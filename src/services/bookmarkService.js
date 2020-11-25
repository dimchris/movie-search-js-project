export default class BookmarkService {
  constructor(datasource) {
    this._datasource = datasource;
  }

  async getAll() {
    return this._datasource.getAll();
  }

  async add(bookmark) {
    return this._datasource.add(bookmark);
  }

  async remove(imdbId) {
    return this._datasource.remove(imdbId);
  }

  async getByTags(tags) {
    return this._datasource.getByTags(tags);
  }

  async updateTags(imdb, tags) {
    return this._datasource.updateTags(imdb, tags);
  }
}
