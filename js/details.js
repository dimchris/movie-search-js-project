// Movie details component 
class MovieDetails extends HTMLElement {
  constructor() {
    super();
    this._loading = false || this.getAttribute('loading');
    this._apiKey = this.getAttribute('api-key')
    this._url = `http://www.omdbapi.com/?plot=full&apikey=${this._apiKey}`;
    this._imdbId = this.getAttribute('imdbId');
    this._movie;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // if no results
    if (!this._imdbId) {
      this.innerHTML = `
                <p>no results</p>
            `;
    } else {
      // fetch results
      this._getResults(this._imdbId)
        .then((response) => response.json())
        .then((result) => {
          this._movie = new Movie(result.imdbId, result.Title, result.imdbRating, result.imdbVotes, result.Runtime, result.Year, result.Plot, result.Director, result.Actors, result.Genre, result.Language);
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
        this._imdbId = newValue;
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