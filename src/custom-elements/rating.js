// Movie details component 
export default class Rating extends HTMLElement {
  constructor() {
    super();
    this._score = this.getAttribute('score') || 0;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = '';
    const rating = document.createElement('div');
    rating.classList.add('rating');
    // calc the number of colored stars
    const stars = Math.round(5 * (this._score / 10)) || 0; // if there is no score then no stars
    // add stars
    for (let i = 1; i <= stars; i++) {
      const star = document.createElement('span');
      star.innerHTML = '\u2605';
      rating.appendChild(star);
    }

    // add empty stars
    const emptyStars = 5 - stars;
    for (let i = 1; i <= emptyStars; i++) {
      const star = document.createElement('span');
      star.innerHTML = '☆';
      rating.appendChild(star);
    }
    this.appendChild(rating);
  }

  static get observedAttributes() {
    return ['score'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) {
      return;
    }
    switch (name) {
      case 'score':
        this._score = newValue || 0;
        this.render();
        break;
      default:
    }
  }
}