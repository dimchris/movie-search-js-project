export default class FilterBarItemComponent extends HTMLElement {
  constructor() {
    super();
    this._name = this.getAttribute("name");
    this._code = this.getAttribute("code");
    this._enabled = this.getAttribute("enabled");
    this._type = this.getAttribute("type") || "single-select"; // or multi-select
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["name", "code", "enabled"];
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const style = `
        <style>
            :host{
                display: block;
                margin: 5px 0px;
            }
            :host > *{
                margin:0 auto;
                width: 100%;
            }
            input{
                display: none;
                text-align: center;
                max-width: 300px;
            }
            .label{
                color: white;
                cursor: pointer;
                text-align: center;
            }
            .delete{
            }
            .delete:hover{
                color: red;
            }
        </style>
      `;

    this.shadowRoot.innerHTML =
      style +
      `
      <div class="label">${this._name}${
        this._value ? `:${this._value}` : ""
      } <span class="delete">(-)</span></div>
        <input type="text" placeholder="enter a ${this._name}" ${
        this._value ? ` value="${this._value}"` : ""
      }>
        `;

    if (!this._value) {
      this.shadowRoot.querySelector("input").style.display = "block";
    }
    this.shadowRoot.querySelector(".label").addEventListener("click", () => {
      const el = this.shadowRoot.querySelector("input");
      const display = el.style.display;
      el.style.display = display == "block" ? "none" : "block";
    });
    this._shadowRoot
      .querySelector("input")
      .addEventListener("change", (event) => {
        this._value = event.target.value;
        this._render();
      });
    this.shadowRoot.querySelector(".delete").addEventListener("click", () => {
      const event = new CustomEvent("filter-deleted", {
        bubbles: true,
        composed: true,
        detail: this._code,
      });
      this.dispatchEvent(event);
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }
    switch (name) {
      case "enabled":
        this._enabled = newVal;
        break;
      case "name":
        this._name = newVal;
        break;
      case "code":
        this._code = newVal;
        break;
    }
    this._render();
  }

  get value() {
    return {
      name: this._name,
      value: this._value,
    };
  }
}
