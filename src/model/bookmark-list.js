export class BookmarkList {
  constructor(bookmarks) {
    this._bookmarks = bookmarks || [];
  }

  render(el, handler) {
    if (!this._el) {
      this._el = el;
    }

    if (handler) {
      this._addHandler(handler);
    }

    this._el.innerHTML = ""; // clear the children
    if (this.bookmarks == null) {
      return;
    }
    for (const [index, bookmark] of this.bookmarks.entries()) {
      const child = document.createElement("cd-bookmark-result-item");
      child.setAttribute("title", bookmark.title);
      child.setAttribute("year", bookmark.year);
      child.setAttribute("imdbId", bookmark.imdbId);
      child.setAttribute("poster", bookmark.poster);
      child.bookmark = bookmark;
      this._el.appendChild(child);
      if (index == 0) {
        child.classList.add("selected");
        child.click();
      }
    }
  }

  addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
    if (this._el) {
      const child = document.createElement("cd-bookmark-result-item");
      child.setAttribute("title", bookmark.title);
      child.setAttribute("year", bookmark.year);
      child.setAttribute("imdbId", bookmark.imdbId);
      child.setAttribute("poster", bookmark.poster);
      this._el.appendChild(child);
    }
  }

  addBookmarks(bookmarks) {
    bookmarks.forEach((bookmark) => {
      this.addBookmark(bookmark, this.el);
    });
  }

  removeBookmark(imdbId) {
    this.bookmarks = this.bookmarks.filter(
      (bookmark) => bookmark.imdbId !== imdbId
    );
  }

  set bookmarks(bookmarks) {
    this._bookmarks = bookmarks;
    if (this._el) {
      this.render(this._el);
    }
  }

  get bookmarks() {
    return this._bookmarks;
  }

  findBookmark(imdbId) {
    return this._bookmarks.find((bookmark) => bookmark.imdbId === imdbId);
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
