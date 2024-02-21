import Axioss from "../index";
import Axios from "axios";

import { mainhttp, productfetchlink, showproduct } from "../constants/index";
import {
  PRODUCTS_DATA_STATE_CHANGE,
  PRODUCT_ITEM_DATA_STATE_CHANGE,
  PRODUCT_MAX_INDEX_STATE_CHANGE,
  PRODUCT_SEARCH_FILTER_STATE_CHANGE,
  CLEAR_PRODUCT_DATA,
  PRODUCT_FETCH_ERROR_STATE_CHANGE,
  PRODUCTS_DATA_INCREMENT_STATE_CHANGE,
} from "../../redux/constants";
import { productpaginationnumber } from "../constants/index";
import { sentryLog } from "../../sentry";
import { checkNumberEmpty } from "../cart";

export function clearProductData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_PRODUCT_DATA });
  };
}

export const formatProductDescription = (e) => {
  try {
    let str = e.replaceAll("</strong></p>", "#STRONGP#");
    str = str.replaceAll("</p>", "#P#");
    str = str.replaceAll("</li>", "#LI#");
    str = str.replace(/<[^>]*>?/gm, '');
    str = str.replaceAll("&nbsp;", "");
    str = str.replaceAll("&rdquo;", `"`);
    let items = str.split("\n");
    let pieces = [];
    for (let i = 0; i < items?.length; i++) {
      let tag = "p";
      let text = items[i].trim();
      if (text.includes("#LI#")) {
        tag = "li";
        text = text.replaceAll("#LI#", "");
      } else if (text.includes("#STRONGP#")) {
        tag = "strongp";
        text = text.replaceAll("#STRONGP#", "");
      } else {
        text = text.replaceAll("#P#", "");
      }
      text = text.trim();
      if (text !== "") {
        pieces.push({
          tag,
          text,
        });
      }
    }
    return pieces;
  } catch (err) {
    console.error(err);
  }
  return [];
}

export function getProductData(storageProducts, paginationIndex, page) {
  return (dispatch) => {
    try {
      const url = mainhttp + productfetchlink + (page === undefined || page === null ? "" : `?page=${page}`);
      console.log("getProductData", url);
      Axios.get(url)
      .then((response) => {
        //console.log("getProductData response", url, response?.data);
        const products = response?.data?.data;
        if (
          (products === undefined ||
          products === null ||
          products?.length === undefined ||
          products?.length < 1) && checkNumberEmpty(page) <= 1
        ) {
          dispatch({ type: PRODUCT_FETCH_ERROR_STATE_CHANGE, data: "getProductData response null" });
          console.log("getProductData response null", response?.data);
          readStorageProductData(dispatch, storageProducts, paginationIndex, null);
        } else {
          dispatch({ type: PRODUCT_FETCH_ERROR_STATE_CHANGE, data: null });
          if (!(page=== undefined || page === null)) {
            dispatch({ type: PRODUCTS_DATA_INCREMENT_STATE_CHANGE, data: products });
            return;
          }

          /*console.log(`saving all product data to async storage with ${products?.length} items`);
          setObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY, products);*/

          if (products?.length <= productpaginationnumber) {
            dispatch({
              type: PRODUCT_MAX_INDEX_STATE_CHANGE,
              data: 0,
            });
            dispatch({
              type: PRODUCTS_DATA_STATE_CHANGE,
              products,
            });
          } else {
            dispatch({
              type: PRODUCT_MAX_INDEX_STATE_CHANGE,
              data: Math.ceil(products?.length / productpaginationnumber),
            });
            dispatch({
              type: PRODUCTS_DATA_STATE_CHANGE,
              products: products.slice(
                productpaginationnumber * paginationIndex,
                productpaginationnumber * (paginationIndex + 1)
              ),
            });
          }
        } 
      })
      .catch((error) => {
        dispatch({ type: PRODUCT_FETCH_ERROR_STATE_CHANGE, data: error.toString() });
        console.error(error);
        sentryLog(error);
        readStorageProductData(dispatch, storageProducts, paginationIndex);
      });
    } catch (e) {
      dispatch({ type: PRODUCT_FETCH_ERROR_STATE_CHANGE, data: e.toString() });
      console.error(e);
      sentryLog(e);
      readStorageProductData(dispatch, storageProducts, paginationIndex);
    }
  };
}

export function getStorageProductData (storageProducts, paginationIndex) {
  if (paginationIndex === undefined || paginationIndex === null) {
    return;
  }
  return (dispatch) => {
    readStorageProductData(dispatch, storageProducts, paginationIndex);
  };
}

export function updateProductSearchFilter (data) {
  return (dispatch) => {
    if (data === undefined || data === "") {
      dispatch({
        type: PRODUCT_SEARCH_FILTER_STATE_CHANGE,
        data: null,
      });
    } else {
      dispatch({
        type: PRODUCT_SEARCH_FILTER_STATE_CHANGE,
        data,
      });
    }
  }
}

function readStorageProductData (dispatch, storageProducts, paginationIndex) {
  if (storageProducts === undefined || storageProducts === null || storageProducts?.length === undefined || storageProducts?.length < 1) {
    console.log("storage products also null");
    return;
  }

  console.log(`storage products with ${storageProducts?.length} items used`);
  if (storageProducts?.length <= productpaginationnumber) {
    dispatch({
      type: PRODUCT_MAX_INDEX_STATE_CHANGE,
      data: 0,
    });
    dispatch({
      type: PRODUCTS_DATA_STATE_CHANGE,
      products: storageProducts,
    });
  } else {
    dispatch({
      type: PRODUCT_MAX_INDEX_STATE_CHANGE,
      data: Math.floor(storageProducts?.length / productpaginationnumber),
    });
    dispatch({
      type: PRODUCTS_DATA_STATE_CHANGE,
      products: storageProducts.slice(
        productpaginationnumber * paginationIndex,
        productpaginationnumber * (paginationIndex + 1)
      ),
    });
  }
}


export function showProduct(id) {
  return (dispatch) => {
    const url = showproduct + "/" + id.toString();
    console.log("showProduct " + url);
    Axioss.get(url)
      .then((response) => {
        const data = response.data?.data;
        console.log(data);
        if (
          data === undefined ||
          data === null
        ) {
          console.log(`showProduct ${id} is null`);
          return;
        }
        dispatch({ type: PRODUCT_ITEM_DATA_STATE_CHANGE, data });
      })
      .catch((error) => {
        console.error(error);
        sentryLog(error);
      });
  };
}
