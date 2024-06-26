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
  MEDIA_KIT_VIDEOS_MENGAJAK_STATE_CHANGE,
  MEDIA_KIT_PHOTOS_MULTIPLE_SAVE_STATE_CHANGE,
  MEDIA_KIT_TUTORIALS_STATE_CHANGE,
  MEDIA_KIT_FLYER_SELECTION_STATE_CHANGE,
  MEDIA_KIT_HOME_STATE_CHANGE,
  MEDIA_KIT_PENJELASAN_BISNIS_STATE_CHANGE,
} from "../constants";

const initialState = {
  home: null,
  photos: null,
  photosUri: [],
  flyerMengajak: null,
  flyerSelection: [],
  videos: null,
  videosUri: [],
  videosMengajak: null,
  tutorials: null,
  penjelasanBisnis: null,
  fonts: [],
  colors: [],
  sizes: [],
  photosMultipleSave: {
    success: false,
    error: null,
  },
  photoError: null,
  videoError: null,
  watermarkData: null,
};

export const mediakit = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_KIT_HOME_STATE_CHANGE:
      return {
        ...state,
        home: action.data,
      };
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
    case MEDIA_KIT_FLYER_SELECTION_STATE_CHANGE:
      return {
        ...state,
        flyerSelection: action.data,
    };
    case MEDIA_KIT_PHOTOS_MULTIPLE_SAVE_STATE_CHANGE:
      return {
        ...state,
        photosMultipleSave: action.data,
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
    case MEDIA_KIT_TUTORIALS_STATE_CHANGE:
      return {
        ...state,
        tutorials: action.data,
    };
    case MEDIA_KIT_PENJELASAN_BISNIS_STATE_CHANGE:
      return {
        ...state,
        penjelasanBisnis: action.data,
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
