import axios from "../configuration/axios";

export default class DirectorService {
  async add(name) {
    return axios.post("/directors", { name: name });
  }
  async getByName(name) {
    return axios.get(`/directors?name=${name}&exact=true`);
  }
  async get(id) {
    return axios.get(`/directors/${id}`);
  }
}
