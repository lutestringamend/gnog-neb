import Axios from "../index";

import {
  USER_ADDRESS_STATE_CLEAR,
  USER_ADDRESS_UPDATE_STATE_CHANGE,
  USER_RAJAONGKIR_STATE_CHANGE,
} from "../../redux/constants";
import { updateuserdata, rajaongkirAPI } from "../constants";
import { getCurrentUser } from "../user";

export function clearAddressData() {
  return (dispatch) => {
    console.log("clearAddressData");
    dispatch({ type: USER_ADDRESS_STATE_CLEAR });
  };
}

export function clearRajaOngkir(clearKota, clearKecamatan) {
  return (dispatch) => {
    if (clearKota) {
      dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data: null, key: "kota" });
    }
    if (clearKecamatan) {
      dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data: null, key: "kecamatan" });
    }
  };
}

export function callRajaOngkir(token, key, param, id) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    
    let url = rajaongkirAPI + "/" + key.toString();
    if (id !== null && param !== null) {
      url += "?" + param.toString() + "=" + id.toString();
    }
    console.log("callRajaOngkir " + url + " with header");

    Axios.get(url, config)
      .then((response) => {
        const data = response.data.data;
        //console.log(data);
        dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data, key });
        if (key === "provinsi" || key === "kota") {
          dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data: null, key: "kecamatan" });
        }
        if (key === "provinsi") {
          dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data: null, key: "kota" });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_ADDRESS_UPDATE_STATE_CHANGE,
          data: { session: "", message: error?.message },
        });
      });
  };
}

export function updateUserAddressData(currentUser, address, token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const params = {
      ...address,
      nama_lengkap: address.nama_depan + " " + address.nama_belakang,
      jenis_kelamin: currentUser?.detail_user?.jenis_kelamin,
      tanggal_lahir: currentUser?.detail_user?.tanggal_lahir,
      nomor_rekening: currentUser?.detail_user?.nomor_rekening,
      bank: currentUser?.detail_user?.bank,
      cabang_bank: currentUser?.detail_user?.cabang_bank,
    };
    
    const url = updateuserdata + "/" + currentUser?.id.toString();
    console.log("updateUserData " + url + " with params and header");
    console.log({ config, params });

    Axios.post(url, params, config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        dispatch({ type: USER_ADDRESS_UPDATE_STATE_CHANGE, data: data });
        if (data?.session === "success") {
          dispatch(getCurrentUser(token));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: USER_ADDRESS_UPDATE_STATE_CHANGE,
          data: { session: "", message: error?.message },
        });
      });
  };
}
