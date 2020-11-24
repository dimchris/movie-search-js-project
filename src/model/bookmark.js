import { MovieItem } from "./movie-item";
import { TagList } from "./tag-list";
import { tagService } from "../services/services";

export class Bookmark extends MovieItem {
  constructor(imdbId, title, year, poster, tags = new TagList(), id = null) {
    super(imdbId, title, year, poster);
    this.tags = tags;
    this._id = id; // this is the db id
  }

  async render(el) {
    el.innerHTML = `
        <div class="details-title">
        ${this.title}
        <cd-rating score="${this.rating}"></cd-rating>
        </div>
        <div class="details-subtitle">
            <span><b>IMDb</b> ${this.rating}(${this.votes})</span><span>${this.runtime}</span><span>${this.year}</span>
        </div>
        <div class="details-more">
          <div class="details-description">${this.plot}</div>
          <div class="details-directors"><span class="label">Directors</span> ${this.director}</div>
          <div class="details-actors"><span class="label">Starring</span> ${this.actors}</div>
          <div class="details-genres"><span class="label">Genres</span> ${this.genre}</div>
          <div class="details-language"><span class="label">Language</span> ${this.language}</div>
        </div>
        `;
    // add tags
    const tagList = document.createElement("cd-bookmark-tags");
    const tags0 = await tagService.getAll();
    tagList.selectedTags = this.tags;
    tagList.tags = new TagList(tags0);
    tagList.selectedHandler = function (input) {
      this.tags = input;
    };
    el.querySelector(".details-title").append(tagList);
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  static fromMovieItem(movieItem) {
    return new Bookmark(
      movieItem.imdbId,
      movieItem.title,
      movieItem.year,
      movieItem.poster
    );
  }

  addTag(tag) {
    this.tags.push(tag);
  }

  removeTag(tagId) {
    this.tags = this.tags.filter((tag) => {
      tag._id === tagId;
    });
  }
}
