// Search bar component
class MovieSearchBar extends HTMLElement{
    constructor(){
        super();
        this._apiKey = this.getAttribute('api-key');
        this._url = `http://www.omdbapi.com/?apikey=${this._apiKey}&type=movie`;
        this._timeout = null;
        // get the time after stop typing to start searching for results
        // default value 1500ms
        this._timeoutTime = this.getAttribute('timeout') || 1500;
        this._searchLabel = this.getAttribute('seach-label') || 'searching...';
        this._canNotFindResultsLabel = this.getAttribute('can-not-find-result-label') || 'could not find a movie..';
        this._errorLabel = this.getAttribute('error-label') || 'unexpected error occured.. plz try again.';
        this._results = [];
        this._input = '';
        this._page = 1;
        this._totalResults = 0; // total results returned from query after fetch
        this._totalPages = 1; // total pages returned from query, each page of 10 items
        this._placeholder = 'placeholder...'; // default value of the place holder
        this._placeholder = this.getAttribute('placeholder') || this._placeholder; // default value if none is set
        // add the input element
        this._searchBox = document.createElement('input');
        this._searchBox.classList = ['search-box-input'];
        this._searchBox.type = 'text';
        this._searchBox.placeholder = this._placeholder;
        this._searchBox.addEventListener('keyup', this._onNewInput.bind(this));
        this._output = document.createElement('div');
        this._output.innerHTML = '';
        this._output.classList.add('search-output');

    }
    
    connectedCallback(){
        this.appendChild(this._searchBox);
        this.appendChild(this._output);
        
    }

    _onNewInput(){
        this._searchBox.classList.add('searching');
        this._searchBox.classList.remove('search-error');
        this._searchBox.classList.remove('search-compconste');
        this._output.classList.remove('search-hidden');

        this._output.innerHTML = this._searchLabel;
        this.classList.remove('close');
        // get the input
        let input = this._searchBox.value;
        input = input ? input.trim() : input;
        // set the page to 1
        this._page = 1;
        if(input){
            this._input = input;
            // while typing clear the timeout
            clearTimeout(this._timeout);
            // set new timeout wait &  for timeout time until fetch or reset timeout
            this._timeout = setTimeout(() => {
                this._getNewResults(this._input, this._page)
                    .then(response => response.json())
                    .then(data => {
                        // according to the api the response should be se to true if results
                        if(data.Response === 'True'){
                            this._results = data.Search;
                            this._totalResults = data.totalResults;
                            // calc the pages
                            this._totalPages = Math.trunc(data.totalResults/10) + (data.totalResults%10 ? 1 : 0);
                            this._searchBox.classList.remove('searching');
                            this._searchBox.classList.add('search-compconste');
                            this._output.classList.add('search-hidden');
                            this._searchBox.innerHTML = '';
                            this.classList.add('close');
                        }else{
                            this._results = [];
                            this._totalResults = 0;
                            this._totalPages = 1;
                            this.classList.remove('close');
                            this._output.innerHTML = this._canNotFindResultsLabel;
                            this._searchBox.classList.add('search-error');
                        }
                        const event = new Event('results-updated');
                        this.dispatchEvent(event);
                    })
                    .catch(error => {
                        this._searchBox.classList.add('search-error');
                        this._output.innerHTML = this._errorLabel;
                        this._errorHandler(error);
                    });
                }, this._timeoutTime);
        }else{
            this.classList.remove('close');
            this._searchBox.classList.remove('searching');
            clearTimeout(this._timeout);
            this._results = [];
        }
    }
    _getNewResults(input, page){
        page = this._page || 1;
        const url = `${this._url}&s=${input}&page=${page}`;
        return fetch(url);
    }
    
    _errorHandler(error){
        console.log(error);
    }

    changePage(page){
        this._page = page || this._page + 1;
       
        if(this._totalPages && this._page > this._totalPages){
            return;
        }

        this._getNewResults(this._input, page)
            .then(response => response.json())
            .then(data => {
                this._results = data.Search;
                this._totalResults = data.totalResults;
                this._totalPages = Math.trunc(data.totalResults/10) + (data.totalResults%10 ? 1 : 0);
                const event = new Event('results-added');
                this.dispatchEvent(event);
            })
            .catch(error => {
                this._errorHandler(error);
            });
    }
}


customElements.define('cd-movie-search-bar', MovieSearchBar);