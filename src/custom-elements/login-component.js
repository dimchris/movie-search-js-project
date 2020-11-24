import { userService } from "../services/services";
import Alert from "../utilities/alerts";
export default class LoginComponent extends HTMLElement {
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
                    flex-direction: column;
                    align-items: center;
                    width: 80%;
                    max-width: 400px;
                }
                input{
                    margin: 10px 0px;
                    border-style:none;
                    text-align: center;
                    font-size: 1.5rem;
                    width: 80%;
                    outline: none;
                }
                input[type=text],input[type=password]{
                    border-style: solid;
                    color: grey;
                    font-style: italic;
                }   
                input[type=text].error,input[type=password].error{
                    border-style: solid;
                    border-color: red;
                    color: grey;
                    font-style: italic;
                }   
                input[type=button]{
                    color: grey;
                    background-color: rgba(255, 255, 255, 0.055);
                    border-radius: 20px;
                }
                input[type=button]:hover{
                    color: rgba(255, 217, 0, 0.788);
                }
            </style>
        `;
    this.shadowRoot.innerHTML =
      style +
      `
            ${
              this._loginState
                ? `
                    <input type="button" value="Logout">

                `
                : `
                    <input type="text" placeholder="username">
                    <input type="password" placeholder="password">
                    <input type="button" value="Login">
                
                `
            }
        `;

    if (!this._loginState) {
      this.shadowRoot
        .querySelector("input[type=button]")
        .addEventListener("click", () => {
          const username = this.shadowRoot.querySelector("input[type=text]")
            .value;
          const password = this.shadowRoot.querySelector("input[type=password]")
            .value;
          if (username && password) {
            this._login(username, password)
              .then((data) => {
                const event = new CustomEvent("user-logged-in", {
                  detail: data,
                  bubbles: true,
                  composed: true,
                });
                this.dispatchEvent(event);
                this._loginState = true;
                this._render();
              })
              .catch(() => {
                Alert.error(
                  "Can Not Login",
                  "Please check your username and password and try again."
                );
                this.shadowRoot
                  .querySelector("input[type=text]")
                  .classList.add("error");
                this.shadowRoot
                  .querySelector("input[type=password]")
                  .classList.add("error");
              });
          }
        });
    }

    if (this._loginState) {
      this.shadowRoot
        .querySelector("input[type=button]")
        .addEventListener("click", () => {
          Alert.confirm("Log out", "Are you sure?", () => {
            const event = new CustomEvent("user-logged-out", {
              bubbles: true,
              composed: true,
            });
            this.dispatchEvent(event);
            this._loginState = false;
            this._render();
          });
        });
    }
  }

  async _login(username, password) {
    return userService.login(username, password);
  }
}
