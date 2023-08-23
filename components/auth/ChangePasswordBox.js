import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import TextInputPassword from "./TextInputPassword";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { setAuthData } from "../../axios/user";
import { colors } from "../../styles/base";
import { resetpassword } from "../../axios/constants";

function ChangePasswordBox(props) {
  const resetPassword = () => {
    Linking.openURL(resetpassword);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Password Lama*</Text>
      <TextInputPassword
        style={styles.textInput}
        secureTextEntry={true}
        onChangeText={(old_password) =>
          props.setAuthData({ ...props.authData, old_password })
        }
      />
      <Text style={styles.text}>Password Baru*</Text>
      <TextInputPassword
        style={styles.textInput}
        secureTextEntry={true}
        onChangeText={(new_password) =>
          props.setAuthData({ ...props.authData, new_password })
        }
      />
      <Text style={styles.text}>Konfirmasi Password Baru*</Text>
      <TextInputPassword
        style={styles.textInput}
        secureTextEntry={true}
        onChangeText={(confirm_password) =>
          props.setAuthData({ ...props.authData, confirm_password })
        }
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

export default connect(mapStateToProps, mapDispatchProps)(ChangePasswordBox);
