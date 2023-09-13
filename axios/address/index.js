import Axios from "../index";

import {
  USER_ADDRESS_STATE_CLEAR,
  USER_ADDRESS_UPDATE_STATE_CHANGE,
  USER_RAJAONGKIR_STATE_CHANGE,
} from "../../redux/constants";
import { updateuserdata, rajaongkirAPI, updatealamat } from "../constants";
import { getCurrentUser } from "../user";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../../components/asyncstorage";
import {
  ASYNC_RAJAONGKIR_KECAMATAN_KEY,
  ASYNC_RAJAONGKIR_KOTA_KEY,
  ASYNC_RAJAONGKIR_PROVINSI_KEY,
} from "../../components/asyncstorage/constants";

export function clearAddressData() {
  return (dispatch) => {
    console.log("clearAddressData");
    dispatch({ type: USER_ADDRESS_STATE_CLEAR });
  };
}

export const updateReduxRajaOngkirWithKey = (key, data) => {
  return (dispatch) => {
    console.log("updateReduxRajaOngkirWithKey", key);
    dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data, key });
  };
};

export function changeAddress(addresses, id, newAddress) {
  if (
    addresses === undefined ||
    addresses === null ||
    addresses?.length === undefined ||
    addresses?.length < 1
  ) {
    return addresses;
  }
  let newAddresses = [];
  for (let address of addresses) {
    if (address?.id === id) {
      if (!(newAddress === undefined || newAddress === null)) {
        newAddresses.unshift(newAddress);
      }
    } else {
      newAddresses.unshift(address);
    }
  }
  return newAddresses;
}

export function clearRajaOngkir(clearKota, clearKecamatan) {
  return (dispatch) => {
    if (clearKota) {
      dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data: null, key: "kota" });
    }
    if (clearKecamatan) {
      dispatch({
        type: USER_RAJAONGKIR_STATE_CHANGE,
        data: null,
        key: "kecamatan",
      });
    }
  };
}

export const updateUserAlamat = async (token, userId, address) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const params = {
    uuid: address?.id ? address?.id : "",
    nama_depan: address?.nama_depan ? address?.nama_depan : "",
    nama_belakang: address?.nama_belakang ? address?.nama_belakang : "",
    nomor_telp: address?.nomor_telp ? address?.nomor_telp : "",
    alamat: address?.alamat ? address?.alamat : "",
    kode_pos: address?.kode_pos ? address?.kode_pos : "",
    provinsi_id : address?.provinsi_id ? address?.provinsi_id : "",
    kota_id : address?.kota_id ? address?.kota_id : "",
    kecamatan_id : address?.kecamatan_id ? address?.kecamatan_id : "",
    lat : address?.lat ? address?.lat : "",
    long : address?.long ? address?.long : "",
  }

  const url = updatealamat + "/" + userId.toString();
  console.log("updateUserAlamat", url, params);

  try {
    const response = await Axios.post(url, address, config).catch((error) => {
      console.log(error);
      sentryLog(error);
      return {
        response: null,
        error: error.toString(),
      };
    });
    console.log("updateUserAlamat response", response);
    return {
      response,
      error,
    };
  } catch (e) {
    console.log(e);
    sentryLog(e);
    return {
      response: null,
      error: e.toString(),
    };
  }
};

export const fetchRajaOngkir = async (token, key, param, id) => {
  if (
    token === undefined ||
    token === null ||
    key === undefined ||
    key === null
  ) {
    return null;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    let url = rajaongkirAPI + "/" + key.toString();
    if (
      !(
        param === undefined ||
        param === null ||
        id === undefined ||
        id === null
      )
    ) {
      url += "?" + param.toString() + "=" + id.toString();
    }
    console.log("fetchRajaOngkir", url);

    const response = await Axios.get(url, config).catch((error) => {
      console.log(error);
      sentryLog(error);
    });

    const data = response?.data?.data;
    if (key === "provinsi") {
      await setObjectAsync(ASYNC_RAJAONGKIR_PROVINSI_KEY, data);
      console.log("storage provinsi saved", data);
      return null;
    } else if (key === "kota") {
      let storageKota = await getObjectAsync(ASYNC_RAJAONGKIR_KOTA_KEY);
      let newArray = [];
      let newItem = {
        provinsi_id: id,
        data,
      };
      if (
        !(
          storageKota === undefined ||
          storageKota === null ||
          storageKota?.length === undefined ||
          storageKota?.length < 1
        )
      ) {
        for (let i = 0; i < storageKota?.length; i++) {
          if (storageKota[i]?.provinsi_id !== id) {
            newArray.push(storageKota[i]);
          }
        }
      }
      newArray.push(newItem);
      await setObjectAsync(ASYNC_RAJAONGKIR_KOTA_KEY, newArray);
      console.log("storage kota saved", newArray);
      return data;
    } else if (key === "kecamatan") {
      let storageKota = await getObjectAsync(ASYNC_RAJAONGKIR_KECAMATAN_KEY);
      let newArray = [];
      let newItem = {
        kota_id: id,
        data,
      };
      if (
        !(
          storageKota === undefined ||
          storageKota === null ||
          storageKota?.length === undefined ||
          storageKota?.length < 1
        )
      ) {
        for (let i = 0; i < storageKota?.length; i++) {
          if (storageKota[i]?.kota_id !== id) {
            newArray.push(storageKota[i]);
          }
        }
      }
      newArray.push(newItem);
      await setObjectAsync(ASYNC_RAJAONGKIR_KECAMATAN_KEY, newArray);
      console.log("storage kecamatan saved", newArray);
      return data;
    }
  } catch (e) {
    console.error(e);
    sentryLog(e);
  }
  return null;
};

export function callRajaOngkir(token, key, param, id) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    let url = rajaongkirAPI + "/" + key.toString();
    if (
      !(
        param === undefined ||
        param === null ||
        id === undefined ||
        id === null
      )
    ) {
      url += "?" + param.toString() + "=" + id.toString();
    }
    console.log("callRajaOngkir", url);

    Axios.get(url, config)
      .then((response) => {
        const data = response.data.data;
        //console.log(data);
        dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data, key });
        if (key === "provinsi" || key === "kota") {
          dispatch({
            type: USER_RAJAONGKIR_STATE_CHANGE,
            data: null,
            key: "kecamatan",
          });
        }
        if (key === "provinsi") {
          dispatch({
            type: USER_RAJAONGKIR_STATE_CHANGE,
            data: null,
            key: "kota",
          });
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
      bank_id: currentUser?.detail_user?.bank?.id,
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
