export class MovieItem {
  constructor(imdbId, title, year, poster) {
    this.imdbId = imdbId;
    this.title = title;
    this.year = year;
    this.poster = poster;
    // this.directors = MovieItem.getArrayFromString(directors);
    // this.writers = MovieItem.getArrayFromString(writers);
  }

  render(el) {
    const zoom = `
            <div class="zoom">
                &#128269;
            </div>
        `;
    const style = `
        <style>
        .result-item-box {
            position: relative;
            display: inline-block;
            height: 100%;
        }

        .result-item-details {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            transition: 1s ease;
        }

        .result-item-details:hover {
            background-color: rgba(255, 255, 255, 0.37);
            backdrop-filter: blur(5px);
            transition: 1s ease;
        }

        .result-item-details > div {
            width: 100%;
            white-space: normal;
            text-align: center;
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0);
            transition: 1s ease;
        }

        .result-item-details:hover > div {
        color: white;
        text-shadow: 2px 2px 5px #000000;
        cursor: default;
        transition: 1s ease;
        }

        .result-item-image {
        display: inline-block;
        height: 100%;
        }

        :host {
        display: inline-block;
        height: 100%;
        margin-right: 10px;
        margin-left: 10px;
        }

        :host(.selected) .result-item-image {
            box-shadow: 0px 0px 20px 8px rgba(255, 255, 255, 0.55);
        }
        img {
            width: auto;
            height: 100%;
        }
        </style>
        `;
    el.innerHTML =
      style +
      `
        <div class = 'result-item-box'>
            <div class = 'result-item-image'>
                <image src=${
                  this.poster
                } onerror="this.src='assets/imgs/imagenotfound.jpg';">
                <div class='result-item-details'>
                    <div>${this.title}</div>
                    <div>${this.year}</div>
                    ${this.poster && this.poster != "N/A" ? zoom : ""}
                </div>
            </div>
        </div>
        `;
    if (this.poster && this.poster != "N/A") {
      el.querySelector(".zoom").addEventListener("click", () => {
        const zoomArea = document.querySelector("#zoom-area");
        zoomArea.style.display = "flex";
        zoomArea.querySelector("img").setAttribute("src", this.poster);
      });
    }
  }
}
