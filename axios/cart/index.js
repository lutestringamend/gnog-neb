import Axios from "../index";
import { sentryLog } from "../../sentry";
import {
  getkeranjang,
  clearkeranjang,
  postkeranjang,
  deletekeranjang,
  storecheckout,
  localisationID,
  defaultcurrency
} from "../constants";
import {
  USER_CART_STATE_CHANGE,
  USER_CART_ITEM_STATE_CHANGE,
  USER_CHECKOUT_STATE_CHANGE,
  USER_CART_STATE_ERROR,
  HISTORY_CHECKOUTS_STATE_CHANGE
} from "../../redux/constants";
import { setObjectAsync } from "../../components/asyncstorage";
import { ASYNC_HISTORY_CHECKOUT_KEY } from "../../components/asyncstorage/constants";

export function clearCartError() {
  return (dispatch) => {
    console.log("clearCartError");
    dispatch({ type: USER_CART_STATE_ERROR, data: null });
  }
}

export function capitalizeFirstLetter(string) {
  if (string === undefined || string === null || string === "") {
    return "";
  }
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (e) {
    console.error(e);
    return string.toString();
  }
}

export function storeCheckout(token, checkoutJson) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.post(storecheckout, checkoutJson, config)
      .then((response) => {
        console.log("storeCheckout with params and header");
        console.log({ checkoutJson, config });
        const data = response.data;
        let clearCart = true;
        if (data?.snap_token === undefined || data?.snap_token === null) clearCart = false;
        console.log(data)
        dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data, clearCart });
        dispatch({ type: HISTORY_CHECKOUTS_STATE_CHANGE, data: null });
        setObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY, null);
      })
      .catch((error) => {
        console.log(error);
        sentryLog(error);
      });
  };
}

export function deleteKeranjang(token, produk_id, itemSize) {
  return (dispatch) => {
    const params = {
      produk: [produk_id],
      produk_id: [produk_id],
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.post(deletekeranjang, params, config)
      .then((response) => {
        const data = response.data?.data;
        console.log("deleteKeranjang", data);
        if (data === undefined) {
          dispatch({ type: USER_CART_STATE_ERROR, data: "API response undefined" });
        } else {
          if (itemSize > 1 && produk_id > 0) {
            dispatch(postKeranjang(token, produk_id, itemSize - 1));
          } else {
            dispatch({
              type: USER_CART_ITEM_STATE_CHANGE,
              produk_id,
              data: { id: produk_id, jumlah: 0 },
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        dispatch({ type: USER_CART_STATE_ERROR, data: error.toString() });
      });
  };
}

export function postKeranjang(token, produk_id, itemSize) {
  return (dispatch) => {
    let new_array = [];
    for (let i = 0; i < itemSize; i++) {
      new_array.push(produk_id);
    }

    const params = {
      produk: new_array,
      produk_id: new_array,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.post(postkeranjang, params, config)
      .then((response) => {
        const data = response.data?.data;
        console.log("postKeranjang", data);

        if (data === undefined) {
          dispatch({ type: USER_CART_STATE_ERROR, data: "API response undefined" });
        } else {
          dispatch({ type: USER_CART_STATE_CHANGE, data });
        }
      })
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        dispatch({ type: USER_CART_STATE_ERROR, data: error.toString() });
      });
  };
}

export function clearKeranjang(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.post(clearkeranjang, null, config)
      .then((response) => {
        const data = response.data?.data;
        console.log("clearKeranjang", data);
        if (data === undefined) {
          dispatch({ type: USER_CART_STATE_ERROR, data: "API response undefined" });
        } else {
          dispatch({ type: USER_CART_STATE_CHANGE, data: null });
        }
      })
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        dispatch({ type: USER_CART_STATE_ERROR, data: error.toString() });
      });
  };
}

export function getKeranjang(token) {
  return (dispatch) => {
    if (token === undefined || token === null || token === ""){
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.get(getkeranjang, config)
      .then((response) => {
        const data = response.data.data;
        console.log("getKeranjang", data);
        if (data === undefined) {
          dispatch({ type: USER_CART_STATE_ERROR, data: "API response undefined" });
        } else {
          dispatch({ type: USER_CART_STATE_CHANGE, data });
        }
      })
      .catch((error) => {
        console.log(error);
        sentryLog(error);
        dispatch({ type: USER_CART_STATE_ERROR, data: error.toString() });
      });
  };
}

export const formatPrice = (num) => {
  if (checkNumberEmpty(num) > 0) {
    return new Intl.NumberFormat(localisationID, {
      style: "currency",
      currency: defaultcurrency,
      minimumFractionDigits: 0,
    }).format(num);
  } else {
    return "GRATIS";
  }
};

export function checkNumberEmpty(num) {
  if (num === undefined || num === null || num < 0) {
    return 0;
  } else if (isNaN(num)) {
    return parseInt(num);
  } else {
    return num;
  }
}
