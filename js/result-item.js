class MovieResultItem extends HTMLElement{

    constructor(){
        super();
        this._title = this.getAttribute('title');
        this._year = this.getAttribute('year');
        this._imdbId = this.getAttribute('imdbId');
        this._poster = this.getAttribute('poster');
        this.addEventListener('click', (e) => {
            document.querySelectorAll('cd-movie-result-item').forEach(item => {
                item.classList.remove('selected');
            })
            this.classList.add('selected');
            const event = new Event('result-clicked', {bubbles: true});
            this.dispatchEvent(event);
        })
    }

    connectedCallback(){
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'year', 'imdbId', 'poster'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case 'title':
                this._title = newValue;
                break;
            case 'year':
                this._year = newValue;
                break;
            case 'imdbId':
                this._imdbId = newValue;
                break;
            case 'poster':
                this._poster = newValue;
                break;
            default:
        }
        this.render();
    }

    render(){
        this.innerHTML = `
        <div class = 'result-item-box'>
            <div class = 'result-item-image'>
                <image src=${this._poster} onerror="this.src='assets/imgs/imagenotfound.jpg';">
            </div>
        </div>
    `;
    }

}

customElements.define('cd-movie-result-item', MovieResultItem);