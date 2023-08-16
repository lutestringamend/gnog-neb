import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Platform,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { setAuthData } from "../../axios/user";
import TextInputPassword from "./TextInputPassword";
import { colors } from "../../styles/base";

function RegisterBox(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username* (digunakan untuk referral Anda)</Text>
      <TextInput
        placeholder={Platform.OS === "ios" && props.authData?.username ? props.authData?.username : ""}
        style={styles.textInput}
        onChangeText={(name) =>props.setAuthData({...props.authData, name })}
      />
      <Text style={styles.text}>Email*</Text>
      <TextInput
        placeholder={Platform.OS === "ios" ? props.authData?.email : ""}
        style={styles.textInput}
        onChangeText={(email) => props.setAuthData({...props.authData, email })}
      />
      <Text style={styles.text}>Nomor Telepon*</Text>
      <TextInput
        placeholder={Platform.OS === "ios" ? props.authData?.phone : ""}
        style={styles.textInput}
        onChangeText={(nomor_telp) => props.setAuthData({...props.authData, nomor_telp })}
      />
      <Text style={styles.text}>Password*</Text>
      <TextInputPassword
        style={styles.textInput}
        onChangeText={(password) => props.setAuthData({...props.authData, password })}
      />
      <Text style={styles.text}>Konfirmasi Password*</Text>
      <TextInputPassword
        style={styles.textInput}
        onChangeText={(confirmPassword) => props.setAuthData({...props.authData, confirmPassword })}
      />
      <Text style={styles.text}>Referral*</Text>
      <TextInput
        placeholder={Platform.OS === "ios" ? props.authData?.referral: ""}
        style={styles.textInput}
        onChangeText={(referral) => props.setAuthData({...props.authData, referral })}
      />
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
  textReferral: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
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

export default connect(mapStateToProps, mapDispatchProps)(RegisterBox);
