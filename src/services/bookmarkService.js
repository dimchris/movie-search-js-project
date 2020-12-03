import user from "../state/user";
import axios from "./axios";

export default class BookmarkService {
  async getAll() {
    this.checkToken();
    return axios.get(`/users/${user.id}/bookmarks`);
  }

  // async get(imdbId) {
  //   return this._bookmarks.get(imdbId);
  // }

  // async getByTags(tags) {
  //   return this._bookmarks.bookmarks.filter((bkmrk) => {
  //     for (let tag of tags) {
  //       const bookmarkTags = bkmrk.tags.tags.reduce((total, item) => {
  //         return [...total, item.id];
  //       }, []);
  //       if (!bookmarkTags && !bookmarkTags.length) {
  //         return false;
  //       }
  //       if (!bookmarkTags.includes(tag)) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   });
  // }

  async add(bookmark) {
    // check if exist
    let newBookmark = await axios.get(
      `/users/${user.id}/bookmarks?imdbId=${bookmark.imdbId}`
    );
    if (newBookmark.data == false) {
      newBookmark = await axios.post(`/users/${user.id}/bookmarks`, bookmark);
    }

    return newBookmark;
  }

  async remove(bookmarkId) {
    return axios.delete(`/users/${user.id}/bookmarks/${bookmarkId}`);
  }

  // async updateTags(imdbId, tags) {
  //   const bmrk = this._bookmarks.findBookmark(imdbId);
  //   // update only tags for now
  //   bmrk.tags = tags;
  // }

  // async getByFilters(filters) {
  //   return this._bookmarks.getByFilters(filters);
  // }

  checkToken() {
    if (user && user.id && user.token) {
      return;
    }
    throw new Error("token is missing");
  }
}
