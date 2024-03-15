import Axios from "../index";

import {
  mediakitkategori,
  mediakitkategorithumbnail,
  mediakitphoto,
  mediakitvideo,
  tokoonlineurlshort,
  tutorialvideo,
} from "../constants";
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
  MEDIA_KIT_TUTORIALS_STATE_CHANGE,
  MEDIA_KIT_FLYER_SELECTION_STATE_CHANGE,
} from "../../redux/constants";
import { sentryLog } from "../../sentry";
import {
  DefaultSelected,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_FLYER_PRODUK_TAG,
  STARTER_KIT_VIDEO_MENGAJAK_TAG,
  STARTER_KIT_VIDEO_PRODUK_TAG,
} from "../../constants/starterkit";
import {
  STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE,
  STARTER_KIT_VIDEO_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_VIDEO_PRODUK_CASE_SENSITIVE,
} from "../constants/starterkit";
import { processStarterKitHome } from "../../utils/starterkit";

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

export function updateReduxMediaKitFlyerSelection(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitFlyerSelection", data);
    dispatch({ type: MEDIA_KIT_FLYER_SELECTION_STATE_CHANGE, data });
  };
}

export function updateReduxMediaKitPhotosMultipleSave(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitPhotosMultipleSave", data);
    dispatch({
      type: MEDIA_KIT_PHOTOS_MULTIPLE_SAVE_STATE_CHANGE,
      data: data
        ? data
        : {
            success: false,
            error: null,
          },
    });
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
    console.log("updateReduxMediaKitFlyerMengajak", data?.length);
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

export function updateReduxMediaKitVideosTutorial(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitVideosTutorial", data);
    dispatch({ type: MEDIA_KIT_TUTORIALS_STATE_CHANGE, data });
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
  };
};

export function setWatermarkDatafromCurrentUser(currentUser, isOriginal) {
  let name = currentUser?.name ? currentUser?.name : "";
  let phone = currentUser?.nomor_telp ? currentUser?.nomor_telp : "";
  let url = currentUser?.name
    ? `${tokoonlineurlshort}${currentUser?.name}`
    : "";

  if (
    !(
      currentUser?.detail_user === undefined ||
      currentUser?.detail_user === null ||
      isOriginal
    )
  ) {
    name = currentUser?.detail_user?.wm_nama
      ? currentUser?.detail_user?.wm_nama
      : currentUser?.detail_user?.nama_depan
        ? currentUser?.detail_user?.nama_depan
        : name;
    phone = currentUser?.detail_user?.wm_nomor_telepon
      ? currentUser?.detail_user?.wm_nomor_telepon
      : phone;
  }

  return {
    name,
    phone,
    url,
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
    return checkVideoFileName(item);
  }

  try {
    if (typeof item?.produk === "string") {
      const data = products.find(({ slug }) => slug === item?.produk);
      if (data === undefined) {
        return checkVideoFileName(item);
      }
      let nama = item?.nama;
      if (nama.includes("/") || nama.toLowerCase().includes("mp4")) {
        nama = data?.nama ? data?.nama : nama;
      }
      return {
        ...checkVideoFileName(item),
        nama,
        product_name: data?.nama,
        produk_id: data?.id,
        produk: data?.slug,
        foto: data?.thumbnail
          ? data?.thumbnail
          : data?.foto
            ? data?.foto
            : null,
      };
    } else if (
      item?.produk?.id === undefined ||
      item?.produk?.slug === undefined ||
      item?.produk?.foto === undefined
    ) {
      return checkVideoFileName(item);
    } else {
      let nama = item?.nama;
      if (nama.includes("/") || nama.toLowerCase().includes("mp4")) {
        nama = item?.produk?.nama ? item?.produk?.nama : nama;
      }
      return {
        ...checkVideoFileName(item),
        nama,
        product_name: item?.produk?.nama,
        produk_id: item?.produk?.id,
        produk: item?.produk?.slug,
        foto: item?.produk?.foto,
      };
    }
  } catch (e) {
    console.error(e);
    return checkVideoFileName(item);
  }
};

export function checkVideoFileName(item) {
  try {
    if (item?.video.includes(" ")) {
      let video = item?.video.replaceAll(" ", "%20");
      return {
        ...item,
        video,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return item;
}

export function getTutorialVideos(token) {
  if (token === undefined || token === null) {
    return;
  }
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    Axios.get(tutorialvideo, config)
      .then((response) => {
        try {
          const data = response?.data?.data;
          console.log("getTutorialVideos response", data);
          if (data === null || data?.length === undefined || data?.length < 1) {
            dispatch({ type: MEDIA_KIT_TUTORIALS_STATE_CHANGE, data: [] });
            return;
          }

          dispatch({ type: MEDIA_KIT_TUTORIALS_STATE_CHANGE, data });
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
}

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
            dispatch({
              type: MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE,
              data: [],
            });
            return;
          }
          let newData = {};
          let newMengajakData = [];
          for (let i = 0; i < data?.length; i++) {
            if (data[i]?.jenis === STARTER_KIT_VIDEO_MENGAJAK_TAG) {
              newMengajakData = data[i]?.videos;
              //newMengajakData.push(data[i]);
            } else if (
              data[i]?.jenis === STARTER_KIT_VIDEO_PRODUK_TAG &&
              !(
                data[i]?.nama === undefined ||
                data[i]?.nama === null ||
                data[i]?.nama === ""
              ) &&
              !(
                data[i]?.videos === undefined ||
                data[i]?.videos?.length === undefined
              )
            ) {
              newData[data[i]?.nama] = data[i]?.videos;
            }

            /*if (
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
            }*/
          }
          console.log("post video produk - mengajak", newData, newMengajakData);
          dispatch({ type: MEDIA_KIT_VIDEOS_STATE_CHANGE, data: newData });
          dispatch({
            type: MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE,
            data: newMengajakData,
          });
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
}

export const getMediaKitKategoriThumbnail = async (token) => {
  if (token === undefined || token === null) {
    return {
      result: null,
      error: "Anda perlu login",
    };
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  try {
    console.log("getMediaKitKategoriThumbnail", mediakitkategorithumbnail);
    const response = await Axios.get(mediakitkategorithumbnail, config).catch(
      (error) => {
        console.error(error);
        sentryLog(error);
        return {
          result: null,
          error: error.toString(),
        };
      },
    );

    let flyers = [];
    let videos = [];
    if (
      response?.data?.[STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE] !== undefined
    ) {
      flyers.push(
        processStarterKitHome(
          STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE,
          response?.data?.[STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE],
        ),
      );
    }
    if (
      response?.data?.[STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE] !== undefined
    ) {
      flyers.push(
        processStarterKitHome(
          STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
          response?.data?.[STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE],
        ),
      );
    }
    if (
      response?.data?.[STARTER_KIT_VIDEO_PRODUK_CASE_SENSITIVE] !== undefined
    ) {
      videos.push(
        processStarterKitHome(
          STARTER_KIT_VIDEO_PRODUK_CASE_SENSITIVE,
          response?.data?.[STARTER_KIT_VIDEO_PRODUK_CASE_SENSITIVE],
        ),
      );
    }
    if (
      response?.data?.[STARTER_KIT_VIDEO_MENGAJAK_CASE_SENSITIVE] !== undefined
    ) {
      videos.push(
        processStarterKitHome(
          STARTER_KIT_VIDEO_MENGAJAK_CASE_SENSITIVE,
          response?.data?.[STARTER_KIT_VIDEO_MENGAJAK_CASE_SENSITIVE],
        ),
      );
    }

    return {
      result: [
        {
          title: "Flyer",
          unit: "Foto",
          items: flyers,
        },
        {
          title: "Video",
          unit: "Video",
          items: videos,
        },
      ],
      error: null,
    };
  } catch (e) {
    console.error("getMediaKitKategori error", e);
    sentryLog(e);
    return {
      result: null,
      error: e.toString(),
    };
  }
};

export const getMediaKitKategori = async (token) => {
  if (token === undefined || token === null) {
    return {
      result: null,
      error: "Anda perlu akun Daclen sebelum bisa mengakses Flyer",
    };
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  console.log("getMediaKitKategori", mediakitkategori);
  try {
    const response = await Axios.get(mediakitkategori, config).catch(
      (error) => {
        console.error(error);
        sentryLog("getMediaKitKategori", error);
        return {
          result: null,
          error: error.toString(),
        };
      },
    );

    const responseData = response.data?.data;
    //console.log("getMediaKitKategori response", responseData);
    if (
      responseData === undefined ||
      responseData === null ||
      responseData?.length === undefined ||
      responseData?.length < 1
    ) {
      return {
        result: {},
        error: null,
      };
    } else {
      let data = {};
      let mengajakArray = [];
      let othersArray = [];
      for (let photo of responseData) {
        if (
          !(
            photo?.fotos === undefined ||
            photo?.fotos?.length === undefined ||
            photo?.fotos?.length < 1
          )
        ) {
          if (photo?.jenis.toLowerCase() === STARTER_KIT_FLYER_MENGAJAK_TAG) {
            if (
              !(
                photo?.fotos === undefined ||
                photo?.fotos?.length === undefined ||
                photo?.fotos?.length < 1
              )
            ) {
              mengajakArray = photo?.fotos;
            }
          } else if (
            photo?.jenis.toLowerCase() === STARTER_KIT_FLYER_PRODUK_TAG &&
            !(
              photo?.nama === undefined ||
              photo?.nama === null ||
              photo?.nama === ""
            )
          ) {
            data[photo?.nama] = photo?.fotos;
          } else {
            othersArray.concat(photo, othersArray);
          }
        }
      }
      return {
        result: data,
        mengajakArray,
        error: null,
      };
    }
  } catch (e) {
    console.error("getMediaKitKategori error", e);
    sentryLog(e);
    return {
      result: null,
      error: e.toString(),
    };
  }
};

export const getMediaKitPhotos = async (token) => {
  if (token === undefined || token === null) {
    return {
      result: null,
      error: "Anda perlu akun Daclen sebelum bisa mengakses Flyer",
    };
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  try {
    const response = await Axios.get(mediakitphoto, config).catch((error) => {
      console.error(error);
      sentryLog(error);
      return {
        result: null,
        error: error.toString(),
      };
    });

    const responseData = response.data?.data;
    //console.log("getMediaKitPhotos response", responseData);
    if (
      responseData === undefined ||
      responseData === null ||
      responseData?.length === undefined ||
      responseData?.length < 1
    ) {
      return {
        result: {},
        error: null,
      };
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
      };
    }
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return {
      result: null,
      error: e.toString(),
    };
  }
};
