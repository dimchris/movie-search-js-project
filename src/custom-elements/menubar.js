export default class Menubar extends HTMLElement {
  constructor() {
    super();
    this._loginState = this.getAttribute("login-state") || false;
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
                flex-direction: row;
                height: 50px;
                width: 100%;
                position: absolute;
                z-index: 300;
                color: grey;
                font-size: 1.8rem;
                background-color: rgba(255, 255, 255, 0.055);
                cursor: default;
            }
            
            div{
                margin: 5px 15px;
            }
            
            .selected{
                color:rgba(255, 217, 0, 0.788)
            }
        </style>
        `;

    const watchlist = `
            <div id="menu-item-watchlist" class="menu-item">
                watchlist
            </div>
        `;

    this.shadowRoot.innerHTML =
      style +
      `
            <div id="menu-item-search" class="menu-item selected">
                search
            </div>
            ${this._loginState ? watchlist : ""}
            <div id="menu-item-account" class="menu-item">
                account
            </div>
        `;
  }

  static get observedAttributes() {
    return ["login-state"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    switch (name) {
      case "login-state":
        this._loginState = newValue;
        this._render();
        this.shadowRoot
          .getElementById("menu-item-search")
          .classList.remove("selected");
        this.shadowRoot.getElementById("menu-item-search").click();
    }
  }
}
