import { MovieItem } from "../../model/movie-item";

// Result item component
export default class MovieResultItemComponent extends HTMLElement {
  constructor() {
    super();
    const title = this.getAttribute("title");
    const year = this.getAttribute("year");
    const imdbId = this.getAttribute("imdbId");
    const poster = this.getAttribute("poster");
    const bookmarkId = this.getAttribute("bookmark-id");
    this._movieItem = new MovieItem(imdbId, title, year, poster, bookmarkId);
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["title", "year", "imdbId", "poster", "bookmark-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case "title":
        this._movieItem.title = newValue;
        break;
      case "year":
        this._movieItem.year = newValue;
        break;
      case "imdbId":
        this._movieItem.imdbId = newValue;
        break;
      case "poster":
        this._movieItem.poster = newValue;
        break;
      case "bookmark-id":
        this._movieItem._id = newValue;
        break;
      default:
    }
    this.render();
  }

  render() {
    this._movieItem.render(this.shadowRoot);
  }

  get movie() {
    return this._movieItem;
  }

  set movie(movie) {
    this._movieItem = movie;
    this.render();
  }
}
