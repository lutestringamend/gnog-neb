import {
  HOME_BANNER_STATE_CHANGE,
  HOME_SLIDER_STATE_CHANGE,
  HOME_CLEAR_DATA,
  HOME_PDF_STATE_CHANGE
} from "../constants";

const initialState = {
  sliders: [],
  banners: [],
  pdfFiles: null,
};

export const home = (state = initialState, action) => {
  switch (action.type) {
    case HOME_SLIDER_STATE_CHANGE:
      return {
        ...state,
        sliders: action.data,
      };
    case HOME_BANNER_STATE_CHANGE:
      return {
        ...state,
        banners: action.data,
      };
    case HOME_PDF_STATE_CHANGE:
      return {
        ...state,
        pdfFiles: action.data,
      };
    case HOME_CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
