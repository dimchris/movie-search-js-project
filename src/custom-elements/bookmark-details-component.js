import { Bookmark } from "../model/bookmark";

// bookmark details component
export default class BookmarkDetailsComponent extends HTMLElement {
  constructor() {
    super();
    this._loading = false || this.getAttribute("loading");
    this._apiKey = this.getAttribute("api-key");
    this._url = `http://www.omdbapi.com/?plot=full&apikey=${this._apiKey}`;
    this._state = this.getAttribute("login-state") || false;
    this._bookmark = new Bookmark();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // if no results
    if (!this._bookmark.imdbId) {
      this.innerHTML = `
               
            `;
    } else {
      // fetch results
      this._getResults(this._bookmark.imdbId)
        .then((response) => response.json())
        .then((result) => {
          this._bookmark.imdbId = result.imdbID;
          this._bookmark.title = result.Title;
          this._bookmark.rating = result.imdbRating;
          this._bookmark.votes = result.imdbVotes;
          this._bookmark.runtime = result.Runtime;
          this._bookmark.year = result.Year;
          this._bookmark.plot = result.Plot;
          this._bookmark.director = result.Director;
          this._bookmark.actors = result.Actors;
          this._bookmark.genre = result.Genre;
          this._bookmark.language = result.Language;
          this._bookmark.poster = result.Poster;
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
    return ["imdbid", "loading", "login-state"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case "imdbid":
        this._bookmark.imdbId = newValue;
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
      case "login-state":
        this._loginState = newValue;
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
    this._bookmark.render(this, this._loginState);
  }

  set bookmark(bkmark) {
    this._bookmark = bkmark;
    this.render();
  }
}
