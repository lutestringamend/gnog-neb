import {
  PROFILE_FAQ_CHANGE,
  PROFILE_MEDIAKIT_CHANGE,
  PROFILE_TNC_CHANGE,
  PROFILE_PRIVACY_CHANGE,
  PROFILE_CLEAR_DATA,
} from "../constants";

const initialState = {
  content: {
    mediakit: '',
    tnc: '',
    privacy: ''
  },
  faq: [],
};

export const profile = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_FAQ_CHANGE:
      return {
        ...state,
        faq: action.data,
      };
    case PROFILE_MEDIAKIT_CHANGE:
      return {
        ...state,
        content: {...state.content, mediakit: action.data},
      };
    case PROFILE_TNC_CHANGE:
      return {
        ...state,
        content: {...state.content, tnc: action.data},
      };
    case PROFILE_PRIVACY_CHANGE:
      return {
        ...state,
        content: {...state.content, privacy: action.data},
      };
    case PROFILE_CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
