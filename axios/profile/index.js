import Axios from "../index";

import {
  getfaq,
  syaratketentuanhtml,
  mediakithtml,
  monthNames,
  monthNamesShort,
  tempdeadlineintervalinmiliseconds,
} from "../constants/index";
import privacyHTML from "../../components/profile/privacy";

import {
  PROFILE_FAQ_CHANGE,
  PROFILE_MEDIAKIT_CHANGE,
  PROFILE_PRIVACY_CHANGE,
  PROFILE_TNC_CHANGE,
  PROFILE_CLEAR_DATA,
  USER_REG_DATE_IN_MS_STATE_CHANGE,
} from "../../redux/constants";

export function clearProfileData() {
  return (dispatch) => {
    dispatch({ type: PROFILE_CLEAR_DATA });
  };
}

export function updateReduxRegDateInMs(data) {
  return (dispatch) => {
    console.log("updateReduxRegDateInMs", data);
    dispatch({ type: USER_REG_DATE_IN_MS_STATE_CHANGE, data });
  };
}

export function getRecruitmentDeadlineinMiliseconds(str) {
  try {
    let date = new Date(str);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime() + tempdeadlineintervalinmiliseconds;
  } catch (e) {
    console.error(e);
    return null;
  }
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

export function convertDateISOStringtoMiliseconds(str) {
  try {
    let date = new Date(str);
    return date.getTime();
  } catch (e) {
    console.error(e);
    return 0;
  }
}

export function convertDateMilisecondstoDisplayDate(ms, isShort) {
  try {
    let date = new Date(ms);
    return `${date.getDate().toString()} ${
      isShort ? monthNamesShort[date.getMonth()] : monthNames[date.getMonth()]
    } ${date.getFullYear().toString()}`;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function convertDateISOStringtoDisplayDate(str, isShort) {
  try {
    let date = new Date(str);
    return `${date.getDate().toString()} ${
      isShort ? monthNamesShort[date.getMonth()] : monthNames[date.getMonth()]
    } ${date.getFullYear().toString()}`;
  } catch (e) {
    console.error(e);
    return str;
  }
}

export function convertDateObjecttoDisplayLocaleDate(date) {
  try {
    return `${addZero(date.getFullYear())}-${addZero(
      date.getMonth() + 1
    )}-${addZero(date.getDate())}`;
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function addZero(n) {
  try {
    if (parseInt(n) < 10) {
      return `0${n.toString()}`;
    } else {
      return n.toString();
    }
  } catch (e) {
    console.error(e);
    return n.toString();
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
