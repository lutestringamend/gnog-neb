import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getOTP } from "../../axios/user";
import { colors, dimensions, staticDimensions } from "../../styles/base";

function VerifyPhone(props) {
  const { currentUser, token } = props;
  const navigation = useNavigation();

  const [phone, setPhone] = useState(
    currentUser?.nomor_telp ? currentUser?.nomor_telp : ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validOTP, setValidOTP] = useState(false);
  const [error, setError] = useState(null);
  const [timerCount, setTimer] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount == 0) {
          setValidOTP(false);
        } else {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      currentUser?.nomor_telp_verified_at !== null &&
      currentUser?.nomor_telp_verified_at !== "" &&
      currentUser?.nomor_telp_verified_at !== undefined
    ) {
      navigation.navigate("Checkout");
    } else if (props.phoneOTP?.session === "success") {
      setSuccess(true);
      setError(
        props.phoneOTP?.message +
          "\nMohon mengecek Whatsapp yang terdaftar dengan nomor " +
          props.phoneOTP?.nomor_telp
      );
      if (props.phoneOTP?.timeout !== null) {
        try {
          let timeDiff =
            props.phoneOTP?.timeout.getTime() - new Date().getTime();
          if (timeDiff > 0) {
            setValidOTP(true);
            setTimer(getSeconds(timeDiff));
            navigation.replace("OTPScreen");
          } else {
            setValidOTP(false);
          }
        } catch (e) {
          console.log(e);
          setValidOTP(false);
        }
      }
    } else {
      setValidOTP(false);
      setSuccess(false);
      setError(props.phoneOTP?.message);
    }
    setLoading(false);
    console.log(props.phoneOTP);
  }, [props.phoneOTP, currentUser]);

  function getSeconds(time) {
    return Math.ceil(time / 1000).toString();
  }

  function getOTP() {
    if (validOTP) {
      navigation.navigate("OTPScreen");
    } else if (phone === "" || phone === null) {
      setError("Mohon isi nomor handphone dengan Whatsapp aktif");
    } else {
      setLoading(true);
      props.getOTP(currentUser?.id, token, phone);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : error ? (
          <Text
            style={[
              styles.textError,
              success && { backgroundColor: colors.daclen_green },
            ]}
          >
            {error}
          </Text>
        ) : null}
        <View style={styles.containerLogo}>
          <Image
            source={require("../../assets/whatsappverify.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.containerContent}>
          <Text style={styles.textHeader}>Verifikasi Nomor Handphone</Text>
          <Text style={styles.text}>
            Nomor telepon aktif kamu diperlukan untuk melakukan checkout. Ayo
            isi nomor telepon kamu agar kami dapat mudah menghubungi kamu.
          </Text>

          {validOTP && timerCount > 0 ? (
            <Text style={styles.textInputHeaderCenter}>
              Mohon menunggu {timerCount} detik sebelum meminta OTP baru
            </Text>
          ) : (
            <View>
              <Text style={styles.textInputHeader}>
                Nomor Whatsapp Aktif (Wajib Diisi)
              </Text>
              <TextInput
                placeholder={
                  phone
                    ? currentUser?.nomor_telp
                    : "Isi dengan nomor Whatsapp aktif"
                }
                style={styles.textInput}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => getOTP()}
            style={[
              styles.button,
              loading && { backgroundColor: colors.daclen_gray },
            ]}
            disabled={loading}
          >
            <Text style={styles.textButton}>
              {validOTP ? "Isi OTP" : "Verifikasi"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.fullWidth,
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
    marginVertical: 20,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textInputHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.daclen_danger,
  },
  textInputHeaderCenter: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.daclen_danger,
    marginBottom: 20,
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
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
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
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getOTP,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(VerifyPhone);
