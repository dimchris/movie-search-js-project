export default class Account extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const style = `
            <style>
                :host{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height:100%;
                }
            </style>
        `;
    this.shadowRoot.innerHTML =
      style +
      `
            <cd-login></cd-login>
        `;
    this._logginComp = this.shadowRoot.querySelector("cd-login");

    this._logginComp.addEventListener("user-logged-in", (e) => {
      this._user = e.details;
    });
  }
}
