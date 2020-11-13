class Movie {
    constructor(imdbId, title, rating, votes, runtime, year, plot, director, actors, genre, language) {
        this.imdbId = imdbId;
        this.title = title;
        this.rating = rating;
        this.votes = votes;
        this.runtime = runtime;
        this.year = year;
        this.plot = plot;
        this.director = director;
        this.actors = actors;
        this.genre = genre;
        this.language = language;
    }

    render(el) {
        el.innerHTML = `
        <div class="details-title">
        ${this.title}
        <cd-rating score="${this.rating}"></cd-rating>
        </div>
        <div class="details-subtitle">
            <span><b>IMDb</b> ${this.imdbRating}(${this.votes})</span><span>${this.runtime}</span><span>${this.year}</span>
        </div>
        <div class="details-more">
          <div class="details-description">${this.plot}</div>
          <div class="details-directors"><span class="label">Directors</span> ${this.director}</div>
          <div class="details-actors"><span class="label">Starring</span> ${this.actors}</div>
          <div class="details-genres"><span class="label">Genres</span> ${this.genre}</div>
          <div class="details-language"><span class="label">Language</span> ${this.language}</div>
        </div>
        `;
    }
}