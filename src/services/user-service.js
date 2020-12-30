import axios from "../configuration/axios";

export class UserService {
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
