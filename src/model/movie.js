import { bookmarkService } from "../services/services";
import alerts from "../utilities/alerts";

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
    poster,
    id,
    tags
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
    this._bookmarkId = id;
    this.tags = tags;
  }

  clear() {
    this._el.innerHTML = ``;
  }

  render(el, saveButton, removeButton) {
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
        background-color: transparent;
        border-style: none;
        font-size: 1.6rem; 
        transition: 1s ease;
      }
 
      .add-to-list-button:focus,.remove-from-list-button:focus{
        outline: none;
      }

      .add-to-list-button:hover {
        color: red;
        transition: 1s ease;
      }

      .add-to-list-button.selected {
        background-color: transparent;
        color:red;
        transition: 1s ease;
      }

      .remove-from-list-button:hover {
        color: rgb(228 104 104);
        transition: 1s ease;
      }

      .remove-from-list-button.selected {
        background-color: rgb(228 104 104);
        transition: 1s ease;
      }
    </style>
    
    `;

    const buttons = removeButton
      ? '<button class="remove-from-list-button" type="button">&#10008;</button>'
      : saveButton
      ? '<button class="add-to-list-button" type="button">&#10084;</button>'
      : "";

    el.innerHTML =
      style +
      `
        <div class="details-title">
        ${this.title}${buttons}
        ${
          this.tags
            ? `
        <cd-tags tags="${this.tags.join(
          ","
        )}" delete="true" add="true"></cd-tags>
        `
            : ""
        }
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
    if (saveButton) {
      // check if already a bookmark
      bookmarkService.getBookMarkByMovieImdb(this.imdbId).then((response) => {
        if (response.data != false) {
          el.querySelector("button.add-to-list-button").classList.add(
            "selected"
          );
        }
      });
      el.querySelector("button.add-to-list-button").addEventListener(
        "click",
        (e) => {
          if (e.target.classList.contains("selected")) {
            return;
          }
          e.target.classList.add("selected");
          let event = null;
          event = new CustomEvent("bookmark-added");
          event.movie = this;
          el.dispatchEvent(event);
        }
      );
    }
    if (removeButton) {
      el.querySelector("button.remove-from-list-button").addEventListener(
        "click",
        (e) => {
          alerts.confirm(
            "Remove bookmark",
            `You are about to remove <i>${this.title}</i> from your bookmarks. Are you sure?`,
            () => {
              const event = new CustomEvent("bookmark-removed");
              event.movie = this;
              e.target.classList.toggle("selected");
              el.dispatchEvent(event);
            }
          );
        }
      );
    }

    const tagEl = el.querySelector("cd-tags");
    if (tagEl) {
      tagEl.updateHandler = (tags) => {
        return bookmarkService
          .updateBookMarkTags(this._bookmarkId, {
            tags,
          })
          .then((tags) => {
            // send update tags event to refresh tags
            const event = new CustomEvent("tags-updated", {
              bubbles: true,
              composed: true,
            });
            el.dispatchEvent(event);
            return tags;
          });
      };
    }
  }
}
