import axios from "../axios";

export default class userDS {
  async login(username, password) {
    return axios.post("/users/login", {
      email: username,
      password,
    });
  }
  async register(username, password) {
    return axios.post("/users/register", {
      email: username,
      password,
    });
  }
}
