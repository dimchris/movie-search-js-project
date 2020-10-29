// Result item component
class MovieResultItem extends HTMLElement{

    constructor(){
        super();
        this._title = this.getAttribute('title');
        this._year = this.getAttribute('year');
        this._imdbId = this.getAttribute('imdbId');
        this._poster = this.getAttribute('poster');
        
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
                <div class='result-item-details'>
                    <div>${this._title}</div>
                    <div>${this._year}</div>
                </div>
            </div>
        </div>
    `;
    }

}

customElements.define('cd-movie-result-item', MovieResultItem);