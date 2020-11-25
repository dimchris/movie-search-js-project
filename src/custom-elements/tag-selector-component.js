import Tag from "../model/tag";

export default class TagSelectorComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this.value = [];
    this._tags = [];
    this._selectedTags = [];
    this.addEventListener("click", (event) => {
      const tag = event.target;
      // set tag as selected
      tag.classList.toggle("selected");
      const selected = [
        ...this.shadowRoot.querySelectorAll(".selected"),
      ].reduce((total, tag) => {
        return [
          ...total,
          new Tag(tag.getAttribute("name"), tag.getAttribute("id")),
        ];
      }, []);
      const newSelected = selected.filter((tag) => {
        return !this._selectedTags
          .reduce((total, item) => {
            return [...total, item._id];
          }, [])
          .includes(tag._id);
      });

      const removed = this._selectedTags.filter((tag) => {
        return !selected
          .reduce((total, item) => {
            return [...total, item._id];
          }, [])
          .includes(tag._id);
      });
      // logic to get the selected tags
      this.value = {
        selected,
        newSelected,
        removed,
      };
    });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const style = `
        <style>
            .selected{
                background-color: green;
            }

        </style>
      `;

    this.shadowRoot.innerHTML =
      style +
      `
        <cd-tag-list>${this._tags.reduce((total, tag) => {
          return (total += `<cd-tag name="${tag.name}" id="${tag._id}"></cd-tag>`);
        }, "")}</cd-tag-list>
      
      `;
    // set the selected ones
    if (this._selectedTags) {
      [...this.shadowRoot.querySelectorAll("cd-tag")].forEach((tag) => {
        const selectedTagIds = this._selectedTags.reduce((total, tag) => {
          return [...total, tag._id];
        }, []);
        if (selectedTagIds.includes(tag.id)) {
          tag.classList.add("selected");
        }
      });
    }
  }

  set tags(tags) {
    this._tags = tags ? tags.tags : [];
    this._render();
  }

  set selectedTags(tags) {
    this._selectedTags = tags ? tags.tags : [];
    this._render();
  }
}
