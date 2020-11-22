export class User {
    constructor(username, token) {
        this._username = username;
        this._token = token;
    }

    get token() {
        return this._token;
    }
}