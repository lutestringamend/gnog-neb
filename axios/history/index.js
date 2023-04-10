import Axios from "../index";

import {
  getcheckout,
  postpembayaran,
  getpengiriman,
  statuspengiriman,
  statusidpengiriman,
  dashboardhtml,
} from "../constants";

import {
  HISTORY_CHECKOUTS_STATE_CHANGE,
  HISTORY_CHECKOUT_STATE_CHANGE,
  HISTORY_DELIVERIES_STATE_CHANGE,
  HISTORY_DELIVERY_STATE_CHANGE,
  HISTORY_DELIVERY_STATUS_STATE_CHANGE,
  HISTORY_DASHBOARD_STATE_CHANGE,
  HISTORY_CLEAR_DATA,
  USER_CHECKOUT_STATE_CHANGE
} from "../../redux/constants";

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

export function clearDashboardHTML(token) {
  return (dispatch) => {
    console.log("clearDashboardHTML");
    dispatch({ type: HISTORY_DASHBOARD_STATE_CHANGE, data: null });
  };
}


export function getStatusPengiriman(token, delivery_id, nomor_resi, slug) {
  return (dispatch) => {

    const params = delivery_id === null ? {
      nomor_resi,
      slug,
    } : null;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    const url = delivery_id === null ? statuspengiriman : (statusidpengiriman + "/" + delivery_id.toString())

    Axios.get(
      url,
      config
    )
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
    console.log("clearDeliveryItem")
    dispatch({ type: HISTORY_DELIVERY_STATE_CHANGE, id: null });
  };
}

export function getDeliveryItem(pengiriman_id) {
  return (dispatch) => {
    clearDeliveryStatus();
    console.log("getDeliveryItem for id " + pengiriman_id)
    dispatch({ type: HISTORY_DELIVERY_STATE_CHANGE, id: pengiriman_id });
  };
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

export function getCheckouts(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.get(getcheckout, config)
      .then((response) => {
        console.log("getCheckouts with header");
        //console.log(config);
        const data = response.data.data;
        dispatch({ type: HISTORY_CHECKOUTS_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getDeliveries(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.get(getpengiriman, config)
      .then((response) => {
        console.log("getPengiriman with header");
        //console.log(config);
        const data = response.data.data;
        dispatch({ type: HISTORY_DELIVERIES_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
