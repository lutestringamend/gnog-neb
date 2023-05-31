import Axios from "../index";

import { productfetchlink, showproduct } from "../constants/index";

import {
  PRODUCTS_DATA_STATE_CHANGE,
  PRODUCT_ITEM_DATA_STATE_CHANGE,
  PRODUCT_MAX_INDEX_STATE_CHANGE,
  PRODUCT_SEARCH_FILTER_STATE_CHANGE,
  CLEAR_PRODUCT_DATA,
} from "../../redux/constants";
import { getObjectAsync, setObjectAsync } from "../../components/asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../../components/asyncstorage/constants";
import { productpaginationnumber } from "../constants/index";
import { sentryLog } from "../../sentry";

export function clearProductData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_PRODUCT_DATA });
  };
}

export function getProductData(storageProducts, paginationIndex) {
  return (dispatch) => {
    console.log("getProductData");
    Axios.get(productfetchlink)
      .then((response) => {
        //console.log(response.data);
        const products = response.data?.data;
        if (
          products === undefined ||
          products === null ||
          products?.length === undefined ||
          products?.length < 1
        ) {
          console.log("getProductData is null");
          readStorageProductData(dispatch, storageProducts, paginationIndex, null);
        } else {
          console.log(`saving all product data to async storage with ${products?.length} items`);
          setObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY, products);

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
        console.log("getProductData error", error.toJSON());
        sentryLog(error);
        readStorageProductData(dispatch, storageProducts, paginationIndex);
      });
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
    Axios.get(url)
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
        console.log(`showProduct ${id} is error`, error.toJSON());
        sentryLog(error);
      });
  };
}
