import Tag from "../model/tag";
import { TagList } from "../model/tag-list";
import { tagService } from "../services/services";
import Alert from "../utilities/alerts";

export default class TagListComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.addEventListener("tag-deleted", (event) => {
      event.stopPropagation();
      const id = event.detail;
      tagService
        .remove(id)
        .then(() => {
          return tagService.getAll();
        })
        .then((data) => {
          this._tags = new TagList(data);
          this._render();
        });
    });
    this.shadowRoot.addEventListener("tag-clicked", (event) => {
      event.stopPropagation();
      // TODO: return results by tags selected
    });
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
          margin: 0 15px;
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
    const tags = this._tags.tags.reduce((total, tag) => {
      return (total += `<cd-tag name="${tag.name}" deletable="true"" id="${tag._id}"></cd-tag>`);
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
        Alert.input(
          "Add new tag",
          "Input the name of the tag",
          this._addNewTagHandler.bind(this)
        );
      });
  }

  async _addNewTagHandler(input) {
    let tag = new Tag(input);
    tag = await tagService.add(tag);
    this._tags.addTag(tag);
    this._render();
  }

  set tags(tags) {
    this._tags = tags;
    this._render();
  }
}
