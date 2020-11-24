export class TagList {
  constructor(tags) {
    this._tags = tags || [];
  }

  addTag(tag) {
    this.tags.push(tag);
  }

  addTags(tags) {
    tags.forEach((tag) => {
      this.addTag(tag);
    });
  }

  removeTag(tagId) {
    this.tags = this.tags.filter((tag) => tag._id !== tagId);
  }

  set tags(tags) {
    this._tags = tags;
  }

  get tags() {
    return this._tags;
  }

  findTag(tagId) {
    return this._tags.find((tag) => tag._id === tagId);
  }
}
