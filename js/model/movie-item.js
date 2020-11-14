class MovieItem{
    constructor(imdbId, title, year, poster){
        this.imdbId = imdbId;
        this.title = title;
        this.year = year;
        this.poster = poster;
    };

    render(el){
        const zoom = `
            <div class="zoom">
                &#128269;
            </div>
        `;
        el.innerHTML = `
        <div class = 'result-item-box'>
            <div class = 'result-item-image'>
                <image src=${this.poster} onerror="this.src='assets/imgs/imagenotfound.jpg';">
                <div class='result-item-details'>
                    <div>${this.title}</div>
                    <div>${this.year}</div>
                    ${
                        this.poster && this.poster != 'N/A' ? zoom : ''
                    }
                </div>
            </div>
        </div>
    `;
    if(this.poster && this.poster != 'N/A'){
        el.querySelector('.zoom').addEventListener('click', (event) => {
            const zoomArea = document.querySelector('#zoom-area');
            zoomArea.style.display = 'flex';
            zoomArea.querySelector('img').setAttribute('src', this.poster);
        })
    }
    }
}