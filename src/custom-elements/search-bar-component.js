import { MovieItem } from "../model/movie-item";

// Search bar component
export default class SearchBarComponent extends HTMLElement {
  constructor() {
    super();
    this._apiKey = this.getAttribute("api-key");
    this._url = `http://www.omdbapi.com/?apikey=${this._apiKey}&type=movie`;
    this._timeout = null;
    // get the time after stop typing to start searching for results
    // default value 1500ms
    this._timeoutTime = this.getAttribute("timeout") || 1500;
    this._searchLabel = this.getAttribute("seach-label") || "searching...";
    this._canNotFindResultsLabel =
      this.getAttribute("can-not-find-result-label") ||
      "could not find a movie..";
    this._errorLabel =
      this.getAttribute("error-label") ||
      "unexpected error occured.. plz try again.";
    this._results = null;
    this._input = "";
    this._page = 1;
    this._totalResults = 0; // total results returned from query after fetch
    this._totalPages = 1; // total pages returned from query, each page of 10 items
    this._placeholder = "placeholder..."; // default value of the place holder
    this._placeholder = this.getAttribute("placeholder") || this._placeholder; // default value if none is set
    // add the input element
    this._searchBox = document.createElement("input");
    this._searchBox.classList = ["search-box-input"];
    this._searchBox.type = "search";
    this._searchBox.placeholder = this._placeholder;
    this._searchBox.addEventListener("keyup", this._onNewInput.bind(this));
    this._searchBox.addEventListener("search", this._onNewInput.bind(this));
    this._output = document.createElement("div");
    this._output.innerHTML = "";
    this._output.classList.add("search-output");
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const style = `
      <style>

      @keyframes glow-green {
        from {
          box-shadow: 0 0 5px -5px #aef4af;
        }

        to {
          box-shadow: 0 0 5px 5px #aef4af;
        }
      }

      @keyframes glow-yellow {
        from {
          box-shadow: 0 0 5px -5px #e7f33cbb;
        }

        to {
          box-shadow: 0 0 5px 5px #e7f33cbb;
        }
      }

      @keyframes glow-red {
        from {
          box-shadow: 0 0 5px -5px #be5252;
        }

        to {
          box-shadow: 0 0 5px 5px #be5252;
        }
      }
      :host {
        position: absolute;
        height: 100%;
        width: 100%;
        bottom: 0px;
        left: 0px;
        display: flex;
        flex-direction: column;
        background: var(--primary-color);
        justify-content: center;
        align-items: center;
        transition: height 1s ease, background 1s ease;
        padding-top: 5px;
        padding-bottom: 5px;
        z-index: 20;
      }

      :host(.close) {
        height: 90px;
        background: none;
        transition: height 1s ease, background 2s ease;
      }

      .search-box-input {
        font-size: 1.5rem;
        /* font-family: Verdana, Geneva, Tahoma, sans-serif; */
        color: grey;
        text-align: center;
        font-style: italic;
        height: fit-content;
        width: 80%;
        max-width: 400px;
        border-radius: 20px;
        border-style: solid;
        outline: none;
        margin: 10px;
      }

      .search-box-input.searching {
        border-style: solid;
        animation: glow-yellow 1s infinite alternate;
      }

      .search-box-input.search-compconste {
        border-style: solid;
        animation: glow-green 1s 4 alternate;
      }

      .search-box-input.search-error {
        border-style: solid;
        animation: glow-red 1s infinite alternate;
      }

      .search-box-input::placeholder {
        border-color: var(--primary-color);
      }

      .search-output {
        height: 30px;
        display: block;
        color: grey;
        transition: color 1s ease;
        margin: 5px;
      }

      .search-output.search-hidden {
        display: none;
      }

      ::-webkit-search-cancel-button {
        position: relative;
        right: 20px;

        height: 20px;
        width: 20px;
        border-radius: 10px;
      }
      </style>
    `;
    this.shadowRoot.innerHTML = style;
    this.shadowRoot.appendChild(this._searchBox);
    this.shadowRoot.appendChild(this._output);
  }

  _onNewInput(e) {
    // if not alphanumeric return
    // do not escape delete and back
    if (e.which != 8 && e.which != 46 && (e.which > 90 || e.which < 48)) {
      return;
    }
    this._searchBox.classList.add("searching");
    this._searchBox.classList.remove("search-error");
    this._searchBox.classList.remove("search-compconste");
    this._output.classList.remove("search-hidden");

    this._output.innerHTML = this._searchLabel;
    this.classList.remove("close");
    // get the input
    let input = this._searchBox.value;
    input = input ? input.trim() : input;
    // set the page to 1
    this._page = 1;
    if (input) {
      this._input = input;
      // while typing clear the timeout
      clearTimeout(this._timeout);
      // set new timeout wait &  for timeout time until fetch or reset timeout
      this._timeout = setTimeout(() => {
        this._getNewResults(this._input, this._page)
          .then((response) => response.json())
          .then((data) => {
            // according to the api the response should be se to true if results
            if (data.Response === "True") {
              this._results = data.Search.map(
                (movie) =>
                  new MovieItem(
                    movie.imdbID,
                    movie.Title,
                    movie.Year,
                    movie.Poster
                  )
              );
              this._totalResults = data.totalResults;
              // calc the pages
              this._totalPages =
                Math.trunc(data.totalResults / 10) +
                (data.totalResults % 10 ? 1 : 0);
              // introduce some latency to wait for the images to load properly
              setTimeout(() => {
                this._searchBox.classList.remove("searching");
                this._searchBox.classList.add("search-compconste");
                this._output.classList.add("search-hidden");
                this._searchBox.innerHTML = "";
                this.classList.add("close");
              }, 1000);
            } else {
              this._results = [];
              this._totalResults = 0;
              this._totalPages = 1;
              this.classList.remove("close");
              this._output.innerHTML = this._canNotFindResultsLabel;
              this._searchBox.classList.add("search-error");
            }
            const event = new Event("results-updated");
            this.dispatchEvent(event);
          })
          .catch((error) => {
            this._searchBox.classList.add("search-error");
            this._output.innerHTML = this._errorLabel;
            this._errorHandler(error);
          });
      }, this._timeoutTime);
    } else {
      this.classList.remove("close");
      this._searchBox.classList.remove("searching");
      // remove searching label
      this._output.innerHTML = "";
      clearTimeout(this._timeout);
      this._results = [];
    }
  }
  _getNewResults(input, page) {
    page = this._page || 1;
    const url = `${this._url}&s=${input}&page=${page}`;
    return fetch(url);
  }

  _errorHandler(error) {
    // log the error for now
    console.log(error);
  }

  // this will change the page and get the new results
  changePage(page) {
    // if not page is passed the it will move to the next page
    this._page = page || this._page + 1;

    // if page is out of limits return
    if (this._totalPages && this._page > this._totalPages) {
      return;
    }

    // get the new results
    this._getNewResults(this._input, page)
      .then((response) => response.json())
      .then((data) => {
        this._results = data.Search.map(
          (movie) =>
            new MovieItem(movie.imdbID, movie.Title, movie.Year, movie.Poster)
        );
        this._totalResults = data.totalResults;
        this._totalPages =
          Math.trunc(data.totalResults / 10) + (data.totalResults % 10 ? 1 : 0);
        // emit results added event to refresh the results component
        const event = new Event("results-added");
        this.dispatchEvent(event);
      })
      .catch((error) => {
        this._errorHandler(error);
      });
  }
}
