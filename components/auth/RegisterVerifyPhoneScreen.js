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
  AppState,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, staticDimensions } from "../../styles/base";
import OTPInput from "../OTP/OTPInput";
import BSPopup from "../bottomsheets/BSPopup";
import {
  postRequestAuthOTP,
  postVerifikasiAuthOTP,
} from "../../src/axios/auth";

function RegisterVerifyPhoneScreen(props) {
  const nomor_telp = props.route.params?.nomor_telp
    ? props.route.params?.nomor_telp
    : null;
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const rbSheet = useRef();

  const [otp_id, setOtpId] = useState(null);
  const [otp, setOtp] = useState("");
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isPinReady, setIsPinReady] = useState(false);
  const [elapsed, setElapsed] = useState(90);

  useEffect(() => {
    if (nomor_telp === undefined || nomor_telp === null) {
      return;
    }
    console.log("OTP screen params", nomor_telp, props.route.params?.referral);
    requestOTP();
  }, [nomor_telp]);

  useEffect(() => {
    if (!requested) {
      return;
    }
    if (elapsed < 90) {
      setElapsed(90);
    }
    getElapsedTime();

    const theAppState = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => theAppState.remove();
  }, [requested]);

  useEffect(() => {
    if (elapsed > 0 && requested) {
      setTimeout(getElapsedTime, 1000);
    }
  }, [elapsed]);

  useEffect(() => {
    if (isPinReady) {
      validateOTP();
    }
  }, [isPinReady]);

  const handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      getElapsedTime();
    }
    appState.current = nextAppState;
  };

  const getElapsedTime = async () => {
    try {
      setElapsed((elapsed) => elapsed - 1);
    } catch (err) {
      console.error(err);
      setError(err?.toString());
    }
  };

  function getSeconds(time) {
    return Math.ceil(time / 1000).toString();
  }

  const requestOTP = async () => {
    setLoading(true);
    const result = await postRequestAuthOTP(
      nomor_telp,
      props.route.params?.referral,
    );
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null ||
      result?.result?.otp_id === undefined ||
      result?.result?.otp_id === null
    ) {
      setOtpId(null);
      setError("Gagal mendapatkan OTP");
    } else {
      setOtpId(result?.result?.otp_id);
      setRequested(true);
      console.log("getOTP", result?.result);
    }
    setLoading(false);
  };

  function requestNewOTP() {
    setOtpId(null);
    setRequested(false);
    requestOTP();
  }

  const validateOTP = async () => {
    if (otp?.length === undefined || otp?.length < 5) {
      setError("OTP harus lengkap diisi 6 digit");
    } else {
      setLoading(true);
      const result = await postVerifikasiAuthOTP(otp_id, otp);
      console.log("verifikasiOTP", result?.result);
      if (
        result === undefined ||
        result === null ||
        result?.result === undefined ||
        result?.result === null ||
        result?.result?.session !== "success"
      ) {
        setError("OTP tidak sesuai");
      } else {
        setSuccess(true);
        setError(result?.result?.message ? result?.result?.message : "");
        navigation.navigate("CompleteRegistration", {
          otp_id,
          nomor_telp,
          referral: props.route.params?.referral,
        })
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} onPress={Keyboard.dismiss}>
      {error ? (
          <Text
            allowFontScaling={false}
            style={[
              styles.textError,
              success && { backgroundColor: colors.daclen_green },
            ]}
          >
            {error}
          </Text>
        ) : null}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.containerScroll}
      >
        

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
                    ? colors.daclen_yellow_new
                    : colors.daclen_gray,
              },
            ]}
            disabled={!requested || loading || !isPinReady}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_black}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <Text allowFontScaling={false} style={styles.textButton}>
                Verifikasi OTP
              </Text>
            )}
          </TouchableOpacity>

          {requested ? (
            <TouchableOpacity
              disabled={elapsed > 0}
              style={styles.containerRetry}
              onPress={() => requestNewOTP()}
            >
              <Text allowFontScaling={false} style={styles.textRetry}>
                {elapsed > 0
                  ? `Mohon menunggu ${elapsed} detik sebelum meminta OTP baru`
                  : "Minta OTP Baru"}
              </Text>
            </TouchableOpacity>
          ) : null}
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
    fontSize: 12,
    fontFamily: "Poppins",
    color: colors.daclen_black,
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
    backgroundColor: colors.daclen_yellow_new,
  },
  textError: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    padding: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: colors.daclen_black,
  },
});

export default RegisterVerifyPhoneScreen
