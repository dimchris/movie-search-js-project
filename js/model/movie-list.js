class MovieList {
  constructor(movies) {
    this._movies = movies;
  }

  render(el) {
    this._el = el;
    el.innerHTML = ''; // clear the children
    if(this.movies == null){
        return;
    }
    for (const [index, movie] of this.movies.entries()) {
      const child = document.createElement('cd-movie-result-item');
      child.setAttribute('title', movie.title);
      child.setAttribute('year', movie.year);
      child.setAttribute('imdbId', movie.imdbId);
      child.setAttribute('poster', movie.poster);
      el.appendChild(child);
      if (index == 0) {
        child.classList.add('selected');
        child.dispatchEvent(new Event('result-clicked', { bubbles: true }));
      }
    }
  }

  addMovie(movie, el){
      this.movies.push(movie);
      const child = document.createElement('cd-movie-result-item');
      child.setAttribute('title', movie.title);
      child.setAttribute('year', movie.year);
      child.setAttribute('imdbId', movie.imdbId);
      child.setAttribute('poster', movie.poster);
      el.appendChild(child);
  }

  addMovies(movies, el){
      movies.forEach(movie => {
          this.addMovie(movie, el)
      });
  }

  set movies(movies){
      this._movies = movies;
      this.render(this._el);
  }

  get movies(){
      return this._movies;
  }
}
