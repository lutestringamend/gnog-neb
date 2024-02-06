import Axios from "axios";
import { mainhttp } from "../../axios/constants";

const instance = Axios.create({
  baseURL: mainhttp,
});




export default instance;
