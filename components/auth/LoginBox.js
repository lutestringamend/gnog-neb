import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import TextInputPassword from "./TextInputPassword";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { resetPassword, setAuthData } from "../../axios/user";
import { colors } from "../../styles/base";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_USER_PREVIOUS_USERNAME } from "../asyncstorage/constants";

function LoginBox(props) {
  const [previousUsername, setPreviousUsername] = useState(null);

  useEffect(() => {
    checkAsyncPreviousUsername();
  }, []);

  const checkAsyncPreviousUsername = async () => {
    const storagePreviousUsername = await getObjectAsync(ASYNC_USER_PREVIOUS_USERNAME);
    if (storagePreviousUsername === undefined || storagePreviousUsername === null || storagePreviousUsername === "") {
      setPreviousUsername("");
      return;
    }
    setPreviousUsername(storagePreviousUsername);
    props.setAuthData({...props.authData, email: storagePreviousUsername });
  }

  if (previousUsername === null) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.daclen_orange}
        style={styles.spinner}
      />
    )
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username / Email</Text>
      <TextInput
        placeholder={previousUsername}
        style={styles.textInput}
        onChangeText={(email) => props.setAuthData({...props.authData, email })}
      />
      <Text style={styles.text}>Password</Text>
      <TextInputPassword
        style={styles.textInput}
        onChangeText={(password) => props.setAuthData({...props.authData, password })}
      />
      <TouchableOpacity onPress={() => resetPassword()}>
        <Text style={styles.textChange}>Lupa Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  text: {
    color: colors.daclen_blue,
    fontSize: 12,
    fontWeight: "bold",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: 10,
    fontSize: 14,
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  }
});

const mapStateToProps = (store) => ({
  authData: store.userState.authData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ setAuthData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(LoginBox);
