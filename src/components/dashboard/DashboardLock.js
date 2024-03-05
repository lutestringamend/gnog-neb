import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/base";
import OTPInput from "../../components/OTP/OTPInput";
import { staticDimensions } from "../../styles/base";
//import { PROFILE_LOCK_TIMEOUT_IN_MILISECONDS } from "../../../axios/constants";

const DashboardLock = (props) => {
  const [otp, setOtp] = useState("");
  const [isPinReady, setIsPinReady] = useState(false);

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

  return (
    <View style={styles.containerLock}>
      <OTPInput
        code={otp}
        setCode={setOtp}
        maximumLength={4}
        setIsPinReady={setIsPinReady}
      />
    </View>
  );
};

// <Text allowFontScaling={false} style={styles.textSubheader}>{`Halaman Profil akan dikunci lagi secara otomatis dalam ${PROFILE_LOCK_TIMEOUT_IN_MILISECONDS/60000} menit setelah Anda memasukkan PIN`}</Text>

const styles = StyleSheet.create({
  containerLock: {
    backgroundColor: "transparent",
    marginVertical: staticDimensions.marginHorizontal,
  },
});

export default DashboardLock;
