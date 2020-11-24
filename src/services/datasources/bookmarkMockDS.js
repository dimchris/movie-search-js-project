import { MovieList } from "../../model/movie-list";

export default class BookmarkMockDS {
  constructor(movieList) {
    this._bookmarks = movieList || new MovieList();
  }

  async getAll() {
    return this._bookmarks.movies;
  }

  async get(imdbId) {
    return this._bookmarks.get(imdbId);
  }

  async add(newBookmark) {
    const bookmark = this._bookmarks.findMovie(newBookmark.imdbId);
    if (!bookmark) {
      newBookmark.id = this._getRndInteger(1, 100);
      this._bookmarks.addMovie(newBookmark);
    }
    return newBookmark;
  }

  async remove(imdbId) {
    this._bookmarks.removeMovie(imdbId);
  }

  _getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async update(imdbId, bookmark) {
    const bmrk = this._bookmarks.get(imdbId);
    // update only tags for now
    bmrk.tags = [...bookmark.tags];
  }
}
