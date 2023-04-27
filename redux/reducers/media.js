import {
  MEDIA_PROFILE_PICTURE_STATE_CHANGE,
  MEDIA_DOWNLOAD_STATE_CHANGE,
  MEDIA_CLEAR_DATA,
  MEDIA_WATERMARK_LAYOUT_STATE_CHANGE,
  MEDIA_WATERMARK_VIDEOS_STATE_CHANGE,
} from "../constants";

const initialState = {
  profilePicture: null,
  photoDownload: null,
  watermarkLayout: null,
  watermarkVideos: [],
};

export const media = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_PROFILE_PICTURE_STATE_CHANGE:
      return {
        ...state,
        profilePicture: action.data,
      };
    case MEDIA_DOWNLOAD_STATE_CHANGE:
      return {
        ...state,
        photoDownload: action.data,
      };
    case MEDIA_WATERMARK_LAYOUT_STATE_CHANGE:
      return {
        ...state,
        watermarkLayout: action.data,
      };
    case MEDIA_WATERMARK_VIDEOS_STATE_CHANGE:
      return {
        ...state,
        watermarkVideos:
          state.watermarkVideos?.length === undefined ||
          state.watermarkVideos?.length < 1
            ? [action.data]
            : state.watermarkVideos.map((item) =>
                item.id === action.id
                  ? {
                      id: action.id,
                      rawUri:
                        action.rawUri === null && item.rawUri !== null
                          ? item.rawUri
                          : action.rawUri,
                      uri:
                        action.uri === null && item.uri !== null
                          ? item.uri
                          : action.uri,
                    }
                  : item
              ),
      };
    case MEDIA_CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
