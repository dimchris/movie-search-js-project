import Tag from "../model/tag";
import { TagList } from "../model/tag-list";
import { tagService } from "../services/services";

export default class TagListComponent extends HTMLElement {
  constructor() {
    super();
    this._addNewTagHandler = async (input) => {
      let tag = new Tag(input);
      tag = await tagService.add(tag);
      this.tags.addTag(tag);
      this._render();
    };
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
    this.addEventListener("tag-clicked", () => {
      // e.stopPropagation();
      this.classList.toggle("selected");
      const event = new CustomEvent("bookmarks-filtered", {
        detail: [...this.shadowRoot.querySelectorAll("cd-tag.selected")].reduce(
          (total, item) => {
            return [...total, item.id];
          },
          []
        ),
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this.tags) {
      this.tags.render(this.shadowRoot, this._addNewTagHandler);
    }
  }

  set tags(tags) {
    this._tags = tags;
    this._render();
  }

  get tags() {
    return this._tags;
  }
}
