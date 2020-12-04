import { MovieItem } from "../../model/movie-item";

// Result item component
export default class MovieResultItemComponent extends HTMLElement {
  constructor() {
    super();
    const title = this.getAttribute("title");
    const year = this.getAttribute("year");
    const imdbId = this.getAttribute("imdbId");
    const poster = this.getAttribute("poster");
    const directors = this.getAttribute("directors");
    const writers = this.getAttribute("writers");
    this._movieItem = new MovieItem(
      imdbId,
      title,
      year,
      poster,
      directors,
      writers
    );
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
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
}
