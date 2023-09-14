import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";
import OTPInput from "../OTP/OTPInput";
import {
  updateReduxProfileLockStatus,
  updateReduxProfilePIN,
} from "../../axios/user";
import { setObjectAsync } from "../asyncstorage";
import { ASYNC_USER_PROFILE_PIN_KEY } from "../asyncstorage/constants";

const CreatePIN = (props) => {
  const [newPIN, setNewPIN] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPinReady, setIsPinReady] = useState(false);

  const { token, currentUser, profileLock, profilePIN } = props;
  const navigation = useNavigation();

  useEffect(() => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.name === undefined
    ) {
      navigation.goBack();
    }
  }, [token, currentUser]);

  useEffect(() => {
    if (isPinReady) {
      if (newPIN === null || newPIN === "") {
        setNewPIN(otp);
      } else if (otp === newPIN) {
        setLoading(true);
        processNewPIN();
      } else {
        setError("PIN tidak cocok. Tekan di sini untuk mengulang proses.");
      }
      setOtp("");
      setIsPinReady(false);
    }
  }, [isPinReady]);

  useEffect(() => {
    if (
      loading &&
      !(newPIN === undefined || newPIN === null || newPIN === "")
    ) {
      props.updateReduxProfileLockStatus(false);
      navigation.navigate("Main");
    }
  }, [profilePIN]);

  const processNewPIN = async () => {
    await setObjectAsync(ASYNC_USER_PROFILE_PIN_KEY, newPIN);
    props.updateReduxProfilePIN(newPIN);
  };

  function resetInput() {
    setNewPIN("");
    setOtp("");
    setIsPinReady(false);
    setLoading(false);
    setError(null);
  }

  return (
    <SafeAreaView style={styles.containerLock}>
      <Text
        style={[
          styles.textLockHeader,
          {
            color:
              newPIN === null || newPIN === ""
                ? colors.daclen_black
                : colors.daclen_orange,
          },
        ]}
      >
        {newPIN === null || newPIN === ""
          ? "Masukkan PIN 4 Digit Baru"
          : "Masukkan PIN Lagi untuk Konfirmasi"}
      </Text>
      <OTPInput
        code={otp}
        setCode={setOtp}
        maximumLength={4}
        setIsPinReady={setIsPinReady}
        style={styles.containerOTP}
      />
      {error ? (
        <TouchableOpacity onPress={() => resetInput()}>
          <Text allowFontScaling={false} style={styles.textSubheader}>{error}</Text>
        </TouchableOpacity>
      ) : null}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={styles.spinner}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerLock: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    alignItems: "center",
  },
  containerOTP: {
    marginVertical: 40,
    marginHorizontal: 20,
  },
  textLockHeader: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_black,
    textAlign: "center",
    marginTop: 32,
    marginHorizontal: 20,
  },
  textSubheader: {
    fontFamily: "Poppins", fontSize: 14,
    color: colors.daclen_red,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginHorizontal: 20,
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  profileLock: store.userState.profileLock,
  profileLockTimeout: store.userState.profileLockTimeout,
  profilePIN: store.userState.profilePIN,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxProfileLockStatus,
      updateReduxProfilePIN,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(CreatePIN);
