import MovieDetails from "./custom-elements/details";
import Menubar from "./custom-elements/menubar";
import Rating from "./custom-elements/rating";
import MovieResultItem from "./custom-elements/result-item";
import MovieSearchBar from "./custom-elements/search-bar";
import Login from "./custom-elements/login";
import PopUpComponent from "./custom-elements/pop-up";
import Account from "./custom-elements/account";
import { Bookmark } from "./model/bookmark";
import { MovieList } from "./model/movie-list";
import { bookmarkService } from "./services/services";
import ConfirmComponent from "./custom-elements/confirm-dialog";
import InputComponent from "./custom-elements/input-dialog";
import CarrouselComponent from "./custom-elements/carrousel-component";

customElements.define("cd-movie-details", MovieDetails);
customElements.define("cd-menubar", Menubar);
customElements.define("cd-rating", Rating);
customElements.define("cd-movie-result-item", MovieResultItem);
customElements.define("cd-movie-search-bar", MovieSearchBar);
customElements.define("cd-account", Account);
customElements.define("cd-login", Login);
customElements.define("cd-pop-up", PopUpComponent);
customElements.define("cd-confirm", ConfirmComponent);
customElements.define("cd-input", InputComponent);
customElements.define("cd-carrousel", CarrouselComponent);

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
const movies = new MovieList();
const bookmarks = new MovieList();

// init log in
accountComp.addEventListener("user-logged-in", (e) => {
  menubar.setAttribute("login-state", true);
  movieDetails.setAttribute("login-state", true);
});

accountComp.addEventListener("user-logged-out", (e) => {
  menubar.setAttribute("login-state", ""); // must be a falsy string value
  movieDetails.setAttribute("login-state", "");
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

// // scroll results on wheel event
// resultsItems.addEventListener("wheel", (event) => {
//   resultsItems.scrollLeft -= event.deltaY;
//   event.preventDefault();
// });

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
    bookmarkDetails.setAttribute("imdbid", imdbId);
  }
}

async function initWatchListPage() {
  const bookmarkResults = await bookmarkService.getAll();
  bookmarks.movies = bookmarkResults; // bookmarkItems
  bookmarks.render(bookmarkItems, bookMarkListItemClickHandler);
}
