export default class ConfirmDialogComponent extends HTMLElement {
  constructor() {
    super();
    this._title = this.getAttribute("title");
    this._message = this.getAttribute("message");
    this._type = this.getAttribute("type") || "notification";
    this._hidden = this.getAttribute("hide") === "true" ? true : false;
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["hide", "title", "message"];
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
                position: absolute;
                height: 100%;
                width: 100%;
                z-index: 300;
                backdrop-filter: blur(2px); 
            }
            .pop-up{
                display:flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                min-height:30%;
                background-color:  var(--primary-color);
                color: white;
                box-shadow: black 10px 10px 20px;
            }
            .pop-up *{
                margin: 10px auto;
                font-size: 1.2rem;
                max-width: 800px;
            }
            .pop-up div{
                width:80%;
            }
            input[type=button]{
                width:100%;
                align-self: stretch;
                border-style: none;
                font-size: 1.5rem;
                background-color: transparent;
                color: white;
            }
            input[type=button]:hover{
                color: rgba(255, 217, 0, 0.788);
            }
            .title{
                font-weight: bold;
                font-size: 2rem;
            }
            .pop-up.pop-up-error{ 
                background-color: rgba(186, 64, 64, 0.95);
            }
            .pop-up.pop-up-warning{ 
                background-color: rgb(255 171 0 / 78%);
            }
            .buttons{
                display:flex;
                flex-direction: column;
                justify-content: flex-end;
                height:100%;
            }
        </style>
      `;
    this.shadowRoot.innerHTML =
      style +
      `
      <div class="pop-up pop-up-${this._type}">
        <div class="title">
           ${this._title}
        </div>
        <div class="message">${this._message}</div>
        <div class="buttons">
            <input class="ok" type="button" value="ok">
            <input class="cancel" type="button" value="cancel">
        </div>
      </div>
    `;

    if (this._hidden) {
      this.style.display = "none";
    } else {
      this.style.display = "flex";
    }

    this.shadowRoot.querySelector(".ok").addEventListener("click", () => {
      this.setAttribute("hide", "true");
      if (this.onConfirmHandler) {
        this.onConfirmHandler();
        this.onConfirmHandler = null; // safe
      }
    });

    this.shadowRoot.querySelector(".cancel").addEventListener("click", () => {
      this.setAttribute("hide", "true");
      if (this.onCancelHandler) {
        this.onCancelHandler();
        this.onCancelHandler = null; // safe
      }
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    switch (name) {
      case "hide":
        this._hidden = newVal === "true" ? true : false;
        break;
      case "type":
        this._type = newVal;
        break;
      case "title":
        this._title = newVal;
        break;
      case "message":
        this._message = newVal;
        break;
      default:
        return;
    }
    this._render();
  }
}
