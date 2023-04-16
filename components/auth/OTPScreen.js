import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { validateOTP, getCurrentUser } from "../../axios/user";
import { colors, staticDimensions } from "../../styles/base";
import OTPInput from "../OTP/OTPInput";
import { openCheckout } from "../main/CheckoutScreen";
import BSPopup from "../bottomsheets/BSPopup";

function OTPScreen(props) {
  const { currentUser, token, validationOTP } = props;
  const navigation = useNavigation();
  const rbSheet = useRef();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ongoing, setOngoing] = useState(false);
  const [error, setError] = useState(null);
  const [isPinReady, setIsPinReady] = useState(false);
  const [timerCount, setTimer] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount == 0) {
          setOngoing(false);
        } else {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log({ otp, isPinReady });
    if (isPinReady) {
      validateOTP();
    }
  }, [isPinReady]);

  useEffect(() => {
    if (
      currentUser?.nomor_telp_verified_at !== null &&
      currentUser?.nomor_telp_verified_at !== "" &&
      currentUser?.nomor_telp_verified_at !== undefined
    ) {
      navigation.navigate("Main");
    } else if (loading) {
      if (validationOTP?.session === "success") {
        setSuccess(true);
        setError("Berhasil verifikasi nomor handphone Anda");
        rbSheet.current.open();
      } else {
        setIsPinReady(false);
        setSuccess(false);
        setError(
          "Gagal verifikasi nomor handphone Anda\n" + validationOTP?.message
        );
      }
      setLoading(false);
    }
  }, [validationOTP, currentUser]);

  useEffect(() => {
    setOngoing(false);
    if (props.phoneOTP?.session === "success") {
      if (props.phoneOTP?.timeout !== null) {
        try {
          let timeDiff =
            props.phoneOTP?.timeout.getTime() - new Date().getTime();
          if (timeDiff > 0) {
            setOngoing(true);
            setTimer(getSeconds(timeDiff));
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [props.phoneOTP]);

  function getSeconds(time) {
    return Math.ceil(time / 1000).toString();
  }

  function requestNewOTP() {
    if (!ongoing || timerCount < 1) {
      navigation.navigate("VerifyPhone");
    }
  }

  function validateOTP() {
    if (otp === "" || otp === null || otp.length < 5) {
      setError("OTP harus lengkap diisi 6 digit");
    } else {
      setLoading(true);
      props.validateOTP(currentUser?.id, token, otp);
    }
  }

  function closeBS() {
    props.getCurrentUser(token);
    openCheckout(
      navigation,
      true,
      token,
      currentUser,
      null,
      validationOTP?.session
    );
  }

  return (
    <SafeAreaView style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          error && (
            <Text
              style={[
                styles.textError,
                success && { backgroundColor: colors.daclen_green },
              ]}
            >
              {error}
            </Text>
          )
        )}
        <View style={styles.containerLogo}>
          <Image source={require("../../assets/otp.png")} style={styles.logo} />
        </View>
        <View style={styles.containerContent}>
          <Text style={styles.text}>
            Kode OTP telah dikirim ke nomor Whatsapp yang tertera di bawah ini.
            Masukkan kode OTP untuk menyelesaikan verifikasi.
          </Text>

          <Text style={styles.textWhatsapp}>{props.phoneOTP?.nomor_telp}</Text>

          <TouchableOpacity onPress={() => requestNewOTP()}>
            <Text style={styles.textRetry}>
              {ongoing && timerCount > 0
                ? `Mohon menunggu ${timerCount} detik sebelum meminta OTP baru`
                : "Minta OTP Baru"}
            </Text>
          </TouchableOpacity>

          <OTPInput
            code={otp}
            setCode={setOtp}
            maximumLength={5}
            setIsPinReady={setIsPinReady}
          />

          <TouchableOpacity
            onPress={() => validateOTP()}
            style={[
              styles.button,
              {
                backgroundColor:
                  isPinReady && !loading
                    ? colors.daclen_orange
                    : colors.daclen_gray,
              },
            ]}
            disabled={loading || !ongoing}
          >
            <Text style={styles.textButton}>Verifikasi OTP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <RBSheet
        ref={rbSheet}
        openDuration={250}
        height={350}
        onClose={() => closeBS()}
      >
        <BSPopup
          title="Verifikasi Berhasil"
          text="Nomor handphone Anda telah berhasil diverifikasi. Anda bisa melanjutkan Checkout di Daclen."
          buttonNegative="OK"
          buttonNegativeColor={colors.daclen_gray}
          logo="../../assets/verified.png"
          closeThis={() => rbSheet.current.close()}
          onPress={null}
        />
      </RBSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  containerContent: {
    marginHorizontal: 20,
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerLogo: {
    marginVertical: 32,
    backgroundColor: "white",
    alignSelf: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_black,
  },
  text: {
    fontSize: 14,
    marginVertical: 10,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textWhatsapp: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_green,
    textAlign: "center",
  },
  textRetry: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    color: colors.daclen_orange,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 40,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_black,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    padding: 20,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  phoneOTP: store.userState.phoneOTP,
  validationOTP: store.userState.validationOTP,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      validateOTP,
      getCurrentUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(OTPScreen);
