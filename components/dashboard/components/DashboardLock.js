import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";

import { colors } from "../../../styles/base";
import OTPInput from "../../OTP/OTPInput";

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
      <Text style={styles.textLockHeader}>Masukkan PIN untuk Membuka</Text>
      <OTPInput
        code={otp}
        setCode={setOtp}
        maximumLength={4}
        setIsPinReady={setIsPinReady}
        style={styles.containerOTP}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerLock: {
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  containerOTP: {
    marginVertical: 40,
  },
  textLockHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.daclen_light,
    marginTop: 32,
    textAlign: "center",
  },
});

export default DashboardLock;
