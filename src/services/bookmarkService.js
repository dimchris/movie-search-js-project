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

}