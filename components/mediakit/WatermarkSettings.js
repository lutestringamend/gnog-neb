import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../styles/base";
import { privacypolicy } from "../profile/constants";
import {
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
} from "../../axios/mediakit";
import { overwriteWatermarkVideos } from "../media";
import { WatermarkData, vwmarktextnamecharlimit, vwmarktextphonecharlimit } from "./constants";
import { useNavigation } from "@react-navigation/native";
import { personalwebsiteurlshort } from "../../axios/constants";
import { setObjectAsync } from "../asyncstorage";
import {
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_WATERMARK_PHOTOS_PDF_KEY,
  ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY,
} from "../asyncstorage/constants";
import { sentryLog } from "../../sentry";

const WatermarkSettings = (props) => {
  const { token, currentUser, watermarkData } = props;
  const [tempWatermarkData, setTempWatermarkData] = useState(WatermarkData);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (watermarkData === null) {
      reset();
      return;
    }
    setTempWatermarkData(watermarkData);
    setObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY, watermarkData);
    if (loading) {
      changingWatermarkData();
    }
  }, [watermarkData]);

  useEffect(() => {
    if (
      tempWatermarkData?.name === null ||
      tempWatermarkData?.name === "" ||
      tempWatermarkData?.name?.length < 3 ||
      tempWatermarkData?.phone === null ||
      tempWatermarkData?.phone === "" ||
      tempWatermarkData?.phone?.length < 8
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [tempWatermarkData]);

  function reset() {
    setTempWatermarkData({
      name:
            currentUser?.detail_user === undefined ||
            currentUser?.detail_user?.nama_depan === undefined ||
            currentUser?.detail_user?.nama_depan === null ||
            currentUser?.detail_user?.nama_depan === ""
              ? currentUser?.name
                ? currentUser?.name
                : ""
              : currentUser?.detail_user?.nama_depan,
          phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
          url: currentUser?.name
            ? `${personalwebsiteurlshort}${currentUser?.name}`
            : "",
    });
  }

  const changingWatermarkData = async () => {
    setSuccess(true);
    setError("Setting Watermark telah diganti");
    setLoading(false);
    try {
      await setObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY, watermarkData);
      await setObjectAsync(ASYNC_WATERMARK_PHOTOS_PDF_KEY, null);
      await setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY, null);
      props.updateReduxMediaKitPhotosUri([]);
      props.overwriteWatermarkVideos([]);
    } catch (e) {
      console.error(e);
      sentryLog(e);
    }
  };

  const changeWatermark = () => {
    setError(null);
    setLoading(true);
    props.updateReduxMediaKitWatermarkData(tempWatermarkData);
  };

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
      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.name === undefined ||
      currentUser?.id === null ||
      currentUser?.name === null ? (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textUid}>
            Anda harus Login / Register untuk mengganti Watermark
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView style={styles.containerInfo}>
          <View style={styles.containerPrivacy}>
            <Text style={styles.textUid}>
              Kirimkan foto dan video promosi dari katalog Daclen dengan
              watermark spesial untuk kamu. Watermark berisi nama, nomor telepon
              dan link referral.
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

          <Text style={styles.textCompulsory}>Nama*</Text>
          <TextInput
            value={tempWatermarkData?.name}
            style={styles.textInput}
            onChangeText={(name) =>
              setTempWatermarkData({ ...tempWatermarkData, name })
            }
            maxLength={vwmarktextnamecharlimit}
          />
          <Text style={styles.textCompulsory}>Nomor telepon*</Text>
          <TextInput
            value={tempWatermarkData?.phone}
            style={[styles.textInput, { marginBottom: 0 }]}
            inputMode="numeric"
            onChangeText={(phone) =>
              setTempWatermarkData({ ...tempWatermarkData, phone })
            }
            maxLength={vwmarktextphonecharlimit}
          />
          <View style={styles.containerButtons}>
            <TouchableOpacity
              onPress={() => changeWatermark()}
              style={[
                styles.button,
                {
                  backgroundColor:
                    loading || disabled
                      ? colors.daclen_gray
                      : colors.daclen_orange,
                },
              ]}
              disabled={loading || disabled}
            >
              {loading ? (
                <ActivityIndicator
                  color={colors.daclen_light}
                  size="small"
                  style={styles.spinner}
                />
              ) : (
                <Text style={styles.textButton}>Ganti</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => reset()} style={styles.button}>
              <Text style={styles.textButton}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerInfo: {
    backgroundColor: "transparent",
    flex: 1,
    width: "100%",
  },
  containerPrivacy: {
    marginVertical: 12,
    marginHorizontal: 20,
    alignItems: "center",
  },
  containerButtons: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    alignSelf: "center",
    marginVertical: 32,
    alignItems: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 4,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_black,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  textUid: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 20,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginVertical: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Poppins", fontSize: 14,
  },
  spinner: {
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxMediaKitWatermarkData,
      overwriteWatermarkVideos,
      updateReduxMediaKitPhotosUri,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(WatermarkSettings);
