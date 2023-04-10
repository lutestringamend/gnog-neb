import {
  HISTORY_CHECKOUTS_STATE_CHANGE,
  HISTORY_CHECKOUT_STATE_CHANGE,
  HISTORY_DELIVERIES_STATE_CHANGE,
  HISTORY_DELIVERY_STATE_CHANGE,
  HISTORY_DELIVERY_STATUS_STATE_CHANGE,
  HISTORY_CLEAR_DATA,
  DELIVERY_MANIFEST_HEADER,
} from "../constants";

const initialState = {
  checkouts: null,
  checkout: null,
  deliveries: null,
  delivery: null,
  deliveryStatus: null,
};

export const history = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_CHECKOUTS_STATE_CHANGE:
      return {
        ...state,
        checkouts: action.data,
        checkout: null,
      };

    case HISTORY_DELIVERIES_STATE_CHANGE:
      return {
        ...state,
        deliveries: action.data,
        delivery: null,
        deliveryStatus: null,
      };
    case HISTORY_CHECKOUT_STATE_CHANGE:
      return {
        ...state,
        checkout: state.checkouts.find(({ id }) => id === action.id),
      };

    case HISTORY_DELIVERY_STATE_CHANGE:
      return {
        ...state,
        delivery: action.id === null ? null : state.deliveries.find(({ id }) => id === action.id),
        deliveryStatus: null,
      };
    case HISTORY_DELIVERY_STATUS_STATE_CHANGE:
      return {
        ...state,
        deliveryStatus:
          action.data === null
            ? null
            : {
                ...action.data,
                manifest: [
                  ...DELIVERY_MANIFEST_HEADER,
                  ...action.data?.manifest,
                ],
              },
      };
    case HISTORY_CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
