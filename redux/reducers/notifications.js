import {
  NOTIFICATIONS_NEW_STATE_CHANGE,
  NOTIFICATIONS_ARRAY_OVERHAUL_CHANGE,
  CLEAR_NOTIFICATIONS_DATA,
} from "../constants";

const initialState = {
  notificationsArray: null,
};

export const notifications = (state = initialState, action) => {
  if (
    action === undefined ||
    action === null ||
    action?.data === undefined ||
    action?.type === undefined ||
    action?.data === null ||
    action?.type === null
  ) {
    return state;
  }
  switch (action.type) {
    case NOTIFICATIONS_NEW_STATE_CHANGE:
      return {
        ...state,
        notificationsArray: [action?.data, ...state.notificationsArray],
      };
    case NOTIFICATIONS_ARRAY_OVERHAUL_CHANGE:
      return {
        ...state,
        notificationsArray: action.data,
      };
    case CLEAR_NOTIFICATIONS_DATA:
      return initialState;
    default:
      return state;
  }
};
