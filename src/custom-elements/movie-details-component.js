import { Movie } from "../model/movie";

// Movie details component
export default class MovieDetailsComponent extends HTMLElement {
  constructor() {
    super();
    this._loading = false || this.getAttribute("loading");
    this._saveButton =
      this.getAttribute("save-button") === "true" ? true : false;
    this._removeButton =
      this.getAttribute("remove-button") === "true" ? true : false;
    this._movie = new Movie();
    this._movie._bookmarkId = this.getAttribute("bookmark-id");
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // if no results
    if (!this._movie.imdbId) {
      this.innerHTML = `
               
            `;
    } else {
      // fetch results
      this.setAttribute("loading", true);
      this.getResults(this._movie)
        .then(() => {
          this._renderResult();
          this.setAttribute("loading", false);
        })
        .catch((error) => {
          // only log the error for now
          console.log(error);
        });
    }
  }

  static get observedAttributes() {
    return ["imdbid", "loading", "save-button", "remove-button", "bookmark-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case "imdbid":
        this._movie.imdbId = newValue;
        this.render();
        break;
      case "loading":
        this._loading = newValue;
        if (newValue === "true") {
          this.classList.add("loading");
        } else {
          this.classList.remove("loading");
        }
        break;
      case "save-button":
        this._saveButton = newValue === "true" ? true : false;
        this.render();
        break;
      case "remove-button":
        this._removeButton = newValue === "true" ? true : false;
        this.render();
        break;
      case "bookmark-id":
        this._movie._bookmarkId = newValue;
        this.render();
        break;
      default:
        return;
    }
  }

  _renderResult() {
    this._movie.render(this.shadowRoot, this._saveButton, this._removeButton);
  }

  clear() {
    this.shadowRoot.innerHTML = ``;
  }

  set movie(movie) {
    this._movie = movie;
    this.render();
  }

  set bookmarkId(id) {
    this._movie._bookmarkId = id;
    this.render();
  }
}
