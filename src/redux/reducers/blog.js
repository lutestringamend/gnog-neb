import {
  BLOG_STATE_CHANGE,
  BLOG_STATE_INCREMENT_CHANGE,
  BLOG_PAGE_NUMBER_STATE_CHANGE,
  BLOG_ITEM_STATE_CHANGE,
  BLOG_CLEAR_DATA,
} from "../constants";

const initialState = {
  blogs: null,
  blogItems: [],
  pageNumber: 0,
};

export const blog = (state = initialState, action) => {
  switch (action.type) {
    case BLOG_STATE_CHANGE:
      return {
        ...state,
        blogs: action.data,
      };
    case BLOG_STATE_INCREMENT_CHANGE:
      return {
        ...state,
        blogs: [...state.blogs].concat(action.data),
      };
    case BLOG_PAGE_NUMBER_STATE_CHANGE:
      return {
        ...state,
        pageNumber: action.data,
      };
    case BLOG_ITEM_STATE_CHANGE:
      return {
        ...state,
        blogItems: [...state.blogItems, action.data],
      };
    /*case BLOG_ITEM_STATE_CHANGE:
      return {
        ...state,
        blogItems: state.blogItems.map((item) =>
          item.id === action.id ? action.data : item
        ),
      };*/
    case BLOG_CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
