import Axios from "../index";

import { productfetchlink, showproduct } from "../constants/index";

import {
  PRODUCTS_DATA_STATE_CHANGE,
  PRODUCT_ITEM_DATA_STATE_CHANGE,
  CLEAR_DATA,
} from "../../redux/constants";
import { setObjectAsync } from "../../components/asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../../components/asyncstorage/constants";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function getProductData(storageProducts) {
  return (dispatch) => {
    console.log('getProductData');
    Axios.get(productfetchlink)
      .then((response) => {
        //console.log(response.data);
        const products = response.data.data;
        dispatch({
          type: PRODUCTS_DATA_STATE_CHANGE,
          products,
        });
        setObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY, products);
      })
      .catch((error) => {
        console.log("getProductData error", error);
        if (storageProducts !== null && storageProducts !== undefined) {
          console.log("storage products array read instead");
          dispatch({
            type: PRODUCTS_DATA_STATE_CHANGE,
            products: storageProducts,
          });
        }
      });
  };
}

export function showProduct(id) {
  return (dispatch) => {
    const url = showproduct + "/" + id.toString();
    console.log('showProduct ' + url);
    Axios.get(url)
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        dispatch({ type: PRODUCT_ITEM_DATA_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.log("showProduct error");
        console.log(error);
      });
  };
}
