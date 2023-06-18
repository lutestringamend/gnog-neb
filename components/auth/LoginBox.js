import React, { useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import TextInputPassword from "./TextInputPassword";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { resetPassword, setAuthData } from "../../axios/user";
import { colors } from "../../styles/base";

function LoginBox(props) {
  useEffect(() => {
    if (props?.username !== null && props?.username !== undefined) {
      props.setAuthData({...props.authData, email: props?.username })
    }
  }, [props?.username]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username / Email</Text>
      <TextInput
        placeholder={Platform.OS === "ios" && props.authData?.email ? props.authData?.email : ""}
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
});

const mapStateToProps = (store) => ({
  authData: store.userState.authData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ setAuthData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(LoginBox);
