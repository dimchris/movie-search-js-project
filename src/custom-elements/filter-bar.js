import { filter } from "lodash";
import alerts from "../utilities/alerts";

export default class FilterBarComponent extends HTMLElement {
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
                width: 100%;
                margin: 15px auto;
                display:none;
            }
            .filter-category{
                color: white;
                margin: 0 5px;
                border-style: solid;
                border-color: white;
                border-radius: 15px;
                border-width: 1px;
                cursor: default;
                padding: 5px;
            }
            .filter-categories{
                margin: 15px auto;
                width: fit-content;
                
            }
            #filters{
                margin: auto;
                padding: 10px 0px;
                width: 100%;
                background-color: rgba(255, 255, 255, 0.055);
            }

            input[type=button]{
                display: block;
                margin: auto;
                color: grey;
                background-color: transparent;
                border-style: none;
                text-align: center;
                font-size: 1.5rem;
                width: 80%;
                outline: none;
            }
            input[type=button]:hover{
                color: rgba(255, 217, 0, 0.788);
            }

        </style>
      `;
    this.shadowRoot.innerHTML =
      style +
      `
            <div class="filter-categories">
                <span class="filter-category" id="title">+title</span>
                <span class="filter-category" id="actors">+actors</span>
                <span class="filter-category" id="directors">+directors</span>
            </div>
            <div id="filters"></div>
            <input type="button" value="Search">
      `;
    const filtersEl = this.shadowRoot.querySelector("#filters");
    this._shadowRoot.addEventListener("click", (event) => {
      const id = event.target.id;
      const filter = document.createElement("cd-filter-bar-item");
      switch (id) {
        case "title":
          if (!this._hasTitle) {
            this._hasTitle = true;
            filter.setAttribute("name", "title");
            filter.setAttribute("code", "title");
            filter.setAttribute("enabled", "true");
            filtersEl.appendChild(filter);
          }
          break;
        case "actors":
          this._total_actors = this._total_actors ? this._total_actors + 1 : 1;
          filter.setAttribute("name", "actors");
          filter.setAttribute("code", "actors" + this._total_actors);
          filter.setAttribute("enabled", "true");
          filtersEl.appendChild(filter);
          break;
        case "directors":
          this._total_directors = this._total_directors
            ? this._total_directors + 1
            : 1;
          filter.setAttribute("name", "directors");
          filter.setAttribute("code", "directors" + this._total_directors);
          filter.setAttribute("enabled", "true");
          filtersEl.appendChild(filter);
          break;
      }
    });

    this.shadowRoot.addEventListener("filter-deleted", (e) => {
      const code = e.detail;
      const itemToRemove = [
        ...this.shadowRoot.querySelectorAll("cd-filter-bar-item"),
      ].filter((item) => {
        return item._code === code;
      });
      if (itemToRemove) {
        itemToRemove.forEach((item) => item.remove());
      }
      if (code === "title") {
        this._hasTitle = false;
      }
    });

    this.shadowRoot
      .querySelector("input[type=button]")
      .addEventListener("click", () => {
        const filters = this.filters;
        if (Object.keys(filters).length) {
          const event = new CustomEvent("bookmark-filters-updated", {
            bubbles: true,
            composed: true,
            detail: filters,
          });
          this.dispatchEvent(event);
        } else {
          alerts.warning(
            "Filter Error",
            "Filters are empty. Please refine your criteria and try again."
          );
        }
      });
  }

  get filters() {
    // this will give a map with key as the filter code and value a cs string
    return [...this.shadowRoot.querySelectorAll("cd-filter-bar-item")].reduce(
      (total, item) => {
        return item.value.value
          ? {
              ...total,
              [item.value.name]: total[item.value.name]
                ? [total[item.value.name], item.value.value].join(",")
                : item.value.value,
            }
          : total;
      },
      {}
    );
  }
}
