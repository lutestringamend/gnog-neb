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
import { colors, dimensions } from "../../styles/base";

function setPageHeight(bottomPadding) {
  return dimensions.fullHeight - dimensions.authBoxTopHeight + bottomPadding;
}

function Login(props) {
  const [error, setError] = useState(null);
  const [isLogin, setLogin] = useState(true);
  const [isChangePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const rbSheet = useRef();
  const webKey = props.route.params?.webKey;
  const navigation = useNavigation();

  useEffect(() => {
    console.log(webKey);
    if (webKey === "changePassword") {
      setChangePassword(true);
    } else if (
      props?.token !== null &&
      props.loginToken === null &&
      props.registerToken === null
    ) {
      navigation.navigate("Main");
    } else {
      //props.clearAuthError();
      setChangePassword(false);
      setLoading(false);
    }
  }, [props.token, webKey]);

  useEffect(() => {
    console.log("authError: " + props.authError);
    setLoading(false);
    if (isChangePassword) {
      setError(props.authError?.message);
      if (props.authError?.session === "success") {
        rbSheet.current.open();
      }
    } else {
      setError(props.authError);
    }
  }, [props.authError]);

  /*useEffect(() => {
    console.log("authData: " + JSON.stringify(props.authData));
  }, [props.authData]);*/

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

  const onLogin = () => {
    if (props.authData?.email === null || props.authData?.email === undefined) {
      setError("Anda belum mengisi username atau email Anda");
    } else if (
      props.authData?.password === undefined ||
      props.authData?.password === null
    ) {
      setError("Anda belum mengisi password");
    } else {
      setError(null);
      setLoading(true);
      props.login(props.authData?.email, props.authData?.password);
    }
  };

  const onRegister = () => {
    if (props.authData?.name === null || props.authData?.name === undefined) {
      setError("Anda wajib mengisi username untuk register");
    } else if (
      props.authData?.email === null ||
      props.authData?.email === undefined
    ) {
      setError("Anda wajib mengisi email untuk register");
    } else if (
      props.authData?.nomor_telp === null ||
      props.authData?.nomor_telp === undefined
    ) {
      setError("Anda wajib mengisi nomor telepon untuk register");
    } else if (
      props.authData?.password === undefined ||
      props.authData?.password === null ||
      props.authData?.confirmPassword === undefined ||
      props.authData?.confirmPassword === null
    ) {
      setError("Anda wajib mengisi password untuk register");
    } else if (props.authData?.password !== props.authData?.confirmPassword) {
      setError("Konfirmasi password Anda tidak sama");
    } else if (
      props.authData?.referral === null ||
      props.authData?.referral === undefined
    ) {
      setError("Anda wajib mengisi nama referral");
    } else {
      setError(null);
      setLoading(true);
      props.register(props.authData);
    }
  };

  const onChangePassword = () => {
    if (
      props.authData?.old_password === null ||
      props.authData?.old_password === undefined
    ) {
      setError("Anda wajib mengisi password lama Anda");
    } else if (
      props.authData?.new_password === undefined ||
      props.authData?.new_password === null ||
      props.authData?.confirm_password === undefined ||
      props.authData?.confirm_password === null
    ) {
      setError("Anda wajib mengisi password baru");
    } else if (
      props.authData?.new_password !== props.authData?.confirm_password
    ) {
      setError("Konfirmasi password Anda tidak sama");
    } else {
      setError(null);
      setLoading(true);
      props.changePassword(props.authData, props.currentUser?.id, props.token);
    }
  };

  function closeBS() {
    if (isChangePassword) {
      navigation.navigate("Profile");
    } else {
      if (isLogin) {
        props.setNewToken(props.loginToken);
      } else {
        props.setNewToken(props.registerToken);
      }
      navigation.navigate("Main");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.containerFull}>
          <View style={styles.containerHeader}>
            <TouchableOpacity
              style={styles.containerBack}
              onPress={() => navigation.navigate("Main")}
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
                source={require("../../assets/splash.png")}
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
                    ? setPageHeight(dimensions.authPageRegisterBottomPadding)
                    : setPageHeight(dimensions.pageBottomPadding),
              },
            ]}
          />

          <View style={styles.containerBox}>
            <Text style={styles.textHeader}>
              {isChangePassword
                ? "Ganti Password"
                : isLogin
                ? "Login"
                : "Register"}
            </Text>
            {isChangePassword ? (
              <ChangePasswordBox />
            ) : isLogin ? (
              <LoginBox username={props.route.params?.username} />
            ) : (
              <RegisterBox username={props.route.params?.username} />
            )}

            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.daclen_orange}
                style={{ alignSelf: "center", marginVertical: 10 }}
              />
            ) : (
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
                <Text style={styles.textButton}>
                  {isChangePassword
                    ? "Ganti Password"
                    : isLogin
                    ? "Login"
                    : "Register"}
                </Text>
              </TouchableOpacity>
            )}

            {!isChangePassword && (
              <View style={styles.containerAdditional}>
                <Text style={styles.text}>
                  {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                </Text>
                <TouchableOpacity
                  onPress={() => setLogin(!isLogin)}
                  disabled={loading}
                >
                  <Text style={styles.textChange}>
                    {isLogin ? "Register" : "Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {error && <Text style={styles.textError}>{error}</Text>}
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
              ? `Anda telah berhasil login sebagai ${props.authData?.email}.\nSelamat datang kembali di Daclen!`
              : `Anda telah berhasil register dengan nama akun ${props.authData?.username}.\nSelamat datang di Daclen!`
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
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
  },
  scrollView: {
    flex: 1,
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
    backgroundColor: "white",
  },
  containerFull: {
    flex: 1,
    width: dimensions.fullWidth,
    alignItems: "center",
  },
  containerBottom: {
    backgroundColor: "white",
    height: setPageHeight(dimensions.pageBottomPadding),
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
    height: dimensions.authBoxTopHeight,
  },
  containerBox: {
    position: "absolute",
    width: dimensions.authBoxWidth,
    backgroundColor: colors.daclen_light,
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
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    color: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  text: {
    color: colors.daclen_graydark,
    fontSize: 14,
    marginHorizontal: 10,
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
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
