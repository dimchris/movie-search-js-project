import MovieDetailsComponent from "./custom-elements/movie-details-component";
import MenubarComponent from "./custom-elements/menubar-component";
import RatingComponent from "./custom-elements/rating-component";
import MovieResultItemComponent from "./custom-elements/movie-result-item-component";
import SearchBarComponent from "./custom-elements/search-bar-component";
import LoginComponent from "./custom-elements/login-component";
import PopUpComponent from "./custom-elements/pop-up-component";
import AccountComponent from "./custom-elements/account-component";
import FilterBarComponent from "./custom-elements/filter-bar";
import { Bookmark } from "./model/bookmark";
import { bookmarkService, movieService } from "./services/services";
import ConfirmDialogComponent from "./custom-elements/confirm-dialog-component";
import InputDialogComponent from "./custom-elements/input-dialog-component";
import CarrouselComponent from "./custom-elements/carrousel-component";
import TagComponent from "./custom-elements/tag-component";
import TagListComponent from "./custom-elements/tag-list-component";
import { TagList } from "./model/tag-list";
import TagSelectorComponent from "./custom-elements/tag-selector-component";
import BookmarkTagListComponent from "./custom-elements/bookmark-tag-list-component";
import BookmarkResultItemComponent from "./custom-elements/bookmark-result-item-component";
import FilterBarItemComponent from "./custom-elements/filter-bar-item";
import axios from "./services/axios";
import user from "./state/user";
import bookmarks from "./state/bookmarks";
import movies from "./state/movies";
import alerts from "./utilities/alerts";

customElements.define("cd-movie-details", MovieDetailsComponent);
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
customElements.define("cd-filter-bar", FilterBarComponent);
customElements.define("cd-filter-bar-item", FilterBarItemComponent);

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
let bookmarkResults;

init();

function init() {
  // check local storage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (userId && token) {
    user.id = userId;
    user.token = token;
    login(user);
  }
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401 && user.token) {
        alerts.error("You have been logged out", "Please login again");
        logout();
      }
      // return Promise.reject(error);
    }
  );
}
function configureAxios(user) {
  axios.defaults.headers.common["Authorization"] = `bearer ${user.token}`;
}

function login(user) {
  menubar.setAttribute("login-state", true);
  movieDetails.setAttribute("show-bookmark", true);
  accountComp.loginState = true;
  configureAxios(user);
  initWatchListPage();
}

function logout() {
  menubar.setAttribute("login-state", ""); // must be a falsy string value
  movieDetails.setAttribute("show-bookmark", "");
  // delete user details and local storage
  user.id = null;
  user.token = null;
  localStorage.clear();
}

// cd-tags
// const tags = document.querySelector("cd-tags");
// tagService.getAll().then((data) => {
//   tags.tags = new TagList(data);
// });

// init log in
accountComp.addEventListener("user-logged-in", (e) => {
  const userId = e.detail.data.userId;
  const token = e.detail.data.token;
  user.token = token;
  user.id = userId;
  // set to local storage
  localStorage.setItem("userId", userId);
  localStorage.setItem("token", token);
  login(user);
});

accountComp.addEventListener("user-logged-out", () => {
  logout();
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

movieDetails.shadowRoot.addEventListener("bookmark-added", (e) => {
  const movieItem = e.movieItem;
  // find movie id exists
  movieService
    .add(movieItem)
    .then((movie) => {
      return bookmarkService.add({ movie: movie._id, imdbId: movie.imdbId });
    })
    .then(() => {
      alerts.alert("Success", "Movie has been successfuly saved");
      initWatchListPage();
    })
    .catch((error) => {
      alerts.error("Movie could not be saved", error.response.data.message);
    });
});

// movieDetails.shadowRoot.addEventListener("bookmark-removed", (e) => {
//   bookmarkService.remove(e.movieItem.imdbId);
// });

bookmarkDetails.shadowRoot.addEventListener("bookmark-removed", (e) => {
  bookmarkService.remove(e.movieItem._id).then(() => {
    //reset details
    bookmarks.removeBookmark(e.movieItem._id);
    bookmarkDetails.clear();
  });
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
        break;
      case "menu-item-account":
        accountPage.style.display = "flex";
        break;
      default:
    }
  }
});

// filterTags.addEventListener("bookmarks-filtered", (event) => {
//   if (event.detail.length) {
//     bookmarkService.getByTags(event.detail).then((bkmarks) => {
//       bookmarks.bookmarks = bkmarks;
//       if (!bookmarks.bookmarks.length) {
//         bookmarkDetails.clear();
//       }
//     });
//   } else {
//     bookmarkService.getAll().then((bkmarks) => {
//       bookmarks.bookmarks = bkmarks;
//     });
//   }
// });

// filterBar.addEventListener("bookmark-filters-updated", (event) => {
//   const filters = event.detail;
//   bookmarkService.getByFilters(filters).then((bkmarks) => {
//     bookmarks.bookmarks = bkmarks;
//     if (!bookmarks.bookmarks.length) {
//       bookmarkDetails.clear();
//     }
//   });
// });

// switch search
// let advance_search = false;
// document
//   .querySelector("#switch-button input[type=button]")
//   .addEventListener("click", (event) => {
//     advance_search = !advance_search;
//     if (advance_search) {
//       document.querySelector("cd-filter-bar").style.display = "block";
//       document.querySelector(".tag-filters").style.display = "none";
//       event.target.value = "tag search";
//     } else {
//       document.querySelector("cd-filter-bar").style.display = "none";
//       document.querySelector(".tag-filters").style.display = "block";
//       event.target.value = "advance search";
//     }
//   });

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
    const bookmarkId = bookmarkItem.getAttribute("bookmark-id");
    bookmarkDetails.setAttribute("imdbid", imdbId);
    bookmarkDetails.setAttribute("bookmark-id", bookmarkId);
    bookmarkDetails.selectedTags = bookmark.tags;
    // bookmarkDetails.tags = tags.tags;
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
  bookmarks.bookmarks = prepareBookMarksFromResponseData(bookmarkResults.data); // bookmarkItems
  bookmarks.render(bookmarkItems, bookMarkListItemClickHandler);
}

function prepareBookMarksFromResponseData(bookmarks) {
  return bookmarks.map((bookmark) => {
    const bkmark = new Bookmark(
      bookmark.movie.imdbId,
      bookmark.movie.title,
      bookmark.movie.year,
      bookmark.movie.poster
    );
    bkmark.id = bookmark._id;
    return bkmark;
  });
}
