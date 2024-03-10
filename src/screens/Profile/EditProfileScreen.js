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
  updateReduxCurrentUserData,
} from "../../../axios/user";
import { clearMediaData, setMediaProfilePicture } from "../../../components/media";
import UserData from "../../../components/profile/UserData";
import Separator from "../../components/Separator";
import BSTextInput from "../../components/bottomsheets/BSTextInput";
import BSContainer from "../../components/bottomsheets/BSContainer";
//import BSPopup from "../bottomsheets/BSPopup";
import BSDatePicker from "../../components/bottomsheets/BSDatePicker";
import {
  selectbank,
  privacypolicy,
  bankinfodesc,
  genderchoices,
  birthdateplaceholder,
  bankinfodescset,
} from "../../../components/profile/constants";
import { colors, staticDimensions } from "../../../styles/base";
import { intiialPermissions, checkMediaPermissions } from "../../../components/media";
import BSMedia from "../../components/bottomsheets/BSMedia";
import { setObjectAsync } from "../../../components/asyncstorage";
import { ASYNC_USER_CURRENTUSER_KEY } from "../../../components/asyncstorage/constants";
import {
  convertDisplayLocaleDatetoDateObject,
} from "../../../axios/profile";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";
import Button from "../../components/Button/Button";

const defaultUploadingPhoto = {
  pending: false,
  uploading: false,
};

function EditProfileScreen(props) {
  const [user, setUser] = useState(UserData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(defaultUploadingPhoto);
  const [bottomList, setBottomList] = useState([]);
  const [genderArray, setGenderArray] = useState(genderchoices);
  const [bankName, setBankName] = useState("");
  const [displayDatePicker, setDisplayDatePicker] = useState(false);

  const { token, currentUser, currentAddress, userUpdate, userProfilePicture } =
    props;
  const navigation = useNavigation();
  const rbSheet = useRef();
  const rbSheetMedia = useRef();
  //const rbSheetAddress = useRef();

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
    setGenderArray(
      genderArray.map((item) =>
        item.value === currentUser?.detail_user?.jenis_kelamin
          ? { ...item, selected: true }
          : { ...item, selected: false },
      ),
    );
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
    //console.log(user?.bank_id, user?.bank_name);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (Platform.OS === "web" || props.profilePicture === null) {
      return;
    }
    console.log(
      "redux media profilePicture",
      props.profilePicture);
  }, [props.profilePicture]);

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
    } else if (userUpdate?.session === "photoError") {
      setSuccess(false);
      setError(
        userUpdate?.message === undefined ||
          userUpdate?.message === null ||
          userUpdate?.message === ""
          ? "Error mengambil foto baru"
          : userUpdate?.message,
      );
      setUploadingPhoto(defaultUploadingPhoto);
      props.setMediaProfilePicture(null, currentUser?.id);
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
        ({ selected }) => selected === true,
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
      executeUploadData(
        userProfilePicture
          ? userProfilePicture
          : currentUser?.detail_user?.foto,
      );
    }
  }

  const executeUploadPhoto = async () => {
    const result = await updateUserPhoto(
      currentUser?.id,
      token,
      props.profilePicture,
    );
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      props.setMediaProfilePicture(null, currentUser?.id);
      setSuccess(false);
      setError(result?.error ? result?.error : "Foto tidak berhasil disimpan");
    } else {
      props.getCurrentUser(token);
      setSuccess(true);
      setError("Foto berhasil disimpan");
    }
    if (loading) {
      setLoading(false);
    }
    if (uploadingPhoto.pending || uploadingPhoto.uploading) {
      setUploadingPhoto(defaultUploadingPhoto);
    }
  };

  const executeUploadData = (foto) => {
    props.updateUserData(
      currentUser?.id,
      user,
      currentAddress,
      token,
      currentUser,
      foto,
    );
  };

  /*function openFillAddress() {
    rbSheetAddress.current.close();
    navigation.navigate("LocationPin", {
      isNew: true,
      isDefault: true,
      savedRegion: null,
    });
  }*/

  function openDatePicker() {
    setDisplayDatePicker(true);
  }

  try {
    return (
      <CenteredView title="Edit Profil" style={styles.container}>
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
                  ? userProfilePicture
                    ? userProfilePicture
                    : require("../../assets/user.png")
                  : props.profilePicture
              }
              alt={user?.nama_lengkap}
              contentFit={
                Platform.OS === "ios" && userProfilePicture === null
                  ? "contain"
                  : "cover"
              }
              placeholder={
                Platform.OS === "ios" ? null : require("../../assets/user.png")
              }
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

          <Text allowFontScaling={false} style={styles.textCompulsory}>
            Nomor Telepon*
          </Text>
          {currentUser?.nomor_telp_verified_at && (
            <Text
              allowFontScaling={false}
              style={[styles.text, { marginBottom: 4 }]}
            >
              Telah diverifikasi pada
              {moment(currentUser?.nomor_telp_verified_at).format(
                " MMM DD YYYY, HH:mm",
              )}
            </Text>
          )}
          <TextInput
            value={user?.nomor_telp}
            style={[
              styles.textInput,
              {
                backgroundColor:
                  user?.nomor_telp === null || user?.nomor_telp === ""
                    ? colors.daclen_lightgrey
                    : colors.white,
              },
            ]}
            inputMode="decimal"
            editable={
              !(
                currentUser?.nomor_telp === undefined ||
                currentUser?.nomor_telp === null ||
                currentUser?.nomor_telp === ""
              )
            }
            onChangeText={(nomor_telp) => setUser({ ...user, nomor_telp })}
          />

          <Text allowFontScaling={false} style={styles.textCompulsory}>
            Email*
          </Text>
          {currentUser?.email_verified_at && (
            <Text
              allowFontScaling={false}
              style={[styles.text, { marginBottom: 4 }]}
            >
              Telah diverifikasi pada
              {moment(currentUser?.email_verified_at).format(
                " MMM DD YYYY, HH:mm",
              )}
            </Text>
          )}
          <TextInput
            value={user?.email}
            style={[
              styles.textInput,
              {
                backgroundColor:
                  user?.email === null || user?.email === ""
                    ? colors.daclen_lightgrey
                    : colors.white,
              },
            ]}
            editable={
              !(
                currentUser?.email === undefined ||
                currentUser?.email === null ||
                currentUser?.email === ""
              )
            }
            onChangeText={(email) => setUser({ ...user, email })}
          />

          <Text allowFontScaling={false} style={styles.textCompulsory}>
            Nama depan*
          </Text>
          <TextInput
            value={user?.nama_depan}
            style={[
              styles.textInput,
              {
                backgroundColor:
                  user?.nama_depan === null || user?.nama_depan === ""
                    ? colors.daclen_lightgrey
                    : colors.white,
              },
            ]}
            onChangeText={(nama_depan) => setUser({ ...user, nama_depan })}
            editable={
              currentUser?.bank_set === undefined || !currentUser?.bank_set
            }
          />
          <Text allowFontScaling={false} style={styles.text}>
            Nama belakang (opsional)
          </Text>
          <TextInput
            value={user?.nama_belakang}
            style={styles.textInput}
            onChangeText={(nama_belakang) =>
              setUser({ ...user, nama_belakang })
            }
            editable={
              currentUser?.bank_set === undefined || !currentUser?.bank_set
            }
          />

          <Text allowFontScaling={false} style={styles.text}>
            Jenis kelamin (opsional)
          </Text>
          <RadioGroup
            containerStyle={styles.radioGroup}
            radioButtons={genderArray}
            onPress={onPressRadioButtonGender}
            layout="row"
          />

          <Text allowFontScaling={false} style={styles.textCompulsory}>
            Tanggal Lahir*
          </Text>
          {Platform.OS === "web" ? (
            <TextInput
              value={user?.tanggal_lahir ? user?.tanggal_lahir : ""}
              style={[
                styles.textInput,
                {
                  backgroundColor:
                    user?.tanggal_lahir === null || user?.tanggal_lahir === ""
                      ? colors.daclen_lightgrey
                      : colors.white,
                },
              ]}
              placeholder={birthdateplaceholder}
              onChangeText={(tanggal_lahir) =>
                setUser({ ...user, tanggal_lahir })
              }
            />
          ) : (
            <BSTextInput
              value={user?.tanggal_lahir ? user?.tanggal_lahir : ""}
              onPress={() => openDatePicker()}
              style={[
                styles.textInput,
                {
                  backgroundColor:
                    user?.tanggal_lahir === null || user?.tanggal_lahir === ""
                      ? colors.daclen_lightgrey
                      : colors.white,
                },
              ]}
              placeholder={birthdateplaceholder}
              placeholderTextColor={colors.feed_desc_grey}
            />
          )}

          <Separator thickness={2} />

          <Text
            allowFontScaling={false}
            style={[
              styles.textCompulsory,
              {
                fontFamily: "Poppins",
                fontSize: 18,
                marginTop: 20,
                marginBottom: 4,
              },
            ]}
          >
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

          <Text allowFontScaling={false} style={styles.textCompulsory}>
            Nomor Rekening*
          </Text>
          <TextInput
            value={
              currentUser?.bank_set
                ? currentUser?.detail_user?.nomor_rekening
                  ? currentUser?.detail_user?.nomor_rekening
                  : ""
                : user?.nomor_rekening
            }
            style={[
              styles.textInput,
              {
                backgroundColor:
                  user?.nomor_rekening === null || user?.nomor_rekening === ""
                    ? colors.daclen_lightgrey
                    : colors.white,
              },
            ]}
            onChangeText={(nomor_rekening) =>
              setUser({ ...user, nomor_rekening })
            }
            inputMode="decimal"
            editable={
              currentUser?.bank_set === undefined || !currentUser?.bank_set
            }
          />

          <Text allowFontScaling={false} style={styles.textCompulsory}>
            Nama Bank*
          </Text>
          <BSTextInput
            disabled={loading || currentUser?.bank_set}
            onPress={() => openBottomSheet()}
            value={
              currentUser?.bank_set
                ? currentUser?.detail_user?.bank?.nama
                  ? currentUser?.detail_user?.bank?.nama
                  : ""
                : bankName
            }
            style={[
              styles.textInput,
              {
                backgroundColor: currentUser?.bank_set
                  ? colors.white
                  : colors.daclen_lightgrey,
                color: currentUser?.bank_set
                  ? colors.daclen_blue
                  : colors.daclen_black,
              },
            ]}
          />

          <Text allowFontScaling={false} style={styles.text}>
            Cabang Bank
          </Text>
          <TextInput
            value={
              currentUser?.bank_set
                ? currentUser?.detail_user?.cabang_bank
                  ? currentUser?.detail_user?.cabang_bank
                  : ""
                : user?.cabang_bank
            }
            style={styles.textInput}
            onChangeText={(cabang_bank) => setUser({ ...user, cabang_bank })}
            editable={
              currentUser?.bank_set === undefined || !currentUser?.bank_set
            }
          />

          <View style={styles.containerPrivacy}>
            <Text allowFontScaling={false} style={styles.textUid}>
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
            text="Simpan Profil"
            loading={loading || uploadingPhoto.pending || uploadingPhoto.uploading}
            onPress={() => updateUserData()}
            style={styles.button}
          />

          <Button
            inverted
            fontColor={colors.daclen_danger}
            text="Hapus Akun Daclen"
            disabled={loading}
            onPress={() => navigation.navigate("DeleteAccount")}
            style={styles.button}
          />


        </ScrollView>
        <AlertBox text={error} success={success} onClose={() => setError(null)} />
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
        {displayDatePicker ? (
          <BSDatePicker
            currentDate={
              user?.tanggal_lahir
                ? convertDisplayLocaleDatetoDateObject(user?.tanggal_lahir)
                : new Date()
            }
            onPress={(tanggal_lahir) => setUser({ ...user, tanggal_lahir })}
            onError={(e) => setError(e.toString())}
            closeThis={() => setDisplayDatePicker(false)}
          />
        ) : null}
      </CenteredView>
    );
  } catch (e) {
    return (
      <CenteredView title="Edit Profil" style={styles.container}>
        <Text allowFontScaling={false} style={styles.textUid}>
          {e?.message}
        </Text>
      </CenteredView>
    );
  }
}

/*
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
*/

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
    zIndex: 10,
    padding: 4,
    backgroundColor: "transparent",
    borderRadius: 101,
  },
  containerPhotoSpinner: {
    position: "absolute",
    top: 0,
    start: 0,
    width: 202,
    height: 202,
    backgroundColor: "transparent",
    zIndex: 6,
    borderRadius: 101,
    justifyContent: "center",
    alignItems: "center",
  },
  containerEdit: {
    position: "absolute",
    end: 10,
    bottom: 10,
    zIndex: 12,
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
    backgroundColor: colors.daclen_light,
    borderColor: colors.daclen_lightgrey,
    borderWidth: 1,
    aspectRatio: 1 / 1,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontFamily: "Poppins",
    marginHorizontal: 20,
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 20,
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
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
    fontFamily: "Poppins",
    fontSize: 14,
  },
  radioGroup: {
    marginTop: 4,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: staticDimensions.marginHorizontal,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  userProfilePicture: store.userState.profilePicture,
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
      clearMediaData,
      getCurrentUser,
      updateReduxCurrentUserData,
      setMediaProfilePicture,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(EditProfileScreen);
