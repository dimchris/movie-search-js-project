import { userService } from "../services/services";
import Alert from "../utilities/alerts";
export default class LoginComponent extends HTMLElement {
  constructor() {
    super();
    this._loginState =
      this.getAttribute("login-state") === "true" ? true : false;
    this._createAccount = this.getAttribute("create-account") || false;
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
                    color: white;
                    background-color: transparent;
                }
                input[type=button]:hover{
                    color: rgba(255, 217, 0, 0.788);
                }
a {
    color: orange !important;
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
                : this._createAccount
                ? `
                    <input type="text" placeholder="username">
                    <input type="password" placeholder="password">
                    <input type="button" value="Register">
                    <a href="#">or login</a>
                `
                : `
                    <input type="text" placeholder="username">
                    <input type="password" placeholder="password">
                    <input type="button" value="Login">
                    <a href="#">or create new account</a>
                
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
            if (this._createAccount) {
              this._createUser(username, password)
                .then(() => {
                  Alert.alert(
                    "Account Successfully Created",
                    "Your account has been created. Please log in to procceed."
                  );
                  this.createAccount = false;
                })
                .catch((error) => {
                  Alert.error(
                    "Cound not create an accout",
                    error.response.data.message
                  );
                });
            } else {
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
          }
        });
      if (!this._createAccount) {
        this.shadowRoot.querySelector("a").onclick = () => {
          this.createAccount = true;
        };
      } else {
        this.shadowRoot.querySelector("a").onclick = () => {
          this.createAccount = false;
        };
      }
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

  async _createUser(username, password) {
    return userService.register(username, password);
  }

  set createAccount(createAccount) {
    this._createAccount = createAccount;
    this._render();
  }

  set loginState(loginState) {
    this._loginState = loginState;
    this.setAttribute("true");
    this._render();
  }
}
