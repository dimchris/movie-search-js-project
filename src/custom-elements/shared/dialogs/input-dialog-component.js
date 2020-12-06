import alerts from "../../../utilities/alerts";
import validation from "../../../utilities/validation";

export default class InputDialogComponent extends HTMLElement {
  constructor() {
    super();
    this._title = this.getAttribute("title");
    this._message = this.getAttribute("message");
    this._type = this.getAttribute("type") || "notification";
    this._hidden = this.getAttribute("hide") === "true" ? true : false;
    this._inputType = this.getAttribute("input-type") || "text-input";
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["hide", "title", "message", "type", "input-type"];
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    let input = "";
    const textInput = `
        <input type="text">
    `;

    const dropDownMulti = `
      <cd-tag-selector></cd-tag-selector>
    `;
    switch (this._inputType) {
      case "text-input":
        input = textInput;
        break;
      case "drop-down-multi":
        input = dropDownMulti;
        break;
      default:
        input = textInput;
    }

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
                box-shadow: white 0 0px 20px;
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
                text-align:center;
            }
            select{
                color: grey;
                font-style: italic;
                text-align:center;
                max-width: 800px;
                width: 80%;
                height: 100%;
                border-style: none;
                background-color: transparent;
                color: black;
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
            ${input}
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

    let inputEl = null;
    if (this._inputType === "text-input") {
      inputEl = this.shadowRoot.querySelector("input");
      inputEl.focus();
    } else {
      inputEl = this.shadowRoot.querySelector("cd-tag-selector");
      inputEl.tags = this._tags;
      inputEl.selectedTags = this._selectedTags;
    }

    this.shadowRoot.querySelector(".ok").addEventListener("click", () => {
      // sanitize input
      this.setAttribute("hide", "true");
      let input = inputEl.value;
      if (this._inputType === "text-input") {
        if (!validation.isAlphanumeric(input)) {
          alerts.error(
            "Input is not valis",
            "Name can be only alphanumeric. Please try again."
          );
          return;
        }
      }
      if (this.onConfirmHandler) {
        this.onConfirmHandler(input);
        this.onConfirmHandler = null; // safe
      }
    });

    this.shadowRoot.querySelector(".cancel").addEventListener("click", () => {
      let input = inputEl.value;
      this.setAttribute("hide", "true");
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
        this._render();
        break;
      case "type":
        this._type = newVal;
        this._render();
        break;
      case "title":
        this._title = newVal;
        this._render();
        break;
      case "message":
        this._message = newVal;
        this._render();
        break;
      case "input-type":
        this._inputType = newVal;
        this._render();
        break;
      default:
        return;
    }
    this._render();
  }

  set tags(tags) {
    this._tags = tags;
    this._render();
  }

  set selectedTags(tags) {
    this._selectedTags = tags;
    this._render();
  }
}
