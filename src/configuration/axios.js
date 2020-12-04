import Axios from "axios";
import { baseURL } from "./conf";

export default Axios.create({
  baseURL,
});
