class MovieItem{
    constructor(imdbId, title, year, poster){
        this.imdbId = imdbId;
        this.title = title;
        this.year = year;
        this.poster = poster;
    };

    render(el){
        el.innerHTML = `
        <div class = 'result-item-box'>
            <div class = 'result-item-image'>
                <image src=${this.poster} onerror="this.src='assets/imgs/imagenotfound.jpg';">
                <div class='result-item-details'>
                    <div>${this.title}</div>
                    <div>${this.year}</div>
                </div>
            </div>
        </div>
    `;
    }
}