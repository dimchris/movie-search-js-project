// main page elements refs
const searchBar = document.getElementById('search-bar');
const resultsItems = document.getElementById('results');
const movieDetails = document.getElementById('movie-details');
const totalResults = document.getElementById('total-results');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
let movies;

// update results if new search is triggered
searchBar.addEventListener('results-updated', () => {
  const results = searchBar._results;
  const total = searchBar._totalResults;
  const input = searchBar._input;
  if (!results) {
    return;
  }
  totalResults.textContent = `${total} Found for "${input}"`;
  movies = new MovieList(results)
  movies.render(resultsItems)

  searchBar.changePage();
});

// add ne results when new pages r requested
searchBar.addEventListener('results-added', () => {
  const results = searchBar._results;
  if (!results) {
    return;
  }
  movies.addMovies(results, resultsItems);
});

// update details components when movie is selected
resultsItems.addEventListener('result-clicked', (event) => {
  const imdbId = event.target.getAttribute('imdbid');
  movieDetails.setAttribute('imdbid', imdbId);
});

// scroll results on wheel event
resultsItems.addEventListener('wheel', (event) => {
  resultsItems.scrollLeft -= event.deltaY;
  event.preventDefault();
});

// get new results when scrolling (get next page)
resultsItems.addEventListener('scroll', (event) => {
  const scrollWith = resultsItems.scrollWidth;
  const scrollLeft = resultsItems.scrollLeft;
  const clientWidth = resultsItems.clientWidth;
  if ((scrollLeft + clientWidth) / scrollWith > 0.5) {
    searchBar.changePage();
  }
});

// scroll by using the next & back button
next.addEventListener('click', (event) => {
  resultsItems.scrollTo({left: resultsItems.scrollLeft + 0.8 * resultsItems.offsetWidth, behavior:'smooth'})
});

prev.addEventListener('click', (event) => {
  resultsItems.scrollTo({left: resultsItems.scrollLeft - 0.8 * resultsItems.offsetWidth, behavior:'smooth'})
});
