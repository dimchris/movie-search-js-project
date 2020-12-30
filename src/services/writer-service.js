import axios from "../configuration/axios";

export default class WriterService {
  async add(name) {
    return axios.post("/writers", { name });
  }
  async getByName(name) {
    return axios.get(`/writers?name=${name}&exact=true`);
  }
  async get(id) {
    return axios.get(`/writers/${id}`);
  }
}
