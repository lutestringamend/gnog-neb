import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isAvailableAsync } from "expo-sharing";

import {
  getMediaKitPhotos,
  clearMediaKitPhotosError,
  clearMediaKitData,
  updateReduxMediaKitPhotos,
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
} from "../../axios/mediakit";
import { overwriteWatermarkVideos } from "../media";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { colors, dimensions } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";
import HistoryTabItem from "../history/HistoryTabItem";
import { personalwebsiteurlshort } from "../../axios/constants";
import {
  watermarkphotoicon,
  watermarkvideoicon,
  WATERMARK_PHOTO,
  WATERMARK_VIDEO,
} from "../dashboard/constants";
import WatermarkPhotos from "./WatermarkPhotos";
import WatermarkVideos from "./WatermarkVideos";
import { sentryLog } from "../../sentry";
import {
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_MEDIA_WATERMARK_PHOTOS_KEY,
} from "../asyncstorage/constants";
import Header from "./Header";
import { WatermarkData } from "./constants";

function MediaKitFiles(props) {
  try {
    const [activeTab, setActiveTab] = useState(WATERMARK_PHOTO);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [sharingAvailability, setSharingAvailability] = useState(null);
    const [photoKeys, setPhotoKeys] = useState([]);

    const { token, currentUser, photoError, watermarkData, mediaKitPhotos } =
      props;
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
      if (
        currentUser === null ||
        currentUser?.name === undefined ||
        currentUser?.id === undefined
      ) {
        return;
      }
      if (watermarkData === null) {
        checkWatermarkData();
      } else {
        console.log("redux WatermarkData", watermarkData);
      }
    }, [watermarkData]);

    useEffect(() => {
      if (mediaKitPhotos === undefined || mediaKitPhotos === null) {
        checkStorageMediaKitPhotos();
      } else if (photoKeys?.length === undefined || photoKeys?.length < 1) {
        setPhotoKeys(Object.keys(mediaKitPhotos).sort().reverse());
      } else {
        if (photoLoading) {
          setPhotoLoading(false);
        }
        setObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, mediaKitPhotos);
        console.log(
          "redux mediakitphotos",
          mediaKitPhotos,
          "photoKeys",
          photoKeys
        );
      }
    }, [mediaKitPhotos, photoKeys]);

    useEffect(() => {
      if (photoError === null) {
        return;
      }
      if (
        photoLoading &&
        (mediaKitPhotos?.length === undefined || mediaKitPhotos?.length < 1)
      ) {
        setPhotoLoading(false);
      }
    }, [photoError]);

    const checkWatermarkData = async () => {
      let newData = await getObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY);
      if (!(newData === undefined || newData === null)) {
        props.updateReduxMediaKitWatermarkData(newData);
      } else {
        newData = getWatermarkDataFromCurrentUser();
        props.updateReduxMediaKitWatermarkData(newData);
      }
    };

    function getWatermarkDataFromCurrentUser() {
      return {
        ...WatermarkData,
        name: currentUser?.name ? currentUser?.name : "",
        phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
        url: currentUser?.name
          ? `${personalwebsiteurlshort}${currentUser?.name}`
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
          refreshPhotos();
        }
      } else {
        props.updateReduxMediaKitPhotos(storagePhotos);
      }
    };

    const refreshPhotos = () => {
      setPhotoLoading(true);
      props.getMediaKitPhotos(token);
    };



    return (
      <View style={styles.container}>
        <Header onSettingPress={() => navigation.navigate("WatermarkSettings")} />
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
        <View style={styles.scrollView}>
          {token === null ||
          currentUser === null ||
          currentUser?.id === undefined ||
          currentUser?.isActive === undefined ||
          currentUser?.isActive === null ||
          !currentUser?.isActive ? null : watermarkData === null ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={styles.spinner}
            />
          ) : activeTab === WATERMARK_VIDEO ? (
            <WatermarkVideos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              token={token}
            />
          ) : (
            <WatermarkPhotos
              userId={currentUser?.id}
              loading={photoLoading}
              error={photoError}
              watermarkData={watermarkData}
              sharingAvailability={sharingAvailability}
              photos={mediaKitPhotos}
              photoKeys={photoKeys}
              refreshPage={() => refreshPhotos()}
            />
          )}
        </View>
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
    width: "100%",
    backgroundColor: colors.white,
  },
  containerHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
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
      overwriteWatermarkVideos,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(MediaKitFiles);
