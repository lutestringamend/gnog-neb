import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  login,
  clearAuthError,
  register,
  changePassword,
  setNewToken,
  loginCheck,
} from "../../../axios/user";

import LoginBox from "../../components/auth/LoginBox";
import RegisterBox from "../../components/auth/RegisterBox";
import ChangePasswordBox from "../../components/auth/ChangePasswordBox";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import { getObjectAsync, setObjectAsync } from "../../../components/asyncstorage";
import {
  ASYNC_DEVICE_TOKEN_KEY,
  ASYNC_USER_PROFILE_PIN_KEY,
} from "../../../components/asyncstorage/constants";
import { sentryLog } from "../../../sentry";
import { checkEmpty } from "../../../redux/reducers/user";
import { isUserDevServer } from "../../../axios";
import {
  devhttp,
  email_regex,
  mainhttp,
  phone_regex,
  uppercase_regex,
  username_regex,
} from "../../../axios/constants";
import CenteredView from "../../components/view/CenteredView";
import AuthHeader from "../../components/auth/AuthHeader";
import AlertBox from "../../components/alert/AlertBox";
import Button from "../../components/Button/Button";
import ModalView from "../../components/modal/ModalView";
import { ModalModel } from "../../models/modal";

const defaultRegisterErrorArray = {
  name: false,
  email: false,
  nomor_telp: false,
  password: false,
  referral: false,
};
const defaultLoginError = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  nomor_telp: "",
  referral: "",
};

function Login(props) {

  const [error, setError] = useState(null);
  const [isLogin, setLogin] = useState(true);
  const [isChangePassword, setChangePassword] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [resettingPin, setResettingPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(defaultLoginError);
  const [registerError, setRegisterError] = useState(defaultLoginError);
  const [registerErrorArray, setRegisterErrorArray] = useState(
    defaultRegisterErrorArray
  );
  const [modal, setModal] = useState(ModalModel);

  const webKey = props.route?.params ? props.route.params?.webKey ? props.route.params?.webKey : null : null;
  const resetPIN = props.route?.params ? props.route.params?.resetPIN
    ? props.route.params?.resetPIN
    : false : false;
  const { token, currentUser, authData, authError } = props;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      console.log("Login Screen visible, BackHandler active");
      return () => {
        console.log("Login Screen is not visible");
        backHandler.remove();
      };
    }, [])
  );

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
      /*} else if (
      token !== null &&
      props.loginToken === null &&
      props.registerToken === null &&
      !resetPIN
    ) {
      navigation.navigate("Main");*/
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
          openModal();
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
        setLoginError({
          ...defaultLoginError,
          password: checkEmpty(authError),
        });
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setError(`Terjadi kesalahan pada saat autentikasi\n${e.toString()}`);
    }
  }, [authError]);

  useEffect(() => {
    console.log("registerError", registerError);
  }, [registerError]);

  useEffect(() => {
    if (isLogin && !isChangePassword && props.loginToken !== null) {
      console.log("loginToken", props.loginToken);
      setLoading(false);
      openModal();
    }
  }, [props.loginToken]);

  useEffect(() => {
    if (!isLogin && !isChangePassword && props.registerToken !== null) {
      console.log("registerToken", props.registerToken);
      setLoading(false);
      openModal();
    }
  }, [props.registerToken]);

  const openModal = () => {
    setModal({
      ...modal,
      visible: true,
      title: isChangePassword ? "Ganti Password" : isLogin ? "Login" : "Register",
      text: isChangePassword
      ? "Anda telah berhasil mengganti password akun Daclen Anda"
      : isLogin
      ? `Anda telah berhasil login sebagai ${authData?.email}.\nSelamat datang kembali di Daclen!`
      : `Anda telah berhasil register sebagai ${
          authData?.name ? authData?.name : authData?.email
        }.\nSelamat datang di Daclen!`,
    })
  }

  const switchPage = () => {
    setLoginError(defaultLoginError);
    setRegisterError(defaultLoginError);
    setLogin((isLogin) => !isLogin);
  };

  const onLogin = async () => {
    setLoginError(defaultLoginError);
    if (userExist || resetPIN) {
      if (
        authData?.email === undefined ||
        authData?.email === null ||
        authData?.email === ""
      ) {
        setLoginError({
          ...loginError,
          email: "Masukkan no handphone / email / username Daclen",
        });
        return;
      } else if (
        authData?.password === undefined ||
        authData?.password === null ||
        authData?.password === ""
      ) {
        setLoginError({
          ...loginError,
          password: "Masukkan password akun Daclen Anda",
        });
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
    } else {
      if (
        authData?.email === undefined ||
        authData?.email === null ||
        authData?.email === ""
      ) {
        setLoginError({
          ...loginError,
          email: "Masukkan no handphone / email / username Daclen",
        });
        return;
      }
      const check = await loginCheck(authData?.email);
      if (
        check?.userId === undefined ||
        check?.userId === null ||
        check?.userId === ""
      ) {
        setLoginError({
          ...loginError,
          email: check?.error
            ? check?.error
            : "Mohon cek koneksi Internet Anda",
        });
        setUserExist(false);
      } else {
        setUserExist(true);
      }
      setLoading(false);
    }
  };

  const onRegister = async () => {
    setRegisterError(defaultLoginError);
    if (resetPIN) {
      return;
    }

    if (!phone_regex.test(authData?.nomor_telp)) {
      setRegisterError({
        ...defaultLoginError,
        nomor_telp: "Masukkan Nomor Handphone aktif yang valid",
      });
    /*} else if (
      authData?.email === undefined ||
      authData?.email === null ||
      authData?.email === ""
    ) {
      setRegisterError({ ...defaultLoginError, email: "Email wajib diisi" });
    } else if (!email_regex.test(authData?.email)) {
      setRegisterError({
        ...defaultLoginError,
        email: "Masukkan alamat email aktif yang valid",
      });
    } else if (
      authData?.name === undefined ||
      authData?.name === null ||
      authData?.name === ""
    ) {
      setRegisterError({ ...defaultLoginError, name: "Username wajib diisi" });
    } else if (authData?.name.includes(" ")) {
      setRegisterError({
        ...defaultLoginError,
        name: "Username tidak boleh mengandung spasi",
      });
    } else if (uppercase_regex.test(authData?.name)) {
      setRegisterError({
        ...defaultLoginError,
        name: "Username hanya boleh memakai huruf kecil",
      });*/
    } else if (
      authData?.referral?.length === undefined || authData?.referral?.length < 3
    ) {
      setRegisterError({
        ...defaultLoginError,
        referral: "Referral wajib diisi",
      });
    } else if (authData?.referral.includes(" ")) {
      setRegisterError({
        ...defaultLoginError,
        referral: "Referral tidak boleh mengandung spasi",
      });
    /*} else if (
      authData?.password === undefined ||
      authData?.password === null
    ) {
      setRegisterError({
        ...defaultLoginError,
        password: "Password wajib diisi",
      });
    } else if (
      authData?.confirmPassword === undefined ||
      authData?.confirmPassword === null
    ) {
      setRegisterError({
        ...defaultLoginError,
        confirmPassword: "Konfirmasi Password wajib diisi",
      });
    } else if (authData?.password !== authData?.confirmPassword) {
      setRegisterError({
        ...defaultLoginError,
        confirmPassword: "Konfirmasi Password tidak sama",
      });*/
    } else {
      console.log("proceed to WA verification", authData?.nomor_telp, authData?.referral);
      navigation.navigate("RegisterVerifyPhone", {
        nomor_telp: authData?.nomor_telp,
        referral: authData?.referral,
      })
      /*
      setLoading(true);
      const deviceToken = await getObjectAsync(ASYNC_DEVICE_TOKEN_KEY);
      props.register(authData, deviceToken);*/
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

  const onBackPress = () => {
    if (userExist) {
      setUserExist(false);
    } else if (!isLogin) {
      setLogin(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <CenteredView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <AuthHeader hideBack={isLogin && !userExist} onBackPress={() => onBackPress()} />
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
              <LoginBox
                userExist={userExist}
                resetPIN={resetPIN}
                errors={loginError}
              />
            ) : (
              <RegisterBox
                errors={registerError}
                errorArray={registerErrorArray}
              />
            )}

            <Button
            onPress={() =>
              isLogin
                ? isChangePassword
                  ? onChangePassword()
                  : onLogin()
                : onRegister()
            }
            loading={loading}
            style={styles.button}
              text={isChangePassword
                ? "Ganti Password"
                : isLogin
                ? resetPIN
                  ? "Reset PIN"
                  : "Continue"
                : "Continue"}
            />


            {!isChangePassword && !resetPIN ? (
              <View style={styles.containerAdditional}>
                <Text allowFontScaling={false} style={styles.text}>
                  {isLogin ? "Tidak punya akun? " : "Sudah punya akun? "}
                  <Text onPress={() => switchPage()}
                  disabled={loading} allowFontScaling={false} style={styles.textChange}>
                    {isLogin ? "Register" : "Login"}
                  </Text>
                </Text>
               
              </View>
            ) : null}
          </View>
          <AlertBox text={error} onClose={() => setError(null)} />
          {modal?.visible ?
          <ModalView
            {...modal}
            setModal={() => closeBS()}
          />
          : null}
      </ScrollView>
    </CenteredView>
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
  containerBox: {
    flex: 1,
    backgroundColor: "transparent",
    minHeight: dimensions.fullHeight * 0.9,
    paddingHorizontal: staticDimensions.authMarginHorizontal,
  },
  containerAdditional: {
    backgroundColor: "transparent",
    marginVertical: staticDimensions.marginHorizontal,
  },
  textHeader: {
    fontSize: 36 * dimensions.fullWidthAdjusted / 430,
    fontFamily: "Poppins-Light",
    marginBottom: 20,
  },
  button: {
    marginVertical: staticDimensions.marginHorizontal,
  },
  text: {
    color: colors.black,
    fontFamily: "Poppins",
    fontSize: 12,
  },
  textChange: {
    color: colors.daclen_blue_link,
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
