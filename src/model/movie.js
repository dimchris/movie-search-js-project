import alerts from "../utilities/alerts";
import { MovieItem } from "./movie-item";

export class Movie {
  constructor(
    imdbId,
    title,
    rating,
    votes,
    runtime,
    year,
    plot,
    writers,
    directors,
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
    this.directors = directors;
    this.actors = actors;
    this.genre = genre;
    this.language = language;
    this.poster = poster;
    this.writers = writers;
  }

  clear() {
    this._el.innerHTML = ``;
  }

  render(el, state, showTags, tags, selectedTags, selectedHandler) {
    const style = `
    <style>
      :host > * {
          margin: 10px;
      }
      :host {
        display: flex;
        display: block;
        flex-direction: column;
        flex-wrap: wrap;
        color: white;
        height: 100%;
        width: 100%;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        overflow: auto;
      }
      .details-title {
        font-size: 1.9rem;
      }

      .details-subtitle {
        font-size: 1rem;
        color: lightgrey;
      }

      .details-subtitle > span {
        padding-right: 1rem;
      }

      .details-more .label {
        display: inline-block;
        font-weight: bold;
        width: 6rem;
        font-size: 1.1rem;
        color: lightgrey;
      }

      .details-more .details-description {
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      :host(.loading) {
        filter: blur(5px);
      }
      .add-to-list-button, .remove-from-list-button {
        margin: 0px 10px;
        padding: 5px;
        width: fit-content;
        color: white;
        background-color: rgba(255, 255, 255, 0.055);
        border-style: none;
        border-radius: 20px;
        transition: 1s ease;
      }
 
      .add-to-list-button:focus,.remove-from-list-button:focus{
        outline: none;
      }

      .add-to-list-button:hover {
        background-color: rgb(103, 202, 103);
        transition: 1s ease;
      }

      .add-to-list-button.selected {
        background-color: rgb(103, 202, 103);
        transition: 1s ease;
      }

      .remove-from-list-button:hover {
        background-color: rgb(228 104 104);
        transition: 1s ease;
      }

      .remove-from-list-button.selected {
        background-color: rgb(228 104 104);
        transition: 1s ease;
      }
    </style>
    
    `;

    const buttons = showTags
      ? '<button class="remove-from-list-button" type="button">remove</button>'
      : '<button class="add-to-list-button" type="button">save</button>';

    el.innerHTML =
      style +
      `
        <div class="details-title">
        ${this.title}${state ? buttons : ""}
        <div class="tags"></div>
        <cd-rating score="${this.rating}"></cd-rating>
        </div>
        <div class="details-subtitle">
            <span><b>IMDb</b> ${this.rating}(${this.votes})</span><span>${
        this.runtime
      }</span><span>${this.year}</span>
        </div>
        <div class="details-more">
          <div class="details-description">${this.plot}</div>
          <div class="details-writers"><span class="label">Writers</span> ${
            this.writers
          }</div>
          <div class="details-directorss"><span class="label">Directors</span> ${
            this.directors
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
    if (state && !showTags) {
      el.querySelector("button.add-to-list-button").addEventListener(
        "click",
        (e) => {
          let event = null;
          event = new CustomEvent("bookmark-added");
          event.movieItem = new MovieItem(
            this.imdbId,
            this.title,
            this.year,
            this.poster,
            this.directors,
            this.writers
          );
          el.dispatchEvent(event);
        }
      );
    }
    if (showTags) {
      const tagEl = document.createElement("cd-bookmark-tags");
      el.querySelector(".tags").append(tagEl);
      tagEl.selectedTags = selectedTags;
      tagEl.tags = tags;
      tagEl.selectedHandler = (input) => {
        selectedHandler(input);
      };

      el.querySelector("button.remove-from-list-button").addEventListener(
        "click",
        (e) => {
          alerts.confirm(
            "Remove Book Mark",
            "You are about to remove this bookmark. Are you sure?",
            () => {
              const event = new CustomEvent("bookmark-removed");
              event.movieItem = new MovieItem(
                this.imdbId,
                this.title,
                this.year,
                this.poster,
                this.directors,
                this.writers
              );
              event.movieItem._id = this._bookmarkId;
              e.target.classList.toggle("selected");
              el.dispatchEvent(event);
            }
          );
        }
      );
    }
  }
}
