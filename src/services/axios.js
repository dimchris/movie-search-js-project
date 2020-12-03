import Axios from "axios";

const baseURL = "http://localhost:3000/api/v1";

export default Axios.create({
  baseURL,
});
