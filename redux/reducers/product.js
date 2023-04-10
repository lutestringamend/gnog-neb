import {
  PRODUCTS_DATA_STATE_CHANGE,
  PRODUCT_ITEM_DATA_STATE_CHANGE,
  CLEAR_PRODUCT_DATA,
} from "../constants";

const initialState = {
  products: [],
  productItems: [],
};

export const product = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCTS_DATA_STATE_CHANGE:
      return {
        ...state,
        products: action.products,
      };
    case PRODUCT_ITEM_DATA_STATE_CHANGE:
      return {
        ...state,
        productItems: [...state.productItems, action.data],
      };
    case CLEAR_PRODUCT_DATA:
      return initialState;
    default:
      return state;
  }
};
