import Axios from "axios";
import { mainhttp, testerusercode } from "./constants";
import { getObjectAsync, setObjectAsync } from "../components/asyncstorage";
import { ASYNC_SERVER_URL } from "../components/asyncstorage/constants";

const instance = Axios.create({
  baseURL: mainhttp,
});

instance.interceptors.request.use(
  async (config) => {
    let baseURL = await getObjectAsync(ASYNC_SERVER_URL);
    if (baseURL === undefined || baseURL === null || baseURL === "") {
      config.baseURL = mainhttp;
      await setObjectAsync(ASYNC_SERVER_URL, mainhttp);
      console.log("axios instance baseURL null", mainhttp);
    } else {
      config.baseURL = baseURL;
      //console.log("axios instance baseURL", baseURL);
    }
    return config;
  },
  (error) => {
    console.error(error);
  }
);

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

export default instance;
