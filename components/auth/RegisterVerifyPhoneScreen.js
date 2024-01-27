import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { validateOTP, getOTP } from "../../axios/user";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import OTPInput from "../OTP/OTPInput";
import BSPopup from "../bottomsheets/BSPopup";

function RegisterVerifyPhoneScreen(props) {
  const { phoneOTP, validationOTP } = props;
  const nomor_telp = props.route.params?.nomor_telp
    ? props.route.params?.nomor_telp
    : null;
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
    /*let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount == 0) {
          setOngoing(false);
        } else {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);*/
    console.log("getOTP", nomor_telp, props.route.params?.referral);
  }, []);

  useEffect(() => {
    console.log({ otp, isPinReady });
    if (isPinReady) {
      validateOTP();
    }
  }, [isPinReady]);

  useEffect(() => {
    if (loading) {
      if (validationOTP?.session === "success") {
        setSuccess(true);
        setError("Berhasil verifikasi nomor handphone Anda");
        rbSheet.current.open();
      } else {
        setIsPinReady(false);
        setSuccess(false);
        setError(
          "Gagal verifikasi nomor handphone Anda\n" + validationOTP?.message,
        );
      }
      setLoading(false);
    }
  }, [validationOTP]);

  useEffect(() => {
    setOngoing(false);
    if (phoneOTP?.session === "success") {
      if (phoneOTP?.timeout !== null) {
        try {
          let timeDiff = phoneOTP?.timeout.getTime() - new Date().getTime();
          if (timeDiff > 0) {
            setOngoing(true);
            setTimer(getSeconds(timeDiff));
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [phoneOTP]);

  function getSeconds(time) {
    return Math.ceil(time / 1000).toString();
  }

  function requestNewOTP() {
    console.log("getOTP");
  }

  function validateOTP() {
    if (otp?.length === undefined || otp?.length < 5) {
      setError("OTP harus lengkap diisi 6 digit");
    } else {
      console.log("validateOTP", otp);
      /*TO BE CONTINUED
      setLoading(true);
      props.validateOTP(null, null, otp);*/
    }
  }

  function closeBS() {}

  return (
    <SafeAreaView style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.containerScroll}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          error && (
            <Text
              allowFontScaling={false}
              style={[
                styles.textError,
                success && { backgroundColor: colors.daclen_green },
              ]}
            >
              {error}
            </Text>
          )
        )}

        <View style={styles.containerContent}>
          <Text allowFontScaling={false} style={styles.text}>
            Masukkan kode verifikasi yang dikirim ke
          </Text>

          <View style={styles.containerWhatsapp}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={16}
              color={colors.daclen_green}
            />
            <Text
              allowFontScaling={false}
              style={[
                styles.text,
                {
                  marginStart: 4,
                  fontFamily: "Poppins-SemiBold",
                  color: colors.daclen_green,
                },
              ]}
            >
              {nomor_telp}
            </Text>
          </View>

          <OTPInput
            code={otp}
            setCode={setOtp}
            maximumLength={5}
            setIsPinReady={setIsPinReady}
            style={styles.containerOTP}
            boxStyle={{ width: 64, height: 64 }}
            fontSize={16}
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
            <Text allowFontScaling={false} style={styles.textButton}>
              Verifikasi OTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={ongoing || timerCount > 0}
            style={styles.containerRetry}
            onPress={() => requestNewOTP()}
          >
            <Text allowFontScaling={false} style={styles.textRetry}>
              {ongoing && timerCount > 0
                ? `Mohon menunggu ${timerCount} detik sebelum meminta OTP baru`
                : "Minta OTP Baru"}
            </Text>
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
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  containerScroll: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  containerWhatsapp: {
    marginTop: 4,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerContent: {
    backgroundColor: "transparent",
    marginTop: 32,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerOTP: {
    backgroundColor: "transparent",
    marginVertical: 64,
  },
  containerRetry: {
    backgroundColor: "transparent",
    marginTop: 32,
  },
  textHeader: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: colors.daclen_black,
  },
  text: {
    color: colors.daclen_graydark,
    fontFamily: "Poppins",
    fontSize: 14,
    textAlign: "center",
  },
  textRetry: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: colors.daclen_blue,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    fontFamily: "Poppins",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_yellow_new,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    padding: 20,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: colors.daclen_black,
  },
});

const mapStateToProps = (store) => ({
  phoneOTP: store.userState.phoneOTP,
  validationOTP: store.userState.validationOTP,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getOTP,
      validateOTP,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(RegisterVerifyPhoneScreen);
