export default class Tag {
  constructor(name, id) {
    this.name = name;
    this._id = id;
  }

  render(el) {
    const tag = document.createElement("cd-tag");
    tag.setAttribute("name", this.name);
    tag.setAttribute("id", this.id);
    el.append(tag);
  }
}
