import MovieDetailsComponent from "./custom-elements/movie-details-component";
import MenubarComponent from "./custom-elements/menubar-component";
import RatingComponent from "./custom-elements/rating-component";
import MovieResultItemComponent from "./custom-elements/movie-result-item-component";
import SearchBarComponent from "./custom-elements/search-bar-component";
import LoginComponent from "./custom-elements/login-component";
import PopUpComponent from "./custom-elements/pop-up-component";
import AccountComponent from "./custom-elements/account-component";
import { Bookmark } from "./model/bookmark";
import { MovieList } from "./model/movie-list";
import { bookmarkService, tagService } from "./services/services";
import ConfirmDialogComponent from "./custom-elements/confirm-dialog-component";
import InputDialogComponent from "./custom-elements/input-dialog-component";
import CarrouselComponent from "./custom-elements/carrousel-component";
import TagComponent from "./custom-elements/tag-component";
import TagListComponent from "./custom-elements/tag-list-component";
import { TagList } from "./model/tag-list";
import TagSelectorComponent from "./custom-elements/tag-selector-component";
import BookmarkDetailsComponent from "./custom-elements/bookmark-details-component";
import BookmarkTagListComponent from "./custom-elements/bookmark-tag-list-component";
import BookmarkResultItemComponent from "./custom-elements/bookmark-result-item-component";
import { BookmarkList } from "./model/bookmark-list";

customElements.define("cd-movie-details", MovieDetailsComponent);
customElements.define("cd-bookmark-details", BookmarkDetailsComponent);
customElements.define("cd-menubar", MenubarComponent);
customElements.define("cd-rating", RatingComponent);
customElements.define("cd-movie-result-item", MovieResultItemComponent);
customElements.define("cd-bookmark-result-item", BookmarkResultItemComponent);
customElements.define("cd-movie-search-bar", SearchBarComponent);
customElements.define("cd-account", AccountComponent);
customElements.define("cd-login", LoginComponent);
customElements.define("cd-pop-up", PopUpComponent);
customElements.define("cd-confirm", ConfirmDialogComponent);
customElements.define("cd-input", InputDialogComponent);
customElements.define("cd-carrousel", CarrouselComponent);
customElements.define("cd-tag", TagComponent);
customElements.define("cd-tags", TagListComponent);
customElements.define("cd-bookmark-tags", BookmarkTagListComponent);
customElements.define("cd-tag-selector", TagSelectorComponent);

// main page elements refs
const searchBar = document.getElementById("search-bar");
const resultsItems = document.getElementById("results");
const bookmarkItems = document.getElementById("bookmarks");
const movieDetails = document.getElementById("movie-details");
const bookmarkDetails = document.getElementById("bookmark-details");
const totalResults = document.getElementById("search-total-results");
const zoomArea = document.querySelector("#zoom-area");
const zoomCloseButton = document.querySelector("#zoom-area__close-button");
const menubar = document.querySelector("cd-menubar");
const mainPage = document.getElementById("main");
const watchlistPage = document.getElementById("watchlist");
const accountPage = document.getElementById("account");
const accountComp = document.querySelector("cd-account");
const filterTags = document.getElementById("filter-tags");
const movies = new MovieList();
const bookmarks = new BookmarkList();
let bookmarkResults;

// TODO: remove test cd-tags
const tags = document.querySelector("cd-tags");
tagService.getAll().then((data) => {
  tags.tags = new TagList(data);
});

// init log in
accountComp.addEventListener("user-logged-in", (e) => {
  menubar.setAttribute("login-state", true);
  movieDetails.setAttribute("show-bookmark", true);
});

accountComp.addEventListener("user-logged-out", (e) => {
  menubar.setAttribute("login-state", ""); // must be a falsy string value
  movieDetails.setAttribute("show-bookmark", "");
});

// update results if new search is triggered
searchBar.addEventListener("results-updated", () => {
  const results = searchBar._results;
  const total = searchBar._totalResults;
  const input = searchBar._input;
  totalResults.textContent = `${total} Found for "${input}"`;
  movies.render(resultsItems, movieListItemClickHandler);
  movies.movies = results;

  // buffer more results
  searchBar.changePage();
});

// add new results when new pages r requested
searchBar.addEventListener("results-added", () => {
  const results = searchBar._results;
  if (!results) {
    return;
  }
  movies.addMovies(results, resultsItems);
});

// get new results when scrolling (get next page)
resultsItems.addEventListener("scroll", () => {
  const scrollWith = resultsItems.scrollWidth;
  const scrollLeft = resultsItems.scrollLeft;
  const clientWidth = resultsItems.clientWidth;
  if ((scrollLeft + clientWidth) / scrollWith > 0.5) {
    searchBar.changePage();
  }
});

movieDetails.addEventListener("bookmark-added", (e) => {
  bookmarkService.add(Bookmark.fromMovieItem(e.movieItem));
});

movieDetails.addEventListener("bookmark-removed", (e) => {
  bookmarkService.remove(e.movieItem.imdbId);
});

zoomCloseButton.addEventListener("click", () => {
  zoomArea.style.display = "none";
});

menubar.shadowRoot.addEventListener("click", (e) => {
  // select menu item
  if (
    e.target.classList.contains("menu-item") &&
    !e.target.classList.contains("selected")
  ) {
    e.currentTarget.querySelectorAll("div").forEach((item) => {
      item.classList.remove("selected");
    });
    e.target.classList.add("selected");
    // change page
    document
      .querySelectorAll(".page")
      .forEach((item) => (item.style.display = "none"));
    switch (e.target.id) {
      case "menu-item-search":
        mainPage.style.display = "flex";
        break;
      case "menu-item-watchlist":
        watchlistPage.style.display = "flex";
        initWatchListPage();
        break;
      case "menu-item-account":
        accountPage.style.display = "flex";
        break;
      default:
    }
  }
});

filterTags.addEventListener("bookmarks-filtered", (event) => {
  if (event.detail.length) {
    bookmarkService.getByTags(event.detail).then((bkmarks) => {
      bookmarks.bookmarks = bkmarks;
    });
  } else {
    bookmarkService.getAll().then((bkmarks) => {
      bookmarks.bookmarks = bkmarks;
    });
  }
});

// movie list click handler
function movieListItemClickHandler(event) {
  let movieItem = event.target.closest("cd-movie-result-item");
  if (movieItem) {
    // on click update the item details
    // remove select class from all items
    event.currentTarget
      .querySelectorAll("cd-movie-result-item")
      .forEach((item) => {
        item.classList.remove("selected");
      });

    // add select class to the selected item
    movieItem.classList.add("selected");

    const imdbId = movieItem.getAttribute("imdbId");
    movieDetails.setAttribute("imdbid", imdbId);
  }
}
// movie list click handler
function bookMarkListItemClickHandler(event) {
  let bookmarkItem = event.target.closest("cd-bookmark-result-item");
  if (bookmarkItem) {
    // on click update the item details
    // remove select class from all items
    event.currentTarget
      .querySelectorAll("cd-bookmark-result-item")
      .forEach((item) => {
        item.classList.remove("selected");
      });

    // add select class to the selected item
    bookmarkItem.classList.add("selected");
    const bookmark = bookmarkItem.bookmark;
    const imdbId = bookmarkItem.getAttribute("imdbId");
    bookmarkDetails.setAttribute("imdbid", imdbId);
    bookmarkDetails.selectedTags = bookmark.tags;
    bookmarkDetails.tags = tags.tags;
    bookmarkDetails.selectedHandler = (input) => {
      const newSelectedTags = new TagList(input.selected);
      bookmarkDetails.selectedTags = newSelectedTags;
      bookmark.tags = newSelectedTags;
      bookmarkService.updateTags(imdbId, newSelectedTags);
    };
  }
}

async function initWatchListPage() {
  bookmarkResults = await bookmarkService.getAll();
  bookmarks.bookmarks = bookmarkResults; // bookmarkItems
  bookmarks.render(bookmarkItems, bookMarkListItemClickHandler);
}
