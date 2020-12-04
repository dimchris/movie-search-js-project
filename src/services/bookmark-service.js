import user from "../state/user";
import axios from "../configuration/axios";

export default class BookmarkService {
  async getAll() {
    this.checkToken();
    return axios.get(`/users/${user.id}/bookmarks`);
  }

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

  checkToken() {
    if (user && user.id && user.token) {
      return;
    }
    throw new Error("token is missing");
  }
}
