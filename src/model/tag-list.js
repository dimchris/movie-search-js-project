import alerts from "../utilities/alerts";

export class TagList {
  constructor(tags) {
    this._tags = tags || [];
  }

  render(el, addNewTagHandler) {
    if (el) {
      this._el = el;
    }
    if (!this._el) {
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
    const tags = this.tags.reduce((total, tag) => {
      return (total += `<cd-tag name="${tag.name}" deletable="true"" id="${tag._id}"></cd-tag>`);
    }, "");
    this._el.innerHTML =
      style +
      `
        ${tags}
        <input type="button" value="+">
      `;
    this._el
      .querySelector("input[type=button]")
      .addEventListener("click", () => {
        alerts.input(
          "Add new tag",
          "Input the name of the tag",
          addNewTagHandler
        );
      });
  }

  addTag(tag) {
    this.tags.push(tag);
    this.render();
  }

  addTags(tags) {
    tags.forEach((tag) => {
      this.addTag(tag);
    });
  }

  removeTag(tagId) {
    this.tags = this.tags.filter((tag) => tag._id !== tagId);
    this.render();
  }

  set tags(tags) {
    this._tags = tags || [];
  }

  get tags() {
    return this._tags;
  }

  findTag(tagId) {
    return this._tags.find((tag) => tag._id === tagId);
  }
}
