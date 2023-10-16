import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  login,
  clearAuthError,
  register,
  changePassword,
  setNewToken,
} from "../../axios/user";

import LoginBox from "./LoginBox";
import RegisterBox from "./RegisterBox";
import ChangePasswordBox from "./ChangePasswordBox";
import BSPopup from "../bottomsheets/BSPopup";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { ASYNC_DEVICE_TOKEN_KEY, ASYNC_USER_PROFILE_PIN_KEY } from "../asyncstorage/constants";
import { sentryLog } from "../../sentry";
import { checkEmpty } from "../../redux/reducers/user";
import { isUserDevServer } from "../../axios";
import { devhttp, mainhttp } from "../../axios/constants";

function setPageHeight(bottomPadding) {
  return (
    dimensions.fullHeight - staticDimensions.authBoxTopHeight + bottomPadding
  );
}

const defaultRegisterErrorArray = {
  name: false,
  email: false,
  nomor_telp: false,
  password: false,
  referral: false,
};

function Login(props) {
  const [error, setError] = useState(null);
  const [isLogin, setLogin] = useState(true);
  const [isChangePassword, setChangePassword] = useState(false);
  const [resettingPin, setResettingPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerErrorArray, setRegisterErrorArray] = useState(
    defaultRegisterErrorArray
  );

  const rbSheet = useRef();
  const webKey = props.route.params?.webKey;
  const resetPIN = props.route.params?.resetPIN
    ? props.route.params?.resetPIN
    : false;
  const { token, currentUser, authData, authError } = props;
  const navigation = useNavigation();

  useEffect(() => {
    if (
      currentUser === null ||
      currentUser?.name === undefined ||
      currentUser?.name === null
    ) {
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    console.log(webKey);
    if (webKey === "changePassword") {
      setChangePassword(true);
    } else if (
      token !== null &&
      props.loginToken === null &&
      props.registerToken === null &&
      !resetPIN
    ) {
      navigation.navigate("Main");
    } else {
      //props.clearAuthError();
      setChangePassword(false);
      setLoading(false);
    }
  }, [token, webKey]);

  useEffect(() => {
    console.log("redux authError", authError);
    setLoading(false);
    try {
      if (isChangePassword) {
        setError(authError?.message);
        if (authError?.session === "success") {
          rbSheet.current.open();
        }
      } else if (!isLogin && authError !== null) {
        setRegisterErrorArray(defaultRegisterErrorArray);
        let registerErrorKeys = Object.keys(authError);
        let newError = "";
        let newRegisterErrorArray = defaultRegisterErrorArray;
        for (let key of registerErrorKeys) {
          newRegisterErrorArray[key] = true;
          newError = `${newError === "" ? "" : `${newError}\n`}${authError[
            key
          ][0].toString()}`;
        }
        console.log("newRegisterError", newError, newRegisterErrorArray);
        setRegisterErrorArray(newRegisterErrorArray);
        setError(newError);
      } else {
        setError(checkEmpty(authError));
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setError(`Terjadi kesalahan pada saat autentikasi\n${e.toString()}`);
    }
  }, [authError]);
  
  useEffect(() => {
    console.log("registerErrorArray", registerErrorArray);
  }, [registerErrorArray]);

  useEffect(() => {
    if (isLogin && !isChangePassword && props.loginToken !== null) {
      console.log("loginToken", props.loginToken);
      setLoading(false);
      rbSheet.current.open();
    }
  }, [props.loginToken]);

  useEffect(() => {
    if (!isLogin && !isChangePassword && props.registerToken !== null) {
      console.log("registerToken", props.registerToken);
      setLoading(false);
      rbSheet.current.open();
    }
  }, [props.registerToken]);

  const onLogin = async () => {
    if (authData?.email === null || authData?.email === undefined) {
      setError("Anda belum mengisi username atau email Anda");
      return;
    } else if (
      authData?.password === undefined ||
      authData?.password === null
    ) {
      setError("Anda belum mengisi password");
      return;
    }
    setError(null);
    setLoading(true);
    if (resetPIN) {
      await setObjectAsync(ASYNC_USER_PROFILE_PIN_KEY, null);
    }
    const deviceToken = await getObjectAsync(ASYNC_DEVICE_TOKEN_KEY);
    props.login(authData?.email, authData?.password, resetPIN, deviceToken);
    setResettingPin(resetPIN);
  };

  const onRegister = async () => {
    if (resetPIN) {
      return;
    } else if (authData?.name === null || authData?.name === undefined) {
      setError("Anda wajib mengisi username untuk register");
    } else if (authData?.email === null || authData?.email === undefined) {
      setError("Anda wajib mengisi email untuk register");
    } else if (
      authData?.nomor_telp === null ||
      authData?.nomor_telp === undefined
    ) {
      setError("Anda wajib mengisi nomor telepon untuk register");
    } else if (
      authData?.password === undefined ||
      authData?.password === null ||
      authData?.confirmPassword === undefined ||
      authData?.confirmPassword === null
    ) {
      setError("Anda wajib mengisi password untuk register");
    } else if (authData?.password !== authData?.confirmPassword) {
      setError("Konfirmasi password Anda tidak sama");
    } else if (
      authData?.referral === null ||
      authData?.referral === undefined
    ) {
      setError("Anda wajib mengisi nama referral");
    } else {
      setError(null);
      setLoading(true);
      const deviceToken = await getObjectAsync(ASYNC_DEVICE_TOKEN_KEY);
      props.register(authData, deviceToken);
    }
  };

  const onChangePassword = () => {
    if (
      authData?.old_password === null ||
      authData?.old_password === undefined
    ) {
      setError("Anda wajib mengisi password lama Anda");
    } else if (
      authData?.new_password === undefined ||
      authData?.new_password === null ||
      authData?.confirm_password === undefined ||
      authData?.confirm_password === null
    ) {
      setError("Anda wajib mengisi password baru");
    } else if (authData?.new_password !== authData?.confirm_password) {
      setError("Konfirmasi password Anda tidak sama");
    } else {
      setError(null);
      setLoading(true);
      props.changePassword(authData, currentUser?.id, token);
    }
  };

  function closeBS() {
    if (isChangePassword) {
      navigation.goBack();
    } else {
      if (isLogin) {
        props.setNewToken(props.loginToken);
      } else {
        props.setNewToken(props.registerToken);
      }
      if (resetPIN && resettingPin) {
        navigation.navigate("CreatePIN");
      } else {
        navigation.navigate("Main");
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.containerFull}>
          <View style={styles.containerHeader}>
            <TouchableOpacity
              style={styles.containerBack}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left-bold-circle"
                size={32}
                color={colors.daclen_light}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Main")}>
              <Image
                source={require("../../assets/splashsmall.png")}
                style={styles.imageLogo}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.containerBottom,
              {
                height:
                  !isChangePassword && !isLogin
                    ? setPageHeight(
                        staticDimensions.authPageRegisterBottomPadding
                      )
                    : setPageHeight(staticDimensions.pageBottomPadding),
              },
            ]}
          />

          <View style={styles.containerBox}>
            <Text allowFontScaling={false} style={styles.textHeader}>
              {isChangePassword
                ? "Ganti Password"
                : isLogin
                ? resetPIN
                  ? "Reset PIN"
                  : "Login"
                : "Register"}
            </Text>
            {isChangePassword ? (
              <ChangePasswordBox />
            ) : isLogin ? (
              <LoginBox />
            ) : (
              <RegisterBox errorArray={registerErrorArray} />
            )}

            <TouchableOpacity
              onPress={() =>
                isChangePassword
                  ? onChangePassword()
                  : isLogin
                  ? onLogin()
                  : onRegister()
              }
              style={[
                styles.button,
                loading && { backgroundColor: colors.daclen_gray },
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_light}
                  style={{
                    alignSelf: "center",
                  }}
                />
              ) : (
                <Text allowFontScaling={false} style={styles.textButton}>
                  {isChangePassword
                    ? "Ganti Password"
                    : isLogin
                    ? resetPIN
                      ? "Login Ulang & Reset PIN"
                      : "Login"
                    : "Register"}
                </Text>
              )}
            </TouchableOpacity>

            {!isChangePassword && !resetPIN ? (
              <View style={styles.containerAdditional}>
                <Text allowFontScaling={false} style={styles.text}>
                  {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                </Text>
                <TouchableOpacity
                  onPress={() => setLogin(!isLogin)}
                  disabled={loading}
                >
                  <Text allowFontScaling={false} style={styles.textChange}>
                    {isLogin ? "Register" : "Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {error ? <Text allowFontScaling={false} style={styles.textError}>{error}</Text> : null}
          </View>
        </View>
      </ScrollView>

      <RBSheet
        ref={rbSheet}
        openDuration={250}
        height={350}
        onClose={() => closeBS()}
      >
        <BSPopup
          title={
            isChangePassword ? "Ganti Password" : isLogin ? "Login" : "Register"
          }
          text={
            isChangePassword
              ? "Anda telah berhasil mengganti password akun Daclen Anda"
              : isLogin
              ? `Anda telah berhasil login sebagai ${authData?.email}.\nSelamat datang kembali di Daclen!`
              : `Anda telah berhasil register sebagai ${
                  authData?.name ? authData?.name : authData?.email
                }.\nSelamat datang di Daclen!`
          }
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
    height: "100%",
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  containerFull: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  containerBottom: {
    backgroundColor: "white",
    height: setPageHeight(staticDimensions.pageBottomPadding),
    width: "100%",
  },
  containerBack: {
    position: "absolute",
    top: 36,
    start: 20,
    elevation: 6,
  },
  containerHeader: {
    width: "100%",
    backgroundColor: colors.daclen_black,
    alignItems: "center",
    height: staticDimensions.authBoxTopHeight,
  },
  containerBox: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    borderColor: colors.daclen_gray,
    borderWidth: 2,
    borderRadius: 5,
    marginHorizontal: 40,
    marginTop: 100,
    padding: 20,
    elevation: 10,
  },
  containerAdditional: {
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  imageLogo: {
    width: 125,
    height: 30,
    marginTop: 32,
  },
  textHeader: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 32,
    color: colors.daclen_danger,
    textAlign: "center",
    textAlignVertical: "center",
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
  text: {
    color: colors.daclen_graydark,
    fontFamily: "Poppins", fontSize: 14,
    marginHorizontal: 10,
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  authData: store.userState.authData,
  authError: store.userState.authError,
  loginToken: store.userState.loginToken,
  registerToken: store.userState.registerToken,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { login, clearAuthError, register, changePassword, setNewToken },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Login);
