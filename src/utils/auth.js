import { userLogout } from "../../axios/user";
import { USER_REGISTER_TOKEN_STATE_CHANGE } from "../../redux/constants";

export function updateReduxUserRegisterToken(token) {
    return (dispatch) => {
      console.log("updateReduxUserRegisterToken", token);
      dispatch({ type: USER_REGISTER_TOKEN_STATE_CHANGE, token });
    };
  }

  export const userLogOut = async (props, username) => {
    try {
      await userLogout(username);
      props.setNewToken(null, null);
      props.clearUserData(true);
    } catch (e) {
      sentryLog(e);
    }
  };