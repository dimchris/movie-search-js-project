// main page elements refs
const searchBar = document.getElementById('search-bar');
const resultsItems = document.getElementById('results');
const bookmarkItems = document.getElementById('bookmarks');
const movieDetails = document.getElementById('movie-details');
const totalResults = document.getElementById('search-total-results');
const totalBookmarks = document.getElementById('total-bookmarks');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const zoomArea = document.querySelector('#zoom-area');
const zoomCloseButton = document.querySelector('#zoom-area__close-button');
const menubar = document.querySelector('.menubar');
const mainPage = document.getElementById('main');
const watchlistPage = document.getElementById('watchlist');
const accountPage = document.getElementById('account');
const movies = new MovieList();
const bookmarks = new MovieList();

// init services
const bookmarkService = new BookmarkService(new BookmarkMockDS(bookmarks));


// update results if new search is triggered
searchBar.addEventListener('results-updated', () => {
  const results = searchBar._results;
  const total = searchBar._totalResults;
  const input = searchBar._input;
  totalResults.textContent = `${total} Found for "${input}"`;
  movies.render(resultsItems, movieListItemClickHandler);
  movies.movies = results;

  // buffer more results
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

movieDetails.addEventListener('bookmark-added', e =>{
  bookmarkService.add(Bookmark.fromMovieItem(e.movieItem));
})

movieDetails.addEventListener('bookmark-removed', e =>{
  bookmarkService.remove(e.movieItem.imdbId);
})


// scroll by using the next & back button
next.addEventListener('click', (event) => {
  document.querySelector('.carrousel-items').scrollTo({left: resultsItems.scrollLeft + 0.8 * resultsItems.offsetWidth, behavior:'smooth'})
});

prev.addEventListener('click', (event) => {
  document.querySelector('.carrousel-items').scrollTo({left: resultsItems.scrollLeft - 0.8 * resultsItems.offsetWidth, behavior:'smooth'})
});

zoomCloseButton.addEventListener('click', (e) => {
  zoomArea.style.display = 'none';
})

menubar.addEventListener('click', e =>{
  // select menu item
  if(e.target.classList.contains('menu-item') && !e.target.classList.contains('selected')){
    e.currentTarget.querySelectorAll('div').forEach(item =>{
      item.classList.remove('selected')
    })
    e.target.classList.add('selected');
    // change page
    document.querySelectorAll('.page').forEach( item => item.style.display = 'none');
    switch(e.target.id){
      case 'menu-item-search':
        mainPage.style.display = 'flex';
        break;
        case 'menu-item-watchlist':
          watchlistPage.style.display = 'flex';
          initWatchListPage();
        break;
        case 'menu-item-account':
          accountPage.style.display = 'flex';
        break;
        default:
    }
  }

});

// movie list click handler
function movieListItemClickHandler(event){
  let movieItem = event.target.closest('cd-movie-result-item');
  if(movieItem){
    // on click update the item details
    // remove select class from all items
    event.currentTarget.querySelectorAll('cd-movie-result-item').forEach(item => {
        item.classList.remove('selected');
    })
    
    // add select class to the selected item
    movieItem.classList.add('selected');

    const imdbId = movieItem.getAttribute('imdbId');
    movieDetails.setAttribute('imdbid', imdbId);
  }
}

async function initWatchListPage(){
  const bookmarkResults = await bookmarkService.getAll();
  bookmarks.movies = bookmarkResults; // bookmarkItems
  bookmarks.render(bookmarkItems, null);

}