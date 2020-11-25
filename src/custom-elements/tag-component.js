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
        :host{
          display: inline-block;
          border-style: solid;
          border-radius: 15px;
          background-color: rgb(255 195 0 / 78%);
          color: black;
          font-size: 1rem;
          font-weight: normal;
          padding: 3px;
          cursor: default;
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
