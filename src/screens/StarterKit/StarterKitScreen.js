import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  ToastAndroid,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isAvailableAsync } from "expo-sharing";

import {
  getMediaKitPhotos,
  getMediaKitKategori,
  getMediaKitVideos,
  clearMediaKitPhotosError,
  clearMediaKitData,
  updateReduxMediaKitPhotos,
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
  updateReduxMediaKitPhotosError,
  setWatermarkDatafromCurrentUser,
  updateReduxMediaKitFlyerMengajak,
  updateReduxMediaKitVideosMengajak,
  updateReduxMediaKitPhotosMultipleSave,
  updateReduxMediaKitFlyerSelection,
} from "../../../axios/mediakit";
import { overwriteWatermarkVideos } from "../../../components/media";
import {
  getObjectAsync,
  setObjectAsync,
} from "../../../components/asyncstorage";
import { colors, dimensions } from "../../styles/base";
import { ErrorView } from "../../../components/webview/WebviewChild";
import StarterKitFlyerProduk from "./StarterKitFlyerProduk";
import StarterKitVideo from "./StarterKitVideo";
import { sentryLog } from "../../../sentry";
import {
  ASYNC_MEDIA_FLYER_MENGAJAK_KEY,
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_MEDIA_WATERMARK_PHOTOS_KEY,
} from "../../../components/asyncstorage/constants";
import {
  STARTER_KIT_FLYER_PRODUK,
  STARTER_KIT_FLYER_MENGAJAK,
  STARTER_KIT_FLYER_PRODUK_TAG,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_HOME,
  STARTER_KIT_VIDEO_PRODUK,
  STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE,
  STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_VIDEO_PRODUK_CASE_SENSITIVE,
  STARTER_KIT_VIDEO_MENGAJAK,
  STARTER_KIT_VIDEO_MENGAJAK_CASE_SENSITIVE,
  DefaultSelected,
  FLYER_SELECTION_LIMIT,
  STARTER_KIT_VIDEO_MENGAJAK_TAG,
  STARTER_KIT_VIDEO_PRODUK_TAG,
  STARTER_KIT_PERSONAL_WEBSITE,
  STARTER_KIT_PERSONAL_WEBSITE_ICON,
  STARTER_KIT_REFERRAL,
  STARTER_KIT_REFERRAL_ICON,
  STARTER_KIT_TOKO_ONLINE_DESC,
  STARTER_KIT_TOKO_ONLINE_ICON,
  STARTER_KIT_TOKO_ONLINE_TEXT,
} from "../../constants/starterkit";
import StarterKitHomeScreen from "./StarterKitHomeScreen";
import StarterKitModal from "../../components/modal/StarterKitModal";
import FlyerMengajak from "./StarterKitFlyerMengajak";
import StarterKitHeader from "../../components/starterkit/StarterKitHeader";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import StarterKitPanelButton from "../../components/starterkit/StarterKitPanelButton";
import {
  personalwebsiteurl,
  personalwebsiteurlshort,
  tokoonlineurl,
  tokoonlineurlshort,
  webreferral,
  webreferralshort,
} from "../../axios/constants";

const defaultModal = {
  visible: false,
  title: null,
  url: null,
  urlShort: null,
  desc: null,
};

const panelWidth = (398 * dimensions.fullWidthAdjusted) / 430;
const panelHeight = (74 * dimensions.fullWidthAdjusted) / 430;

function StarterKitScreen(props) {
  const [activeTab, setActiveTab] = useState(STARTER_KIT_HOME);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [sharingAvailability, setSharingAvailability] = useState(null);
  const [photoKeys, setPhotoKeys] = useState([]);
  const [modal, setModal] = useState(defaultModal);
  const [selectMode, setSelectMode] = useState(false);

  const {
    token,
    currentUser,
    profilePicture,
    photoError,
    watermarkData,
    mediaKitPhotos,
    flyerMengajak,
    flyerSelection,
    mediaKitVideos,
    products,
    photosMultipleSave,
  } = props;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      console.log("MediaKitFiles visible, BackHandler active", activeTab);
      return () => {
        console.log("MediaKitFiles is not visible");
        backHandler.remove();
      };
    }, [activeTab]),
  );

  useEffect(() => {
    const checkSharing = async () => {
      const result = await isAvailableAsync();
      if (!result && Platform.OS === "android") {
        ToastAndroid.show(
          "Perangkat tidak mengizinkan sharing file",
          ToastAndroid.LONG,
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
      fetchStarterKitFlyerProduk();
    } else {
      setPhotoKeys(Object.keys(mediaKitPhotos).sort());
      if (photoLoading) {
        setPhotoLoading(false);
      }
      setObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, mediaKitPhotos);
    }
  }, [mediaKitPhotos]);

  /*useEffect(() => {
    console.log("selectMode", selectMode);
  }, [selectMode]);*/

  useEffect(() => {
    /*if (mediaKitVideos === null || mediaKitVideos?.length === undefined) {
      return;
    }*/
    if (videoLoading) {
      setVideoLoading(false);
    }
  }, [mediaKitVideos]);

  useEffect(() => {
    if (!(flyerSelection?.length === undefined || flyerMengajak?.length < 1)) {
      props.updateReduxMediaKitFlyerSelection([]);
    }
    if (
      !(
        activeTab === STARTER_KIT_FLYER_PRODUK ||
        activeTab === STARTER_KIT_FLYER_MENGAJAK
      ) &&
      selectMode
    ) {
      setSelectMode(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (
      flyerSelection === null ||
      flyerSelection?.length === undefined ||
      flyerSelection?.length < 1
    ) {
      if (selectMode) {
        setSelectMode(false);
      }
    } else {
      if (!selectMode) {
        setSelectMode(true);
      }
    }
    //console.log("redux flyerSelection", flyerSelection);
  }, [flyerSelection]);

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

  useEffect(() => {
    if (photosMultipleSave?.error !== null && selectMode) {
      setSelectMode(false);
    }
    console.log("redux photosMultipleSave", photosMultipleSave);
  }, [photosMultipleSave]);

  const checkWatermarkData = async () => {
    let newData = await getObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY);
    if (!(newData === undefined || newData === null)) {
      props.updateReduxMediaKitWatermarkData(newData);
    } else {
      newData = setWatermarkDatafromCurrentUser(currentUser, false);
      props.updateReduxMediaKitWatermarkData(newData);
    }
  };

  const fetchStarterKitFlyerProduk = async () => {
    const result = await getMediaKitKategori(token);
    //console.log("getMediaKitKategori", result);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      props.updateReduxMediaKitPhotos(null);
      setPhotoKeys([]);
      if (!(result?.error === undefined || result?.error === null)) {
        props.updateReduxMediaKitPhotosError(result?.error);
      }
      checkStorageMediaKitPhotos();
    } else {
      props.updateReduxMediaKitPhotos(result?.result);
      props.updateReduxMediaKitPhotosError(null);
    }

    //props.updateReduxMediaKitFlyerMengajak(result?.result["Audra"]);
    if (
      result?.mengajakArray === undefined ||
      result?.mengajakArray === null ||
      result?.mengajakArray?.length === undefined
    ) {
      const storageFlyers = await getObjectAsync(
        ASYNC_MEDIA_FLYER_MENGAJAK_KEY,
      );
      if (storageFlyers === undefined || storageFlyers === null) {
        props.updateReduxMediaKitFlyerMengajak([]);
      } else {
        props.updateReduxMediaKitFlyerMengajak(storageFlyers);
      }
    } else {
      props.updateReduxMediaKitFlyerMengajak(result?.mengajakArray);
      await setObjectAsync(
        ASYNC_MEDIA_FLYER_MENGAJAK_KEY,
        result?.mengajakArray,
      );
    }
  };

  const checkStorageMediaKitPhotos = async () => {
    const storagePhotos = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_PHOTOS_KEY,
    );
    if (storagePhotos === undefined || storagePhotos === null) {
      //props.clearMediaKitPhotosError();
      props.updateReduxMediaKitPhotos(null);
      if (photoLoading) {
        setPhotoLoading(false);
      }
    } else {
      props.updateReduxMediaKitPhotos(storagePhotos);
    }
  };

  const refreshPhotos = () => {
    setPhotoLoading(true);
    fetchStarterKitFlyerProduk();
  };

  const refreshVideos = () => {
    setVideoLoading(true);
    props.getMediaKitVideos(token, products);
  };

  const refreshContent = () => {
    if (
      activeTab === STARTER_KIT_VIDEO_PRODUK ||
      activeTab === STARTER_KIT_VIDEO_MENGAJAK
    ) {
      refreshVideos();
    } else {
      clearSelection();
      refreshPhotos();
    }
  };

  const onBackPress = () => {
    if (selectMode) {
      clearSelection();
    } else if (modal?.visible) {
      setModal(defaultModal);
    } else if (activeTab !== STARTER_KIT_HOME) {
      setSelectMode(false);
      setActiveTab(STARTER_KIT_HOME);
    } else {
      navigation.goBack();
    }
    return true;
  };

  const setSelected = (isAdd, item) => {
    try {
      if (flyerSelection?.length === undefined || flyerSelection?.length < 1) {
        if (isAdd) {
          props.updateReduxMediaKitFlyerSelection([item]);
        }
      } else {
        const found = flyerSelection.find(({ id }) => id === item?.id);
        if (found === undefined || found === null) {
          if (isAdd && flyerSelection?.length < FLYER_SELECTION_LIMIT) {
            let newArray = [...flyerSelection];
            newArray.push(item);
            props.updateReduxMediaKitFlyerSelection(newArray);
          }
        } else if (!isAdd) {
          let newArray = [];
          for (let f of flyerSelection) {
            if (f?.id !== item?.id) {
              newArray.push(f);
            }
          }
          props.updateReduxMediaKitFlyerSelection(newArray);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  function openTokoOnline() {
    setModal({
      visible: true,
      title: STARTER_KIT_TOKO_ONLINE_TEXT,
      url: `${tokoonlineurl}${currentUser?.name}`,
      urlShort: `${tokoonlineurlshort}${currentUser?.name}`,
      desc: STARTER_KIT_TOKO_ONLINE_DESC,
    });
  }

  function openPersonalWeb() {
    setModal({
      visible: true,
      title: STARTER_KIT_PERSONAL_WEBSITE,
      url: `${personalwebsiteurl}${currentUser?.name}`,
      urlShort: `${personalwebsiteurlshort}${currentUser?.name}`,
      desc: null,
    });
  }

  function openReferral() {
    setModal({
      visible: true,
      title: STARTER_KIT_REFERRAL,
      url: `${webreferral}${currentUser?.name}`,
      urlShort: `${webreferralshort}${currentUser?.name}`,
      desc: null,
    });
  }

  const onSelectPress = () => {
    if (selectMode) {
      openMultipleImageSave();
    } else {
      setSelectMode(true);
    }
  };

  const clearSelection = () => {
    props.updateReduxMediaKitFlyerSelection([]);
    setSelectMode(false);
  };

  const openMultipleImageSave = () => {
    props.updateReduxMediaKitFlyerSelection([]);
    setSelectMode(false);
    navigation.navigate("MultipleImageSave", {
      photos: flyerSelection,
      sharingAvailability,
      jenis_foto:
        activeTab === STARTER_KIT_FLYER_PRODUK
          ? STARTER_KIT_FLYER_PRODUK_TAG
          : STARTER_KIT_FLYER_MENGAJAK_TAG,
      title: `Menyimpan ${STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE}`,
    });
  };

  const openWatermarkSettings = () => {
    navigation.navigate("WatermarkSettings", {
      urlTitle:
        activeTab === STARTER_KIT_FLYER_PRODUK
          ? STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE
          : activeTab === STARTER_KIT_FLYER_MENGAJAK
            ? STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE
            : activeTab === STARTER_KIT_VIDEO_PRODUK
              ? STARTER_KIT_VIDEO_PRODUK_CASE_SENSITIVE
              : activeTab === STARTER_KIT_VIDEO_MENGAJAK
                ? STARTER_KIT_VIDEO_MENGAJAK_CASE_SENSITIVE
                : null,
      urlEndpoint:
        activeTab === STARTER_KIT_FLYER_PRODUK ||
        activeTab === STARTER_KIT_VIDEO_PRODUK
          ? tokoonlineurlshort
          : personalwebsiteurlshort,
    });
  };

  try {
    return (
      <View style={styles.container}>
        <StarterKitHeader
          onPress={() => openWatermarkSettings()}
          token={token}
          currentUser={currentUser}
          profilePicture={profilePicture}
        />

        <View style={styles.containerInside}>
          <View style={styles.containerPanel}>
            {activeTab === STARTER_KIT_HOME ? (
              <StarterKitPanelButton
                icon="store"
                text="Toko Online"
                onPress={() => openTokoOnline()}
              />
            ) : (
              <StarterKitPanelButton
                icon="chevron-left"
                text="Kembali"
                disabled={photoLoading || videoLoading}
                onPress={() => onBackPress()}
              />
            )}

            {(activeTab === STARTER_KIT_FLYER_MENGAJAK &&
              !(
                flyerMengajak?.length === undefined || flyerMengajak?.length < 1
              )) ||
            (activeTab === STARTER_KIT_FLYER_PRODUK &&
              !(photoKeys?.length === undefined || photoKeys?.length < 1)) ? (
              <StarterKitPanelButton
                icon={selectMode ? "content-save-all" : "select-multiple"}
                text={selectMode ? "Download" : "Seleksi"}
                disabled={
                  photoLoading ||
                  videoLoading ||
                  (selectMode &&
                    (activeTab === STARTER_KIT_FLYER_PRODUK ||
                      activeTab === STARTER_KIT_FLYER_MENGAJAK) &&
                    (flyerSelection?.length === undefined ||
                      flyerSelection?.length < 1))
                }
                onPress={() => onSelectPress()}
              />
            ) : activeTab === STARTER_KIT_HOME ? (
              <StarterKitPanelButton
                icon="web"
                text="Personal Web"
                onPress={() => openPersonalWeb()}
              />
            ) : (
              <View style={{ backgroundColor: "transparent", flex: 1 }} />
            )}

            {photoLoading || videoLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_grey_placeholder}
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              />
            ) : activeTab === STARTER_KIT_HOME ? (
              <StarterKitPanelButton
                icon="share-circle"
                text="Ajak Bergabung"
                onPress={() => openReferral()}
              />
            ) : (
              <StarterKitPanelButton
                icon="refresh"
                text="Refresh"
                disabled={photoLoading || videoLoading}
                onPress={() => refreshContent()}
              />
            )}
          </View>

          <View style={styles.containerScroll}>
            {token === null ||
            currentUser === null ||
            currentUser?.id === undefined ||
            ((currentUser?.isActive === undefined ||
              currentUser?.isActive === null ||
              !currentUser?.isActive) &&
              !(
                currentUser?.level === "spv" ||
                currentUser?.status_member === "supervisor"
              )) ? (
              currentUser?.nomor_telp_verified_at === undefined ||
              currentUser?.nomor_telp_verified_at === null ? (
                <EmptyPlaceholder
                  title="Starter Kit"
                  text="Mohon menyelesaikan proses registrasi dahulu sebelum mengakses Starter Kit."
                />
              ) : null
            ) : watermarkData === null ? (
              <ActivityIndicator
                size="large"
                color={colors.daclen_orange}
                style={styles.spinner}
              />
            ) : activeTab === STARTER_KIT_VIDEO_PRODUK ||
              activeTab === STARTER_KIT_VIDEO_MENGAJAK ? (
              <StarterKitVideo
                watermarkData={watermarkData}
                userId={currentUser?.id}
                token={token}
                loading={videoLoading}
                jenis_video={
                  activeTab === STARTER_KIT_VIDEO_MENGAJAK
                    ? STARTER_KIT_VIDEO_MENGAJAK_TAG
                    : STARTER_KIT_VIDEO_PRODUK_TAG
                }
                refreshPage={() => refreshVideos()}
              />
            ) : activeTab === STARTER_KIT_FLYER_PRODUK ? (
              <StarterKitFlyerProduk
                userId={currentUser?.id}
                loading={photoLoading}
                error={photoError}
                watermarkData={watermarkData}
                sharingAvailability={sharingAvailability}
                photos={mediaKitPhotos}
                photoKeys={photoKeys}
                jenis_foto={STARTER_KIT_FLYER_PRODUK_TAG}
                photosMultipleSave={photosMultipleSave}
                clearMultipleSave={() =>
                  props?.updateReduxMediaKitPhotosMultipleSave(null)
                }
                refreshPage={() => refreshPhotos()}
                selectMode={selectMode}
                selected={flyerSelection}
                setSelected={(isAdd, e) => setSelected(isAdd, e)}
              />
            ) : activeTab === STARTER_KIT_FLYER_MENGAJAK ? (
              <FlyerMengajak
                photos={flyerMengajak}
                refreshing={photoLoading}
                showTitle={false}
                userId={currentUser?.id}
                watermarkData={watermarkData}
                sharingAvailability={sharingAvailability}
                jenis_foto={STARTER_KIT_FLYER_MENGAJAK_TAG}
                photosMultipleSave={photosMultipleSave}
                clearMultipleSave={() =>
                  props?.updateReduxMediaKitPhotosMultipleSave(null)
                }
                refreshPage={() => refreshPhotos()}
                selectMode={selectMode}
                selected={flyerSelection}
                setSelected={(isAdd, e) => setSelected(isAdd, e)}
              />
            ) : (
              <StarterKitHomeScreen
                setModal={(e) => setModal(e)}
                setActiveTab={(e) => setActiveTab(e)}
              />
            )}
          </View>
        </View>

        {modal?.visible ? (
          <StarterKitModal
            modal={modal}
            toggleModal={() =>
              setModal((modal) => ({ ...modal, visible: !modal?.visible }))
            }
          />
        ) : null}
      </View>
    );
  } catch (error) {
    sentryLog(error);
    return (
      <SafeAreaView style={styles.container}>
        <EmptyPlaceholder
          title="Starter Kit"
          text={error.message}
          minHeight={dimensions.fullHeight}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_black,
  },
  containerScroll: {
    flex: 1,
    width: dimensions.fullWidth,
    marginTop: panelHeight / 2,
    paddingTop: panelHeight / 2,
    backgroundColor: colors.white,
    borderTopStartRadius: (20 * dimensions.fullWidth) / 430,
    borderTopEndRadius: (20 * dimensions.fullWidth) / 430,
    minHeight: dimensions.fullHeight * 0.9,
  },
  containerInside: {
    backgroundColor: "transparent",
  },
  containerPanel: {
    position: "absolute",
    top: 0,
    zIndex: 6,
    width: panelWidth,
    height: panelHeight,
    start: (dimensions.fullWidth - panelWidth) / 2,
    end: (dimensions.fullWidth - panelWidth) / 2,
    borderRadius: 20,
    borderColor: colors.daclen_grey_container,
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingHorizontal: (28 * dimensions.fullWidthAdjusted) / 430,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerText: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  containerNav: {
    flexDirection: "row",
    elevation: 4,
    backgroundColor: colors.daclen_bg,
    borderColor: colors.daclen_light,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
    borderTopWidth: 1,
    borderStartWidth: 1,
    borderBottomWidth: 1,
    paddingEnd: 4,
  },
  containerRefresh: {
    backgroundColor: "transparent",
    justifyContent: "center",
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
  containerSelection: {
    marginStart: 20,
    marginEnd: 10,
    flex: 1,
    marginVertical: 12,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  cancel: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: 10,
    marginBottom: 3,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginStart: 6,
    alignSelf: "center",
    textAlignVertical: "center",
    color: colors.daclen_black,
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
  refresh: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  textRefresh: {
    backgroundColor: "transparent",
    marginVertical: 10,
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: "Poppins",
    color: colors.daclen_light,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  textHeader: {
    color: colors.daclen_light,
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    backgroundColor: "transparent",
  },
  textSelection: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_orange,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  profilePicture: store.userState.profilePicture,
  photosUri: store.mediaKitState.photosUri,
  watermarkData: store.mediaKitState.watermarkData,
  mediaKitPhotos: store.mediaKitState.photos,
  mediaKitVideos: store.mediaKitState.videos,
  flyerMengajak: store.mediaKitState.flyerMengajak,
  flyerSelection: store.mediaKitState.flyerSelection,
  videosMengajak: store.mediaKitState.videosMengajak,
  photoError: store.mediaKitState.photoError,
  photosMultipleSave: store.mediaKitState.photosMultipleSave,
  products: store.productState.products,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitVideos,
      updateReduxMediaKitPhotos,
      updateReduxMediaKitWatermarkData,
      updateReduxMediaKitPhotosUri,
      updateReduxMediaKitPhotosError,
      clearMediaKitPhotosError,
      clearMediaKitData,
      overwriteWatermarkVideos,
      updateReduxMediaKitFlyerMengajak,
      updateReduxMediaKitVideosMengajak,
      updateReduxMediaKitPhotosMultipleSave,
      updateReduxMediaKitFlyerSelection,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(StarterKitScreen);
