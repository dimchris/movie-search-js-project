export default class InputComponent extends HTMLElement {
  constructor() {
    super();
    this._title = this.getAttribute("title");
    this._message = this.getAttribute("message");
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
                background-color: rgba(173, 173, 173, 0.95);
                color: var(--primary-color);
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
                background-color: transparent;
                border-style: none;
                font-size: 1.2rem;
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
                background-color: rgba(186, 154, 64, 0.95);
            }
            .buttons{
                display:flex;
                flex-direction: column;
                justify-content: flex-end;
                height:100%;
            }
            input[type=text]{
                border-style: solid;
                color: grey;
                font-style: italic;
                border-radius: 15px;
            }
        </style>
      `;
    this.shadowRoot.innerHTML =
      style +
      `
      <div class="pop-up pop-up-warning">
        <div class="title">
           ${this._title}
        </div>
        <div class="message">${this._message}</div>
        <input type="text">
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
      let input = this.shadowRoot.querySelector("input[type=text]").val;
      if (this.onConfirmHandler) {
        this.onConfirmHandler(input);
        this.onConfirmHandler = null; // safe
      }
    });

    this.shadowRoot.querySelector(".cancel").addEventListener("click", () => {
      this.setAttribute("hide", "true");
      let input = this.shadowRoot.querySelector("input[type=text]").val;
      if (this.onCancelHandler) {
        this.onCancelHandler(input);
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
