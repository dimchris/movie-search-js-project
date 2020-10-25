// Movie details component 
class MovieDetails extends HTMLElement {
  constructor() {
    super();
    this._apiKey = this.getAttribute('api-key')
    this._url = `http://www.omdbapi.com/?apikey=${this._apiKey}`;
    this._imdbId = this.getAttribute('imdbId');
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
        .then((data) => {
          this._renderResult(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  static get observedAttributes() {
    return ['imdbid'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'imdbid':
        this._imdbId = newValue;
      default:
    }
    this.render();
  }

  _getResults(imdbId) {
    return fetch(`${this._url}&i=${imdbId}`);
  }

  _renderResult(result) {
    this.innerHTML = `
            <div class="details-title">${result.Title}</div>
            <div class="details-subtitle">
                <span><b>IMDb</b> ${result.imdbRating}(${result.imdbVotes})</span><span>${result.Runtime}</span><span>${result.Year}</span>
            </div>
            <div class="details-more">
            <div class="details-description">${result.Plot}</div>
            <div class="details-directors"><span class="label">Directors</span> ${result.Director}</div>
            <div class="details-actors"><span class="label">Starring</span> ${result.Actors}</div>
            <div class="details-genres"><span class="label">Genres</span> ${result.Genre}</div>
            <div class="details-language"><span class="label">Language</span> ${result.Language}</div>
            </div>
        `;

  }
}

customElements.define('cd-movie-details', MovieDetails);
