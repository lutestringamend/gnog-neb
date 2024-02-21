import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";

import BSPopup from "../../../components/bottomsheets/BSPopup";
import { colors } from "../../../styles/base";
import { getAuthShowOTP, postAuthRegister } from "../../axios/auth";
import TextInputLabel from "../../../components/textinputs/TextInputLabel";
import { email_regex } from "../../../axios/constants";
import { storeNewToken, setNewToken } from "../../../axios/user";
import { updateReduxUserRegisterToken } from "../../utils/auth";

const defaultData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const CompleteRegistrationScreen = (props) => {
  const { registerToken } = props;
  const navigation = useNavigation();
  const otp_id = props.route.params?.otp_id ? props.route.params?.otp_id : null;
  const nomor_telp = props.route.params?.nomor_telp
    ? props.route.params?.nomor_telp
    : null;
  const referral = props.route.params?.referral
    ? props.route.params?.referral
    : null;
  const rbSheet = useRef();

  const [verifiedAt, setVerifiedAt] = useState(null);
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (otp_id === null) {
      return;
    }
    props.updateReduxUserRegisterToken(null);
    showOTP();
  }, [otp_id]);

  useEffect(() => {
    if (registerToken === null) {
        return;
    }
    rbSheet.current.open();
  }, [registerToken]);

  useEffect(() => {
    let newErrors = errors;
    if (!(data?.name === "" || data?.name.includes(" "))) {
      newErrors = { ...newErrors, name: "" };
    }
    if (email_regex.test(data?.email)) {
      newErrors = { ...newErrors, email: "" };
    }
    if (!(data?.password === "" || data?.password?.length < 8)) {
      newErrors = { ...newErrors, password: "" };
    }
    if (
      !(
        data?.confirmPassword === "" ||
        data?.confirmPassword?.length < 8 ||
        data?.confirmPassword !== data?.password
      )
    ) {
      newErrors = { ...newErrors, confirmPassword: "" };
    }
    setErrors(newErrors);
  }, [data]);

  const showOTP = async () => {
    const result = await getAuthShowOTP(otp_id);
    console.log("showOTP", result?.result);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      setError("Nomor telepon belum terverifikasi");
    } else {
      setVerifiedAt(result?.result?.data?.created_at);
    }
  };

  const proceed = async () => {
    if (data?.name === "") {
      setErrors({ ...errors, name: "Username harus diisi" });
      return;
    }
    if (data?.name.includes(" ")) {
      setErrors({ ...errors, name: "Username tidak boleh mengandung spasi" });
      return;
    }
    if (email_regex.test(data?.email)) {
      setErrors({ ...errors, email: "" });
    } else {
      setErrors({ ...errors, email: "Masukkan alamat email yang benar" });
      return;
    }
    if (data?.password === "") {
      setErrors({ ...errors, password: "Isian password wajib diisi" });
      return;
    }
    if (data?.password?.length < 8) {
      setErrors({
        ...errors,
        password: "Isian password harus minimal 8 karakter",
      });
      return;
    }
    if (data?.confirmPassword === "") {
      setErrors({
        ...errors,
        confirmPassword: "Isian konfirmasi password wajib diisi",
      });
      return;
    }
    if (data?.confirmPassword !== data?.password) {
      setErrors({
        ...errors,
        confirmPassword: "Konfirmasi password harus sama",
      });
      return;
    }

    setLoading(true);
    const result = await postAuthRegister({
      ...data,
      nomor_telp,
      referral,
    });
    console.log("postAuthRegister", result?.result);

    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      setError("Gagal mendaftarkan akun baru");
    } else if (result?.result?.errors) {
      let newErrors = defaultData;
      let newError = "";
      if (result?.result?.errors?.name) {
        newErrors = { ...newErrors, name: result?.result?.errors?.name[0] };
      }
      if (result?.result?.errors?.email) {
        newErrors = { ...newErrors, email: result?.result?.errors?.email[0] };
      }
      if (result?.result?.errors?.nomor_telp) {
        newError = result?.result?.errors?.nomor_telp[0];
      }
      if (result?.result?.errors?.referral) {
        newError = `${newError ? `${newError}\n` : ""}${
          result?.result?.errors?.referral[0]
        }`;
      }
      setError(newError);
      setErrors(newErrors);
    } else if (
      result?.result?.token === undefined ||
      result?.result?.token === null ||
      result?.result?.token === ""
    ) {
      setError("Gagal mendaftarkan akun baru");
    } else {
      const token = result?.result?.token;
      props.updateReduxUserRegisterToken(token);
      storeNewToken(token, data?.password);
    }

    setLoading(false);
  };

  function closeBS() {
    props.setNewToken(registerToken);
    navigation.navigate("Main");
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text allowFontScaling={false} style={styles.textError}>
          {error}
        </Text>
      ) : null}
      {verifiedAt === null ? (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={colors.daclen_gray} />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.containerScroll}
        >
          <Text allowFontScaling={false} style={styles.textUid}>
            Lengkapi data diri untuk mendaftarkan akun baru Anda. Username anda
            akan digunakan sebagai link toko online, personal web, dan kode
            referral.
          </Text>
          <TextInputLabel
            label="Username"
            compulsory
            placeholder="Hanya huruf kecil dan tanpa spasi"
            value={data?.name}
            error={errors?.name}
            maxCharacter={16}
            onChangeText={(name) => setData({ ...data, name })}
          />

          <TextInputLabel
            label="Email"
            compulsory
            placeholder="Alamat email aktif"
            value={data?.email}
            error={errors?.email}
            onChangeText={(email) => setData({ ...data, email })}
          />

          <TextInputLabel
            label="Password"
            compulsory
            secureTextEntry
            value={data?.password}
            error={errors?.password}
            onChangeText={(password) => setData({ ...data, password })}
          />

          <TextInputLabel
            label="Konfirmasi Password"
            compulsory
            secureTextEntry
            value={data?.confirmPassword}
            error={errors?.confirmPassword}
            onChangeText={(confirmPassword) =>
              setData({ ...data, confirmPassword })
            }
          />
          <TouchableOpacity
            onPress={() => proceed()}
            style={[
              styles.button,
              {
                backgroundColor: loading
                  ? colors.daclen_gray
                  : colors.daclen_yellow_new,
              },
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_black}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <Text allowFontScaling={false} style={styles.textButton}>
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
      <RBSheet
        ref={rbSheet}
        openDuration={250}
        height={350}
        onClose={() => closeBS()}
      >
        <BSPopup
          title="Registrasi"
          text={`Anda telah berhasil register sebagai ${
            data?.name ? data?.name : data?.email
          }.\nSelamat datang di Daclen!`}
          buttonNegative="OK"
          buttonNegativeColor={colors.daclen_gray}
          logo="../../../assets/verified.png"
          closeThis={() => rbSheet.current.close()}
          onPress={null}
        />
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  containerScroll: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 60,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginTop: 32,
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
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_black,
    marginBottom: 20,
  },
});

const mapStateToProps = (store) => ({
  registerToken: store.userState.registerToken,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ updateReduxUserRegisterToken, setNewToken }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(CompleteRegistrationScreen);
