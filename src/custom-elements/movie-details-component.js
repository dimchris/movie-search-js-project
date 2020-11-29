import { Movie } from "../model/movie";
import { TagList } from "../model/tag-list";

// Movie details component
export default class MovieDetailsComponent extends HTMLElement {
  constructor() {
    super();
    this._loading = false || this.getAttribute("loading");
    this._apiKey = this.getAttribute("api-key");
    this._url = `http://www.omdbapi.com/?plot=full&apikey=${this._apiKey}`;
    this._showBookmark = this.getAttribute("show-bookmark") || false;
    this._movie = new Movie();
    this._tags = new TagList();
    this._selectedTags = new TagList();
    this._showTags = this.getAttribute("show-tags") || false;
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
      this._getResults(this._movie.imdbId)
        .then((response) => response.json())
        .then((result) => {
          this._movie.imdbId = result.imdbID;
          this._movie.title = result.Title;
          this._movie.rating = result.imdbRating;
          this._movie.votes = result.imdbVotes;
          this._movie.runtime = result.Runtime;
          this._movie.year = result.Year;
          this._movie.plot = result.Plot;
          this._movie.director = result.Director;
          this._movie.actors = result.Actors;
          this._movie.genre = result.Genre;
          this._movie.language = result.Language;
          this._movie.poster = result.Poster;
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
    return ["imdbid", "loading", "show-bookmark", "show-tags"];
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
      case "show-bookmark":
        this._showBookmark = newValue;
        this.render();
        break;
      case "show-tags":
        this._showTags = newValue;
        this.render();
        break;
      default:
        return;
    }
  }

  _getResults(imdbId) {
    this.setAttribute("loading", true);
    return fetch(`${this._url}&i=${imdbId}`);
  }

  _renderResult() {
    this._movie.render(
      this.shadowRoot,
      this._showBookmark,
      this._showTags,
      this._tags,
      this._selectedTags,
      this._selectedHandler
    );
  }

  clear() {
    this.shadowRoot.innerHTML = ``;
  }

  set movie(movie) {
    this._movie = movie;
    this.render();
  }

  set tags(tags) {
    this._tags = tags;
    this.render();
  }

  set selectedTags(tags) {
    this._selectedTags = tags;
    this.render();
  }

  set selectedHandler(handler) {
    this._selectedHandler = handler;
  }
}
