let searchBar = document.getElementById('search-bar');
let resultsItems = document.getElementById('results');
let movieDetails = document.getElementById('movie-details');
let totalResults = document.getElementById('total-results');
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

searchBar.addEventListener('results-updated', () => {
  let results = searchBar._results;
  let total = searchBar._totalResults;
  let input = searchBar._input;
  if (!results) {
    return;
  }
  totalResults.textContent = `${total} Found for "${input}"`;
  resultsItems.innerHTML = ''; // clear the children
  for (let [index, result] of results.entries()) {
    let child = document.createElement('cd-movie-result-item');
    child.setAttribute('title', result.Title);
    child.setAttribute('year', result.Year);
    child.setAttribute('imdbId', result.imdbID);
    child.setAttribute('poster', result.Poster);
    resultsItems.appendChild(child);
    if (index == 0) {
      child.classList.add('selected');
      child.dispatchEvent(new Event('result-clicked', { bubbles: true }));
    }
  }

  searchBar.changePage();
});

searchBar.addEventListener('results-added', () => {
  let results = searchBar._results;
  if (!results) {
    return;
  }
  for (result of results) {
    let child = document.createElement('cd-movie-result-item');
    child.setAttribute('title', result.Title);
    child.setAttribute('year', result.Year);
    child.setAttribute('imdbId', result.imdbID);
    child.setAttribute('poster', result.Poster);
    resultsItems.appendChild(child);
  }
});

resultsItems.addEventListener('result-clicked', (event) => {
  let imdbId = event.target.getAttribute('imdbid');
  movieDetails.setAttribute('imdbid', imdbId);
});

resultsItems.addEventListener('wheel', (event) => {
  resultsItems.scrollLeft -= event.deltaY;
  event.preventDefault();
});

resultsItems.addEventListener('scroll', (event) => {
  let scrollWith = resultsItems.scrollWidth;
  let scrollLeft = resultsItems.scrollLeft;
  let clientWidth = resultsItems.clientWidth;
  console.log((scrollLeft + clientWidth) / scrollWith);
  if ((scrollLeft + clientWidth) / scrollWith > 0.5) {
    searchBar.changePage();
  }
});

next.addEventListener('click', (event) => {
  console.log(resultsItems.scrollLeft);
  resultsItems.scrollLeft += 0.8 * resultsItems.offsetWidth;
});

prev.addEventListener('click', (event) => {
  console.log(resultsItems.scrollLeft);
  resultsItems.scrollLeft -= 0.8 * resultsItems.offsetWidth;
});
