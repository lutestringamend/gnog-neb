import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioGroup from "react-native-radio-buttons-group";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  updateUserData,
  getBank,
  updateUserPhoto,
  getCurrentUser,
} from "../../axios/user";
import { clearMediaData } from "../media";
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
import { colors, blurhash, staticDimensions } from "../../styles/base";
import { intiialPermissions, checkMediaPermissions } from "../media";
import BSMedia from "../bottomsheets/BSMedia";
import { setObjectAsync } from "../asyncstorage";
import { ASYNC_USER_CURRENTUSER_KEY } from "../asyncstorage/constants";

function EditProfile(props) {
  const [user, setUser] = useState(UserData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState({
    pending: false,
    uploading: false,
  });
  const [bottomList, setBottomList] = useState([]);
  const [genderArray, setGenderArray] = useState(genderchoices);
  const [bankName, setBankName] = useState("");

  const { token, currentUser, currentAddress, userUpdate } = props;
  const navigation = useNavigation();
  const rbSheet = useRef();
  const rbSheetMedia = useRef();
  const rbSheetAddress = useRef();

  const [permissions, setPermissions] = useState(intiialPermissions);
  const exitRightAway = props.route.params?.exitRightAway
    ? props.route.params?.exitRightAway
    : false;

  useEffect(() => {
    const initiatePermission = async () => {
      let newPermissions = await checkMediaPermissions();
      setPermissions(newPermissions);
    };
    props.clearMediaData();
    if (permissions === intiialPermissions) {
      initiatePermission();
    }
  }, []);

  /*useEffect(() => {
    console.log({ permissions });
  }, [permissions]);*/

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
    if (uploadingPhoto?.pending) {
      setUploadingPhoto({
        pending: false,
        uploading: true,
      });
      executeUploadPhoto();
    }
    /*if (userUpdate?.session === "success") {
      setObjectAsync(ASYNC_USER_CURRENTUSER_KEY, currentUser);
    }*/

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
    setGenderArray(
      genderArray.map((item) =>
        item.value === currentUser?.detail_user?.jenis_kelamin
          ? { ...item, selected: true }
          : { ...item, selected: false }
      )
    );
    console.log("EditProfile currentUser", currentUser);
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
    //console.log(user?.bank_id, user?.bank_name);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    //debug purposes
    /*if (currentUser?.id === 8054 && props.profilePicture !== null) {
      let uri = Platform.OS === "web" ? "base64" : props.profilePicture;
      let type = getMimeType(props.profilePicture);
      let name = getProfilePictureName(
        currentUser?.id,
        type,
        props.profilePicture
      );
      setError(`uri ${uri}\ntype ${type}\nname ${name}`);
    }*/
    if (uploadingPhoto.uploading) {
      setUploadingPhoto({
        pending: false,
        uploading: false,
      });
    }
    console.log(
      "redux media profilePicture",
      props.profilePicture === null ? null : "not null"
    );
  }, [props.profilePicture]);

  useEffect(() => {
    if (loading) {
      if (userUpdate?.session === "success") {
        props.getCurrentUser(token);
        setSuccess(true);
        setError(userUpdate?.message);
        if (exitRightAway) {
          navigation.goBack();
        }
      } else {
        setSuccess(false);
        let errorHeader = "Gagal update data user\n";
        switch (userUpdate?.session) {
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
        setError(`${errorHeader}${userUpdate?.message}`);
      }
      setLoading(false);
    } else if (userUpdate?.session === "photoError") {
      setSuccess(false);
      setError("Error mengambil foto baru\n" + userUpdate?.message);
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
      } else if (token !== null) {
        setLoading(true);
        props.getBank(token);
      }
    }
  }

  function getBSValue(item) {
    if (
      !(
        item?.id === undefined ||
        item?.id === null ||
        item?.nama === undefined ||
        item?.nama === null ||
        item?.id == user?.bank_id
      )
    ) {
      setUser({
        ...user,
        bank_id: item?.id,
        bank_name: item?.nama,
      });
      setBankName(item?.nama);
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
    } else if (
      user?.bank_id === "" ||
      user?.bank_name === "" ||
      user?.bank_id === null ||
      user?.bank_name === null
    ) {
      setError("Nama Bank harus dipilih");
    } else if (user?.nomor_telp === "") {
      setError("Nomor Telepon harus diisi");
    } else if (!loading && token !== null && currentUser?.id !== undefined) {
      setLoading(true);
      if (
        !(
          props.profilePicture === null ||
          props.profilePicture === undefined ||
          props.profilePicture === ""
        )
      ) {
        setUploadingPhoto({
          pending: true,
          uploading: false,
        });
      }
      executeUploadData(currentUser?.detail_user?.foto);
    }
  }

  const executeUploadPhoto = () => {
    props.updateUserPhoto(currentUser?.id, token, props.profilePicture);
  };

  const executeUploadData = (foto) => {
    props.updateUserData(
      currentUser?.id,
      user,
      currentAddress,
      token,
      currentUser,
      foto
    );
  };

  function openFillAddress() {
    rbSheetAddress.current.close();
    navigation.navigate("Address");
  }

  try {
    return (
      <View style={styles.container}>
        {error ? (
          <Text
            style={[
              styles.textError,
              success && { backgroundColor: colors.daclen_green },
            ]}
          >
            {error}
          </Text>
        ) : null}
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity
            style={[
              styles.containerPhoto,
              {
                opacity:
                  uploadingPhoto.pending || uploadingPhoto.uploading ? 0.6 : 1,
              },
            ]}
            onPress={() => rbSheetMedia.current.open()}
          >
            <Image
              style={styles.image}
              source={
                props.profilePicture === undefined ||
                props.profilePicture === null ||
                props.profilePicture === ""
                  ? currentUser === null ||
                    currentUser?.detail_user === undefined ||
                    currentUser?.detail_user === null ||
                    currentUser?.detail_user?.foto === undefined ||
                    currentUser?.detail_user?.foto === null ||
                    currentUser?.detail_user?.foto === ""
                    ? require("../../assets/user.png")
                    : currentUser?.detail_user?.foto
                  : props.profilePicture
              }
              alt={user?.nama_lengkap}
              contentFit="cover"
              placeholder={blurhash}
              transition={100}
            />
            {uploadingPhoto.pending || uploadingPhoto.uploading ? (
              <View style={styles.containerPhotoSpinner}>
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_orange}
                  style={{ alignSelf: "center" }}
                />
              </View>
            ) : (
              <View style={styles.containerEdit}>
                <MaterialCommunityIcons
                  name="image-edit"
                  size={28}
                  color="white"
                />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.textCompulsory}>Nomor Telepon*</Text>
          {currentUser?.nomor_telp_verified_at && (
            <Text style={[styles.text, { marginBottom: 4 }]}>
              Telah diverifikasi pada
              {moment(currentUser?.nomor_telp_verified_at).format(
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
          {currentUser?.email_verified_at && (
            <Text style={[styles.text, { marginBottom: 4 }]}>
              Telah diverifikasi pada
              {moment(currentUser?.email_verified_at).format(
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
            value={bankName}
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
              {
                backgroundColor:
                  loading || uploadingPhoto.pending || uploadingPhoto.uploading
                    ? colors.daclen_gray
                    : colors.daclen_blue,
              },
            ]}
            disabled={loading}
          >
            {loading || uploadingPhoto.pending || uploadingPhoto.uploading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_light}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <Text style={styles.textButton}>Simpan Profil</Text>
            )}
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
    width: "100%",
  },
  scrollView: {
    flex: 1,
    paddingBottom: staticDimensions.pageBottomPadding,
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
  containerPhotoSpinner: {
    position: "absolute",
    top: 0,
    start: 0,
    width: 202,
    height: 202,
    backgroundColor: "transparent",
    zIndex: 6,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 6,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
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
    {
      updateUserData,
      getBank,
      updateUserPhoto,
      clearMediaData,
      getCurrentUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(EditProfile);
