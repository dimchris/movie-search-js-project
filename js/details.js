// Movie details component 
class MovieDetails extends HTMLElement {
  constructor() {
    super();
    this._loading = false || this.getAttribute('loading');
    this._apiKey = this.getAttribute('api-key')
    this._url = `http://www.omdbapi.com/?plot=full&apikey=${this._apiKey}`;
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
    if(oldValue == newValue){
      return;
    }
    switch (name) {
      case 'imdbid':
        this._imdbId = newValue;
        this.render();
        break;
      case 'loading':
        this._loading = newValue;
        if(newValue === "true"){
          this.classList.add('loading');
        }else{
          this.classList.remove('loading');
        }
      default:
    }
  }

  _getResults(imdbId) {
    this.setAttribute('loading', true)
    return fetch(`${this._url}&i=${imdbId}`);
  }

  _renderResult(result) {
    this.innerHTML = `
            <div class="details-title">
            ${result.Title}
            <cd-rating score="${result.imdbRating}"></cd-rating>
            </div>
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
