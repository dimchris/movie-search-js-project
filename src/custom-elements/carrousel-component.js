export default class CarrouselComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [""];
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const style = `
        <style>
            :host{
                position: relative;
                height: 40%;
            }
            .prev,
        .next {
            z-index: 10;
            cursor: pointer;
            position: absolute;
            top: 50%;
            width: auto;
            margin-top: -22px;
            padding: 16px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            transition: 0.6s ease;
            border-radius: 0 3px 3px 0;
            user-select: none;
        }

        /* Position the "next button" to the right */
        .next {
            right: 0;
            border-radius: 3px 0 0 3px;
        }

        /* On hover, add a black background color with a little bit see-through */
        .prev:hover,
        .next:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        </style>
      `;
    this.shadowRoot.innerHTML =
      style +
      `
        <a class="prev">&#10094;</a>
        <slot></slot>
        <a class="next">&#10095;</a>
    `;

    const next = this.shadowRoot.querySelector(".next");
    const prev = this.shadowRoot.querySelector(".prev");

    // scroll by using the next & back button
    next.addEventListener("click", () => {
      const carrouseItems = this.querySelector(".carrousel-items");
      carrouseItems.scrollTo({
        left: carrouseItems.scrollLeft + 0.8 * carrouseItems.offsetWidth,
        behavior: "smooth",
      });
    });

    prev.addEventListener("click", () => {
      const carrouseItems = this.querySelector(".carrousel-items");
      carrouseItems.scrollTo({
        left: carrouseItems.scrollLeft - 0.8 * carrouseItems.offsetWidth,
        behavior: "smooth",
      });
    });

    // scroll results on wheel event
    this.shadowRoot.addEventListener("wheel", (event) => {
      const carrouseItems = this.querySelector(".carrousel-items");
      carrouseItems.scrollTo({
        left: carrouseItems.scrollLeft + 0.8 * event.deltaY,
      });
    });
  }
}
