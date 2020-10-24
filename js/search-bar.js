class MovieSearchBar extends HTMLElement{
    constructor(){
        super();
        this._url = 'http://www.omdbapi.com/?apikey=15fb3faa&type=movie';
        this._timeout = null;
        this._results = [];
        this._input = '';
        this._page = 1;
        this._totalResults = 0;
        this._totalPages = 1;
        this._placeholder = 'placeholder...';
        this._placeholder = this.getAttribute('placeholder') || this._placeholder;
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
        this._searchBox.classList.remove('search-complete');
        this._output.classList.remove('search-hidden');

        this._output.innerHTML = 'searching...';
        this.classList.remove('close');
        // get the input
        let input = this._searchBox.value;
        input = input ? input.trim() : input;
        // set the page to 1
        this._page = 1;
        if(input){
            this._input = input;
            clearTimeout(this._timeout);
            this._timeout = setTimeout(() => {
                this._getNewResults(this._input, this._page)
                    .then(response => response.json())
                    .then(data => {
                        if(data.Response === 'True'){
                            this._results = data.Search;
                            this._totalResults = data.totalResults;
                            this._totalPages = Math.trunc(data.totalResults/10) + (data.totalResults%10 ? 1 : 0);
                            this._searchBox.classList.remove('searching');
                            this._searchBox.classList.add('search-complete');
                            this._output.classList.add('search-hidden');
                            this._searchBox.innerHTML = '';
                            this.classList.add('close');
                        }else{
                            this._results = [];
                            this._totalResults = 0;
                            this.classList.remove('close');
                            this._output.innerHTML = 'could not find a movie..';
                            this._searchBox.classList.add('search-error');
                        }
                        let event = new Event('results-updated');
                        this.dispatchEvent(event);
                    })
                    .catch(error => {
                        this._searchBox.classList.add('search-error');
                        this._output.innerHTML = 'unexpected error occured.. plz try again.';
                        this._errorHandler(error);
                    });
                }, 1500);
        }else{
            this.classList.remove('close');
            this._searchBox.classList.remove('searching');
            this._output.innerHTML = ' ';
            clearTimeout(this._timeout);
            this._results = [];
        }
    }
    _getNewResults(input, page){
        page = this._page || 1;
        let url = `${this._url}&s=${input}&page=${page}`;
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
                let event = new Event('results-added');
                this.dispatchEvent(event);
            })
            .catch(error => {
                this._errorHandler(error);
            });
    }
}


customElements.define('cd-movie-search-bar', MovieSearchBar);