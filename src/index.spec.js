import chai, {expect} from 'chai'
import UIComponent, {renderJSX} from './index.js'

chai.use(require('chai-spies'))

class Sample extends UIComponent {
  render() {
    return <div></div>
  }
}
window.customElements.define('ui-sample', Sample)

class Card extends UIComponent {
  static observedAttributes = [
    'string', 
    'boolean',
    'number',
    'array',
    'object',
  ]

  render(props = {}) {
    return (
      <div>
        {props.name && <div>Nome: {props.name}</div>}
        {props.email && <div>Email: {props.email}</div>}
      </div>
    )
  }
}

window.customElements.define('ui-card', Card)

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

  // test('should update', () => {
  //   const element = new Card()
  //   element.setAttribute('string', 'Darlan')
  //   element.string = 'Clara'
  //   element.boolean = true
  //   element.number = 10
  //   element.array = ['darlan mendonca', 10]
  //   element.object = {name: 'darlan', languages: ['js', 'swift']}
  //   console.log(element.props)
  // })
})