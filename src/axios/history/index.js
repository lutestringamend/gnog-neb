import Axios from "../index";

import {
  getcheckout,
  postpembayaran,
  getpengiriman,
  statuspengiriman,
  statusidpengiriman,
  dashboardhtml,
  cancelcheckout,
  confirmcheckout,
  deletecheckout,
} from "../constants";

import {
  HISTORY_CHECKOUTS_STATE_CHANGE,
  HISTORY_CHECKOUT_STATE_CHANGE,
  HISTORY_DELIVERIES_STATE_CHANGE,
  HISTORY_DELIVERY_STATE_CHANGE,
  HISTORY_DELIVERY_STATUS_STATE_CHANGE,
  HISTORY_DASHBOARD_STATE_CHANGE,
  HISTORY_CLEAR_DATA,
  USER_CHECKOUT_STATE_CHANGE,
  HISTORY_CHECKOUT_PAGE_NUMBER_STATE_CHANGE,
  HISTORY_DELIVERY_PAGE_NUMBER_STATE_CHANGE,
  HISTORY_CHECKOUTS_INCREMENT_CHANGE,
  HISTORY_DELIVERIES_INCREMENT_CHANGE,
} from "../../redux/constants";
import { Platform, ToastAndroid } from "react-native";
import { sentryLog } from "../../sentry";

export function clearHistoryData() {
  return (dispatch) => {
    console.log("clearHistoryData");
    dispatch({ type: HISTORY_CLEAR_DATA });
  };
}

export function clearUserCheckoutData() {
  return (dispatch) => {
    console.log("clearUserCheckoutData");
    dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data: null });
  };
}

export function clearDeliveryStatus() {
  return (dispatch) => {
    console.log("clearDeliveryStatus");
    dispatch({ type: HISTORY_DELIVERY_STATUS_STATE_CHANGE, data: null });
  };
}

export function updateReduxHistoryCheckoutsPageNumber(data) {
  return (dispatch) => {
    console.log("updateReduxHistoryCheckoutsPageNumber", data);
    dispatch({ type: HISTORY_CHECKOUT_PAGE_NUMBER_STATE_CHANGE, data });
  };
}

export function updateReduxHistoryDeliveriesPageNumber(data) {
  return (dispatch) => {
    console.log("updateReduxHistoryDeliveriesPageNumber", data);
    dispatch({ type: HISTORY_DELIVERY_PAGE_NUMBER_STATE_CHANGE, data });
  };
}

export function updateReduxHistoryCheckouts(data) {
  return (dispatch) => {
    console.log("updateReduxHistoryCheckouts", data);
    dispatch({ type: HISTORY_CHECKOUTS_STATE_CHANGE, data });
  };
}

export function updateReduxHistoryDeliveries(data) {
  return (dispatch) => {
    console.log("updateReduxHistoryDeliveries", data);
    dispatch({ type: HISTORY_DELIVERIES_STATE_CHANGE, data });
  };
}

export function clearDashboardHTML(token) {
  return (dispatch) => {
    console.log("clearDashboardHTML");
    dispatch({ type: HISTORY_DASHBOARD_STATE_CHANGE, data: null });
  };
}

export function getStatusPengiriman(token, delivery_id, nomor_resi, slug) {
  return (dispatch) => {
    const params =
      delivery_id === null
        ? {
            nomor_resi,
            slug,
          }
        : null;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const url =
      delivery_id === null
        ? statuspengiriman
        : statusidpengiriman + "/" + delivery_id.toString();

    Axios.get(url, config)
      .then((response) => {
        console.log("getStatusPengiriman with params and header");
        const statusCode = response.data?.rajaongkir?.status?.code;
        if (statusCode === 200) {
          const data = response.data.rajaongkir?.result;
          //console.log(data);
          dispatch({
            type: HISTORY_DELIVERY_STATUS_STATE_CHANGE,
            data,
          });
        } else {
          clearDeliveryStatus();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getDashboardHTML(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    console.log("getDashboardHTML with header " + JSON.stringify(config));
    Axios.get(dashboardhtml, config)
      .then((response) => {
        //console.log(config);
        const data = response?.data;
        //console.log(data);
        dispatch({ type: HISTORY_DASHBOARD_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log("getDashboardHTML error");
        console.log(error);
      });
  };
}

export function getCheckoutItem(checkout_id) {
  return (dispatch) => {
    dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data: null });
    dispatch({ type: HISTORY_CHECKOUT_STATE_CHANGE, id: checkout_id });
  };
}

export function clearDeliveryItem() {
  return (dispatch) => {
    clearDeliveryStatus();
    console.log("clearDeliveryItem");
    dispatch({ type: HISTORY_DELIVERY_STATE_CHANGE, id: null });
  };
}

export function getDeliveryItem(pengiriman_id) {
  return (dispatch) => {
    clearDeliveryStatus();
    console.log("getDeliveryItem for id " + pengiriman_id);
    dispatch({ type: HISTORY_DELIVERY_STATE_CHANGE, id: pengiriman_id });
  };
}

export const confirmCheckout = async (token, checkout_id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const url = confirmcheckout.replace("#ID#", checkout_id);
  console.log("confirmCheckout", url);

  try {
    const response = await Axios.post(url, config)
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        if (Platform.OS == "android") {
          ToastAndroid.show(error.toString(), ToastAndroid.LONG);
        }
        return false;
      });
      if (response?.data === undefined || response?.data?.message === undefined) {
        return false;
      } else {
        return true;
      }
  } catch (e) {
    console.error(e);
    if (Platform.OS == "android") {
      ToastAndroid.show(e.toString(), ToastAndroid.LONG);
    }
    return false;
  }
  
}

export const deleteCheckout = async (token, checkout_id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  /*const url = cancelcheckout.replace("#ID#", checkout_id);
  console.log("cancelCheckout", url);*/
  const params = {
    checkout_id: [checkout_id],
  };

  console.log("deleteCheckout", params);
  try {
    const response = await Axios.post(deletecheckout, params, config)
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        if (Platform.OS == "android") {
          ToastAndroid.show(error.toString(), ToastAndroid.LONG);
        }
        return false;
      });
    if (response?.data === undefined || response?.data?.message === undefined) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    if (Platform.OS == "android") {
      ToastAndroid.show(e.toString(), ToastAndroid.LONG);
    }
    return false;
  }

}

export const cancelCheckout = async (token, checkout_id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const url = cancelcheckout.replace("#ID#", checkout_id);
  console.log("cancelCheckout", url);

  try {
    const response = await Axios.post(url, config)
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        if (Platform.OS == "android") {
          ToastAndroid.show(error.toString(), ToastAndroid.LONG);
        }
        return false;
      });
    if (response?.data === undefined || response?.data?.message === undefined) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    if (Platform.OS == "android") {
      ToastAndroid.show(e.toString(), ToastAndroid.LONG);
    }
    return false;
  }

}

export function postPembayaran(token, checkout_id) {
  return (dispatch) => {
    const params = {
      checkout_id,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data: null });
    Axios.post(postpembayaran, params, config)
      .then((response) => {
        console.log("postPembayaran with params and header");
        //console.log({ params, config });
        console.log(response.data);
        const data = response.data;
        dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getCheckouts(token, pageNumber) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url =
      getcheckout +
      "?page=" +
      (parseInt(pageNumber) > 0 ? pageNumber.toString() : "1");
    console.log("getCheckouts", url);

    Axios.get(url, config)
      .then((response) => {
        const data = response.data.data;
        if (data?.length === undefined || data?.length < 1) {
          dispatch({ HISTORY_CHECKOUT_PAGE_NUMBER_STATE_CHANGE, data: 999 });
        } else {
          let newArray = [];
          for (let a of data) {
            newArray.push(a.id);
          }
          console.log("getCheckout result", url, newArray);
          dispatch({
            type:
              parseInt(pageNumber) < 2
                ? HISTORY_CHECKOUTS_STATE_CHANGE
                : HISTORY_CHECKOUTS_INCREMENT_CHANGE,
            data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getDeliveries(token, pageNumber) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const url =
      getpengiriman +
      "?page=" +
      (parseInt(pageNumber) > 0 ? pageNumber.toString() : "1");
    console.log("getDeliveries", url);

    Axios.get(url, config)
      .then((response) => {
        const data = response.data.data;
        if (data?.length === undefined || data?.length < 1) {
          dispatch({ HISTORY_DELIVERY_PAGE_NUMBER_STATE_CHANGE, data: 999 });
        } else {
          let newArray = [];
          for (let a of data) {
            newArray.push(a.id);
          }
          console.log("getDeliveries result", url, newArray);
          dispatch({
            type:
              parseInt(pageNumber) < 2
                ? HISTORY_DELIVERIES_STATE_CHANGE
                : HISTORY_DELIVERIES_INCREMENT_CHANGE,
            data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
