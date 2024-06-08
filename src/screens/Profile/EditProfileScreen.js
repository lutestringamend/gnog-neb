import React, { useState, useEffect, useRef } from "react";
import {
  View,
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

import { useNavigation } from "@react-navigation/native";
import moment from "moment";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  updateUserData,
  updateUserPhoto,
  getCurrentUser,
  updateReduxCurrentUserData,
} from "../../../axios/user";
import {
  clearMediaData,
  setMediaProfilePicture,
} from "../../../components/media";
import UserData from "../../../components/profile/UserData";
import Separator from "../../components/Separator";
import BSDatePicker from "../../components/bottomsheets/BSDatePicker";
import {
  privacypolicy,
  genderchoices,
} from "../../../components/profile/constants";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import {
  intiialPermissions,
  checkMediaPermissions,
} from "../../../components/media";
import BSMedia from "../../components/bottomsheets/BSMedia";
import { setObjectAsync } from "../../../components/asyncstorage";
import { ASYNC_USER_CURRENTUSER_KEY } from "../../../components/asyncstorage/constants";
import { convertDisplayLocaleDatetoDateObject } from "../../../axios/profile";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";
import Button from "../../components/Button/Button";
import { globalUIRatio } from "../../styles/base";
import TextInputLabel from "../../../components/textinputs/TextInputLabel";
import TextInputButton from "../../components/textinputs/TextInputButton";
import CheckoutCourierItem from "../../components/checkout/CheckoutCourierItem";
import { email_regex, phone_regex } from "../../axios/constants";

const defaultUploadingPhoto = {
  pending: false,
  uploading: false,
};

function EditProfileScreen(props) {
  const [user, setUser] = useState(UserData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(UserData);
  const [success, setSuccess] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(defaultUploadingPhoto);
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
  }, [currentUser]);

  useEffect(() => {
    //console.log("user data", user);
    let newErrors = { ...errors };
    if (phone_regex.test(user?.nomor_telp)) {
      newErrors = { ...newErrors, nomor_telp: "" };
    }
    if (email_regex.test(user?.email)) {
      newErrors = { ...newErrors, email: "" };
    }
    if (user?.nama_depan) {
      newErrors = { ...newErrors, nama_depan: "" };
    }
    if (user?.tanggal_lahir) {
      newErrors = { ...newErrors, tanggal_lahir: "" };
    }
    setErrors(newErrors);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (Platform.OS === "web" || props.profilePicture === null) {
      return;
    }
    console.log("redux media profilePicture", props.profilePicture);
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

  function onPressRadioButtonGender(jenis_kelamin) {
    setUser({ ...user, jenis_kelamin });
  }

  function updateUserData() {
    let newErrors = { ...UserData };
    let isComplete = true;

    if (user?.nomor_telp === "") {
      isComplete = false;
      newErrors = { ...newErrors, nomor_telp: "Nomor Telepon wajib diisi" };
    } else if (
      !phone_regex.test(user?.nomor_telp)
    ) {
      isComplete = false;
      newErrors = { ...newErrors, nomor_telp: "Masukan Nomor Telepon yang benar" };
    }
    if (user?.email === "") {
      isComplete = false;
      newErrors = { ...newErrors, email: "Email wajib diisi" };
    } else if (
      !email_regex.test(user?.email)
    ) {
      isComplete = false;
      newErrors = { ...newErrors, email: "Masukan Email yang benar" };
    }
    if (user?.nama_depan === "") {
      isComplete = false;
      newErrors = { ...newErrors, nama_depan: "Nama Depan wajib diisi" };
    }
    if (user?.tanggal_lahir === "") {
      isComplete = false;
      newErrors = { ...newErrors, tanggal_lahir: "Tanggal Lahir wajib diisi" };
    }
    setErrors(newErrors);
    
    if (isComplete && !loading && token !== null && currentUser?.id !== undefined) {
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


  function openDatePicker() {
    setDisplayDatePicker(true);
  }

  const deleteAccount = () => {
    if (!loading) {
      navigation.navigate("DeleteAccount")
    }
  }

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
          {
            props?.profilePicture || userProfilePicture ? (
              <Image
              style={styles.image}
              source={
                props?.profilePicture 
                  ? props?.profilePicture : userProfilePicture
        
              }
              contentFit={
                Platform.OS === "ios" && userProfilePicture === null
                  ? "contain"
                  : "cover"
              }
              placeholder={null}
            />
            ) : (
              <MaterialCommunityIcons
                name="account-circle"
                size={200 * globalUIRatio}
                color={colors.daclen_black}
              />
            )
          }
         
          {uploadingPhoto.pending || uploadingPhoto.uploading ? (
            <View style={styles.containerPhotoSpinner}>
              <ActivityIndicator
                size="small"
                color={colors.daclen_grey_light}
                style={{ alignSelf: "center" }}
              />
            </View>
          ) : (
            <View style={styles.containerEdit}>
              <MaterialCommunityIcons
                name="image-edit"
                size={28 * globalUIRatio}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>

        <TextInputLabel
          label="Nomor Telepon"
          compulsory
          placeholder="Masukkan nomor Whatsapp aktif"
          value={user?.nomor_telp}
          error={errors?.nomor_telp}
          inputMode="decimal"
          containerStyle={styles.textInput}
          onChangeText={(nomor_telp) => setUser({ ...user, nomor_telp })}
          notes={currentUser?.nomor_telp_verified_at ? `Telah diverifikasi pada ${moment(currentUser?.nomor_telp_verified_at).format(
            " MMM DD YYYY, HH:mm",
          )}` : null}
        />

        <TextInputLabel
          label="Email"
          compulsory
          placeholder="Masukkan alamat email Anda"
          value={user?.email}
          error={errors?.email}
          containerStyle={styles.textInput}
          onChangeText={(email) => setUser({ ...user, email })}
          notes={currentUser?.email_verified_at ? `Telah diverifikasi pada ${moment(currentUser?.email_verified_at).format(
            " MMM DD YYYY, HH:mm",
          )}` : ""}
        />

       

        <TextInputLabel
          label="Nama Depan"
          compulsory
          placeholder="Masukkan nama depan Anda"
          value={user?.nama_depan}
          error={errors?.nama_depan}
          editable={
            currentUser?.bank_set === undefined || !currentUser?.bank_set
          }
          containerStyle={styles.textInput}
          onChangeText={(nama_depan) => setUser({ ...user, nama_depan })}
        />

        <TextInputLabel
          label="Nama Belakang"
          placeholder="Masukkan nama belakang Anda"
          value={user?.nama_belakang}
          error={errors?.nama_belakang}
          editable={
            currentUser?.bank_set === undefined || !currentUser?.bank_set
          }
          containerStyle={styles.textInput}
          onChangeText={(nama_belakang) =>
            setUser({ ...user, nama_belakang })
          }
        />

        <Text allowFontScaling={false} style={[styles.text, { fontSize: 14 * globalUIRatio, fontFamily: "Poppins" }]}>
          Jenis Kelamin
        </Text>
        <View style={styles.radioGroup}>
          {genderchoices.map((item, index) => (
            <CheckoutCourierItem
              key={index}
              text={item?.label}
              style={{ width: (dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal) / 2, justifyContent: "flex-end",  flexDirection: "row-reverse", }}
              textStyle={{ fontFamily: "Poppins", marginStart: 6 * globalUIRatio }}
              selected={user?.jenis_kelamin === item?.value}
              onPress={() => onPressRadioButtonGender(item?.value)}
            />
          ))}
        </View>

        <TextInputButton
          label="Tanggal Lahir"
          compulsory
          error={errors?.tanggal_lahir}
          containerStyle={styles.textInput}
          value={user?.tanggal_lahir ? user?.tanggal_lahir : ""}
          onPress={() => openDatePicker()}
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
          text="Simpan Profil"
          loading={
            loading || uploadingPhoto.pending || uploadingPhoto.uploading
          }
          onPress={() => updateUserData()}
          style={styles.button}
        />

        <Button
          inverted
          bordered
          borderColor={colors.daclen_danger_border}
          fontColor={colors.daclen_danger}
          text="Hapus Akun Daclen"
          onPress={() => deleteAccount()}
          style={styles.button}
        />
      </ScrollView>
      <AlertBox
        text={error}
        success={success}
        onClose={() => setError(null)}
      />
      <RBSheet
        customStyles={{
          wrapper: {
            zIndex: 1,
          },
          container: {
            backgroundColor: "transparent",
          },
        }}
        ref={rbSheetMedia}
        openDuration={250}
        height={300 * globalUIRatio} 
      >
        <BSMedia
          mediaKey="profilePicture"
          title="Ganti Profile Picture"
          closeThis={() => rbSheetMedia.current.close()}
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
}

/*
        <RBSheet customStyles={{
          wrapper: {
            zIndex: 1,
          },
          container: {
            backgroundColor: "transparent",
          },
        }}  ref={rbSheetAddress} openDuration={250} height={350}>
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
    width: dimensions.fullWidthAdjusted,
  },
  scrollView: {
    flex: 1,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerPrivacy: {
    marginVertical: 20 * globalUIRatio,
    alignItems: "center",
  },
  containerPhoto: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32 * globalUIRatio,
    marginHorizontal: staticDimensions.marginHorizontal,
    width: 202 * globalUIRatio,
    height: 202 * globalUIRatio,
    alignSelf: "center",
    zIndex: 10,
    padding: 4 * globalUIRatio,
    backgroundColor: "transparent",
    borderRadius: 101 * globalUIRatio,
  },
  containerPhotoSpinner: {
    position: "absolute",
    top: 0,
    start: 0,
    width: 202 * globalUIRatio,
    height: 202 * globalUIRatio,
    backgroundColor: "transparent",
    zIndex: 6,
    borderRadius: 101 * globalUIRatio,
    justifyContent: "center",
    alignItems: "center",
  },
  containerEdit: {
    position: "absolute",
    end: 10 * globalUIRatio,
    bottom: 10 * globalUIRatio,
    zIndex: 12,
    backgroundColor: colors.daclen_black,
    width: 40 * globalUIRatio,
    height: 40 * globalUIRatio,
    borderRadius: 20 * globalUIRatio,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200 * globalUIRatio,
    height: 200 * globalUIRatio,
    borderRadius: 100 * globalUIRatio,
    backgroundColor: "transparent",
  },
  textHeader: {
    fontSize: 18 * globalUIRatio,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.black,
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
  radioGroup: {
    marginTop: 6 * globalUIRatio,
    marginBottom: 20 * globalUIRatio,
    marginHorizontal: staticDimensions.marginHorizontal,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: staticDimensions.marginHorizontal,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  userProfilePicture: store.userState.profilePicture,
  currentAddress: store.userState.currentAddress,
  userUpdate: store.userState.userUpdate,
  profilePicture: store.mediaState.profilePicture,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateUserData,
      clearMediaData,
      getCurrentUser,
      updateReduxCurrentUserData,
      setMediaProfilePicture,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(EditProfileScreen);
