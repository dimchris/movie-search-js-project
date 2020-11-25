export class User {
  constructor(username, token, id = null, password = null) {
    this._id = id;
    this._username = username;
    this._token = token;
    this._password = password;
  }

  get token() {
    return this._token;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
