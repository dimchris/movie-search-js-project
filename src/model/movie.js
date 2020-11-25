import { MovieItem } from "./movie-item";
import { TagList } from "./tag-list";

export class Movie {
  constructor(
    imdbId,
    title,
    rating,
    votes,
    runtime,
    year,
    plot,
    director,
    actors,
    genre,
    language,
    poster
  ) {
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
    this.poster = poster;
  }

  render(el, state, showTags, tags, selectedTags, selectedHandler) {
    el.innerHTML = `
        <div class="details-title">
        ${this.title}${
      state
        ? '<button class="add-to-list-button" type="button">bookmark</button>'
        : ""
    }
        <span class="tags"></span>
        <cd-rating score="${this.rating}"></cd-rating>
        </div>
        <div class="details-subtitle">
            <span><b>IMDb</b> ${this.rating}(${this.votes})</span><span>${
      this.runtime
    }</span><span>${this.year}</span>
        </div>
        <div class="details-more">
          <div class="details-description">${this.plot}</div>
          <div class="details-directors"><span class="label">Directors</span> ${
            this.director
          }</div>
          <div class="details-actors"><span class="label">Starring</span> ${
            this.actors
          }</div>
          <div class="details-genres"><span class="label">Genres</span> ${
            this.genre
          }</div>
          <div class="details-language"><span class="label">Language</span> ${
            this.language
          }</div>
        </div>
        `;
    if (state) {
      el.querySelector("button").addEventListener("click", (e) => {
        let event = null;
        if (e.target.classList.contains("selected")) {
          event = new CustomEvent("bookmark-removed");
        } else {
          event = new CustomEvent("bookmark-added");
        }
        event.movieItem = new MovieItem(
          this.imdbId,
          this.title,
          this.year,
          this.poster
        );
        e.target.classList.toggle("selected");
        el.dispatchEvent(event);
      });
    }
    if (showTags) {
      const tagEl = document.createElement("cd-bookmark-tags");
      el.querySelector(".tags").append(tagEl);
      tagEl.selectedTags = selectedTags;
      tagEl.tags = tags;
      tagEl.selectedHandler = (input) => {
        selectedHandler(input);
      };
    }
  }
}
