import _ from "lodash";

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
      child.setAttribute("bookmark-id", bookmark._id);
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
      child.setAttribute("bookmark-id", bookmark._id);
      this._el.appendChild(child);
    }
  }

  addBookmarks(bookmarks) {
    bookmarks.forEach((bookmark) => {
      this.addBookmark(bookmark, this.el);
    });
  }

  removeBookmark(id) {
    // this.bookmarks = this.bookmarks.filter((bookmark) => bookmark._id !== id);
    if (this._el) {
      const el = this._el.querySelector(
        `cd-bookmark-result-item[bookmark-id="${id}"]`
      );
      if (el) {
        el.remove();
      }
    }
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

  getByFilters(filters) {
    return this._bookmarks.filter((bkmrk) => {
      let result = true;
      let char;
      _.forEach(filters, (value, key) => {
        if (key == "title") {
          char = "";
          result =
            result &&
            bkmrk[key] &&
            bkmrk[key].toLowerCase().includes(value.toLowerCase());
        } else {
          char = ",";

          result =
            result &&
            bkmrk[key] &&
            value
              .split(char)
              .every((item) =>
                bkmrk[key].toLowerCase().includes(item.toLowerCase())
              );
        }
      });
      return result;
    });
  }
}
