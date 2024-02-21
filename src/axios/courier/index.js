import Axios from "../index";

import { masterkurirAPI, getkurirdata } from "../constants";

import {
  USER_MASTERKURIR_STATE_CHANGE,
  USER_RAJAONGKIR_STATE_CHANGE,
  USER_COURIERS_STATE_CHANGE
} from "../../redux/constants";
import { sentryLog } from "../../sentry";

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

    console.log("getKurirData request", map);
    Axios.post(getkurirdata, map, config)
      .then((response) => {
        try {
          console.log("getKurirData response", response);
          const data = response.data?.data?.costs;
          if (data === undefined) {
            dispatch({ type: USER_COURIERS_STATE_CHANGE, data: null });
          } else {
            dispatch({ type: USER_COURIERS_STATE_CHANGE, data });
          }
        } catch (e) {
          console.error(e);
          sentryLog(e);
          dispatch({ type: USER_COURIERS_STATE_CHANGE, data: null });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: USER_COURIERS_STATE_CHANGE, data: null });
      });
  };
}


