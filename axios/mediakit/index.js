import Axios from "../index";

import { mediakitphoto, mediakitvideo } from "../constants";
import {
  MEDIA_KIT_CLEAR_DATA,
  MEDIA_KIT_PHOTOS_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_URI_STATE_CHANGE,
  MEDIA_KIT_WATERMARK_DATA_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE,
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

export function clearMediaKitVideosError() {
  return (dispatch) => {
    console.log("clearMediaKitVideosError");
    dispatch({ type: MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE, data: null });
  };
}

export function updateReduxMediaKitWatermarkData(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitWatermarkData", data);
    dispatch({ type: MEDIA_KIT_WATERMARK_DATA_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitPhotosUri(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotosUri", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_URI_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitVideosUri(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitVideosUri", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_URI_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitPhotos(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotos", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitVideos(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitVideos", data);
    dispatch({ type: MEDIA_KIT_VIDEOS_STATE_CHANGE, data });
  };
}

export const getVideoProductData = (item, products) => {
  if (
    products === undefined ||
    products === null ||
    products?.length === undefined ||
    products?.length < 1 ||
    item?.produk === undefined ||
    item?.produk === null
  ) {
    return item;
  }

  try {
    if (typeof item?.produk === "string") {
      const data = products.find(({ slug }) => slug === item?.produk);
      if (data === undefined) {
        return item;
      }
      let nama = item?.nama;
      if (nama.includes("/") || nama.toLowerCase().includes("mp4")) {
        nama = data?.nama ? data?.nama : nama;
      }
      return {
        ...item,
        nama,
        produk_id: data?.id,
        produk: data?.slug,
        foto: data?.foto,
      };
    } else if (
      item?.produk?.id === undefined ||
      item?.produk?.slug === undefined ||
      item?.produk?.foto === undefined
    ) {
      return item;
    } else {
      let nama = item?.nama;
      if (nama.includes("/") || nama.toLowerCase().includes("mp4")) {
        nama = item?.produk?.nama ? item?.produk?.nama : nama;
      }
      return {
        ...item,
        nama,
        produk_id: item?.produk?.id,
        produk: item?.produk?.slug,
        foto: item?.produk?.foto,
      };
    }
  } catch (e) {
    console.error(e);
    return item;
  }
};

export function getMediaKitVideos(token, products) {
  if (token === undefined || token === null) {
    return;
  }
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    Axios.get(mediakitvideo, config)
      .then((response) => {
        try {
          const data = response?.data?.data;
          console.log("getMediaKitVideos", data);
          let newData = [];
          for (let i = 0; i < data?.length; i++) {
            if (
              data[i]?.video === undefined &&
              data[i]?.videoWatermarks !== undefined
            ) {
              for (let j = 0; j < data[i]?.videoWatermarks.length; j++) {
                let videoItem = getVideoProductData(
                  data[i]?.videoWatermarks[j],
                  products
                );
                newData.unshift(videoItem);
              }
            } else {
              let videoItem = getVideoProductData(data[i], products);
              newData.unshift(videoItem);
            }
          }
          console.log("video watermark after product process", newData);
          dispatch({ type: MEDIA_KIT_VIDEOS_STATE_CHANGE, data: newData });
        } catch (e) {
          sentryLog(e);
          dispatch({
            type: MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE,
            data: e.toString(),
          });
        }
      })
      .catch((error) => {
        sentryLog(error);
        dispatch({
          type: MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE,
          data: error.toString(),
        });
      });
  };

  /* ;*/
}

export function getMediaKitPhotos(token) {
  if (token === undefined || token === null) {
    return;
  }
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    Axios.get(mediakitphoto, config)
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
