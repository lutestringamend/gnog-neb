import Axios from "../index";

import { getfaq, syaratketentuanhtml, mediakithtml } from "../constants/index";
import privacyHTML from "../../components/profile/privacy";

import {
  PROFILE_FAQ_CHANGE,
  PROFILE_MEDIAKIT_CHANGE,
  PROFILE_PRIVACY_CHANGE,
  PROFILE_TNC_CHANGE,
  PROFILE_CLEAR_DATA,
} from "../../redux/constants";

export function clearProfileData() {
  return (dispatch) => {
    dispatch({ type: PROFILE_CLEAR_DATA });
  };
}

export function convertDisplayLocaleDatetoDateObject(dateString) {
  try {
    const items = dateString.split("-");
    return new Date(
      parseInt(items[0]),
      parseInt(items[1]) - 1,
      parseInt(items[2])
    );
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function convertDateObjecttoDisplayLocaleDate(date) {
  try {
    return `${date.getFullYear().toString()}-${(
      date.getMonth() + 1
    ).toString()}-${date.getDate().toString()}`;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function getPrivacyPolicy() {
  return (dispatch) => {
    console.log("getPrivacyPolicy");
    dispatch({ type: PROFILE_PRIVACY_CHANGE, data: privacyHTML });
  };
}

export function getFAQ() {
  return (dispatch) => {
    Axios.get(getfaq)
      .then((response) => {
        //console.log(response.data);
        dispatch({
          type: PROFILE_FAQ_CHANGE,
          data: response.data.data,
        });
      })
      .catch((error) => {
        console.log("getFAQ error");
        console.log(error);
      });
  };
}

export function getMediaKitHTML() {
  return (dispatch) => {
    Axios.get(mediakithtml)
      .then((response) => {
        console.log("getMediaKitHTML");
        dispatch({
          type: PROFILE_MEDIAKIT_CHANGE,
          data: response.data,
        });
      })
      .catch((error) => {
        console.log("mediakithtml error");
        console.log(error);
      });
  };
}

export function getTncHTML() {
  return (dispatch) => {
    Axios.get(syaratketentuanhtml)
      .then((response) => {
        console.log("getTncHTML");
        dispatch({
          type: PROFILE_TNC_CHANGE,
          data: response.data,
        });
      })
      .catch((error) => {
        console.log("syaratketentuanhtml error");
        console.log(error);
      });
  };
}
