import Axios from "../index";

import { mediakitphoto } from "../constants";
import {
  MEDIA_KIT_CLEAR_DATA,
  MEDIA_KIT_PHOTOS_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_URI_STATE_CHANGE,
} from "../../redux/constants";
import { sentryLog } from "../../sentry";

export function clearMediaKitData() {
  return (dispatch) => {
    console.log("clearMediaKitData");
    dispatch({ type: MEDIA_KIT_CLEAR_DATA });
  };
}

export function clearMediaKitPhotosError() {
  return (dispatch) => {
    console.log("clearMediaKitPhotosError");
    dispatch({ type: MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE, data: null });
  };
}

export function updateReduxMediaKitPhotosUri(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotosUri", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_URI_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitPhotos(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotos", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_STATE_CHANGE, data });
  };
}

export function getMediaKitPhotos() {
  return (dispatch) => {
    Axios.get(mediakitphoto)
      .then((response) => {
        //console.log(config);
        try {
          const responseData = response.data?.data;
          let data = {};
          let othersArray = [];
          for (let photo of responseData) {
            if (
              photo?.kategori === undefined ||
              photo?.kategori?.length === undefined ||
              photo?.kategori?.length === undefined ||
              photo?.kategori?.length < 1 ||
              photo?.kategori[0] === undefined ||
              photo?.kategori[0]?.nama === undefined
            ) {
              othersArray.push(photo);
            } else {
              let category = photo?.kategori[0]?.nama;
              let theArray = data[category] ? data[category] : [];
              theArray.push(photo);
              data[category] = theArray;
            }
          }
          //data["Lain-lain"] = othersArray;
          console.log("getMediaKitPhotos", data);
          dispatch({ type: MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE, data: null });
          dispatch({ type: MEDIA_KIT_PHOTOS_STATE_CHANGE, data });
        } catch (e) {
          sentryLog(e);
          dispatch({
            type: MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE,
            data: e.toString(),
          });
          dispatch({ type: MEDIA_KIT_PHOTOS_STATE_CHANGE, data: [] });
        }
      })
      .catch((error) => {
        sentryLog(error);
        dispatch({
          type: MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE,
          data: error.toString(),
        });
      });
  };
}
