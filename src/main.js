import MovieDetailsComponent from "./custom-elements/movie-details-component/movie-details-component";
import MenubarComponent from "./custom-elements/menu-bar-component/menubar-component";
import RatingComponent from "./custom-elements/shared/rating-component";
import MovieResultItemComponent from "./custom-elements/result-items/movie-result-item-component";
import SearchBarComponent from "./custom-elements/search-bar-component/search-bar-component";
import LoginComponent from "./custom-elements/menu-bar-component/account-component/login-component/login-component";
import PopUpComponent from "./custom-elements/shared/dialogs/pop-up-component";
import AccountComponent from "./custom-elements/menu-bar-component/account-component/account-component";
import {
  bookmarkService,
  directorService,
  movieService,
  writerService,
} from "./services/services";
import ConfirmDialogComponent from "./custom-elements/shared/dialogs/confirm-dialog-component";
import InputDialogComponent from "./custom-elements/shared/dialogs/input-dialog-component";
import CarrouselComponent from "./custom-elements/shared/carrousel-component";
import axios from "./configuration/axios";
import user from "./state/user";
import bookmarks from "./state/bookmarks";
import movies from "./state/movies";
import alerts from "./utilities/alerts";
import { MovieItem } from "./model/movie-item";

customElements.define("cd-movie-details", MovieDetailsComponent);
customElements.define("cd-menubar", MenubarComponent);
customElements.define("cd-rating", RatingComponent);
customElements.define("cd-movie-result-item", MovieResultItemComponent);
customElements.define("cd-movie-search-bar", SearchBarComponent);
customElements.define("cd-account", AccountComponent);
customElements.define("cd-login", LoginComponent);
customElements.define("cd-pop-up", PopUpComponent);
customElements.define("cd-confirm", ConfirmDialogComponent);
customElements.define("cd-input", InputDialogComponent);
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
}

function configureAxios(user) {
  axios.defaults.headers.common["Authorization"] = `bearer ${user.token}`;
}

function login(user) {
  menubar.setAttribute("login-state", true);
  movieDetails.setAttribute("save-button", true);
  accountComp.loginState = true;
  configureAxios(user);
  initWatchListPage();
}

function logout() {
  menubar.setAttribute("login-state", ""); // must be a falsy string value
  movieDetails.setAttribute("save-button", "");
  bookmarkDetails.clear();
  // delete user details and local storage
  user.id = null;
  user.token = null;
  localStorage.clear();
}

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
  const movieItem = e.movie;
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

bookmarkDetails.shadowRoot.addEventListener("bookmark-removed", (e) => {
  bookmarkService.remove(e.movie._bookmarkId).then(() => {
    //reset details
    bookmarks.removeBookmark(e.movie._bookmarkId);
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
  let bookmarkItem = event.target.closest("cd-movie-result-item");
  if (bookmarkItem) {
    // on click update the item details
    // remove select class from all items
    event.currentTarget
      .querySelectorAll("cd-movie-result-item")
      .forEach((item) => {
        item.classList.remove("selected");
      });

    // add select class to the selected item
    bookmarkItem.classList.add("selected");
    const imdbId = bookmarkItem.getAttribute("imdbId");
    const bookmarkId = bookmarkItem.getAttribute("bookmark-id");
    bookmarkDetails.setAttribute("imdbid", imdbId);
    bookmarkDetails.setAttribute("bookmark-id", bookmarkId);
  }
}

async function initWatchListPage() {
  bookmarkResults = await bookmarkService.getAll();
  bookmarks.movies = prepareBookMarksFromResponseData(bookmarkResults.data); // bookmarkItems
  bookmarks.render(bookmarkItems, bookMarkListItemClickHandler);
}

function prepareBookMarksFromResponseData(bookmarks) {
  return bookmarks.map((bookmark) => {
    const bkmark = new MovieItem(
      bookmark.movie.imdbId,
      bookmark.movie.title,
      bookmark.movie.year,
      bookmark.movie.poster
    );
    bkmark.id = bookmark._id;
    return bkmark;
  });
}

bookmarkDetails.getResults = async (movie) => {
  const result = await movieService.getByImdb(movie.imdbId);
  const returnedMovie = result.data[0];
  movie.imdbId = returnedMovie.imdbId;
  movie.title = returnedMovie.title;
  movie.rating = returnedMovie.rating;
  movie.votes = returnedMovie.votes;
  movie.runtime = returnedMovie.runtime;
  movie.year = returnedMovie.year;
  movie.plot = returnedMovie.plot;
  movie.actors = returnedMovie.actors;
  movie.genre = returnedMovie.genre;
  movie.language = returnedMovie.language;
  movie.poster = returnedMovie.poster;
  // get directors
  let directorArray = [];
  for (let director of returnedMovie.directors) {
    const name = await (await directorService.get(director)).data.name;
    directorArray.push(name);
  }
  movie.directors = directorArray.join(" ,");
  // get writers
  let writerArray = [];
  for (let writer of returnedMovie.writers) {
    const name = await (await writerService.get(writer)).data.name;
    writerArray.push(name);
  }
  movie.writers = writerArray.join(" ,");

  return movie;
};

movieDetails.getResults = async (movie) => {
  const url = "https://www.omdbapi.com/?plot=full&apikey=15fb3faa";
  return fetch(`${url}&i=${movie.imdbId}`)
    .then((response) => response.json())
    .then((result) => {
      movie.imdbId = result.imdbID;
      movie.title = result.Title;
      movie.rating = result.imdbRating;
      movie.votes = result.imdbVotes;
      movie.runtime = result.Runtime;
      movie.year = result.Year;
      movie.plot = result.Plot;
      movie.directors = result.Director;
      movie.actors = result.Actors;
      movie.genre = result.Genre;
      movie.language = result.Language;
      movie.poster = result.Poster;
      movie.writers = result.Writer;
      return movie;
    });
};
