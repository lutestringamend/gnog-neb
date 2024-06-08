import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  updateUserData,
  getBank,
  getCurrentUser,
  updateReduxCurrentUserData,
} from "../../../axios/user";
import UserData from "../../../components/profile/UserData";
import {
  privacypolicy,
  bankinfodesc,
  bankinfodescset,
} from "../../../components/profile/constants";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import { setObjectAsync } from "../../../components/asyncstorage";
import { ASYNC_USER_CURRENTUSER_KEY } from "../../../components/asyncstorage/constants";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";
import Button from "../../components/Button/Button";
import { globalUIRatio } from "../../styles/base";
import TextInputLabel from "../../../components/textinputs/TextInputLabel";
import TextInputButton from "../../components/textinputs/TextInputButton";

function EditBankDetails(props) {
  const [user, setUser] = useState(UserData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(UserData);
  const [success, setSuccess] = useState(false);
  const [bankName, setBankName] = useState("");

  const { token, currentUser, currentAddress, userUpdate } =
    props;
  const navigation = useNavigation();
  const rbSheet = useRef();


  const exitRightAway = props.route.params?.exitRightAway
    ? props.route.params?.exitRightAway
    : false;


  useEffect(() => {
    if (
      currentUser === undefined ||
      currentUser === null ||
      currentUser?.id === undefined
    ) {
      setLoading(false);
      return;
    }
    setLoading(true);
    if (userUpdate?.session === "success") {
      setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, currentUser);
    }

    setUser({
      nama_lengkap: currentUser?.detail_user?.nama_lengkap,
      email: currentUser?.email,
      nomor_telp: currentUser?.nomor_telp,
      jenis_kelamin: currentUser?.detail_user?.jenis_kelamin,
      tanggal_lahir: currentUser?.detail_user?.tanggal_lahir,
      nomor_rekening: currentUser?.detail_user?.nomor_rekening,
      bank_name: currentUser?.detail_user?.bank?.nama,
      bank_id: currentUser?.detail_user?.bank?.id,
      cabang_bank: currentUser?.detail_user?.cabang_bank,
      nama_depan: currentUser?.detail_user?.nama_depan,
      nama_belakang: currentUser?.detail_user?.nama_belakang,
    });
    //console.log("EditProfile currentUser", currentUser);
    let newBankId = currentUser?.detail_user?.bank?.id;
    if (
      props.banks?.length === undefined ||
      props.banks?.length < 1 ||
      newBankId === undefined ||
      newBankId === null
    ) {
      setBankName(currentUser?.detail_user?.bank?.nama);
      return;
    }
    for (let bank of props.banks) {
      if (bank?.id === newBankId) {
        setBankName(bank?.nama);
        return;
      }
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("user data", user);
    setLoading(false);
  }, [user]);


  useEffect(() => {
    if (loading) {
      if (userUpdate?.session === "success") {
        //props.getCurrentUser(token);
        setSuccess(true);
        setError(userUpdate?.message);
        if (exitRightAway) {
          navigation.goBack();
        }
      } else {
        setSuccess(false);
        let errorHeader = "Gagal update data user.\n";
        switch (userUpdate?.session) {
          case "photoError":
            errorHeader = "Gagal upload foto\n";
            break;
          case "photoUri":
            errorHeader = "URI foto\n";
            break;
          default:
            break;
        }
        setError(`${errorHeader}${userUpdate?.message}`);
      }
      setLoading(false);
    }
  }, [userUpdate]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      setBottomList(props.banks);
      rbSheet.current.open();
    }
    //console.log(props.banks);
  }, [props.banks]);


  function openBottomSheet() {
    if (!loading) {
      if (props.banks?.length > 0) {
        setBottomList(props.banks);
        rbSheet.current.open();
      } else if (token !== null) {
        setLoading(true);
        props.getBank(token);
      }
    }
  }



  function updateUserData() {
    if (user?.nama_depan === "") {
      setError("Nama Depan harus diisi");
    } else if (user?.email === "") {
      setError("Email harus diisi");
    } else if (user?.tanggal_lahir === "") {
      setError("Tanggal Lahir harus diisi");
    } else if (user?.nomor_telp === "") {
      setError("Nomor Telepon harus diisi");
    } else if (
      user?.nomor_telp?.length === undefined ||
      user?.nomor_telp?.length < 8
    ) {
      setError("Nomor Telepon yang anda masukkan salah");
    } else if (
      (currentUser?.bank_set === undefined || !currentUser?.bank_set) &&
      (user?.bank_id === "" ||
        user?.bank_name === "" ||
        user?.bank_id === null ||
        user?.bank_name === null ||
        user?.nomor_rekening === "" ||
        user?.nomor_rekening?.length < 6)
    ) {
      console.log("user", user);
      setError("Nama Bank dan Nomor Rekening harus diisi dengan benar");
    } else if (!loading && token !== null && currentUser?.id !== undefined) {
      setLoading(true);
      executeUploadData(currentUser?.detail_user?.foto);
    }
  }


  const executeUploadData = (foto) => {
    props.updateUserData(
      currentUser?.id,
      user,
      currentAddress,
      token,
      currentUser,
    );
  };



  return (
    <CenteredView title="Edit Profil" style={styles.container}>
        <ScrollView style={styles.scrollView}>
      
          <Text allowFontScaling={false} style={styles.textHeader}>
            Info Bank
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.text, { marginBottom: 20, textAlign: "justify" }]}
          >
            {currentUser?.bank_set === undefined || !currentUser?.bank_set
              ? bankinfodesc
              : bankinfodescset}
          </Text>

          <TextInputLabel
            label="Nomor Rekening"
            compulsory
            value={
              currentUser?.bank_set
                ? currentUser?.detail_user?.nomor_rekening
                  ? currentUser?.detail_user?.nomor_rekening
                  : ""
                : user?.nomor_rekening
            }
            error={errors?.nomor_rekening}
            onChangeText={(nomor_rekening) =>
              setUser({ ...user, nomor_rekening })
            }
            inputMode="decimal"
            editable={
              currentUser?.bank_set === undefined || !currentUser?.bank_set
            }
            containerStyle={styles.textInput}
          />

          <TextInputButton
            label="Nama Bank"
            compulsory
            disabled={loading || currentUser?.bank_set}
            onPress={() => openBottomSheet()}
            value={
              currentUser?.bank_set
                ? currentUser?.detail_user?.bank?.nama
                  ? currentUser?.detail_user?.bank?.nama
                  : ""
                : bankName
            }
            error={errors?.bank_name}
            containerStyle={styles.textInput}
          />

          <TextInputLabel
            label="Cabang Bank"
            value={user?.cabang_bank ? user?.cabang_bank :
              currentUser?.bank_set
                ? currentUser?.detail_user?.cabang_bank
                  ? currentUser?.detail_user?.cabang_bank
                  : "" : ""
            }
            error={errors.cabang_bank}
            containerStyle={styles.textInput}
            onChangeText={(cabang_bank) => setUser({ ...user, cabang_bank })}
            editable={
              currentUser?.bank_set === undefined || !currentUser?.bank_set
            }
          />

          <View style={styles.containerPrivacy}>
            <Text allowFontScaling={false} style={styles.text}>
              Informasi di atas akan digunakan untuk pengiriman Checkout Anda
              dan dikirimkan ke pihak ketiga sebagai jasa pengantaran.
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Webview", {
                  webKey: "privacy",
                  text: privacypolicy,
                })
              }
              disabled={loading}
            >
              <Text allowFontScaling={false} style={styles.textChange}>
                Baca {privacypolicy}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            text="Simpan Info Bank"
            loading={loading}
            onPress={() => updateUserData()}
            style={styles.button}
          />

       
        </ScrollView>
        <AlertBox
          text={error}
          success={success}
          onClose={() => setError(null)}
        />

      </CenteredView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: dimensions.fullWidthAdjusted,
  },
  scrollView: {
    flex: 1,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerPrivacy: {
    marginBottom: 20 * globalUIRatio,
    alignItems: "center",
  },
  textHeader: {
    fontSize: 18 * globalUIRatio,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.black,
    marginTop: 20 * globalUIRatio,
    marginBottom: 10 * globalUIRatio,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  text: {
    fontSize: 12 * globalUIRatio,
    fontFamily: "Poppins-Light",
    backgroundColor: "transparent",
    color: colors.black,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  textChange: {
    color: colors.daclen_black,
    fontSize: 14 * globalUIRatio,
    fontFamily: "Poppins-Medium",
    marginVertical: 6 * globalUIRatio,
    marginHorizontal: 20 * globalUIRatio,
  },
  textInput: {
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  button: {
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: staticDimensions.marginHorizontal,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  currentAddress: store.userState.currentAddress,
  userUpdate: store.userState.userUpdate,
  banks: store.userState.banks,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateUserData,
      getBank,
      getCurrentUser,
      updateReduxCurrentUserData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(EditBankDetails);
