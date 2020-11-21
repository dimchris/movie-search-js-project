// Movie details component 
class MovieDetails extends HTMLElement {
  constructor() {
    super();
    this._loading = false || this.getAttribute('loading');
    this._apiKey = this.getAttribute('api-key')
    this._url = `http://www.omdbapi.com/?plot=full&apikey=${this._apiKey}`;
    this._movie = new Movie();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // if no results
    if (!this._movie.imdbId) {
      this.innerHTML = `
                <p>no results</p>
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
          this.setAttribute('loading', false)
        })
        .catch((error) => {
          // only log the error for now
          console.log(error);
        });
    }
  }

  static get observedAttributes() {
    return ['imdbid', 'loading'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case 'imdbid':
        this._movie.imdbId = newValue;
        this.render();
        break;
      case 'loading':
        this._loading = newValue;
        if (newValue === "true") {
          this.classList.add('loading');
        } else {
          this.classList.remove('loading');
        }
        default:
    }
  }

  _getResults(imdbId) {
    this.setAttribute('loading', true)
    return fetch(`${this._url}&i=${imdbId}`);
  }

  _renderResult() {
    this._movie.render(this);
  }
}

customElements.define('cd-movie-details', MovieDetails);