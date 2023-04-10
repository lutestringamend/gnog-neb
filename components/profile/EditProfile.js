import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioGroup from "react-native-radio-buttons-group";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { updateUserData, getBank, updateUserPhoto } from "../../axios/user";
import { clearMediaData, getMimeType, getProfilePictureName } from "../media";
import UserData from "./UserData";
import Separator from "./Separator";
import BSTextInput from "../bottomsheets/BSTextInput";
import BSContainer from "../bottomsheets/BSContainer";
import BSPopup from "../bottomsheets/BSPopup";
import {
  selectbank,
  privacypolicy,
  bankinfodesc,
  genderchoices,
  birthdateplaceholder,
} from "./constants";
import { colors, dimensions } from "../../styles/base";
import { intiialPermissions, checkMediaPermissions } from "../media";
import BSMedia from "../bottomsheets/BSMedia";

function EditProfile(props) {
  const [user, setUser] = useState(UserData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bottomList, setBottomList] = useState([]);
  const [genderArray, setGenderArray] = useState(genderchoices);

  const navigation = useNavigation();
  const rbSheet = useRef();
  const rbSheetMedia = useRef();
  const rbSheetAddress = useRef();

  const [permissions, setPermissions] = useState(intiialPermissions);

  useEffect(() => {
    const initiatePermission = async () => {
      let newPermissions = await checkMediaPermissions();
      setPermissions(newPermissions);
    }
    props.clearMediaData();
    if (permissions === intiialPermissions) {
      initiatePermission();
    }
  }, []);

  useEffect(() => {
    console.log({ permissions });
  }, [permissions]);

  useEffect(() => {
    //console.log(props.currentUser);
    if (props.currentUser !== null && props.currentUser !== undefined) {
      setLoading(true);
      setUser({
        nama_lengkap: props.currentUser?.detail_user?.nama_lengkap,
        email: props.currentUser?.email,
        nomor_telp: props.currentUser?.nomor_telp,
        jenis_kelamin: props.currentUser?.detail_user?.jenis_kelamin,
        tanggal_lahir: props.currentUser?.detail_user?.tanggal_lahir,
        nomor_rekening: props.currentUser?.detail_user?.nomor_rekening,
        bank_name: props.currentUser?.detail_user?.bank?.nama,
        bank_id: props.currentUser?.detail_user?.bank?.id,
        cabang_bank: props.currentUser?.detail_user?.cabang_bank,
        nama_depan: props.currentUser?.detail_user?.nama_depan,
        nama_belakang: props.currentUser?.detail_user?.nama_belakang,
      });
      setGenderArray(
        genderArray.map((item) =>
          item.value === props.currentUser?.detail_user?.jenis_kelamin
            ? { ...item, selected: true }
            : { ...item, selected: false }
        )
      );
    } else {
      setLoading(false);
    }
  }, [props.currentUser]);

  useEffect(() => {
    //console.log(user?.bank_id, user?.bank_name);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    //debug purposes
    if (props.currentUser?.id === 8054 && props.profilePicture !== null) {
      let uri = Platform.OS === "web" ? "base64" : props.profilePicture;
      let type =  getMimeType(props.profilePicture);
      let name =  getProfilePictureName(props.currentUser?.id, type, props.profilePicture);
      setError(`uri ${uri}\ntype ${type}\nname ${name}`);
    }
  }, [props.profilePicture]);

  useEffect(() => {
    if (loading) {
      if (props.userUpdate?.session === "success") {
        setSuccess(true);
        setError(props.userUpdate?.message);
      } else {
        setSuccess(false);
        let errorHeader = "Gagal update data user\n";
        switch (props.userUpdate?.session) {
          case "photoError":
            errorHeader = "Gagal upload foto\n";
            break;
          case "photoUri":
            errorHeader = "URI foto\n";
            break;
          case "addressIncomplete":
            rbSheetAddress.current.open();
            break;
          default:
            break;
        }
        setError(`${errorHeader}${props.userUpdate?.message}`);
      }
      setLoading(false);
    } else if (props.userUpdate?.session === "photoError") {
      setSuccess(false);
      setError("Error mengambil foto baru\n" + props.userUpdate?.message);
    }
  }, [props.userUpdate]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      setBottomList(props.banks);
      rbSheet.current.open();
    }
    //console.log(props.banks);
  }, [props.banks]);

  function onPressRadioButtonGender(radioButtonsArray) {
    try {
      const chosen = radioButtonsArray.find(
        ({ selected }) => selected === true
      );
      setUser({ ...user, jenis_kelamin: chosen.value });
    } catch (e) {
      console.log(e);
    }
  }

  function openBottomSheet() {
    if (!loading) {
      if (props.banks?.length > 0) {
        setBottomList(props.banks);
        rbSheet.current.open();
      } else if (props.token !== null) {
        setLoading(true);
        props.getBank(props.token);
      }
    }
  }

  function getBSValue(item) {
    if (
      item?.id !== null &&
      item?.id !== undefined &&
      item?.id !== user?.bank_id
    ) {
      setUser({
        ...user,
        bank_id: item?.id,
        bank_name: item?.nama,
      });
    }
    //console.log(JSON.stringify(item));
    rbSheet.current.close();
  }

  function updateUserData() {
    if (user?.nama_depan === "") {
      setError("Nama Depan harus diisi");
    } else if (user?.email === "") {
      setError("Email harus diisi");
    } else if (user?.nomor_rekening === "") {
      setError("Nomor Rekening harus diisi");
    } else if (user?.bank_id === "" || user?.bank_name === "" || user?.bank_id === null || user?.bank_name === null) {
      setError("Nama Bank harus dipilih");
    } else if (user?.nomor_telp === "") {
      setError("Nomor Telepon harus diisi");
    } else if (
      !loading &&
      props.token !== null &&
      props.currentUser?.id !== undefined
    ) {
      setLoading(true);
      props.updateUserData(
        props.currentUser?.id,
        user,
        props.currentAddress,
        props.token
      );
      if (
        props.profilePicture !== null &&
        props.profilePicture !== undefined &&
        props.profilePicture !== ""
      ) {
        props.updateUserPhoto(
          props.currentUser?.id,
          props.token,
          props.profilePicture
        );
      }
    }
  }

  function openFillAddress() {
    rbSheetAddress.current.close();
    navigation.navigate("Address");
  }

  try {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          error && (
            <Text
              style={[
                styles.textError,
                success && { backgroundColor: colors.daclen_green },
              ]}
            >
              {error}
            </Text>
          )
        )}
          <TouchableOpacity
            style={styles.containerPhoto}
            onPress={() => rbSheetMedia.current.open()}
          >
            <Image
              style={styles.image}
              source={
                props.profilePicture !== null &&
                props.profilePicture !== undefined
                  ? { uri: props.profilePicture }
                  : props.currentUser?.detail_user?.foto !== ""
                  ? { uri: props.currentUser?.detail_user?.foto }
                  : require("../../assets/user.png")
              }
              alt={user?.nama_lengkap}
            />
            <View style={styles.containerEdit}>
              <MaterialCommunityIcons
                name="image-edit"
                size={28}
                color="white"
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.textCompulsory}>Nomor Telepon*</Text>
          {props.currentUser?.nomor_telp_verified_at && (
            <Text style={[styles.text, { marginBottom: 4 }]}>
              Telah diverifikasi pada
              {moment(props.currentUser?.nomor_telp_verified_at).format(
                " MMM DD YYYY, HH:mm"
              )}
            </Text>
          )}
          <TextInput
            value={user?.nomor_telp}
            style={styles.textInput}
            onChangeText={(nomor_telp) => setUser({ ...user, nomor_telp })}
          />

          <Text style={styles.textCompulsory}>Email*</Text>
          {props.currentUser?.email_verified_at && (
            <Text style={[styles.text, { marginBottom: 4 }]}>
              Telah diverifikasi pada
              {moment(props.currentUser?.email_verified_at).format(
                " MMM DD YYYY, HH:mm"
              )}
            </Text>
          )}
          <TextInput
            value={user?.email}
            style={styles.textInput}
            onChangeText={(email) => setUser({ ...user, email })}
          />

          <Text style={styles.textCompulsory}>Nama depan*</Text>
          <TextInput
            value={user?.nama_depan}
            style={styles.textInput}
            onChangeText={(nama_depan) => setUser({ ...user, nama_depan })}
          />
          <Text style={styles.text}>Nama belakang (opsional)</Text>
          <TextInput
            value={user?.nama_belakang}
            style={styles.textInput}
            onChangeText={(nama_belakang) =>
              setUser({ ...user, nama_belakang })
            }
          />

          <Text style={styles.text}>Jenis kelamin (opsional)</Text>
          <RadioGroup
            containerStyle={styles.radioGroup}
            radioButtons={genderArray}
            onPress={onPressRadioButtonGender}
            layout="row"
          />

          <Text style={styles.text}>Tanggal Lahir (opsional)</Text>
          <TextInput
            value={user?.tanggal_lahir}
            style={styles.textInput}
            placeholder={birthdateplaceholder}
            onChangeText={(tanggal_lahir) =>
              setUser({ ...user, tanggal_lahir })
            }
          />

          <Separator thickness={2} />

          <Text
            style={[
              styles.textCompulsory,
              { fontSize: 18, marginTop: 20, marginBottom: 4 },
            ]}
          >
            Info Bank
          </Text>
          <Text
            style={[styles.text, { marginBottom: 20, textAlign: "justify" }]}
          >
            {bankinfodesc}
          </Text>

          <Text style={styles.textCompulsory}>Nomor Rekening*</Text>
          <TextInput
            value={user?.nomor_rekening}
            style={styles.textInput}
            onChangeText={(nomor_rekening) =>
              setUser({ ...user, nomor_rekening })
            }
          />

          <Text style={styles.textCompulsory}>Nama Bank*</Text>
          <BSTextInput
            disabled={loading}
            onPress={() => openBottomSheet()}
            value={user?.bank_name}
            style={styles.textInput}
          />

          <Text style={styles.text}>Cabang Bank</Text>
          <TextInput
            value={user?.cabang_bank}
            style={styles.textInput}
            onChangeText={(cabang_bank) => setUser({ ...user, cabang_bank })}
          />

          <View style={styles.containerPrivacy}>
            <Text style={styles.textUid}>
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
              <Text style={styles.textChange}>Baca {privacypolicy}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => updateUserData()}
            style={[
              styles.button,
              loading && { backgroundColor: colors.daclen_gray },
            ]}
            disabled={loading}
          >
            <Text style={styles.textButton}>Simpan Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("DeleteAccount")}
            style={[
              styles.button,
              loading
                ? { backgroundColor: colors.daclen_gray }
                : { backgroundColor: colors.daclen_danger },
            ]}
            disabled={loading}
          >
            <Text style={styles.textButton}>Hapus Akun Daclen</Text>
          </TouchableOpacity>
        </ScrollView>
        <RBSheet ref={rbSheetMedia} openDuration={250} height={300}>
          <BSMedia
            mediaKey="profilePicture"
            title="Ganti Profile Picture"
            closeThis={() => rbSheetMedia.current.close()}
          />
        </RBSheet>
        <RBSheet ref={rbSheet} openDuration={250} height={250}>
          <BSContainer
            title={selectbank}
            list={bottomList}
            closeThis={() => rbSheet.current.close()}
            onPress={(item) => getBSValue(item)}
          />
        </RBSheet>
        <RBSheet ref={rbSheetAddress} openDuration={250} height={350}>
          <BSPopup
            title="Alamat Pengiriman Kosong"
            text="Anda harus mengisi alamat pengiriman di akun ini sebelum Anda bisa update profil Anda"
            buttonPositive="Isi Alamat"
            buttonPositiveColor={colors.daclen_blue}
            buttonNegative="Tutup"
            buttonNegativeColor={colors.daclen_gray}
            icon="truck-delivery"
            closeThis={() => rbSheetAddress.current.close()}
            onPress={() => openFillAddress()}
          />
        </RBSheet>
      </View>
    );
  } catch (e) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
        <Text style={styles.textUid}>{e?.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: dimensions.fullWidth,
  },
  scrollView: {
    flex: 1,
    paddingBottom: dimensions.pageBottomPadding,
  },
  containerPrivacy: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  containerPhoto: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32,
    marginHorizontal: 20,
    width: 202,
    height: 202,
    alignSelf: "center",
    elevation: 10,
    padding: 4,
    backgroundColor: colors.daclen_orange,
    borderRadius: 100,
  },
  containerEdit: {
    position: "absolute",
    end: 10,
    bottom: 10,
    elevation: 12,
    backgroundColor: colors.daclen_orange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: colors.daclen_lightgrey,
    borderWidth: 1,
    aspectRatio: 1 / 1,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
    marginHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 14,
  },
  radioGroup: {
    marginTop: 4,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_black,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  currentAddress: store.userState.currentAddress,
  userUpdate: store.userState.userUpdate,
  banks: store.userState.banks,
  profilePicture: store.mediaState.profilePicture,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { updateUserData, getBank, updateUserPhoto, clearMediaData },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(EditProfile);
