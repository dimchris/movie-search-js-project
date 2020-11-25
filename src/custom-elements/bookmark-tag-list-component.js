import Alert from "../utilities/alerts";

export default class BookmarkTagListComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this._tags) {
      return;
    }
    const style = `
      <style>
        :host{
          display: inline-block;
          white-space: nowrap;
        }
        cd-tag{
          margin: 3px;
        }
        input[type=button]{
            color: grey;
            background-color: rgba(255, 255, 255, 0.055);
            border-radius: 15px;
            border-style:none;
        }
        input[type=button]:hover{
            color: rgba(255, 217, 0, 0.788);
        }
      </style>
    `;
    const tags = this._selectedTags.tags.reduce((total, tag) => {
      return (total += `<cd-tag name="${tag.name}" deletable="false"" id="${tag._id}"></cd-tag>`);
    }, "");
    this.shadowRoot.innerHTML =
      style +
      `
        ${tags}
        <input type="button" value="+">
      `;

    this.shadowRoot
      .querySelector("input[type=button]")
      .addEventListener("click", () => {
        Alert.select(
          "Add new tag",
          "Input the name of the tag",
          this._selectedHandler,
          this._cancelHandler,
          this._tags,
          this._selectedTags
        );
      });
  }

  set tags(tags) {
    this._tags = tags;
    this._render();
  }
  set selectedTags(tags) {
    this._selectedTags = tags;
    this._render();
  }

  set selectedHandler(handler) {
    this._selectedHandler = handler;
  }
}
