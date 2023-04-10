import Axios from "../index";
import {
  getkeranjang,
  clearkeranjang,
  postkeranjang,
  deletekeranjang,
  storecheckout
} from "../constants";
import {
  USER_CART_STATE_CHANGE,
  USER_CART_ITEM_STATE_CHANGE,
  USER_CHECKOUT_STATE_CHANGE
} from "../../redux/constants";

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
        if (data.snap_token === undefined || data.snap_token === null) clearCart = false;
        console.log(data)
        dispatch({ type: USER_CHECKOUT_STATE_CHANGE, data, clearCart })
      })
      .catch((error) => {
        console.log(error);
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
        console.log("deleteKeranjang with params and header:");
        console.log({ params, config });
        const data = response.data.data;
        if (data) {
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
        console.log("postKeranjang with params and header:");
        console.log({ params, config });
        const data = response.data.data;
        if (data !== undefined) {
          dispatch({ type: USER_CART_STATE_CHANGE, data });
        }
      })
      .catch((error) => {
        console.log(error);
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
        console.log("clearKeranjang with header:");
        console.log(config);
        const data = response.data.data;
        if (data) {
          dispatch({ type: USER_CART_STATE_CHANGE, data: null });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getKeranjang(token) {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    Axios.get(getkeranjang, config)
      .then((response) => {
        console.log("getKeranjang with header");
        const data = response.data.data;
        if (data !== undefined) {
          dispatch({ type: USER_CART_STATE_CHANGE, data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
