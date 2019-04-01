export default class UIComponent extends window.HTMLElement {
  static observedAttributes = []

  props = {}

  constructor(self) {
    super(self)

    const defineGetterSetter = attribute => {
      Object.defineProperty(this, attribute, {
        set: (value) => {
          this.props[attribute] = value

          value !== undefined && value !== null
            ? this.setAttribute(attribute, value)
            : this.removeAttribute(attribute)
        },
        get: () => {
          return this.props[attribute]
        }
      })
    }

    this.constructor
      .observedAttributes
      .forEach(defineGetterSetter)
  }

  connectedCallback() {
    const hasBeforeRender = typeof this.beforeRender === 'function'
    const hasAfterRender = typeof this.afterRender === 'function'
    
    if (hasBeforeRender)
      this.beforeRender()
    
    this.appendChild(this.render())

    if (hasAfterRender)
      this.afterRender()
  }

  attributeChangedCallback(attribute) {
    this.updateRender()

    const updateEvent = new Event('update')
    updateEvent.attribute = attribute
    updateEvent.value = this[attribute]
    this.dispatchEvent(updateEvent)
  }

  updateRender() {
    
  }

  updateNode() {
  
  }
}

export function renderJSX(tag, attrs, ...children) {
  if (typeof tag === 'function')
    return tag()
  
  if (typeof tag === 'string') {
    const fragments = document.createDocumentFragment()
    const element = document.createElement(tag)
    children.forEach(child => {
       if (child instanceof HTMLElement) { 
         fragments.appendChild(child)
       } else if (typeof child === 'string'){
         const textnode = document.createTextNode(child)
         fragments.appendChild(textnode)
       }
    })

    element.appendChild(fragments)
    
    if (attrs) {
      const attributes = Object.keys(attrs)
        .filter(key => attrs[key] === 0 || attrs[key])
        .map(name => ( {name, value: attrs[name]}) )

      attributes.forEach(({name, value}) => {
        element.setAttribute(name, value)
      })
    }
    
    return element
  }
}