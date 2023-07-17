import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
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
} from "../../axios/mediakit";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { colors, staticDimensions } from "../../styles/base";
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
} from "./constants";
import WatermarkPhotos from "./WatermarkPhotos";
import WatermarkVideos from "./WatermarkVideos";
import { sentryLog } from "../../sentry";
import { ASYNC_MEDIA_WATERMARK_PHOTOS_KEY } from "../asyncstorage/constants";

function MediaKitFiles(props) {
  try {
    const [activeTab, setActiveTab] = useState(
      props.route.params?.activeTab
        ? props.route.params?.activeTab
        : WATERMARK_PHOTO
    );
    const [expand, setExpand] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sharingAvailability, setSharingAvailability] = useState(null);
    const { currentUser, photoError } = props;
    const navigation = useNavigation();

    const [watermarkData, setWatermarkData] = useState({
      name: currentUser?.name ? currentUser?.name : "",
      phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
      url: currentUser?.name
        ? `https://${webreferral}${currentUser?.name}`
        : "",
    });

    useEffect(() => {
      const checkSharing = async () => {
        const result = await isAvailableAsync();
        if (!result && Platform.OS === "android") {
          ToastAndroid.show("Perangkat tidak mengizinkan sharing file", ToastAndroid.LONG);
        }
        console.log("sharingAvailability", result);
        setSharingAvailability(result);
      };
      checkSharing();
      //props.clearMediaKitData();
    }, []);

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

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity onPress={() => setExpand(!expand)}>
            <View style={styles.containerHeader}>
              <Text style={styles.textHeader}>Pengaturan Watermark</Text>
              <Image
                source={require("../../assets/gear.png")}
                style={styles.gear}
              />
            </View>
          </TouchableOpacity>
          {expand ? (
            <View style={styles.containerInfo}>
              <View style={styles.containerPrivacy}>
                <Text style={styles.textUid}>
                  Kirimkan foto dan video promosi dari katalog Daclen dengan
                  watermark spesial untuk kamu. Watermark berisi nama, nomor
                  telepon dan link referral.
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
                  value={watermarkData?.name}
                  style={styles.textInput}
                  onChangeText={(name) =>
                    setWatermarkData({ ...watermarkData, name })
                  }
                />
                <Text style={styles.textCompulsory}>Nomor telepon*</Text>
                <TextInput
                  value={watermarkData?.phone}
                  style={styles.textInput}
                  onChangeText={(phone) =>
                    setWatermarkData({ ...watermarkData, phone })
                  }
                />
              </View>
            </View>
          ) : null}

          {activeTab === WATERMARK_VIDEO ? (
            <WatermarkVideos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              videos={tempvideoarray}
            />
          ) : (
            <WatermarkPhotos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              loading={photoLoading}
              error={photoError}
              sharingAvailability={sharingAvailability}
              photos={props.mediaKitPhotos}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    sentryLog(error);
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          error={error.message}
          onOpenExternalLink={() => openExternalLink()}
        />
      </SafeAreaView>
    );
  }
}

/*
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

            
<Text style={styles.textCompulsory}>Link Referral*</Text>
                <TextInput
                  value={watermarkData?.url}
                  style={styles.textInput}
                  onChangeText={(url) =>
                    setWatermarkData({ ...watermarkData, url })
                  }
                />
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
  },
  containerInfo: {
    backgroundColor: "white",
  },
  containerPrivacy: {
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
  containerBox: {
    backgroundColor: colors.daclen_light,
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
  mediaKitPhotos: store.mediaKitState.photos,
  photoError: store.mediaKitState.photoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitPhotos,
      updateReduxMediaKitPhotos,
      clearMediaKitPhotosError,
      clearMediaKitData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(MediaKitFiles);
