import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/base";
import OTPInput from "../../OTP/OTPInput";
//import { PROFILE_LOCK_TIMEOUT_IN_MILISECONDS } from "../../../axios/constants";

const DashboardLock = (props) => {
  const [otp, setOtp] = useState("");
  const [isPinReady, setIsPinReady] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isPinReady) {
      if (props?.receiveOTP === undefined || props?.receiveOTP === null) {
        return;
      }
      props.receiveOTP(otp);
      setOtp("");
      setIsPinReady(false);
    }
  }, [isPinReady]);

  function resetPIN() {
    navigation.navigate("Login", {
      resetPIN: true,
    });
  }

  return (
    <View style={styles.containerLock}>
      <Text allowFontScaling={false} style={styles.textLockHeader}>Masukkan PIN untuk Membuka</Text>
      <OTPInput
        code={otp}
        setCode={setOtp}
        maximumLength={4}
        setIsPinReady={setIsPinReady}
        style={styles.containerOTP}
      />
      <TouchableOpacity onPress={() => resetPIN()}>
      <Text allowFontScaling={false} style={styles.textSubheader}>Reset PIN</Text>
      </TouchableOpacity>

    </View>
  );
};

// <Text allowFontScaling={false} style={styles.textSubheader}>{`Halaman Profil akan dikunci lagi secara otomatis dalam ${PROFILE_LOCK_TIMEOUT_IN_MILISECONDS/60000} menit setelah Anda memasukkan PIN`}</Text>

const styles = StyleSheet.create({
  containerLock: {
    backgroundColor: colors.daclen_bg_highlighted,
    opacity: 0.9,
    borderRadius: 6,
    elevation: 2,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  containerOTP: {
    marginVertical: 40,
  },
  textLockHeader: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
    textAlign: "center",
  },
  textSubheader: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_green_button,
    textAlign: "center",
  },
});

export default DashboardLock;
