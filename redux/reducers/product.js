import {
  PRODUCTS_DATA_STATE_CHANGE,
  PRODUCT_ITEM_DATA_STATE_CHANGE,
  PRODUCTS_DATA_INCREMENT_STATE_CHANGE,
  CLEAR_PRODUCT_DATA,
  PRODUCT_MAX_INDEX_STATE_CHANGE,
  PRODUCT_SEARCH_FILTER_STATE_CHANGE,
  PRODUCT_FETCH_ERROR_STATE_CHANGE,
} from "../constants";

const initialState = {
  products: [],
  productItems: [],
  productError: null,
  maxIndex: 0,
  searchFilter: null,
};

export const product = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCTS_DATA_STATE_CHANGE:
      return {
        ...state,
        products: action.products,
      };
    case PRODUCTS_DATA_INCREMENT_STATE_CHANGE:
      return {
        ...state,
        products: [...state.products].concat(action.data),
      };  
  case PRODUCT_FETCH_ERROR_STATE_CHANGE:
      return {
        ...state,
        productError: action.data,
      };
    case PRODUCT_ITEM_DATA_STATE_CHANGE:
      return {
        ...state,
        productItems: [...state.productItems, action.data],
      };
    case PRODUCT_MAX_INDEX_STATE_CHANGE:
      return {
        ...state,
        maxIndex: action.data ? action.data : 0,
      };
    case PRODUCT_SEARCH_FILTER_STATE_CHANGE:
      return {
        ...state,
        searchFilter:
          action.data === undefined ||
          action.data === null ||
          action.data === ""
            ? null
            : action.data,
      };
    case CLEAR_PRODUCT_DATA:
      return initialState;
    default:
      return state;
  }
};
