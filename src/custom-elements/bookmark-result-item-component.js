import { Bookmark } from "../model/bookmark";

// Result item component
export default class BookmarkResultItemComponent extends HTMLElement {
  constructor() {
    super();
    const title = this.getAttribute("title");
    const year = this.getAttribute("year");
    const imdbId = this.getAttribute("imdbId");
    const poster = this.getAttribute("poster");
    this._bookmarkItem = new Bookmark(imdbId, title, year, poster);
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.draggable = true;
    this.render();
  }

  static get observedAttributes() {
    return ["title", "year", "imdbId", "poster"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case "title":
        this._bookmarkItem.title = newValue;
        break;
      case "year":
        this._bookmarkItem.year = newValue;
        break;
      case "imdbId":
        this._bookmarkItem.imdbId = newValue;
        break;
      case "poster":
        this._bookmarkItem.poster = newValue;
        break;
      default:
    }
    this.render();
  }

  render() {
    this._bookmarkItem.render(this.shadowRoot);
  }

  get movie() {
    return this._bookmarkItem;
  }

  set bookmark(bookmark) {
    this._bookmarkItem = bookmark;
  }

  get bookmark() {
    return this._bookmarkItem;
  }
}
