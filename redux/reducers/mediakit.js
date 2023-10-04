import {
  MEDIA_KIT_PHOTOS_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_STATE_CHANGE,
  MEDIA_KIT_FONTS_STATE_CHANGE,
  MEDIA_KIT_COLORS_STATE_CHANGE,
  MEDIA_KIT_SIZES_STATE_CHANGE,
  MEDIA_KIT_CLEAR_DATA,
  MEDIA_KIT_PHOTOS_ERROR_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_URI_STATE_CHANGE,
  MEDIA_KIT_WATERMARK_DATA_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_URI_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE,
  MEDIA_KIT_FLYER_MENGAJAK_STATE_CHANGE,
  MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE
} from "../constants";

const initialState = {
  photos: null,
  photosUri: [],
  flyerMengajak: null,
  videos: null,
  videosUri: [],
  videosMengajak: null,
  fonts: [],
  colors: [],
  sizes: [],
  photoError: null,
  videoError: null,
  watermarkData: null,
};

export const mediakit = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_KIT_WATERMARK_DATA_STATE_CHANGE:
      return {
        ...state,
        watermarkData: action.data,
      };
    case MEDIA_KIT_PHOTOS_STATE_CHANGE:
      return {
        ...state,
        photos: action.data,
      };
    case MEDIA_KIT_PHOTOS_URI_STATE_CHANGE:
      return {
        ...state,
        photosUri: action.data,
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
    case MEDIA_KIT_FLYER_MENGAJAK_STATE_CHANGE:
      return {
        ...state,
        flyerMengajak: action.data,
    };
    case MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE:
      return {
        ...state,
        videosMengajak: action.data,
    };
    case MEDIA_KIT_VIDEOS_URI_STATE_CHANGE:
      return {
        ...state,
        videosUri: action.data,
      };
      case MEDIA_KIT_VIDEOS_ERROR_STATE_CHANGE:
        return {
          ...state,
          videoError: action.data,
        }
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
