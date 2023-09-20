import Axios from "../index";
import { sentryLog } from "../../sentry";
import {
  getkeranjang,
  clearkeranjang,
  postkeranjang,
  deletekeranjang,
  storecheckout,
  localisationID,
  defaultcurrency,
} from "../constants";
import {
  USER_CART_STATE_CHANGE,
  USER_CART_ITEM_STATE_CHANGE,
  USER_CHECKOUT_STATE_CHANGE,
  USER_CART_STATE_ERROR,
  HISTORY_CHECKOUTS_STATE_CHANGE,
  USER_TEMP_CART_STATE_CHANGE,
  USER_TEMP_CART_ITEM_STATE_CHANGE,
  USER_TEMP_CART_NEW_ITEM_CHANGE,
  USER_CHECKOUT_ERROR_STATE_CHANGE,
} from "../../redux/constants";

export function clearCartError() {
  return (dispatch) => {
    console.log("clearCartError");
    dispatch({ type: USER_CART_STATE_ERROR, data: null });
  };
}

export function updateReduxCheckoutError(data) {
  return (dispatch) => {
    console.log("updateReduxCheckoutError", data);
    dispatch({ type: USER_CHECKOUT_ERROR_STATE_CHANGE, data });
  };
}

export function overhaulReduxTempCart(data) {
  return (dispatch) => {
    console.log("overhaulReduxTempCart", data);
    dispatch({ type: USER_TEMP_CART_STATE_CHANGE, data });
  };
}

export function overhaulReduxCart(data) {
  return (dispatch) => {
    console.log("overhaulReduxCart", data);
    dispatch({ type: USER_CART_STATE_CHANGE, data });
  };
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

    console.log("storeCheckout", checkoutJson);
    Axios.post(storecheckout, checkoutJson, config)
      .then((response) => {
        const data = response.data;
        let clearCart = true;
        if (data?.snap_token === undefined || data?.snap_token === null)
          clearCart = false;
        console.log("storeCheckout response", data);
        dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data, clearCart });
        dispatch({ type: USER_CHECKOUT_ERROR_STATE_CHANGE, data: null });
        dispatch({ type: HISTORY_CHECKOUTS_STATE_CHANGE, data: null });
      })
      .catch((error) => {
        console.error(error);
        sentryLog(error);
        dispatch({ type: USER_CHECKOUT_ERROR_STATE_CHANGE, data: error });
        //console.log("storeCheckout error", error?.response?.data?.message);
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
          dispatch({
            type: USER_CART_STATE_ERROR,
            data: "API response undefined",
          });
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

export function addToTempCart(produk_id) {
  return (dispatch) => {
    console.log("addToTempCart", produk_id);
    try {
      dispatch({
        type: USER_TEMP_CART_NEW_ITEM_CHANGE,
        id: produk_id,
        data: 1,
      });
    } catch (e) {
      console.error(e);
    }
  };
}

export function modifyTempCart(produk_id, itemSize) {
  return (dispatch) => {
    console.log("modifyTempCart", produk_id, itemSize);
    try {
      dispatch({
        type: USER_TEMP_CART_ITEM_STATE_CHANGE,
        id: produk_id,
        data: parseInt(itemSize) < 1 ? 0 : parseInt(itemSize),
      });
    } catch (e) {
      console.error(e);
    }
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
          dispatch({
            type: USER_CART_STATE_ERROR,
            data: "API response undefined",
          });
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
          dispatch({
            type: USER_CART_STATE_ERROR,
            data: "API response undefined",
          });
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

export function alterKeranjang(token, tempCart) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    if (
      tempCart === undefined ||
      tempCart === null ||
      tempCart?.length === undefined ||
      tempCart?.length < 1
    ) {
      return;
    }

    let new_array = [];
    for (let i = 0; i < tempCart.length; i++) {
      let id = tempCart[i]?.id;
      let jumlah = tempCart[i]?.jumlah;
      if (
        !(
          id === undefined ||
          id === null ||
          jumlah === undefined ||
          jumlah === null ||
          jumlah < 1
        )
      ) {
        for (let j = 0; j < jumlah; j++) {
          new_array.push(id);
        }
      }
    }

    const params = {
      produk: new_array,
      produk_id: new_array,
    };

    console.log("alterKeranjang", tempCart, new_array);

    Axios.post(clearkeranjang, null, config)
      .then((response) => {
        const data = response.data?.data;
        console.log("clearKeranjang", data);
        if (data === undefined) {
          dispatch({
            type: USER_CART_STATE_ERROR,
            data: "API response undefined",
          });
        } else {
          //dispatch({ type: USER_CART_STATE_CHANGE, data: null });
          Axios.post(postkeranjang, params, config)
            .then((response) => {
              const data = response.data?.data;
              console.log("postKeranjang", data);
              if (data === undefined) {
                dispatch({
                  type: USER_CART_STATE_ERROR,
                  data: "API response undefined",
                });
              } else {
                dispatch({ type: USER_CART_STATE_CHANGE, data });
              }
            })
            .catch((error) => {
              console.log(error);
              sentryLog(error);
              dispatch({ type: USER_CART_STATE_ERROR, data: error.toString() });
            });
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
    if (token === undefined || token === null || token === "") {
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
          dispatch({
            type: USER_CART_STATE_ERROR,
            data: "API response undefined",
          });
        } else {
          dispatch({ type: USER_CART_STATE_CHANGE, data });
          try {
            let tempCartMap = [];
            let produkArray = data?.produk;
            for (let item of produkArray) {
              tempCartMap.push({
                id: item?.id,
                jumlah: parseInt(item?.jumlah),
              });
            }
            dispatch({ type: USER_TEMP_CART_STATE_CHANGE, data: tempCartMap });
          } catch (e) {
            console.error(e);
            dispatch({ type: USER_TEMP_CART_STATE_CHANGE, data: null });
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

export const calculateSaldoAvailable = (saldo, totalPrice) => {
  try {
    if (parseInt(totalPrice) >= parseInt(saldo)) {
      return 0;
    } else {
      return parseInt(saldo) - parseInt(totalPrice);
    }
  } catch (e) {
    console.error(e);
    return checkNumberEmpty(saldo);
  }
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
