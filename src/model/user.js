export class User {
  constructor(username, token, id = null) {
    this._id = id;
    this._username = username;
    this._token = token;
  }

  get token() {
    return this._token;
  }

  set token(token) {
    this._token = token;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
