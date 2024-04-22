import React, { useState, useEffect, useRef } from "react";
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
  Keyboard,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import TextInputPassword from "../../../components/auth/TextInputPassword";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { deleteAccount, setNewToken, clearUserData } from "../../axios/user";
import { colors } from "../../styles/base";
import BSPopup from "../../components/bottomsheets/BSPopup";
import { userLogOut } from "../../utils/auth";
import CenteredView from "../../components/view/CenteredView";

function DeleteAccountScreen(props) {
  const { currentUser, token, authDelete } = props;
  const navigation = useNavigation();
  const rbSheet = useRef();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [auth, setAuth] = useState({
    email: currentUser?.email,
    password: "",
  });

  const attemptLogout = async () => {
    await userLogOut(props, null);
    navigation.navigate("Main");
  };

  useEffect(() => {
    if (currentUser === null || token === null) {
      setError("Anda harus login dahulu");
    }
  }, [currentUser, token]);

  useEffect(() => {
    console.log(authDelete);
    if (loading) {
      if (
        authDelete?.id === currentUser?.id &&
        authDelete?.username === currentUser?.username
      ) {
        setError(null);
        setSuccess(true);
      } else {
        setError(authDelete?.message);
        setSuccess(false);
      }
      setLoading(false);
    }
  }, [authDelete]);

  useEffect(() => {
    if (success) {
      rbSheet.current.open();
    }
  }, [success]);

  const proceedDelete = () => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    props.deleteAccount(auth?.email, auth?.password);
  };

  return (
    <CenteredView title="Hapus Akun" style={styles.container} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          error && (
            <Text allowFontScaling={false}
              style={[
                styles.textError,
                success && { backgroundColor: colors.daclen_green },
              ]}
            >
              {error}
            </Text>
          )
        )}
        <View style={styles.containerLogo}>
          <Image
            source={require("../../assets/email.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.containerContent}>
          <Text allowFontScaling={false} style={styles.textHeader}>Penghapusan Akun Daclen</Text>
          <Text allowFontScaling={false} style={styles.text}>
            Mohon mengisi alamat email aktif yang digunakan oleh Anda beserta
            dengan password akun. Tim admin akan mengirimkan instruksi dan link
            untuk penghapusan akun dalam waktu 3 hari kerja.
          </Text>
          <Text allowFontScaling={false}
            style={[
              styles.text,
              {
                color: colors.daclen_danger,
                fontFamily: "Poppins-Bold",
                marginBottom: 20,
              },
            ]}
          >
            Aksi ini akan menghapus seluruh data user Anda secara permanen,
            termasuk identitas diri, data alamat, komisi dan poin, checkout dan
            pengiriman.
          </Text>

          {success ? null : (
            <View>
              <Text allowFontScaling={false} style={styles.textInputHeader}>Alamat Email Aktif</Text>
              <TextInput
                placeholder={
                  auth?.email
                    ? currentUser?.email
                    : "Isi dengan alamat email aktif"
                }
                style={styles.textInput}
                onChangeText={(email) => setAuth({ ...auth, email })}
              />
              <Text allowFontScaling={false} style={styles.textInputHeader}>Password</Text>
              <TextInputPassword
                style={styles.textInput}
                onChangeText={(password) => setAuth({ ...auth, password })}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => proceedDelete()}
            style={[
              styles.button,
              loading && { backgroundColor: colors.daclen_gray },
            ]}
            disabled={loading || success}
          >
            <Text allowFontScaling={false} style={styles.textButton}>Hapus Akun Daclen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <RBSheet customStyles={{
          wrapper: {
            zIndex: 1,
          },
          container: {
            backgroundColor: "transparent",
          },
        }} 
        ref={rbSheet}
        openDuration={250}
        height={350}
        onClose={() => attemptLogout()}
      >
        <BSPopup
          title="Pengajuan Berhasil"
          text="Email dan password Anda telah berhasil diverifikasi. Anda akan menerima email dalam 3 hari kerja dan otomatis logout dari akun Daclen."
          buttonNegative="OK"
          buttonNegativeColor={colors.daclen_gray}
          logo="../../assets/verified.png"
          onPress={null}
          closeThis={() => rbSheet.current.close()}
        />
      </RBSheet>
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  containerContent: {
    marginHorizontal: 20,
    backgroundColor: "white",
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
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    color: colors.daclen_black,
  },
  text: {
    fontFamily: "Poppins", fontSize: 14,
    marginVertical: 10,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    fontFamily: "Poppins", fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 40,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_danger,
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
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  authDelete: store.userState.authDelete,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      deleteAccount,
      setNewToken,
      clearUserData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(DeleteAccountScreen);
