class BookmarkService{
    constructor(datasource){
        this._datasource = datasource;
    }

    getAll(){
        return this._datasource.getAll();
    }

    add(bookmark){
        return this._datasource.add(bookmark);
    }

    remove(imdbId){
        return this._datasource.remove(imdbId);
    }
    
}