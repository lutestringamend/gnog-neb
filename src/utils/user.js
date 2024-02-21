import { USER_MAIN_MODAL_STATE_CHANGE } from "../redux/constants";

export function updateReduxUserMainModal(data) {
    return (dispatch) => {
      console.log("updateReduxUserMainModal", data);
      dispatch({ type: USER_MAIN_MODAL_STATE_CHANGE, data });
    };
  }