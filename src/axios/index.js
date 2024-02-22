import Axios from "axios";
import { mainhttp } from "../../axios/constants";

const instance = Axios.create({
  baseURL: mainhttp,
});

export const isUserDevServer = (name) => {
  if (name === undefined || name === null || name === "") {
    return false;
  }
  try {
    if (name.includes(testerusercode)) {
      return true;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const checkNumberEmpty = (e) => {
  if (e === undefined || e === null) {
    return 0;
  }
  try {
    if (isNaN(e)) {
      return parseInt(e);
    } else {
      return e;
    }
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const addZeroToArray = (e) => {
  if (!(e === undefined || e === null)) {
    try {
      if (parseInt(e) < 10) {
        return["0", e.toString()];
      } else {
        let n = Math.floor(e % 10);
        return [Math.floor(e / 10).toString(), n.toString()];
      }
    } catch (e) {
      console.error(e);
  
    }
  }
  return ["0", "0"];
} 


export default instance;
