import Tag from "../../model/tag";
import { TagList } from "../../model/tag-list";

export default class TagMockDS {
  constructor() {
    this._tags = new TagList([
      new Tag("action", "1"),
      new Tag("watch-later", "2"),
    ]);
  }

  async getAll() {
    return [...this._tags.tags];
  }

  async add(newTag) {
    const tag = this._tags.findTag(newTag._id);
    if (!tag) {
      newTag._id = this._getRndInteger(1, 100);
      this._tags.addTag(newTag);
    }
    return newTag;
  }

  async remove(tagId) {
    this._tags.removeTag(tagId);
  }

  _getRndInteger(min, max) {
    return "" + (Math.floor(Math.random() * (max - min)) + min);
  }
}
