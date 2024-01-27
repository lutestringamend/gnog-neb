import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { eliminateSpaceFromString, setAuthData } from "../../axios/user";
import { colors } from "../../styles/base";
import TextInputLabel from "../textinputs/TextInputLabel";

function RegisterBox(props) {
  const { errorArray, errors, authData } = props;

  const checkInputUsername = () => {
    const name = eliminateSpaceFromString(authData?.name);
    props.setAuthData({ ...authData, name });
  };

  return (
    <View style={styles.container}>
      <TextInputLabel
        label="Nomor Whatsapp Aktif"
        compulsory
        value={authData?.nomor_telp}
        inputMode="decimal"
        error={errors?.nomor_telp}
        onChangeText={(nomor_telp) =>
          props.setAuthData({ ...authData, nomor_telp })
        }
      />

      <TextInputLabel
        label="Email"
        compulsory
        value={authData?.email}
        error={errors?.email}
        onChangeText={(email) =>
          props.setAuthData({ ...authData, email })
        }
      />

      <TextInputLabel
        label="Username (untuk referral Anda)"
        compulsory
        placeholder="Huruf kecil, tanpa spasi"
        value={authData?.name}
        error={errors?.name}
        maxCharacter={16}
        onChangeText={(name) => props.setAuthData({ ...authData, name })}
        onEndEditing={() => checkInputUsername()}
      />

      <TextInputLabel
        label="Referral"
        compulsory
        placeholder="Username yang mengajak join"
        value={authData?.referral}
        error={errors?.referral}
        maxCharacter={16}
        onChangeText={(referral) =>
          props.setAuthData({ ...authData, referral })
        }
      />

      <TextInputLabel
        label="Password"
        secureTextEntry
        compulsory
        error={errors?.password}
        value={authData?.password}
        onChangeText={(password) =>
          props.setAuthData({ ...authData, password })
        }
      />

      <TextInputLabel
        label="Konfirmasi Password"
        secureTextEntry
        compulsory
        error={errors?.confirmPassword}
        value={authData?.confirmPassword}
        onChangeText={(confirmPassword) =>
          props.setAuthData({ ...authData, confirmPassword })
        }
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
    fontFamily: "Poppins-SemiBold",
  },
  textReferral: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: 10,
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

const mapStateToProps = (store) => ({
  authData: store.userState.authData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ setAuthData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(RegisterBox);
