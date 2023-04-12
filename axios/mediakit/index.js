import Axios from "../index";

import { mediakitphoto } from "../constants";

import {
  MEDIA_KIT_CLEAR_DATA,
  MEDIA_KIT_PHOTOS_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_STATE_CHANGE,
  MEDIA_KIT_FONTS_STATE_CHANGE,
  MEDIA_KIT_COLORS_STATE_CHANGE,
  MEDIA_KIT_SIZES_STATE_CHANGE,
} from "../../redux/constants";

export function clearMediaKitData() {
  return (dispatch) => {
    console.log("clearMediaKitData");
    dispatch({ type: MEDIA_KIT_CLEAR_DATA });
  };
}

export function getMediaKitPhotos() {
  return (dispatch) => {

    Axios.get(mediakitphoto)
      .then((response) => {
        console.log("getMediaKitPhotos");
        //console.log(config);
        const data = response.data?.data;
        dispatch({ type: MEDIA_KIT_PHOTOS_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}



