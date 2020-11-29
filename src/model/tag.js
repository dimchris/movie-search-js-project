import _ from "lodash/core";
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

  get id() {
    return this._id;
  }

  set name(name) {
    this._name = _.escape(name);
  }

  get name() {
    return this._name;
  }
}
