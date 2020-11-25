import { User } from "../model/user";

export class UserMockService {
  constructor() {
    this._users = [];
  }
  login(username, password) {
    return new Promise((resolve, reject) => {
      const user = this.findUser(username, password);
      if (user.length > 0) {
        resolve(user);
      } else {
        reject("could not find user");
      }
    });
  }

  register(username, password) {
    return new Promise((resolve, reject) => {
      if (password.length < 8) {
        reject("Password should consist more than 8 characters");
      } else if (this.findUserByUsername(username).length) {
        reject(
          "This username already exists. Please choose a new one and try again."
        );
      } else {
        const user = new User(
          username,
          null,
          this._getRndInteger(1, 100),
          password
        );
        this._users.push(user);
        resolve(user);
      }
    });
  }

  _getRndInteger(min, max) {
    return "" + (Math.floor(Math.random() * (max - min)) + min);
  }

  findUser(username, password) {
    return this._users.filter((user) => {
      return user._username == username && user._password == password;
    });
  }

  findUserByUsername(username) {
    return this._users.filter((user) => {
      return user._username == username;
    });
  }
}
