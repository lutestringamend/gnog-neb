import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isAvailableAsync } from "expo-sharing";
import RBSheet from "react-native-raw-bottom-sheet";

import {
  getMediaKitPhotos,
  clearMediaKitPhotosError,
  clearMediaKitData,
  updateReduxMediaKitPhotos,
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
} from "../../axios/mediakit";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import { privacypolicy } from "../profile/constants";
import { ErrorView } from "../webview/WebviewChild";
import HistoryTabItem from "../history/HistoryTabItem";
import { webreferral } from "../../axios/constants";
import {
  watermarkphotoicon,
  watermarkvideoicon,
  WATERMARK_PHOTO,
  WATERMARK_VIDEO,
  tempvideoarray,
} from "../dashboard/constants";
import WatermarkPhotos from "./WatermarkPhotos";
import WatermarkVideos from "./WatermarkVideos";
import { sentryLog } from "../../sentry";
import { ASYNC_MEDIA_WATERMARK_DATA_KEY, ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../asyncstorage/constants";
import Header from "../DashboardHeader";
import BSPopup from "../bottomsheets/BSPopup";
import { WatermarkData } from "./constants";

const WatermarkSettings = ({
  navigation,
  loading,
  tempWatermarkData,
  setTempWatermarkData,
}) => {
  return (
    <View style={styles.containerInfo}>
      <View style={styles.containerPrivacy}>
        <Text style={styles.textUid}>
          Kirimkan foto dan video promosi dari katalog Daclen dengan watermark
          spesial untuk kamu. Watermark berisi nama, nomor telepon dan link
          referral.
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

      <View style={styles.containerBox}>
        <Text style={styles.textCompulsory}>Nama*</Text>
        <TextInput
          value={tempWatermarkData?.name}
          style={styles.textInput}
          onChangeText={(name) =>
            setTempWatermarkData({ ...tempWatermarkData, name })
          }
        />
        <Text style={styles.textCompulsory}>Nomor telepon*</Text>
        <TextInput
          value={tempWatermarkData?.phone}
          style={styles.textInput}
          inputMode="numeric"
          onChangeText={(phone) =>
            setTempWatermarkData({ ...tempWatermarkData, phone })
          }
        />
      </View>
    </View>
  );
};

function MediaKitFiles(props) {
  try {
    const [activeTab, setActiveTab] = useState(WATERMARK_PHOTO);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sharingAvailability, setSharingAvailability] = useState(null);
    const [tempWatermarkData, setTempWatermarkData] = useState(WatermarkData);

    const { currentUser, photoError, watermarkData } = props;
    const rbSheet = useRef();
    const navigation = useNavigation();

    useEffect(() => {
      const checkSharing = async () => {
        const result = await isAvailableAsync();
        if (!result && Platform.OS === "android") {
          ToastAndroid.show(
            "Perangkat tidak mengizinkan sharing file",
            ToastAndroid.LONG
          );
        }
        console.log("sharingAvailability", result);
        setSharingAvailability(result);
      };
      checkSharing();
      //props.clearMediaKitData();
    }, []);

    useEffect(() => {
      if (currentUser === null || currentUser?.name === undefined || currentUser?.id === undefined) {
        return;
      }
      if (watermarkData === null) {
        checkWatermarkData();
      } else {
        if (loading) {
          changingWatermarkData();
        }
        console.log("redux WatermarkData", watermarkData);
      }
    }, [watermarkData]);

    useEffect(() => {
      if (props.mediaKitPhotos === undefined || props.mediaKitPhotos === null) {
        checkStorageMediaKitPhotos();
      } else {
        if (photoLoading) {
          setPhotoLoading(false);
        }
        setObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, props.mediaKitPhotos);
        console.log("redux mediakitphotos", props.mediaKitPhotos);
      }
    }, [props.mediaKitPhotos]);

    useEffect(() => {
      if (photoError === null) {
        return;
      }
      if (
        photoLoading &&
        (props.mediaKitPhotos?.length === undefined ||
          props.mediaKitPhotos?.length < 1)
      ) {
        setPhotoLoading(false);
      }
    }, [photoError]);

    const checkWatermarkData = async () => {
      let newData = await getObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY);
      if (!(newData === undefined || newData === null)) {
        setTempWatermarkData(newData);
        props.updateReduxMediaKitWatermarkData(newData);
      } else {
        newData = getWatermarkDataFromCurrentUser();
        setTempWatermarkData(newData);
        props.updateReduxMediaKitWatermarkData(newData);
      }
    }

    function getWatermarkDataFromCurrentUser() {
      return {
        ...WatermarkData,
        name: currentUser?.name ? currentUser?.name : "",
        phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
        url: currentUser?.name
          ? `https://${webreferral}${currentUser?.name}`
          : "",
      };
    }

    const checkStorageMediaKitPhotos = async () => {
      const storagePhotos = await getObjectAsync(
        ASYNC_MEDIA_WATERMARK_PHOTOS_KEY
      );
      if (storagePhotos === undefined || storagePhotos === null) {
        props.clearMediaKitPhotosError();
        props.clearMediaKitData();
        if (!photoLoading) {
          setPhotoLoading(true);
          props.getMediaKitPhotos();
        }
      } else {
        props.updateReduxMediaKitPhotos(storagePhotos);
      }
    };

    function closeBS() {}

    function changeWatermark() {
      if (
        tempWatermarkData?.name === null ||
        tempWatermarkData?.name === "" ||
        tempWatermarkData?.name?.length < 3 ||
        tempWatermarkData?.phone === null ||
        tempWatermarkData?.phone === "" ||
        tempWatermarkData?.phone?.length < 8
      ) {
        rbSheet.current.close();
        return;
      }
      setLoading(true);
      props.updateReduxMediaKitWatermarkData(tempWatermarkData);
    }

    const changingWatermarkData = async () => {
      await setObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY, watermarkData);
      await setObjectAsync(ASYNC_WATERMARK_PHOTOS_PDF_KEY, null);
      props.updateReduxMediaKitPhotosUri([]);
      setLoading(false);
      rbSheet.current.close();
    }

    return (
      <View style={styles.container}>
        <Header
          settingText="SETTING WATERMARK"
          onSettingPress={() => rbSheet.current.open()}
        />
        <ScrollView style={styles.scrollView}>
          {currentUser?.id === 8054 ? (
            <View style={styles.tabView}>
              <HistoryTabItem
                activeTab={activeTab}
                name={WATERMARK_PHOTO}
                icon={watermarkphotoicon}
                onPress={() => setActiveTab(WATERMARK_PHOTO)}
              />
              <HistoryTabItem
                activeTab={activeTab}
                name={WATERMARK_VIDEO}
                icon={watermarkvideoicon}
                onPress={() => setActiveTab(WATERMARK_VIDEO)}
              />
            </View>
          ) : null}

          {watermarkData === null ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={styles.spinner}
            />
          ) : activeTab === WATERMARK_VIDEO ? (
            <WatermarkVideos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              videos={tempvideoarray}
            />
          ) : (
            <WatermarkPhotos
              userId={currentUser?.id}
              loading={photoLoading}
              error={photoError}
              sharingAvailability={sharingAvailability}
              photos={props.mediaKitPhotos}
            />
          )}
        </ScrollView>
        <RBSheet
          ref={rbSheet}
          openDuration={250}
          height={dimensions.fullHeight - 32}
          onClose={() => closeBS()}
        >
          <BSPopup
            title="Setting Watermark"
            content={
              <WatermarkSettings
                loading={loading}
                navigation={navigation}
                tempWatermarkData={tempWatermarkData}
                setTempWatermarkData={setTempWatermarkData}
              />
            }
            buttonPositive="Ganti"
            buttonPositiveColor={colors.daclen_orange}
            buttonNegative="Tutup"
            buttonNegativeColor={colors.daclen_gray}
            buttonDisabled={
              tempWatermarkData?.name === null ||
              tempWatermarkData?.name === "" ||
              tempWatermarkData?.name?.length < 3 ||
              tempWatermarkData?.phone === null ||
              tempWatermarkData?.phone === "" ||
              tempWatermarkData?.phone?.length < 8
            }
            closeThis={() => rbSheet.current.close()}
            onPress={() => changeWatermark()}
          />
        </RBSheet>
      </View>
    );
  } catch (error) {
    sentryLog(error);
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <ErrorView
          error={error.message}
          onOpenExternalLink={() => openExternalLink()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
  },
  containerInfo: {
    height: dimensions.fullHeight - 200,
    backgroundColor: "transparent",
  },
  containerPrivacy: {
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
  containerBox: {
    backgroundColor: colors.white,
    borderColor: colors.daclen_gray,
    borderWidth: 2,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    elevation: 10,
  },
  tabView: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  gear: {
    backgroundColor: "transparent",
    alignSelf: "center",
    width: 20,
    height: 20,
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
  },
  textHeader: {
    color: colors.daclen_light,
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontWeight: "bold",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: 20,
    fontSize: 14,
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  photosUri: store.mediaKitState.photosUri,
  watermarkData: store.mediaKitState.watermarkData,
  mediaKitPhotos: store.mediaKitState.photos,
  photoError: store.mediaKitState.photoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitPhotos,
      updateReduxMediaKitPhotos,
      updateReduxMediaKitWatermarkData,
      updateReduxMediaKitPhotosUri,
      clearMediaKitPhotosError,
      clearMediaKitData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(MediaKitFiles);
