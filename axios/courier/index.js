import Axios from "../index";

import { masterkurirAPI, getkurirdata } from "../constants";

import {
  USER_MASTERKURIR_STATE_CHANGE,
  USER_RAJAONGKIR_STATE_CHANGE,
  USER_COURIERS_STATE_CHANGE
} from "../../redux/constants";

export function clearCourierData() {
  return (dispatch) => {
    console.log("clearCourierData");
    dispatch({ type: USER_MASTERKURIR_STATE_CHANGE, data: [] });
    dispatch({ type: USER_RAJAONGKIR_STATE_CHANGE, data: null });
    dispatch({ type: USER_COURIERS_STATE_CHANGE, data: [] });
  };
}

export function callMasterkurir(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.get(masterkurirAPI, config)
      .then((response) => {
        console.log("callMasterkurir with header");
        //console.log(config);
        const data = response.data?.data;
        dispatch({ type: USER_MASTERKURIR_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getKurirData(token, map) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.post(getkurirdata, map, config)
      .then((response) => {
        console.log("getKurirData with header");
        //console.log(config);
        const data = response.data?.data?.costs;
        console.log(response);
        dispatch({ type: USER_COURIERS_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: USER_COURIERS_STATE_CHANGE, data: null });
      });
  };
}


