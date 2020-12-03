import { BookmarkList } from "../../model/bookmark-list";

export default class BookmarkMockDS {
  constructor(bookmarkList) {
    this._bookmarks = bookmarkList || new BookmarkList();
  }

  async getAll() {
    return this._bookmarks.bookmarks;
  }

  async get(imdbId) {
    return this._bookmarks.get(imdbId);
  }

  async getByTags(tags) {
    return this._bookmarks.bookmarks.filter((bkmrk) => {
      for (let tag of tags) {
        const bookmarkTags = bkmrk.tags.tags.reduce((total, item) => {
          return [...total, item.id];
        }, []);
        if (!bookmarkTags && !bookmarkTags.length) {
          return false;
        }
        if (!bookmarkTags.includes(tag)) {
          return false;
        }
      }
      return true;
    });
  }

  async add(newBookmark) {
    const bookmark = this._bookmarks.findBookmark(newBookmark.imdbId);
    if (!bookmark) {
      newBookmark.id = this._getRndInteger(1, 100);
      this._bookmarks.addBookmark(newBookmark);
    }
    return newBookmark;
  }

  async remove(imdbId) {
    this._bookmarks.removeBookmark(imdbId);
  }

  _getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async updateTags(imdbId, tags) {
    const bmrk = this._bookmarks.findBookmark(imdbId);
    // update only tags for now
    bmrk.tags = tags;
  }

  async getByFilters(filters) {
    return this._bookmarks.getByFilters(filters);
  }
}
