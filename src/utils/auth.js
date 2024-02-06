import { USER_REGISTER_TOKEN_STATE_CHANGE } from "../../redux/constants";

export function updateReduxUserRegisterToken(token) {
    return (dispatch) => {
      console.log("updateReduxUserRegisterToken", token);
      dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token });
    };
  }