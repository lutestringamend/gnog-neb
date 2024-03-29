import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  eliminateSpaceFromString,
  resetPassword,
  setAuthData,
} from "../../../axios/user";
import { colors, staticDimensions } from "../../styles/base";
import { getObjectAsync } from "../..//asyncstorage";
import { ASYNC_USER_PREVIOUS_USERNAME } from "../../asyncstorage/constants";
import TextInputLabel from "../textinputs/TextInputLabel";
import EmptySpinner from "../empty/EmptySpinner";

function LoginBox(props) {
  const [previousUsername, setPreviousUsername] = useState(null);
  const { userExist, resetPIN, errors } = props;

  useEffect(() => {
    checkAsyncPreviousUsername();
  }, []);

  const checkAsyncPreviousUsername = async () => {
    const storagePreviousUsername = await getObjectAsync(
      ASYNC_USER_PREVIOUS_USERNAME
    );
    if (
      storagePreviousUsername === undefined ||
      storagePreviousUsername === null ||
      storagePreviousUsername === ""
    ) {
      setPreviousUsername("");
      return;
    }
    setPreviousUsername(storagePreviousUsername);
    props.setAuthData({ ...props.authData, email: storagePreviousUsername });
  };

  const checkInputUsername = () => {
    const email = eliminateSpaceFromString(props.authData?.email);
    props.setAuthData({ ...props.authData, email });
  };

  if (previousUsername === null) {
    return (
      <EmptySpinner />
    );
  }

  return (
    <View style={styles.container}>
      <TextInputLabel
        label="No Handphone / Email / Username"
        placeholder="08xxxxxx"
        value={props.authData?.email ? props.authData?.email : ""}
        error={errors?.email}
        onChangeText={(email) =>
          props.setAuthData({ ...props.authData, email })
        }
        onEndEditing={() => checkInputUsername()}
        verified={userExist && !resetPIN}
        shortVerified
      />
      {userExist || resetPIN ? (
        <View style={styles.containerVertical}>
          <TextInputLabel
            label="Password"
            secureTextEntry
            error={errors?.password}
            value={props.authData?.password ? props.authData?.password : ""}
            onChangeText={(password) =>
              props.setAuthData({ ...props.authData, password })
            }
          />
          <TouchableOpacity
            style={styles.containerReset}
            onPress={() => resetPassword()}
          >
            <Text allowFontScaling={false} style={styles.textChange}>
              Lupa Password?
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerReset: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
  },
  text: {
    color: colors.daclen_blue,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  textChange: {
    backgroundColor: "transparent",
    color: colors.daclen_blue_link,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: staticDimensions.marginHorizontal,
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

const mapStateToProps = (store) => ({
  authData: store.userState.authData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ setAuthData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(LoginBox);
