import Axios from "../index";
import { Linking, Platform, ToastAndroid } from "react-native";

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
} from "../constants";
import { getKeranjang } from "../cart";
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
  clearStorage,
  setObjectAsync,
  setTokenAsync,
} from "../../components/asyncstorage";
import { ASYNC_HISTORY_CHECKOUT_KEY, ASYNC_HISTORY_DELIVERY_KEY, ASYNC_MEDIA_WATERMARK_DATA_KEY, ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, ASYNC_USER_CURRENTUSER_KEY, ASYNC_USER_PROFILE_PIN_KEY, ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../../components/asyncstorage/constants";
import { MAXIMUM_FILE_SIZE_IN_BYTES } from "../../components/media/constants";
import { sentryLog } from "../../sentry";

export const resetPassword = () => {
  Linking.openURL(resetpassword);
};

export const userLogout = async () => {
  console.log("userLogout");
  await setTokenAsync(null);
  await setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, null);
  await setObjectAsync(ASYNC_USER_PROFILE_PIN_KEY, null);
  await setObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY, null);
  await setObjectAsync(ASYNC_HISTORY_DELIVERY_KEY, null);
  await setObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY, null);
  await setObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, null);
  await setObjectAsync(ASYNC_WATERMARK_PHOTOS_PDF_KEY, null);
  setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, null);
  //await clearStorage();
};

/*export function enableForceLogout() {
  return (dispatch) => {
    console.log("enableForceLogout");
    dispatch({ type: ENABLE_FORCE_LOGOUT });
  };
}*/

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
      dispatch({ type: USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE, data: date.getTime() });
      console.log("updateReduxProfileLockTimeout", date.getTime());
    }
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
    console.log("updateReduxProfilePIN", data);
    dispatch({ type: USER_PROFILE_PIN_STATE_CHANGE, data });
  };
}

export function disableForceLogout() {
  return (dispatch) => {
    console.log("disableForceLogout");
    dispatch({ type: DISABLE_FORCE_LOGOUT });
  };
}

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
    console.log("getSyaratRoot with header");

    Axios.get(getsyaratroot, config)
      .then((response) => {
        const data = response.data?.data;
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

    Axios.get(url, config)
      .then((response) => {
        const data = response.data;
        dispatch({ type: USER_SALDO_STATE_CHANGE, data });
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

    Axios.get(url, config)
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

export function getHPV(id, token) {
  return (dispatch) => {
    if (
      id === undefined ||
      id === null ||
      token === undefined ||
      token === null
    ) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url = gethpv + "/" + id.toString();
    console.log("getHPV with header " + url);

    Axios.get(url, config)
      .then((response) => {
        const data = response.data;
        dispatch({ type: USER_HPV_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        dispatch({ type: USER_HPV_STATE_CHANGE, data: {
          data: null,
        } });
        //dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: error?.message });
      });
  };
}

export function deleteAccount(email, password) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_DELETE_STATE_CHANGE, data: null });
    const params = {
      email,
      password,
      device_name: Platform.OS,
    };
    console.log("deleteAccount with params " + JSON.stringify(params));

    Axios.post(userdelete, params)
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

    Axios.post(url, params, config)
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

    Axios.post(url, params, config)
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

/*const file = dataURLtoFile(uri);
          formData.append("foto", file);
          method = "base64 to file";
          console.log("convert base64 to file", file);
          
          transformRequest: (data) => {
            return data;
          },*/

export function updateUserPhoto(id, token, uri) {
  try {
    return (dispatch) => {
      let formData = new FormData();
      let type = getMimeType(uri);
      let name = getProfilePictureName(id, type, uri);
      let method = "";

      if (Platform.OS === "web") {
        const fileSize = calculateBase64SizeInBytes(uri);
        if (fileSize >= MAXIMUM_FILE_SIZE_IN_BYTES) {
          dispatch(sendProfilePhotoUnusable(true));
          dispatch(clearMediaData());
          return;
        }

        let blob = DataURIToBlob(uri);
        formData.append("foto", blob, name);
        method = "uri to blob";
        console.log("sending blob", name, type, blob);
      } else {
        let foto = {
          name,
          type,
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        };
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
      if (Platform.OS === "android" && id === 8054) {
        ToastAndroid.show(
          `updateUserPhoto ${url}\nname: ${name}\nuri: ${uri}\ntype: ${type}`,
          ToastAndroid.LONG
        );
      } else {
        console.log("updateUserPhoto " + url + " with formData and header");
        console.log({ config, formData });
      }

      Axios.post(url, formData, config)
        .then((response) => {
          const data = response.data;
          console.log(data);
          /*if (Platform.OS === "android" && id === 8054) {
              ToastAndroid.show(`response is ${JSON.stringify(data)}`);
            }*/
          if (data?.session === "success") {
            dispatch({ type: USER_UPDATE_STATE_CHANGE, data: data });
            dispatch(getCurrentUser(token));
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
            dispatch({
              type: USER_UPDATE_STATE_CHANGE,
              data: {
                session: "photoError",
                message: JSON.stringify(data),
              },
            });
          }
          dispatch(clearMediaData());
        })
        .catch((error) => {
          console.error(error);
          sentryLog(error);
          dispatch({
            type: USER_UPDATE_STATE_CHANGE,
            data: {
              session: "photoError",
              message: JSON.stringify({
                MAINMESSAGE: error.message,
                CONFIG: JSON.stringify(config),
                METHOD: method,
                URI: uri,
                TYPE: type,
                FORMDATA: JSON.stringify(formData),
              }),
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

export function updateUserData(id, userData, address, token, currentUser) {
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
        foto: null,
        nama_lengkap: userData?.nama_depan + " " + userData?.nama_belakang,
      };

      const url = updateuserdata + "/" + id.toString();
      console.log("updateUserData " + url + " with params and header");
      console.log({ config, params });

      Axios.post(url, params, config)
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
              dispatch({
                type: USER_UPDATE_STATE_CHANGE,
                data: { session: "", message: JSON.stringify(data?.errors) },
              });
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
                  foto: currentUser?.detail_user?.foto
                    ? currentUser?.detail_user?.foto
                    : null,
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

    Axios.get(getbank, config)
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

    Axios.post(url, authData, config)
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

export function register(authData) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: null });
    const params = {
      ...authData,
      device_name: Platform.OS,
    };
    console.log("register with params " + JSON.stringify(params));

    Axios.post(userregister, params)
      .then((response) => {
        console.log(response.data);
        const token = response.data.token;
        if (token !== null && token !== undefined) {
          //dispatch(setNewToken(token));
          dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token });
        } else {
          const data =
            "Tidak bisa mendaftarkan akun baru. Mohon periksa kembali data yang Anda masukkan.";
          dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data });
          //dispatch(clearUserData());
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: error?.message });
      });
  };
}

export function login(email, password, resetPIN) {
  return (dispatch) => {
    dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: null });
    const params = {
      email,
      password,
      device_name: Platform.OS,
    };
    console.log("login with params " + JSON.stringify(params));

    Axios.post(loginlink, params)
      .then((response) => {
        console.log(response.data);
        const token = response.data.token;
        if (token !== null && token !== undefined) {
          //dispatch(setNewToken(token));
          if (resetPIN) {
            dispatch({ type: USER_PROFILE_PIN_STATE_CHANGE, data: null });
            dispatch({ type: USER_PROFILE_LOCK_STATE_CHANGE, data: true });
            dispatch({ type: USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE, data: null });
          }
          dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token });
        } else {
          const data =
            "Username/password salah. Mohon periksa kembali data yang Anda masukkan.";
          dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data });
          //dispatch(clearUserData());
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: USER_AUTH_ERROR_STATE_CHANGE, data: error?.message });
      });
  };
}

export function getCurrentUser(token, storageCurrentUser) {
  return (dispatch) => {
    if (token === undefined || token === null || token === "") {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.get(getcurrentuser, config)
      .then((response) => {
        const data = response.data?.data;
        if (data === undefined || data === null) {
          console.log("getCurrentUser response data is null");
          dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token: null });
          dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token: null });
          dispatch({ type: HISTORY_CLEAR_DATA });
          try {
            readStorageCurrentUser(dispatch, storageCurrentUser);
          } catch (e) {
            console.error(e);
            sentryLog(e);
          }
        } else {
          //console.log(`getCurrentUser token ${token}`, data);
          dispatch({ type: USER_STATE_CHANGE, data });
          dispatch({ type: USER_ADDRESS_STATE_CHANGE, data });
          dispatch({ type: HISTORY_CLEAR_DATA });
          dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token: null });
          dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token: null });
          setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, data);
        }
      })
      .catch((error) => {
        console.log("getcurrentuser error");
        sentryLog(error);
        dispatch({ type: USER_LOGIN_TOKEN_STATE_CHANGE, token: null });
        dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token: null });
        dispatch({ type: HISTORY_CLEAR_DATA });
        readStorageCurrentUser(dispatch, storageCurrentUser);
      });
  };
}

function readStorageCurrentUser(dispatch, storageCurrentUser) {
  if (storageCurrentUser === undefined || storageCurrentUser === null) {
    console.log("storage currentUser also null");
    dispatch({ type: USER_STATE_CHANGE, data: null });
    dispatch({ type: USER_ADDRESS_STATE_CHANGE, data: null });
  } else {
    console.log("reading from storage currentUser");
    dispatch({ type: USER_STATE_CHANGE, data: storageCurrentUser });
    dispatch({
      type: USER_ADDRESS_STATE_CHANGE,
      data: storageCurrentUser,
    });
  }
}

export function setNewToken(token, storageCurrentUser) {
  return (dispatch) => {
    if (token === undefined || token === null || token === "") {
      console.log("redux token set to null");
      dispatch({ type: USER_TOKEN_STATE_CHANGE, token: null });
    } else {
      console.log("redux token set to new", token);
      dispatch({ type: USER_TOKEN_STATE_CHANGE, token });
      dispatch(getCurrentUser(token, storageCurrentUser));
      dispatch(getKeranjang(token));
      setTokenAsync(token);
    }
  };
}
