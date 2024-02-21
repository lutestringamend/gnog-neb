import Axios from "../index";

import { finalblognumber, getblog, showblog } from "../constants";

import {
  BLOG_STATE_CHANGE,
  BLOG_STATE_INCREMENT_CHANGE,
  BLOG_PAGE_NUMBER_STATE_CHANGE,
  BLOG_ITEM_STATE_CHANGE,
  BLOG_CLEAR_DATA,
} from "../../redux/constants";

export function clearBlogData() {
  return (dispatch) => {
    console.log("clearBlogData");
    dispatch({ type: BLOG_CLEAR_DATA });
  };
}

export function getBlog(pageNumber) {
  return (dispatch) => {
    const url =
      getblog +
      "?page=" +
      (parseInt(pageNumber) > 0 ? pageNumber.toString() : "1");
    console.log("getBlog", url);

    Axios.get(url)
      .then((response) => {
        //console.log(config);
        const data = response.data.data;
        console.log("receiving data", data?.length);
        if (
          data === null ||
          data === undefined ||
          data?.length === undefined ||
          data?.length < 1
        ) {
          dispatch({
            type: BLOG_PAGE_NUMBER_STATE_CHANGE,
            data: finalblognumber,
          });
        } else {
          if (parseInt(pageNumber) > 1) {
            dispatch({ type: BLOG_STATE_INCREMENT_CHANGE, data });
            dispatch({
              type: BLOG_PAGE_NUMBER_STATE_CHANGE,
              data: parseInt(pageNumber),
            });
          } else {
            dispatch({ type: BLOG_STATE_CHANGE, data });
            dispatch({ type: BLOG_PAGE_NUMBER_STATE_CHANGE, data: 1 });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function showBlog(id) {
  if (id === null) {
    return;
  }

  return (dispatch) => {
    const url = showblog + "/" + id.toString();
    console.log("showBlog " + url);

    Axios.get(url)
      .then((response) => {
        const data = response.data.data;
        //console.log(data);
        dispatch({ type: BLOG_ITEM_STATE_CHANGE, id, data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
