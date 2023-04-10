import Axios from "../index";

import { contentslider, contentbannertiga } from "../constants";

import {
  HOME_SLIDER_STATE_CHANGE,
  HOME_BANNER_STATE_CHANGE,
  HOME_CLEAR_DATA,
} from "../../redux/constants";

export function clearHomeData() {
  return (dispatch) => {
    console.log("clearHomeData");
    dispatch({ type: HOME_CLEAR_DATA });
  };
}

export function getSliderContent() {
  return (dispatch) => {
    Axios.get(contentslider)
      .then((response) => {
        //console.log(config);
        const data = response.data.data;
        dispatch({ type: HOME_SLIDER_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getBannerTiga() {
  return (dispatch) => {
    Axios.get(contentbannertiga)
      .then((response) => {
        //console.log(config);
        const data = response.data.data;
        dispatch({ type: HOME_BANNER_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}