import alerts from '../../utilities/alerts';

export default class TagsComponent extends HTMLElement {
  constructor() {
    super();
    this._tags =
      this.getAttribute('tags') && this.getAttribute('tags').length > 0
        ? this.getAttribute('tags').split(',')
        : [];
    this._delete = this.getAttribute('delete') == 'true' ? true : false;
    this._add = this.getAttribute('add') == 'true' ? true : false;
    this._select = this.getAttribute('select') == 'true' ? true : false;
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['tags', 'delete', 'add', 'select'];
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const style = `
      <style>
      :host{
        display: block;
        font-size: 1rem !important;
        font-weight: normal !important;
        cursor: default;
      }
      span.tag{
        background-color: dimgrey;
        border-radius: 5px;
        padding: 2px 5px;
        margin: 0px 2px;
        transition: background-color 500ms ease;
      }
      .delete:hover{
        color: red;
        transition: color 1s ease;
      }
      .add{
        font-size: 1rem;
      }
      .add:hover{
        color: green;
        transition: color 1s ease;
      }
      span.tag.selected{
        background-color: forestgreen
      }
      span.tag.select:hover{
        background-color: forestgreen  
      }
      </style>
      `;
    this.shadowRoot.innerHTML =
      style +
      `
        <span class="tags">
        ${this._tags.reduce((total, item) => {
          return (total += `<span class="tag${
            this._select ? ' select' : ''
          }" id="tag-${item}">#${item} ${
            this._delete
              ? `<span class="delete" title="remove tag">&times;</span>`
              : ''
          }</span>`);
        }, '')}
        </span>
        ${
          this._add
            ? `
        <span class="add" title="add new tag">+</span>
        `
            : ''
        }
      `;

    if (this._add) {
      this.shadowRoot
        .querySelector('span.add')
        .addEventListener('click', () => {
          alerts.input(
            'Add a new tag',
            'Input the name of the tag.',
            this.addTag.bind(this)
          );
        });
    }
    this.shadowRoot
      .querySelector('.tags')
      .addEventListener('click', (event) => {
        if (event.target.classList.contains('delete')) {
          const name = event.target.parentNode.id.split('tag-')[1];
          this.removeTag(name);
        } else {
          if (this._selectHandler) {
            this._selectHandler(event.target, this._tags);
          }
        }
      });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }
    switch (name) {
      case 'tags':
        this._tags = newVal && newVal.length > 0 ? newVal.split(',') : [];
        break;
      case 'delete':
        this._delete = newVal == 'true' ? true : false;
        break;
      case 'add':
        this.add = newVal == 'true' ? true : false;
        break;
      case 'select':
        this.add = newVal == 'true' ? true : false;
        break;
    }

    this._render();
  }

  addTag(tag) {
    const newTags = [...this._tags, tag];
    if (!this._updateHandler) {
      this._render();
      return;
    }
    this._updateHandler(newTags, this).then(() => {
      this._tags = newTags;
      this._render();
    });
  }

  removeTag(tag) {
    const newTags = this._tags.filter((item) => tag !== item);
    if (!this._updateHandler) {
      this._render();
      return;
    }
    this._updateHandler(newTags, this).then(() => {
      this._tags = newTags;
      this._render();
    });
  }

  set updateHandler(updateHandler) {
    this._updateHandler = updateHandler;
  }

  set selectHandler(selectHandler) {
    this._selectHandler = selectHandler;
  }
}
