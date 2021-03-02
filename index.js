window.customElements.define('flower-layout', class extends HTMLElement {
  _processChildren() {
    const petals = this.petalsSlot.assignedElements()
    petals.forEach((element, x) => {
      element.style.setProperty('--i', x + 1)
    })

    this.container.style.setProperty("--m", petals.length)
  }

  constructor() {
    super()
    this.attachShadow({mode:"open"})
    this.shadowRoot.innerHTML = `
      <style>
        #container {
          --tan: 0.41;
          --d: 2em; /* element size */
          --rel: 0.5; /* how much extra space we want between images, 1 = one element size */
          --r: calc(.5*(1 + var(--rel))*var(--d)/var(--tan)); /* circle radius */
          --s: calc(2*var(--r) + var(--d)); /* container size */
          position: relative;
          width: var(--s); height: var(--s);
          font-size: x-large;
          font-weight: bold;
        }

        ::slotted(*) {
          position: absolute;
          top: 50%; left: 50%;
          margin: calc(-.5*var(--d));
          width: var(--d); height: var(--d);
          --az: calc(var(--i)*1turn/var(--m));
          transform: 
            rotate(var(--az)) 
            translate(var(--r))
            rotate(calc(-1*var(--az)))
        }
      </style>
      <div id="container">
        <slot name="center"></slot>
        <slot></slot>
      </div>
    `
    const slots = this.shadowRoot.querySelectorAll('slot')
    this.centerSlot = slots[0]
    this.petalsSlot = slots[1]

    this.container = this.shadowRoot.querySelector('#container')
    this.container.addEventListener('slotChange', () => this._processChildren())
  }

  connectedCallback() {
    this._processChildren()
  }

  get elementSize() {
    return getComputedStyle(this.container).getPropertyValue('--d')
  }

  set elementSize(size) {
    this.container.style.setProperty('--d', size)
  }

  get elementSpacing() {
    return getComputedStyle(this.container).getPropertyValue('--rel')
  }

  set elementSpacing(spacing) {
    this.container.style.setProperty('--rel', spacing)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'element-size':
        this.elementSize = newValue
        break
      case 'element-spacing':
        this.elementSpacing = newValue
    }
  }
  
  static get observedAttributes() { return ['element-size', 'element-spacing']; }
})
