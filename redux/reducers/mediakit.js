import {
  MEDIA_KIT_PHOTOS_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_STATE_CHANGE,
  MEDIA_KIT_FONTS_STATE_CHANGE,
  MEDIA_KIT_COLORS_STATE_CHANGE,
  MEDIA_KIT_SIZES_STATE_CHANGE,
  MEDIA_KIT_CLEAR_DATA,
  MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE
} from "../constants";

const initialState = {
  photos: [],
  videos: [],
  fonts: [],
  colors: [],
  sizes: [],
  photoError: null,
};

export const mediakit = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_KIT_PHOTOS_STATE_CHANGE:
      return {
        ...state,
        photos: action.data,
      };
    case MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE:
      return {
        ...state,
        photoError: action.data,
      }
    case MEDIA_KIT_VIDEOS_STATE_CHANGE:
      return {
        ...state,
        videos: action.data,
    };
    case MEDIA_KIT_FONTS_STATE_CHANGE:
      return {
        ...state,
        fonts: action.data,
    };
    case MEDIA_KIT_COLORS_STATE_CHANGE:
      return {
        ...state,
        colors: action.data,
    };
    case MEDIA_KIT_SIZES_STATE_CHANGE:
      return {
        ...state,
        sizes: action.data,
    };
    case MEDIA_KIT_CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
