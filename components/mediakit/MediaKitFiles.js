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
  ImageBackground,
  BackHandler,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isAvailableAsync } from "expo-sharing";

import {
  getMediaKitPhotos,
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
  filterPhotoProps,
} from "../../axios/mediakit";
import { overwriteWatermarkVideos } from "../media";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { colors } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";
import WatermarkPhotos from "./photos/WatermarkPhotos";
import WatermarkVideos from "./videos/WatermarkVideos";
import { sentryLog } from "../../sentry";
import {
  ASYNC_MEDIA_FLYER_MENGAJAK_KEY,
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_MEDIA_WATERMARK_PHOTOS_KEY,
} from "../asyncstorage/constants";
import Header from "../DashboardHeader";
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
} from "./constants";
import StarterKitHome from "./home/StarterKitHome";
import StarterKitModal from "./home/StarterKitModal";
import FlyerMengajak from "./photos/FlyerMengajak";
import {
  personalwebsiteurlshort,
  tokoonlineurlshort,
} from "../../axios/constants";

const defaultModal = {
  visible: false,
  title: null,
  url: null,
  urlShort: null,
  desc: null,
};

function MediaKitFiles(props) {
  const [activeTab, setActiveTab] = useState(STARTER_KIT_HOME);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [sharingAvailability, setSharingAvailability] = useState(null);
  const [photoKeys, setPhotoKeys] = useState([]);
  const [modal, setModal] = useState(defaultModal);
  const [selectMode, setSelectMode] = useState(false);
  const [selection, setSelection] = useState({
    flyerProduk: DefaultSelected,
    flyerMengajak: DefaultSelected,
  });

  const {
    token,
    currentUser,
    photoError,
    watermarkData,
    mediaKitPhotos,
    flyerMengajak,
    mediaKitVideos,
    products,
    photosMultipleSave,
  } = props;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      console.log("MediaKitFiles visible, BackHandler active", activeTab);
      return () => {
        console.log("MediaKitFiles is not visible");
        backHandler.remove();
      };
    }, [activeTab])
  );

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
      fetchWatermarkPhotos();
    } else {
      setPhotoKeys(Object.keys(mediaKitPhotos).sort());
      if (photoLoading) {
        setPhotoLoading(false);
      }
      setObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY, mediaKitPhotos);
    }
  }, [mediaKitPhotos]);

  useEffect(() => {
    if (mediaKitVideos === null || mediaKitVideos?.length === undefined) {
      return;
    }
    if (videoLoading) {
      setVideoLoading(false);
    }
  }, [mediaKitVideos]);

  useEffect(() => {
    console.log("flyer selection", selection);
  }, [selection]);

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
    if (!selectMode) {
      if (
        activeTab === STARTER_KIT_FLYER_PRODUK &&
        selection.flyerProduk !== DefaultSelected
      ) {
        setSelection({
          ...selection,
          flyerProduk: {
            ids: {},
            urls: [],
          },
        });
      } else if (
        activeTab === STARTER_KIT_FLYER_MENGAJAK &&
        selection.flyerMengajak !== DefaultSelected
      ) {
        setSelection({
          ...selection,
          flyerMengajak: {
            ids: {},
            urls: [],
          },
        });
      } else {
        setSelection({
          flyerProduk: {
            ids: {},
            urls: [],
          },
          flyerMengajak: {
            ids: {},
            urls: [],
          },
        });
      }
    }
  }, [selectMode]);

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

  const fetchWatermarkPhotos = async () => {
    const result = await getMediaKitPhotos(token);
    console.log("getMediaKitPhotos", result);
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
        ASYNC_MEDIA_FLYER_MENGAJAK_KEY
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
        result?.mengajakArray
      );
    }
  };

  const checkStorageMediaKitPhotos = async () => {
    const storagePhotos = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_PHOTOS_KEY
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
    fetchWatermarkPhotos();
  };

  const refreshVideos = () => {
    setVideoLoading(true);
    props.getMediaKitVideos(token, products);
  };

  const refreshContent = () => {
    if (activeTab === STARTER_KIT_VIDEO_PRODUK) {
      refreshVideos();
    } else {
      refreshPhotos();
    }
  };

  const onBackPress = () => {
    if (modal?.visible) {
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
      if (item === null) {
        if (activeTab === STARTER_KIT_FLYER_PRODUK) {
          setSelection({
            ...selection,
            flyerProduk: DefaultSelected,
          });
        } else if (activeTab === STARTER_KIT_FLYER_MENGAJAK) {
          setSelection({
            ...selection,
            flyerMengajak: DefaultSelected,
          });
        }
        return;
      }

      const selected =
        activeTab === STARTER_KIT_FLYER_PRODUK
          ? selection.flyerProduk
          : selection.flyerMengajak;
      let ids = selected?.ids;
      let urls = [];

      if (isAdd) {
        if (selected?.urls?.length >= FLYER_SELECTION_LIMIT) {
          return;
        }
        ids[item?.id] = true;

        let isFound = false;
        if (
          !(selected?.urls?.length === undefined || selected?.urls?.length < 1)
        ) {
          for (let i = 0; i < selected?.urls?.length; i++) {
            if (selected?.urls[i]?.id === item?.id) {
              isFound = true;
            }
            urls.push(selected?.urls[i]);
          }
        }
        if (!isFound) {
          urls.push(filterPhotoProps(item));
        }
      } else {
        ids[item?.id] = false;
        if (
          !(selected?.urls?.length === undefined || selected?.urls?.length < 1)
        ) {
          for (let i = 0; i < selected?.urls?.length; i++) {
            if (selected?.urls[i]?.id !== item?.id) {
              urls.push(selected?.urls[i]);
            }
          }
        }
      }

      if (activeTab === STARTER_KIT_FLYER_PRODUK) {
        setSelection({
          ...selection,
          flyerProduk: {
            ids,
            urls,
          },
        });
      } else if (activeTab === STARTER_KIT_FLYER_MENGAJAK) {
        setSelection({
          ...selection,
          flyerMengajak: {
            ids,
            urls,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSelectPress = () => {
    if (selectMode) {
      openMultipleImageSave();
    } else {
      setSelectMode(true);
    }
  };

  /*const clearSelection = () => {
    if (
      (activeTab === STARTER_KIT_FLYER_PRODUK &&
        (selection.flyerProduk.urls?.length === undefined ||
          selection.flyerProduk.urls?.length < 1)) ||
      (activeTab === STARTER_KIT_FLYER_MENGAJAK &&
        (selection.flyerMengajak.urls?.length === undefined ||
          selection.flyerMengajak.urls?.length < 1))
    ) {
      setSelectMode(false);
    } else {
      setSelected(true, null);
    }
  };*/

  const openMultipleImageSave = () => {
    navigation.navigate("MultipleImageSave", {
      photos:
        activeTab === STARTER_KIT_FLYER_PRODUK
          ? selection?.flyerProduk?.urls
          : selection?.flyerMengajak?.urls,
      sharingAvailability,
      jenis_foto:
        activeTab === STARTER_KIT_FLYER_PRODUK
          ? STARTER_KIT_FLYER_PRODUK_TAG
          : STARTER_KIT_FLYER_MENGAJAK_TAG,
      title: `Menyimpan ${STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE}`,
    });
  };

  try {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/profilbg.png")}
          style={styles.background}
          resizeMode="cover"
        />

        <Header />

        <View style={styles.containerNav}>
          {activeTab === STARTER_KIT_HOME ? (
            <TouchableOpacity
              style={[
                styles.containerRefresh,
                {
                  backgroundColor:
                    photoLoading || videoLoading
                      ? colors.daclen_gray
                      : colors.daclen_bg_highlighted,
                  borderTopStartRadius: 6,
                  borderBottomStartRadius: 6,
                },
              ]}
              disabled={photoLoading || videoLoading}
              onPress={() =>
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
                })
              }
            >
              <Text style={styles.textRefresh}>SETTING WATERMARK</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.containerRefresh,
                {
                  backgroundColor:
                    photoLoading || videoLoading
                      ? colors.daclen_gray
                      : colors.daclen_bg_highlighted,
                  borderTopStartRadius: 6,
                  borderBottomStartRadius: 6,
                },
              ]}
              disabled={photoLoading || videoLoading}
              onPress={() => onBackPress()}
            >
              <Text style={styles.textRefresh}>BACK</Text>
            </TouchableOpacity>
          )}

          {(activeTab === STARTER_KIT_FLYER_MENGAJAK &&
            !(
              flyerMengajak?.length === undefined || flyerMengajak?.length < 1
            )) ||
          (activeTab === STARTER_KIT_FLYER_PRODUK &&
            !(photoKeys?.length === undefined || photoKeys?.length < 1)) ? (
            <TouchableOpacity
              style={[
                styles.containerRefresh,
                {
                  backgroundColor:
                    photoLoading ||
                    videoLoading ||
                    (selectMode &&
                      ((activeTab === STARTER_KIT_FLYER_PRODUK &&
                        (selection.flyerProduk.urls?.length === undefined ||
                          selection.flyerProduk.urls?.length < 1)) ||
                        (activeTab === STARTER_KIT_FLYER_MENGAJAK &&
                          (selection.flyerMengajak.urls?.length === undefined ||
                            selection.flyerMengajak.urls?.length < 1))))
                      ? colors.daclen_gray
                      : colors.daclen_blue,
                },
              ]}
              onPress={() => onSelectPress()}
              disabled={
                photoLoading ||
                videoLoading ||
                (selectMode &&
                  ((activeTab === STARTER_KIT_FLYER_PRODUK &&
                    (selection.flyerProduk.urls?.length === undefined ||
                      selection.flyerProduk.urls?.length < 1)) ||
                    (activeTab === STARTER_KIT_FLYER_MENGAJAK &&
                      (selection.flyerMengajak.urls?.length === undefined ||
                        selection.flyerMengajak.urls?.length < 1))))
              }
            >
              <Text style={styles.textRefresh}>
                {selectMode ? "SIMPAN FILE" : "PILIH FILE"}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.containerRefresh}
            disabled={photoLoading || videoLoading}
            onPress={() => refreshContent()}
          >
            {photoLoading || videoLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_light}
                style={{
                  alignSelf: "center",
                  marginVertical: 10,
                  marginHorizontal: 12,
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color={colors.daclen_light}
                style={styles.refresh}
              />
            )}
          </TouchableOpacity>
        </View>

        {selectMode ? (
          <View style={styles.containerSelection}>
            <Text allowFontScaling={false} style={styles.textSelection}>
              {`${
                activeTab === STARTER_KIT_FLYER_PRODUK
                  ? selection.flyerProduk.urls?.length
                  : selection.flyerMengajak.urls?.length
              } / ${FLYER_SELECTION_LIMIT} Flyer dipilih`}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectMode(false)}
              style={styles.button}
            >
              <MaterialCommunityIcons
                name="close"
                size={14}
                color={colors.daclen_black}
              />

              <Text allowFontScaling={false} style={styles.textButton}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.scrollView}>
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
              <Text
                allowFontScaling={false}
                style={[styles.textSelection, { color: colors.daclen_light }]}
              >
                Mohon Verifikasi Nomor HP terlebih dahulu
              </Text>
            ) : null
          ) : watermarkData === null ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={styles.spinner}
            />
          ) : activeTab === STARTER_KIT_VIDEO_PRODUK ? (
            <WatermarkVideos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              token={token}
              loading={videoLoading}
              refreshPage={() => refreshVideos()}
            />
          ) : activeTab === STARTER_KIT_FLYER_PRODUK ? (
            <WatermarkPhotos
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
              setSelectMode={(e) => setSelectMode(e)}
              selected={selection.flyerProduk}
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
              setSelectMode={(e) => setSelectMode(e)}
              selected={selection.flyerMengajak}
              setSelected={(isAdd, e) => setSelected(isAdd, e)}
            />
          ) : (
            <StarterKitHome
              currentUser={currentUser}
              setModal={(e) => setModal(e)}
              setActiveTab={(e) => setActiveTab(e)}
            />
          )}
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
    backgroundColor: "transparent",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
  },
  containerHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
  },
  containerNav: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginVertical: 12,
    zIndex: 10,
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
    marginHorizontal: 10,
    marginTop: 12,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginStart: 12,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    backgroundColor: colors.daclen_light,
    alignSelf: "center",
    elevation: 4,
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
    fontSize: 14,
    color: colors.daclen_orange,
    textAlignVertical: "center",
    marginVertical: 6,
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  photosUri: store.mediaKitState.photosUri,
  watermarkData: store.mediaKitState.watermarkData,
  mediaKitPhotos: store.mediaKitState.photos,
  mediaKitVideos: store.mediaKitState.videos,
  flyerMengajak: store.mediaKitState.flyerMengajak,
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(MediaKitFiles);
