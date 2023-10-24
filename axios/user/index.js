import Axioss, { isUserDevServer } from "../index";
import Axios from "axios";
import { Linking, Platform, ToastAndroid } from "react-native";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import moment from "moment";

import {
  getcurrentuser,
  loginlink,
  userregister,
  userchangepassword,
  userdelete,
  getbank,
  updateuserdata,
  updateuserphoto,
  getotp,
  validateotp,
  gethpv,
  laporanpoinuser,
  getsyaratroot,
  resetpassword,
  laporansaldo,
  PROFILE_LOCK_TIMEOUT_IN_MILISECONDS,
  registergetsnaptoken,
  devhttp,
  mainhttp,
  penarikansaldo,
  riwayatpenarikansaldo,
  showhpv,
  recruitmenttarget,
  TEMP_DEV_DEVICE_TOKEN,
} from "../constants";
import { checkNumberEmpty, getKeranjang } from "../cart";
import { initialState } from "../../redux/reducers/user";

import {
  USER_STATE_CHANGE,
  USER_TOKEN_STATE_CHANGE,
  USER_ADDRESS_STATE_CHANGE,
  USER_AUTH_DATA_STATE_CHANGE,
  USER_AUTH_ERROR_STATE_CHANGE,
  USER_AUTH_DELETE_STATE_CHANGE,
  USER_BANKS_STATE_CHANGE,
  USER_UPDATE_STATE_CHANGE,
  USER_OTP_STATE_CHANGE,
  USER_OTP_VALIDATION_STATE_CHANGE,
  CLEAR_USER_DATA,
  HISTORY_CLEAR_DATA,
  USER_LOGIN_TOKEN_STATE_CHANGE,
  USER_REGISTER_TOKEN_STATE_CHANGE,
  DISABLE_FORCE_LOGOUT,
  USER_HPV_STATE_CHANGE,
  USER_POINTS_STATE_CHANGE,
  USER_SYARAT_ROOT_STATE_CHANGE,
  MEDIA_KIT_CLEAR_DATA,
  USER_SALDO_STATE_CHANGE,
  USER_PROFILE_LOCK_STATE_CHANGE,
  USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE,
  USER_PROFILE_PIN_STATE_CHANGE,
  USER_REGISTER_SNAP_TOKEN_STATE_CHANGE,
  MEDIA_CLEAR_DATA,
  USER_ADDRESSES_STATE_CHANGE,
  USER_ADDRESS_ID_STATE_CHANGE,
  USER_ADDRESSES_INCREMENT,
  USER_RECRUITMENT_DEADLINE_STATE_CHANGE,
  USER_CART_STATE_CHANGE,
  USER_TEMP_CART_STATE_CHANGE,
  USER_RIWAYAT_SALDO_STATE_CHANGE,
  USER_HPV_ARRAY_STATE_CHANGE,
  USER_HPV_ARRAY_INCREMENT_STATE_CHANGE,
  USER_HPV_TOTAL_REKRUTMEN_STATE_CHANGE,
  USER_PROFILE_PICTURE_STATE_CHANGE,
  USER_SALDO_AKUMULASI_STATE_CHANGE,
} from "../../redux/constants";
import {
  calculateBase64SizeInBytes,
  clearMediaData,
  DataURIToBlob,
  getMimeType,
  getProfilePictureName,
  sendProfilePhotoUnusable,
} from "../../components/media";
import {
  getObjectAsync,
  setObjectAsync,
  setTokenAsync,
} from "../../components/asyncstorage";
import {
  ASYNC_HISTORY_CHECKOUT_KEY,
  ASYNC_HISTORY_DELIVERY_KEY,
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_MEDIA_WATERMARK_PHOTOS_KEY,
  ASYNC_MEDIA_WATERMARK_VIDEOS_KEY,
  ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY,
  ASYNC_NOTIFICATIONS_KEY,
  ASYNC_SERVER_URL,
  ASYNC_USER_ADDRESSES_KEY,
  ASYNC_USER_CURRENTUSER_KEY,
  ASYNC_USER_KEY,
  ASYNC_USER_PREVIOUS_USERNAME,
  ASYNC_USER_PROFILE_ADDRESS_ID_KEY,
  ASYNC_USER_PROFILE_PIN_KEY,
  ASYNC_USER_REGISTER_SNAP_TOKEN_KEY,
  ASYNC_USER_TOKEN_KEY,
  ASYNC_WATERMARK_PHOTOS_PDF_KEY,
  ASYNC_WELCOME_NOTIFICATION_KEY,
} from "../../components/asyncstorage/constants";
import { MAXIMUM_FILE_SIZE_IN_BYTES } from "../../components/media/constants";
import { sentryLog } from "../../sentry";
import { aes } from "./aes";
import { processDbAlamatLainToRedux } from "../address";
import {
  countdownfrozen,
  countdowngreen,
  countdownorange,
  countdownred,
  saldokeluartag,
  saldomasuktag,
} from "../../components/dashboard/constants";

export const resetPassword = () => {
  Linking.openURL(resetpassword);
};

export const userLogout = async (username) => {
  console.log("userLogout", username);
  await setTokenAsync(null);
  await setObjectAsync(ASYNC_USER_KEY, null);
  await setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, null);
  await setObjectAsync(ASYNC_USER_PROFILE_PIN_KEY, null);
  await setObjectAsync(ASYNC_USER_REGISTER_SNAP_TOKEN_KEY, null);
  await setObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY, null);
  await setObjectAsync(ASYNC_HISTORY_DELIVERY_KEY, null);
  await setObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY, null);
  await setObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, null);
  await setObjectAsync(ASYNC_WATERMARK_PHOTOS_PDF_KEY, null);
  await setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, null);
  await setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY, null);
  await setObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY, null);
  await setObjectAsync(ASYNC_USER_ADDRESSES_KEY, null);
  await setObjectAsync(ASYNC_NOTIFICATIONS_KEY, null);
  setObjectAsync(ASYNC_WELCOME_NOTIFICATION_KEY, null);
  setObjectAsync(
    ASYNC_USER_PREVIOUS_USERNAME,
    username === undefined || username === null ? null : username
  );
  //await clearStorage();
};

/*export function enableForceLogout() {
  return (dispatch) => {
    console.log("enableForceLogout");
    dispatch({ type: ENABLE_FORCE_LOGOUT });
  };
}*/

export function generateUuid() {
  const UUID = Crypto.randomUUID();
  return UUID;
}

export const updateReduxHPV = (data) => {
  return (dispatch) => {
    dispatch({ type: USER_HPV_STATE_CHANGE, data });
  };
};

export const updateReduxCurrentUserData = (data) => {
  return (dispatch) => {
    dispatch({ type: USER_STATE_CHANGE, data });
  };
};

export function updateReduxProfileLockStatus(data) {
  return (dispatch) => {
    console.log("updateReduxProfileLockStatus", data);
    dispatch({ type: USER_PROFILE_LOCK_STATE_CHANGE, data });
    if (data) {
      dispatch({ type: USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE, data: null });
      console.log("updateReduxProfileLockTimeout", null);
    } else {
      let date = new Date();
      date.setTime(date.getTime() + PROFILE_LOCK_TIMEOUT_IN_MILISECONDS);
      dispatch({
        type: USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE,
        data: date.getTime(),
      });
      console.log("updateReduxProfileLockTimeout", date.getTime());
    }
  };
}

export function updateReduxRegisterSnapToken(data) {
  return (dispatch) => {
    console.log("updateReduxRegisterSnapToken", data);
    dispatch({ type: USER_REGISTER_SNAP_TOKEN_STATE_CHANGE, data });
  };
}

export function updateReduxProfileLockTimeout(data) {
  return (dispatch) => {
    console.log("updateReduxProfileLockTimeout", data);
    dispatch({ type: USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE, data });
  };
}

export function updateReduxProfilePIN(data) {
  return (dispatch) => {
    console.log("updateReduxProfilePIN");
    dispatch({ type: USER_PROFILE_PIN_STATE_CHANGE, data });
  };
}

export function updateReduxRecruitmentDeadline(data) {
  return (dispatch) => {
    console.log("updateReduxRecruitmentDeadline", data);
    dispatch({ type: USER_RECRUITMENT_DEADLINE_STATE_CHANGE, data });
  };
}

export function updateReduxUserAddresses(data) {
  return (dispatch) => {
    console.log("updateReduxUserAddresses", data);
    dispatch({ type: USER_ADDRESSES_STATE_CHANGE, data });
  };
}

export function incrementReduxUserAddresses(data) {
  return (dispatch) => {
    console.log("incrementReduxUserAddresses", data);
    dispatch({ type: USER_ADDRESSES_INCREMENT, data });
  };
}

export function updateReduxUserAddressId(data) {
  return (dispatch) => {
    console.log("updateReduxUserAddressId", data);
    dispatch({ type: USER_ADDRESS_ID_STATE_CHANGE, data });
  };
}

export function updateReduxUserSaldo(data) {
  return (dispatch) => {
    console.log("updateReduxUserSaldo", data);
    dispatch({ type: USER_SALDO_STATE_CHANGE, data });
  };
}

export function updateReduxUserRiwayatSaldo(data) {
  return (dispatch) => {
    console.log("updateReduxUserRiwayatSaldo", data);
    dispatch({ type: USER_RIWAYAT_SALDO_STATE_CHANGE, data });
  };
}

export function overhaulReduxUserHpvArray(data) {
  return (dispatch) => {
    console.log("overhaulReduxUserHpvArray", data);
    dispatch({ type: USER_HPV_ARRAY_STATE_CHANGE, data });
  };
}

export function incrementReduxUserHpvArray(data) {
  return (dispatch) => {
    console.log("incrementReduxUserHpvArray", data);
    dispatch({ type: USER_HPV_ARRAY_INCREMENT_STATE_CHANGE, data });
  };
}

export function disableForceLogout() {
  return (dispatch) => {
    console.log("disableForceLogout");
    dispatch({ type: DISABLE_FORCE_LOGOUT });
  };
}

export const eliminateSpaceFromString = (text) => {
  if (text === null || text === "") {
    return text;
  }
  try {
    if (text.includes(" ")) {
      const newText = text.split(" ").join("");
      return newText;
    }
  } catch (e) {
    console.error(e);
  }
  return text;
};

export function clearUserData() {
  return (dispatch) => {
    console.log("clearUserData");
    //setTokenAsync(null);
    dispatch({ type: CLEAR_USER_DATA });
    dispatch({ type: HISTORY_CLEAR_DATA });
    dispatch({ type: MEDIA_KIT_CLEAR_DATA });
  };
}

export function clearSyaratRoot() {
  return (dispatch) => {
    dispatch({ type: USER_SYARAT_ROOT_STATE_CHANGE, data: [] });
  };
}

export function getSyaratRoot(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axioss.get(getsyaratroot, config)
      .then((response) => {
        const data = response.data?.data;
        console.log("getSyaratRoot", data);
        dispatch({ type: USER_SYARAT_ROOT_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_AUTH_ERROR_STATE_CHANGE,
          data: error?.toString(),
        });
      });
  };
}

export const storePenarikanSaldo = async (token, saldo, userId) => {
  if (
    token === undefined ||
    token === null ||
    saldo === undefined ||
    saldo === null ||
    userId === undefined ||
    userId === null
  ) {
    return {
      data: null,
      error: null,
    };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const params = {
    saldo,
    user_id: userId.toString(),
  };
  console.log("storePenarikanSaldo", params);

  try {
    const response = await Axioss.post(penarikansaldo, params, config).catch(
      (error) => {
        console.error(error);
        sentryLog(error);
        return {
          data: null,
          error: error.toString(),
        };
      }
    );
    const data = response?.data;
    console.log("storePenarikanSaldo response", response);

    if (!(data === undefined || data === null)) {
      if (typeof data === "string") {
        return {
          data: null,
          error: data,
        };
      } else if (
        data?.session === undefined ||
        data?.session === null ||
        data?.session !== "success"
      ) {
        return {
          data: null,
          error: data?.message ? data?.message : null,
        };
      } else if (data?.session === "successs") {
        return {
          data,
          error: null,
        };
      } else if (!(data?.errors === undefined || data?.errors === null)) {
        let newArray = Object.values(data?.errors);
        let error = "";
        for (let a of newArray) {
          for (let b of a) {
            error = `${error === "" ? "" : "\n"}${b.toString()}`;
          }
        }
        return {
          data: null,
          error,
        };
      }
    }
    return {
      data,
      error: null,
    };
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return {
      data: null,
      error: e.toString(),
    };
  }
};

export function getRiwayatPenarikanSaldo(id, token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url = riwayatpenarikansaldo + "/" + id.toString();
    console.log("getRiwayatPenarikanSaldo", url);

    Axioss.get(url, config)
      .then((response) => {
        const data = response?.data?.data;
        console.log("getRiwayatPenarikanSaldo response", response);
        dispatch({ type: USER_RIWAYAT_SALDO_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_AUTH_ERROR_STATE_CHANGE,
          data: error.toString(),
        });
      });
  };
}

export function getLaporanSaldo(id, token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url = laporansaldo + "/" + id.toString();
    console.log("getLaporanSaldo", url);

    Axioss.get(url, config)
      .then((response) => {
        const data = response?.data?.data.reverse();
        dispatch({ type: USER_SALDO_STATE_CHANGE, data });
        try {
          let newTotal = 0;
          for (let d of data) {
            if (d?.status.toLowerCase() === "saldo masuk" && checkNumberEmpty(d?.total_saldo) >= checkNumberEmpty(d?.saldo)) {
              newTotal += checkNumberEmpty(d?.saldo);
            }
          }
          console.log("saldoAkumulasi from getLaporanSaldo", newTotal);
          dispatch({ type: USER_SALDO_AKUMULASI_STATE_CHANGE, data: newTotal });
        } catch (e) {
          console.error(e);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_AUTH_ERROR_STATE_CHANGE,
          data: error.toString(),
        });
      });
  };
}

export function getLaporanPoin(id, token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url = laporanpoinuser + "/" + id.toString();
    console.log("laporanpoinuser with header " + url);

    Axioss.get(url, config)
      .then((response) => {
        const data = response.data;
        dispatch({ type: USER_POINTS_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_AUTH_ERROR_STATE_CHANGE,
          data: error.toString(),
        });
      });
  };
}

export function convertInvoiceNumbertoRegDate(inv) {
  try {
    let invoiceDate = inv.split("/")[1];
    let date = new Date();
    date.setFullYear(parseInt(invoiceDate.substring(0, 4)));
    date.setMonth(parseInt(invoiceDate.substring(4, 6)) - 1);
    date.setDate(parseInt(invoiceDate.substring(6, 8)));
    date.setHours(0, 0, 0);
    return date.toISOString();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function determineCountdownColor(batas_rekrut, target_rekrutmen) {
  if (
    batas_rekrut === undefined ||
    batas_rekrut === null ||
    batas_rekrut === "" ||
    target_rekrutmen === undefined ||
    target_rekrutmen === null
  ) {
    return null;
  } else if (checkNumberEmpty(target_rekrutmen) < 1) {
    return countdownfrozen;
  }

  try {
    let deadline = new Date(batas_rekrut).getTime();
    let now = new Date().getTime();
    let days = Math.floor(moment.duration(deadline - now).asDays());
    if (days > 59) {
      return countdowngreen;
    } else if (days > 29) {
      return countdownorange;
    } else {
      return countdownred;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const showHPV = async (id, token) => {
  if (
    id === undefined ||
    id === null ||
    token === undefined ||
    token === null
  ) {
    return {
      result: null,
      error: null,
    };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const url = showhpv + "/" + id.toString();
  console.log("showHPV", url);

  try {
    const response = await Axioss.get(url, config).catch((error) => {
      console.error(error);
      sentryLog(error);
      return {
        result: null,
        error: error.toString(),
      };
    });
    //console.log("showHPV response", response);
    return {
      result: response?.data?.data,
      error: null,
    };
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return {
      result: null,
      error: e.toString(),
    };
  }
};

export const checkSaldoMutationType = (item) => {
  try {
    if (item?.status === saldokeluartag || checkNumberEmpty(item?.saldo) < 0) {
      return -1;
    } else if (item?.status === saldomasuktag || checkNumberEmpty(item?.saldo) > 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export const getHPV = async (id, token) => {
  if (
    id === undefined ||
    id === null ||
    token === undefined ||
    token === null
  ) {
    return {
      result: null,
      error: "",
    };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const url = gethpv + "/" + id.toString();
  console.log("getHPV", url);

  try {
    const response = await Axioss.get(url, config).catch((error) => {
      console.error(error);
      sentryLog(error);
      return {
        result: null,
        error: error.toString(),
      };
    });
    return {
      result: response?.data ? response?.data : null,
      error: "",
    };
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return {
      result: null,
      error: e.toString(),
    };
  }
};

export function deleteAccount(email, password, deviceToken) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_DELETE_STATE_CHANGE, data: null });
    const params = getAuthDeviceInfo(
      {
        email,
        password,
        device_name: Platform.OS,
      },
      deviceToken ? deviceToken : TEMP_DEV_DEVICE_TOKEN
    );
    console.log("deleteAccount");

    Axioss.post(userdelete, params)
      .then((response) => {
        const data = response.data;
        if (data !== null && data !== undefined) {
          dispatch({ type: USER_AUTH_DELETE_STATE_CHANGE, data });
        } else {
          const data = {
            message:
              "Gagal mendapatkan token. Mohon mencoba beberapa saat lagi",
          };
          dispatch({ type: USER_AUTH_DELETE_STATE_CHANGE, data });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: USER_AUTH_DELETE_STATE_CHANGE, data: error });
      });
  };
}

export function validateOTP(id, token, otp) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const params = {
      otp,
    };

    const url = getotp + "/" + id.toString() + validateotp;
    console.log("validateOTP " + url + " with params and header");
    console.log({ config, params });

    Axioss.post(url, params, config)
      .then((response) => {
        let data = response.data;
        console.log(response);
        if (data?.session === "success") {
          dispatch({
            type: USER_OTP_STATE_CHANGE,
            data: initialState.phoneOTP,
          });
          dispatch(getCurrentUser(token));
        }
        //dispatch({ type: USER_OTP_VALIDATION_STATE_CHANGE, data: {...data, session: "success"} });
        dispatch({ type: USER_OTP_VALIDATION_STATE_CHANGE, data });
        //console.log(data);
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_OTP_VALIDATION_STATE_CHANGE,
          data: { session: "", message: error?.message },
        });
      });
  };
}

export function getOTP(id, token, nomor_telp) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const params = {
      nomor_telp,
    };

    const url = getotp + "/" + id.toString();
    console.log("getOTP " + url + " with params and header");
    console.log({ config, params });

    Axioss.post(url, params, config)
      .then((response) => {
        let data = response.data;
        console.log(response);
        if (data?.session === "success") {
          let timeout = new Date();
          timeout.setTime(timeout.getTime() + 90000);
          data = { ...data, timeout, nomor_telp };
        } else {
          data = { ...data, timeout: null };
        }
        //console.log(data);
        dispatch({ type: USER_OTP_STATE_CHANGE, data });
        dispatch({
          type: USER_OTP_VALIDATION_STATE_CHANGE,
          data: initialState.validationOTP,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_OTP_STATE_CHANGE,
          data: { session: "", message: error?.message, timeout: null },
        });
        dispatch({
          type: USER_OTP_VALIDATION_STATE_CHANGE,
          data: initialState.validationOTP,
        });
      });
  };
}

export function updateUserPhoto(id, token, uri) {
  try {
    return (dispatch) => {
      let formData = new FormData();
      let type = getMimeType(uri);
      let name = getProfilePictureName(id, type, uri);
      let method = "";

      const foto = {
        name,
        type,
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
      };

      if (Platform.OS === "web") {
        const fileSize = calculateBase64SizeInBytes(uri);
        if (fileSize >= MAXIMUM_FILE_SIZE_IN_BYTES) {
          dispatch(sendProfilePhotoUnusable(true));
          dispatch({ type: MEDIA_CLEAR_DATA });
          return;
        }

        let blob = DataURIToBlob(uri);
        formData.append("foto", blob, name);
        method = "uri to blob";
        console.log("sending blob", name, type, blob);
      } else {
        formData.append("foto", foto);
        method = "using object";
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const url = updateuserphoto + "/" + id.toString();
      console.log("updateUserPhoto", url);

      Axioss.post(url, formData, config)
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (data?.session === "success") {
            dispatch({ type: USER_UPDATE_STATE_CHANGE, data: data });
          } else if (id === 8054) {
            dispatch({
              type: USER_UPDATE_STATE_CHANGE,
              data: {
                session: "photoError",
                message: `${JSON.stringify(foto)}\n\n${JSON.stringify(data)}`,
              },
            });
          } else if (data?.errors !== undefined) {
            if (data?.errors?.foto !== undefined) {
              dispatch({
                type: USER_UPDATE_STATE_CHANGE,
                data: {
                  session: "photoError",
                  message: JSON.stringify(data?.errors?.foto),
                },
              });
            } else {
              dispatch({
                type: USER_UPDATE_STATE_CHANGE,
                data: {
                  session: "photoError",
                  message: JSON.stringify(data?.errors),
                },
              });
            }
          } else {
            try {
              let message = "";
              for (let a of data) {
                if (!(a === null || a === "")) {
                  message = `${message === "" ? a : `${message}\n${a}`}`;
                }
              }
              dispatch({
                type: USER_UPDATE_STATE_CHANGE,
                data: {
                  session: "photoError",
                  message,
                },
              });
            } catch (e) {
              console.error(e);
              dispatch({
                type: USER_UPDATE_STATE_CHANGE,
                data: {
                  session: "photoError",
                  message: data[0].toString(),
                },
              });
            }
          }
          dispatch({ type: MEDIA_CLEAR_DATA });
        })
        .catch((error) => {
          console.error(error);
          sentryLog(error);
          dispatch({
            type: USER_UPDATE_STATE_CHANGE,
            data: {
              session: "photoError",
              message:
                id === 8054
                  ? JSON.stringify({
                      MAINMESSAGE: error.message,
                      CONFIG: JSON.stringify(config),
                      METHOD: method,
                      URI: uri,
                      TYPE: type,
                      FORMDATA: JSON.stringify(formData),
                    })
                  : error?.message,
            },
          });
        });
    };
  } catch (error) {
    console.error(error);
    sentryLog(error);
    return (dispatch) => {
      dispatch({
        type: USER_UPDATE_STATE_CHANGE,
        data: {
          session: "photoError",
          message: JSON.stringify({
            MAINMESSAGE: error.message,
            METHOD: method,
            FORMDATA: JSON.stringify(formData),
            ...error,
          }),
        },
      });
    };
  }
}

export function updateUserData(
  id,
  userData,
  address,
  token,
  currentUser,
  foto
) {
  try {
    return (dispatch) => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      const params = {
        ...address,
        provinsi_id: address.provinsi?.id,
        kota_id: address.kota?.id,
        kecamatan_id: address.kecamatan?.id,
        ...userData,
        bank_id: userData?.bank_id
          ? userData?.bank_id
          : currentUser?.detail_user?.bank?.id,
        bank_name: userData?.bank_name
          ? userData?.bank_name
          : currentUser?.detail_user?.bank?.nama,
        foto: null,
        nama_lengkap: userData?.nama_depan + " " + userData?.nama_belakang,
        wm_nama: userData?.wm_nama
          ? userData?.wm_nama
          : currentUser?.detail_user?.wm_nama,
        wm_nomor_telepon: userData?.wm_nomor_telepon
          ? userData?.wm_nomor_telepon
          : currentUser?.detail_user?.wm_nomor_telepon,
      };

      const url = updateuserdata + "/" + id.toString();
      console.log("updateUserData", url, params);

      Axioss.post(url, params, config)
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (data?.errors !== undefined) {
            if (
              data?.errors?.alamat !== undefined ||
              data?.errors?.kota_id !== undefined ||
              data?.errors?.provinsi_id !== undefined
            ) {
              dispatch({
                type: USER_UPDATE_STATE_CHANGE,
                data: {
                  session: "addressIncomplete",
                  message: "Mohon mengisi alamat pengiriman dahulu",
                },
              });
            } else {
              try {
                let message = "";
                let errorKeys = Object.keys(data?.errors);
                for (let key of errorKeys) {
                  if (data?.errors[key]?.length > 0) {
                    message = `${message ? `${message}\n` : ""}${
                      data?.errors[key][0]
                    }`;
                  }
                }
                dispatch({
                  type: USER_UPDATE_STATE_CHANGE,
                  data: { session: "", message },
                });
              } catch (e) {
                console.error(e);
                dispatch({
                  type: USER_UPDATE_STATE_CHANGE,
                  data: { session: "", message: JSON.stringify(data?.errors) },
                });
              }
            }
          } else {
            dispatch({ type: USER_UPDATE_STATE_CHANGE, data: data });
            if (
              currentUser === undefined ||
              currentUser === null ||
              currentUser?.detail_user === undefined ||
              currentUser?.detail_user === null
            ) {
              return;
            }
            dispatch({
              type: USER_STATE_CHANGE,
              data: {
                ...currentUser,
                nomor_telp: params?.nomor_telp
                  ? params?.nomor_telp
                  : currentUser?.nomor_telp,
                email: params?.email ? params?.email : currentUser?.email,
                detail_user: {
                  ...currentUser?.detail_user,
                  ...params,
                  foto: foto ? foto : currentUser?.detail_user?.foto,
                  bank: {
                    ...currentUser?.detail_user?.bank,
                    id: params?.bank_id,
                    nama: params?.bank_name,
                  },
                },
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: USER_UPDATE_STATE_CHANGE,
            data: { session: "", message: error?.message },
          });
        });
    };
  } catch (error) {
    console.error(error);
    sentryLog(error);
    return (dispatch) => {
      dispatch({
        type: USER_UPDATE_STATE_CHANGE,
        data: { session: "", message: error?.message },
      });
    };
  }
}

export function getBank(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axioss.get(getbank, config)
      .then((response) => {
        let data = [];
        for (let i = 0; i < response.data?.data?.length; i++) {
          if (response.data?.data[i].isDipakai) {
            data.push(response.data?.data[i]);
          }
        }
        //console.log(data);
        console.log("getBank with header", data);
        dispatch({ type: USER_BANKS_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_UPDATE_STATE_CHANGE,
          data: { session: "", message: error?.message },
        });
      });
  };
}

export function clearAuthData() {
  return (dispatch) => {
    console.log("clearAuthData");
    dispatch({
      type: USER_AUTH_DATA_STATE_CHANGE,
      data: initialState.authData,
    });
  };
}

export function clearAuthError() {
  return (dispatch) => {
    console.log("clearAuthError");
    dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: null });
  };
}

export function setAuthData(data) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_DATA_STATE_CHANGE, data });
  };
}

export function getRegisterSnapToken(id, token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url = registergetsnaptoken + "/" + id.toString();

    Axioss.post(url, config)
      .then((response) => {
        const data = response?.data;
        console.log("getRegisterSnapToken", data);
        dispatch({ type: USER_REGISTER_SNAP_TOKEN_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.error(error);
        sentryLog(error);
        dispatch({
          type: USER_REGISTER_SNAP_TOKEN_STATE_CHANGE,
          data: {
            error: error.toString(),
          },
        });
      });
  };
}

export function changePassword(authData, id, token) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: null });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const url = userchangepassword + "/" + id.toString();
    console.log(
      "changePassword with header and params " + JSON.stringify(authData)
    );

    Axioss.post(url, authData, config)
      .then((response) => {
        console.log(response.data);
        const session = response.data?.session;
        if (session === "success") {
          dispatch({
            type: USER_AUTH_ERROR_STATE_CHANGE,
            data: { session, message: "Berhasil mengganti password" },
          });
        } else if (!response.data?.pass_valid) {
          dispatch({
            type: USER_AUTH_ERROR_STATE_CHANGE,
            data: {
              session,
              message: "Password lama yang Anda masukkan salah",
            },
          });
        } else {
          const data = {
            session: "",
            message: "Gagal mengganti password.\n" + response.data?.message,
          };
          dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data });
          //dispatch(clearUserData());
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_AUTH_ERROR_STATE_CHANGE,
          data: { session: "", message: error?.message },
        });
      });
  };
}

export function register(authData, deviceToken) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: null });
    const params = getAuthDeviceInfo(
      {
        ...authData,
        device_name: Platform.OS,
      },
      deviceToken ? deviceToken : TEMP_DEV_DEVICE_TOKEN
    );

    let isDevUser = isUserDevServer(authData?.name);
    const newServerUrl = isDevUser ? devhttp : mainhttp;
    let url = `${newServerUrl}${userregister}`;
    console.log("register", url);

    Axios.post(url, params)
      .then(async (response) => {
        //console.log("register response data", response.data);
        const token = response?.data?.token;
        if (token === undefined || token === null || token === "") {
          const data = response?.data?.errors
            ? response?.data?.errors
            : "Tidak bisa mendaftarkan akun baru. Mohon periksa kembali data yang Anda masukkan.";
          dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data });
          //dispatch(clearUserData());
          setObjectAsync(ASYNC_USER_KEY, null);
        } else {
          //dispatch(setNewToken(token, deviceToken));
          await setObjectAsync(ASYNC_SERVER_URL, newServerUrl);
          Axios.interceptors.request.use(
            async (config) => {
              config.baseURL = newServerUrl;
              console.log("axios instance baseURL changed to", newServerUrl);
              return config;
            },
            (error) => {
              console.error(error);
            }
          );
          dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token });
          storeNewToken(token, authData?.password);
        }
      })
      .catch((error) => {
        console.error(error);
        sentryLog(error);
        dispatch({
          type: USER_AUTH_ERROR_STATE_CHANGE,
          data: { default: [error?.toString()] },
        });
      });
  };
}

export function login(email, password, resetPIN, deviceToken) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: null });
    const params = getAuthDeviceInfo(
      {
        email,
        password,
        device_name: Platform.OS,
      },
      deviceToken ? deviceToken : TEMP_DEV_DEVICE_TOKEN
    );

    let isDevUser = isUserDevServer(email);
    const newServerUrl = isDevUser ? devhttp : mainhttp;
    let url = `${newServerUrl}${loginlink}`;
    if (email === "jasonlimanjaya" && Platform.OS === "android") {
      ToastAndroid.show(JSON.stringify(params), ToastAndroid.LONG);
    }
    //console.log("login", params);

    Axios.post(url, params)
      .then(async (response) => {
        console.log("login response data", response?.data);
        const token = response?.data?.token;
        if (token === undefined || token === null || token === "") {
          const data = response?.data?.message
            ? response?.data?.message
            : "Username/password salah. Mohon periksa kembali data yang Anda masukkan.";
          dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data });
          setObjectAsync(ASYNC_USER_KEY, null);
          //dispatch(clearUserData());
        } else {
          //dispatch(setNewToken(token, deviceToken));
          await setObjectAsync(ASYNC_SERVER_URL, newServerUrl);
          Axios.interceptors.request.use(
            async (config) => {
              config.baseURL = newServerUrl;
              console.log("axios instance baseURL changed to", newServerUrl);
              return config;
            },
            (error) => {
              console.error(error);
            }
          );
          if (resetPIN) {
            dispatch({ type: USER_PROFILE_PIN_STATE_CHANGE, data: null });
            dispatch({ type: USER_PROFILE_LOCK_STATE_CHANGE, data: true });
            dispatch({
              type: USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE,
              data: null,
            });
          }
          dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token });
          storeNewToken(token, password);
        }
      })
      .catch((error) => {
        console.error(error);
        sentryLog(error);
        dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: error?.message });
      });
  };
}

export const getCurrentUser = (token, storageCurrentUser) => {
  return (dispatch) => {
    if (token === undefined || token === null || token === "") {
      return;
    }
    //dev debug
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    console.log("getCurrentUser", token);
    Axioss.get(getcurrentuser, config)
      .then((response) => {
        const data = response?.data ? response?.data?.data : null;
        if (data === undefined || data === null) {
          console.log("getCurrentUser response data invalid", data);
          readStorageCurrentUser(dispatch, storageCurrentUser, null);
        } else {
          //console.log("user current response", data);
          if (
            data?.status !== null &&
            (data?.target_rekrutmen === undefined ||
              data?.target_rekrutmen === null)
          ) {
            fetchHPVfromUserCurrent(dispatch, token, data);
          } else {
            dispatch({ type: USER_STATE_CHANGE, data });
            setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, data);
          }

          dispatch({
            type: USER_PROFILE_PICTURE_STATE_CHANGE,
            data: data?.detail_user
              ? data?.detail_user?.foto
                ? data?.detail_user?.foto
                : null
              : null,
          });
          dispatch({ type: USER_ADDRESS_STATE_CHANGE, data });
          if (
            !(
              data?.alamat_lain === undefined ||
              data?.alamat_lain?.length === undefined ||
              data?.alamat_lain?.length < 1
            )
          ) {
            let addresses = processDbAlamatLainToRedux(data?.alamat_lain);
            console.log("processDbAlamatLainToRedux", addresses?.length);
            dispatch({ type: USER_ADDRESSES_STATE_CHANGE, data: addresses });
          }
        }
        dispatch({ type: HISTORY_CLEAR_DATA });
        dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token: null });
        dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token: null });
      })
      .catch((error) => {
        let errorJSON = error.toJSON();
        let status = (status =
          errorJSON === undefined ||
          errorJSON === null ||
          errorJSON?.status === undefined
            ? null
            : errorJSON?.status);
        console.error("getCurrentUser", status, error);
        //sentryLog(error);
        dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token: null });
        dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token: null });
        readStorageCurrentUser(dispatch, storageCurrentUser, status);
      });
  };
};

export const fetchHPVfromUserCurrent = async (dispatch, token, currentUser) => {
  if (
    token === undefined ||
    token === null ||
    currentUser === undefined ||
    currentUser === null
  ) {
    return;
  }

  try {
    const result = await getHPV(currentUser?.id, token);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null ||
      currentUser?.batas_rekrut === undefined ||
      currentUser?.batas_rekrut === null ||
      currentUser?.batas_rekrut === ""
    ) { 
      dispatch({ type: USER_STATE_CHANGE, data: currentUser });
      setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, currentUser);
    } else {
      console.log("overhaulReduxHPV", result?.result);
      dispatch({ type: USER_HPV_STATE_CHANGE, data: result?.result });
      
      let deadlineTime = new Date(currentUser?.batas_rekrut).getTime();
      let total_rekrutmen = 0;
      for (let h of result?.result?.data?.children[0]?.children) {
        if (!(h?.id === undefined || h?.id === null)) {
          const childHPV = await showHPV(h?.id, token);
          if (
            !(
              childHPV === undefined ||
              childHPV === null ||
              childHPV?.result === undefined ||
              childHPV?.result === null
            )
          ) {
            let data = childHPV?.result;
            console.log("incrementReduxUserHpvArray", data);
            dispatch({ type: USER_HPV_ARRAY_INCREMENT_STATE_CHANGE, data });

            if (
              !(
                data?.join_date === undefined ||
                data?.join_date === null ||
                data?.join_date === ""
              )
            ) {
              let joinTime = new Date(data?.join_date).getTime();
              if (joinTime < deadlineTime) {
                total_rekrutmen++;
              }
            }
          }
        }
      }
      console.log("overhaulReduxHPVTotalRekrutmen", total_rekrutmen);
      dispatch({
        type: USER_HPV_TOTAL_REKRUTMEN_STATE_CHANGE,
        data: total_rekrutmen,
      });

      let newUserData = {
        ...currentUser,
        target_rekrutmen:
          total_rekrutmen >= recruitmenttarget
            ? 0
            : recruitmenttarget - total_rekrutmen,
      };
      console.log("new redux currentUser after showHPVs", newUserData);
      dispatch({ type: USER_STATE_CHANGE, data: newUserData });
      setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, newUserData);
    }
  } catch (e) {
    console.error(e);
    dispatch({ type: USER_STATE_CHANGE, data: currentUser });
    setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, currentUser);
  }
};

export const fetchSelfHPVfromUserCurrent = async (dispatch, token, id) => {
  const result = await showHPV(id, token);
  if (
    !(
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    )
  ) {
    let data = [result?.result];
    console.log("overhaulReduxUserHpvArray", data);
    dispatch({ type: USER_HPV_ARRAY_STATE_CHANGE, data });
  }
};

function readStorageCurrentUser(dispatch, storageCurrentUser, status) {
  if (storageCurrentUser === undefined || storageCurrentUser === null) {
    console.log("storage currentUser also null");
    dispatch({ type: USER_STATE_CHANGE, data: null });
    dispatch({ type: USER_ADDRESS_STATE_CHANGE, data: null });
    //dispatch({ type: HISTORY_CLEAR_DATA });
    dispatch({ type: MEDIA_KIT_CLEAR_DATA });
    dispatch({ type: USER_TEMP_CART_STATE_CHANGE, data: null });
    dispatch({ type: USER_CART_STATE_CHANGE, data: null });
    dispatch({ type: USER_TOKEN_STATE_CHANGE, token: null });
    userLogout();
    if (Platform.OS === "android") {
      ToastAndroid.show(
        `Terjadi kendala saat login. Mohon menghubungi Daclen Care untuk penjelasan lebih lanjut.${
          status ? `\n${status.toString()}` : ""
        }`,
        ToastAndroid.LONG
      );
    }
  } else {
    console.log("reading from storage currentUser");
    dispatch({ type: USER_STATE_CHANGE, data: storageCurrentUser });
    dispatch({
      type: USER_PROFILE_PICTURE_STATE_CHANGE,
      data: storageCurrentUser?.detail_user
        ? storageCurrentUser?.detail_user?.foto
          ? storageCurrentUser?.detail_user?.foto
          : null
        : null,
    });
    dispatch({
      type: USER_ADDRESS_STATE_CHANGE,
      data: storageCurrentUser,
    });
  }
}

export function setNewToken(token, storageCurrentUser, key, deviceToken) {
  return (dispatch) => {
    if (token === undefined || token === null || token === "") {
      console.log("redux token set to null");
      dispatch({ type: USER_TOKEN_STATE_CHANGE, token: null });
      userLogout();
    } else if (key === undefined || key === null || key === "") {
      console.log("redux token set to previous");
      dispatch({ type: USER_TOKEN_STATE_CHANGE, token });
      dispatch(getCurrentUser(token, storageCurrentUser));
      dispatch(getKeranjang(token));
      setTokenAsync(token);
    } else {
      const params = getAuthDeviceInfo(
        {
          email: storageCurrentUser?.name,
          password: key,
          device_name: Platform.OS,
        },
        deviceToken ? deviceToken : TEMP_DEV_DEVICE_TOKEN
      );
      //console.log("setNewToken login", params);

      Axioss.post(loginlink, params)
        .then((response) => {
          const token = response?.data?.token;
          if (token === undefined || token === null || token === "") {
            setObjectAsync(ASYNC_USER_TOKEN_KEY, null);
            setObjectAsync(ASYNC_USER_KEY, null);
            dispatch({ type: USER_TOKEN_STATE_CHANGE, token: null });
          } else {
            console.log("redux token set to new");
            storeNewToken(token, key);
            dispatch({ type: USER_TOKEN_STATE_CHANGE, token });
            dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token });
            dispatch(getCurrentUser(token, storageCurrentUser));
            dispatch(getKeranjang(token));
            setTokenAsync(token);
          }
        })
        .catch((error) => {
          console.error(error);
          sentryLog(error);
          dispatch({ type: USER_TOKEN_STATE_CHANGE, token: null });
          userLogout();
        });
    }
  };
}

/*storageCurrentUser === undefined ||
      storageCurrentUser === null ||
      storageCurrentUser?.name === undefined ||
      storageCurrentUser?.name === null*/

export const storeNewToken = async (token, key) => {
  if (
    token === undefined ||
    token === null ||
    key === undefined ||
    key === null
  ) {
    return;
  }
  const digest = aes(key, token, true);
  await setObjectAsync(ASYNC_USER_KEY, digest);
};

export const deriveUserKey = async (token) => {
  if (token === undefined || token === null) {
    return null;
  }
  try {
    const key = await getObjectAsync(ASYNC_USER_KEY);
    if (key === undefined || key === null || key === "") {
      return null;
    }
    return aes(key, token, false);
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const getAuthDeviceInfo = (params, deviceToken) => {
  let deviceInfo = getDeviceInfo();
  return {
    ...params,
    android_device_token: Platform.OS === "android" ? deviceToken : null,
    ios_device_token:
      Platform.OS === "ios"
        ? deviceToken
        : Platform.OS === "web"
        ? "SAFARI"
        : null,
    device_info: JSON.stringify(deviceInfo),
    device_model: `${deviceInfo?.model}_${deviceInfo?.versionRelease}`,
  };
};

export const getDeviceInfo = () => {
  return {
    isDevice: Device.isDevice,
    name: Device.deviceName,
    versionRelease: Device.osVersion,
    model: Device.modelName,
    versionSdk: Device.platformApiLevel,
    yearClass: Device.deviceYearClass,
    osName: Device.osName,
    osBuildId: Device.osBuildId,
    osInternalBuildId: Device.osInternalBuildId,
    brand: Device.manufacturer,
    device: Device.productName,
    totalMemory: Device.totalMemory,
    supportedCpuArchitectures: Device.supportedCpuArchitectures,
  };
};
