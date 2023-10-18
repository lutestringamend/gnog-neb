import Axios from "../index";

import { mediakitphoto, mediakitvideo, tokoonlineurlshort } from "../constants";
import {
  MEDIA_KIT_CLEAR_DATA,
  MEDIA_KIT_PHOTOS_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_URI_STATE_CHANGE,
  MEDIA_KIT_WATERMARK_DATA_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE,
  MEDIA_KIT_FLYER_MENGAJAK_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_MULTIPLE_SAVE_STATE_CHANGE,
  MEDIA_KIT_FLYER_PRODUK_SELECTED_STATE_CHANGE,
} from "../../redux/constants";
import { sentryLog } from "../../sentry";
import { DefaultSelected, STARTER_KIT_FLYER_PRODUK_TAG, STARTER_KIT_VIDEO_MENGAJAK_TAG } from "../../components/mediakit/constants";

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

export function updateReduxMediaKitPhotosError(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotosError", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitPhotosMultipleSave(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotosMultipleSave", data);
    dispatch({ type: MEDIA_KIT_PHOTOS_MULTIPLE_SAVE_STATE_CHANGE, data: data ? data : {
      success: false,
      error: null,
    } });
  };
}

export function updateReduxMediaKitWatermarkData(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitWatermarkData");
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
    /*let flyerProduk = [];
    let flyerMengajak = [];
    if (!(data === undefined || data === null || data?.length === undefined || data?.length < 1)) {
      for (let p of data) {
        if (p?.jenis_foto === STARTER_KIT_FLYER_PRODUK_TAG) {
          flyerProduk.push(p);
        } else {
          flyerMengajak.push(p);
        }
      }
    }
    
    console.log("updateReduxMediaKitFlyerMengajak", flyerMengajak);
    dispatch({ type: MEDIA_KIT_FLYER_MENGAJAK_STATE_CHANGE, data: flyerMengajak });*/
  };
}

export function updateReduxMediaKitFlyerMengajak(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitFlyerMengajak", data);
    dispatch({ type: MEDIA_KIT_FLYER_MENGAJAK_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitVideos(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitVideos", data);
    dispatch({ type: MEDIA_KIT_VIDEOS_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitVideosMengajak(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitVideosMengajak", data);
    dispatch({ type: MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE, data });
  };
}

export const filterPhotoProps = (item) => {
  return {
    id: item?.id,
    foto: item?.foto,
    width: item?.width,
    height: item?.height,
    text_y: item?.text_y,
    link_y: item?.link_y,
  }
}

export function setWatermarkDatafromCurrentUser(currentUser, isOriginal) {
  let name = currentUser?.name ? currentUser?.name : "";
  let phone = currentUser?.nomor_telp ? currentUser?.nomor_telp : "";
  let url = currentUser?.name
    ? `${tokoonlineurlshort}${currentUser?.name}`
    : "";
  
  if (!(currentUser?.detail_user === undefined || currentUser?.detail_user === null || isOriginal)) {
    name = currentUser?.detail_user?.wm_nama ? currentUser?.detail_user?.wm_nama : currentUser?.detail_user?.nama_depan ? currentUser?.detail_user?.nama_depan : name;
    phone = currentUser?.detail_user?.wm_nomor_telepon ? currentUser?.detail_user?.wm_nomor_telepon : phone;
  }

  return {
    name,
    phone,
    url
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
        product_name: data?.nama,
        produk_id: data?.id,
        produk: data?.slug,
        foto: data?.thumbnail ? data?.thumbnail : data?.foto ? data?.foto : null,
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
        product_name: item?.produk?.nama,
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
          console.log("getMediaKitVideos response", data);
          if (data === null || data?.length === undefined || data?.length < 1) {
            dispatch({ type: MEDIA_KIT_VIDEOS_STATE_CHANGE, data: [] });
            dispatch({ type: MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE, data: [] });
            return;
          }
          let newData = [];
          let newMengajakData = [];
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
                if (data[i]?.jenis_video === STARTER_KIT_VIDEO_MENGAJAK_TAG) {
                  newMengajakData.unshift(videoItem);
                } else {
                  newData.unshift(videoItem);
                }
              }
            } else {
              let videoItem = getVideoProductData(data[i], products);
              if (data[i]?.jenis_video === STARTER_KIT_VIDEO_MENGAJAK_TAG) {
                newMengajakData.unshift(videoItem);
              } else {
                newData.unshift(videoItem);
              }
            }
          }
          console.log("post video produk - mengajak", newData, newMengajakData);
          dispatch({ type: MEDIA_KIT_VIDEOS_STATE_CHANGE, data: newData });
          dispatch({ type: MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE, data: newMengajakData });
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

export const getMediaKitPhotos = async (token) => {
  if (token === undefined || token === null) {
    return {
      result: null,
      error: "Anda perlu login sebelum bisa melihat foto promosi",
    };
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

    try {
      const response = await Axios.get(mediakitphoto, config)
      .catch((error) => {
        console.error(error);
        sentryLog(error);
        return {
          result: null,
          error: error.toString(),
        }
      });

      const responseData = response.data?.data;
      //console.log("getMediaKitPhotos response", responseData);
      if (responseData === undefined || responseData === null || responseData?.length === undefined || responseData?.length < 1) {
        return {
        result: {},
        error: null,
      }
      } else {
        let data = {};
        let mengajakArray = [];
        let othersArray = [];
        for (let photo of responseData) {
          if (photo?.jenis_foto !== STARTER_KIT_FLYER_PRODUK_TAG) {
            mengajakArray.unshift(photo);
          } else if (
            photo?.kategori === undefined ||
            photo?.kategori?.length === undefined ||
            photo?.kategori?.length === undefined ||
            photo?.kategori?.length < 1 ||
            photo?.kategori[0] === undefined ||
            photo?.kategori[0]?.nama === undefined
          ) {
            othersArray.unshift(photo);
          } else {
            let category = photo?.kategori[0]?.nama;
            let theArray = data[category] ? data[category] : [];
            theArray.unshift(photo);
            data[category] = theArray;
          }
        } 
        return {
          result: data,
          mengajakArray,
          error: null,
        }
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      return {
        result: null,
        error: e.toString(),
      }
    }
}
