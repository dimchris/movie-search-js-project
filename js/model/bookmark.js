class Bookmark extends MovieItem{
    constructor(imdbId, title, year, poster, tags = [], id = null){
        super(imdbId, title, year, poster);
        this.tags = tags;
        this._id = id; // this is the db id
    }

    set id(id){
        this._id = id;
    }

    get id(){
        return this._id;
    }

    static fromMovieItem(movieItem){
        return new Bookmark(movieItem.imdbId, movieItem.title, movieItem.year, movieItem.poster);
    }

}