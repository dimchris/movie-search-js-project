export default class TagComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._id = this.getAttribute("id");
    this._name = this.getAttribute("name");
    this._isDeletable = this.getAttribute("deletable") === "true";
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const style = `
      <style>
          :host {
          margin: 0px 10px;
            padding: 5px;
            width: fit-content;
            background-color: rgba(255, 255, 255, 0.055);
            border-style: none;
            border-radius: 20px;
            transition: 1s ease;
            font-size: 1.0rem;
            font-weight: normal;
            cursor: default;
          }

          :host(:focus) {
            outline: none;
          }

          :host(:hover) {
            background-color: rgb(103, 202, 103);
            transition: 1s ease;
          }

          :host(.selected){
            background-color: rgb(103, 202, 103);
            transition: 1s ease;
          }
        .delete:hover{
          color: red;
        }
        :host(.selected){
          background-color: green;
        }
      </style>
    `;
    this.shadowRoot.innerHTML =
      style +
      `
        #${this._name}  ${
        this._isDeletable ? "<span class='delete'> &times; <span>" : ""
      }
      `;
    if (this._isDeletable) {
      this.shadowRoot.querySelector(".delete").addEventListener("click", () => {
        const event = new CustomEvent("tag-deleted", {
          detail: this._id,
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
      });
    }
    this.addEventListener("click", () => {
      this.classList.toggle("selected");
      const event = new CustomEvent("tag-clicked", {
        detail: this._id,
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });
  }

  get id() {
    return this._id;
  }
}
