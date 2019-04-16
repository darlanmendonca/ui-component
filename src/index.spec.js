import chai, {expect} from 'chai'
import UIComponent, {renderJSX} from './index.js'

chai.use(require('chai-spies'))

class Sample extends UIComponent {
  static observedAttributes = ['lorem', 'name', 'other']

  render() {
    return (
      <div>
        {this.props.name &&
          <div>{this.props.name}</div>
        }
        {this.props.other &&
          <div>{this.props.other}</div>
        }
      </div>
    )
  }
}
window.customElements.define('ui-sample', Sample)

describe('UIComponent', () => {
  test('should export a class', () => {
    expect(UIComponent).to.be.an('function')
  })

  test('should extends HTMLElement', () => {
    expect(UIComponent.prototype).to.be.an.instanceof(window.HTMLElement)
  })

  test('should have static property observedAttributes', () => {
    expect(UIComponent.observedAttributes).to.deep.equal([])
  })

  test('should instanciate using a constructor', () => {
    const element = new Sample()
    expect(element).to.be.instanceof(Sample)
  })

  test('should instanciate using document.createElement', () => {
    const element = document.createElement('ui-sample')
    expect(element).to.be.instanceof(Sample)
  })

  test('should create using html', () => {
    document.body.innerHTML = '<ui-sample></ui-sample>'
    const element = document.querySelector('ui-sample').cloneNode()
    expect(element).to.be.instanceof(Sample)
  })

  test('should have property isConnected', () => {
    const element = new Sample()
    expect(element.isConnected).to.be.false

    document.body.appendChild(element)
    expect(element.isConnected).to.be.true

    element.remove()
    expect(element.isConnected).to.be.false
  })

  test('should render html once connect', () => {
    const element = new Sample()
    expect(element.innerHTML).to.be.equal('')

    element.render = () => <div>lorem</div>
    element.connectedCallback()
    expect(element.innerHTML).to.be.equal('<div>lorem</div>')
  })

  test('should call beforeRender before connect', () => {
    const element = new Sample()
    element.beforeRender = () => ''
    chai.spy.on(element, 'beforeRender')
    element.connectedCallback()

    expect(element.beforeRender).to.have.been.called()
  })

  test('should call afterRender after connect', () => {
    const element = new Sample()
    element.afterRender = () => ''
    chai.spy.on(element, 'afterRender')
    element.connectedCallback()

    expect(element.afterRender).to.have.been.called()
  })

  test('should update render once attribute change', () => {
    const element = new Sample()
    chai.spy.on(element, 'updateRender')
    element.setAttribute('lorem', 'ipsum')

    expect(element.updateRender).to.have.been.called()
  })

  test('should update render once prop change', () => {
    const element = new Sample()
    chai.spy.on(element, 'updateRender')
    element.lorem = 'ipsum'

    expect(element.updateRender).to.have.been.called()
  })

  test.only('should update render', () => {
    const element = new Sample()
    element.connectedCallback()
    console.log(element.outerHTML)
    element.name = 'Darlan'
    console.log(element.outerHTML)
    element.other = 'Clara'
    console.log(element.outerHTML)
  })
})