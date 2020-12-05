export class MovieList {
  constructor(movies) {
    this._movies = movies || [];
  }

  render(el, handler) {
    this._el = el;

    if (handler) {
      this._addHandler(handler);
    }

    el.innerHTML = ""; // clear the children
    if (this.movies == null) {
      return;
    }
    for (const [index, movie] of this.movies.entries()) {
      const child = document.createElement("cd-movie-result-item");
      child.setAttribute("title", movie.title);
      child.setAttribute("year", movie.year);
      child.setAttribute("imdbId", movie.imdbId);
      child.setAttribute("poster", movie.poster);
      child.setAttribute("bookmark-id", movie._id);

      el.appendChild(child);
      if (index == 0) {
        child.classList.add("selected");
        child.click();
      }
    }
  }

  addMovie(movie) {
    this.movies.push(movie);
    if (this._el) {
      const child = document.createElement("cd-movie-result-item");
      child.setAttribute("title", movie.title);
      child.setAttribute("year", movie.year);
      child.setAttribute("imdbId", movie.imdbId);
      child.setAttribute("poster", movie.poster);
      child.setAttribute("bookmark-id", movie._id);
      this._el.appendChild(child);
    }
  }

  addMovies(movies) {
    movies.forEach((movie) => {
      this.addMovie(movie, this.el);
    });
  }

  removeBookmark(id) {
    // this.bookmarks = this.bookmarks.filter((bookmark) => bookmark._id !== id);
    if (this._el) {
      const el = this._el.querySelector(
        `cd-movie-result-item[bookmark-id="${id}"]`
      );
      if (el) {
        let itemEl = el.previousSibling;
        if (!itemEl) {
          itemEl = el.nextSibling;
        }
        if (itemEl) {
          itemEl.click();
        }
        el.remove();
      }
    }
  }

  set movies(movies) {
    this._movies = movies;
    if (this._el) {
      this.render(this._el);
    }
  }

  get movies() {
    return this._movies;
  }

  _addHandler(handler) {
    if (this._el) {
      if (this._handler) {
        this._el.removeEventListener("click", this._handler);
      }
      this._handler = handler;
      this._el.addEventListener("click", handler);
    }
  }
}
