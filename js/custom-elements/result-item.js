// Result item component
class MovieResultItem extends HTMLElement{

    constructor(){
        super();
        const title = this.getAttribute('title');
        const year = this.getAttribute('year');
        const imdbId = this.getAttribute('imdbId');
        const poster = this.getAttribute('poster');
        this._movieItem = new MovieItem(imdbId, title, year, poster);
        
        // on click update the item details
        this.addEventListener('click', (e) => {
            // remove select class from all items
            document.querySelectorAll('cd-movie-result-item').forEach(item => {
                item.classList.remove('selected');
            })
            
            // add select class to the selected item
            this.classList.add('selected');
            
            //  emit clicked event
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
        if(oldValue == newValue){
            return;
        }
        switch(name){
            case 'title':
                this._movieItem.title = newValue;
                break;
            case 'year':
                this._movieItem.year = newValue;
                break;
            case 'imdbId':
                this._movieItem.imdbId = newValue;
                break;
            case 'poster':
                this._movieItem.poster = newValue;
                break;
            default:
        }
        this.render();
    }

    render(){
        this._movieItem.render(this);
    }

}

customElements.define('cd-movie-result-item', MovieResultItem);