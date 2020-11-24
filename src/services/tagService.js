export default class TagService {
  constructor(datasource) {
    this._datasource = datasource;
  }

  async getAll() {
    return this._datasource.getAll();
  }

  async add(tag) {
    return this._datasource.add(tag);
  }

  async remove(tagId) {
    return this._datasource.remove(tagId);
  }
}
