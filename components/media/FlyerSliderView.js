import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { isAvailableAsync } from "expo-sharing";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";

import { colors, staticDimensions } from "../../styles/base";
import { sentryLog } from "../../sentry";
import { sharingOptionsJPEG, sharingOptionsPDF } from "../media/constants";
import {
  multiplephotoshtml,
  multiplephotosimgtagcustomwidthheight,
  pdfpageheight,
  pdfpagewidth,
} from "./constants";
import ImageLargeWatermarkModel from "../media/ImageLargeWatermarkModel";
import {
  STARTER_KIT_FLYER_MENGAJAK,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_FLYER_PRODUK,
  STARTER_KIT_FLYER_PRODUK_TAG,
  videoplayerportraitiosheight,
  videoplayerportraitpanelandroidheight,
} from "../mediakit/constants";
import {
  calculateFlyerDisplayHeight,
  calculateFlyerDisplayWidth,
  calculateResizedImageDimensions,
} from "../mediakit";

const defaultFlyers = [null, null, null];
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const paddingTop = 0;

const previewHeight = screenHeight;
const photoWidth = screenWidth - 20;
const photoHeight = previewHeight - paddingTop;
const panelHeight = screenHeight - previewHeight;

const marginTop = 48;
/*const panelHeight =
  Platform.OS === "ios"
    ? videoplayerportraitiosheight
    : videoplayerportraitpanelandroidheight;*/

const FlyerSliderView = (props) => {
  const { currentUser, watermarkData, mediaKitPhotos, flyerMengajak } = props;
  const navigation = useNavigation();
  const refScroll = useRef();
  const imageRef = useRef();

  const [sharingAvailability, setSharingAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);
  const [lock, setLock] = useState(false);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [data, setData] = useState({
    index: 0,
    type: null,
    product: null,
  });
  const [limit, setLimit] = useState(2);
  const [scrollPosition, setScrollPosition] = useState({
    x: screenWidth,
    y: 0,
  });
  const [flyers, setFlyers] = useState(defaultFlyers);

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
  }, []);

  useEffect(() => {
    console.log("MediaLibrary permissionResponse", permissionResponse);
  }, [permissionResponse]);

  useEffect(() => {
    if (
      props.route.params?.index === undefined ||
      props.route.params?.index === null ||
      props.route.params?.type === undefined ||
      props.route.params?.type === null
    ) {
      navigation.goBack();
      return;
    }
    let newData = {
      index: props.route.params?.index ? props.route.params?.index : 0,
      type: props.route.params?.type
        ? props.route.params?.type
        : STARTER_KIT_FLYER_PRODUK_TAG,
      product: props.route.params?.product
        ? props.route.params?.product
        : "Audra",
    };
    setData(newData);

    let newLength = 0;
    try {
      if (newData?.type === STARTER_KIT_FLYER_PRODUK_TAG) {
        newLength = mediaKitPhotos[newData?.product]?.length;
      } else if (newData?.type === STARTER_KIT_FLYER_MENGAJAK_TAG) {
        newLength = flyerMengajak?.length;
      }
    } catch (e) {
      console.error(e);
    }
    setLimit(newLength - 1);
    setTransformedImage(newLength > 0 ? Array(newLength).fill(null) : null);
    setDownloadUri(newLength > 0 ? Array(newLength).fill(null) : null);
    console.log("route params", props.route.params, newLength);
  }, [props.route.params]);

  useEffect(() => {
    if (data?.type === null) {
      return;
    }
    try {
      if (data?.type === STARTER_KIT_FLYER_PRODUK_TAG) {
        //console.log("mediakitPhotos", mediaKitPhotos);
        props.navigation.setOptions({
          title: data?.product ? data?.product : STARTER_KIT_FLYER_PRODUK,
        });
        let array = mediaKitPhotos[data?.product];
        let limit = array?.length - 1;
        if (data?.index < 1) {
          setFlyers([null, array[0], array[1]]);
        } else if (data?.index >= limit) {
          setFlyers([array[data?.index - 1], array[data?.index], null]);
        } else {
          setFlyers([
            array[data?.index - 1],
            array[data?.index],
            array[data?.index + 1],
          ]);
        }
        setLimit(limit);
      } else if (data?.type === STARTER_KIT_FLYER_MENGAJAK_TAG) {
        props.navigation.setOptions({ title: STARTER_KIT_FLYER_MENGAJAK });
        let limit = flyerMengajak?.length - 1;
        if (data?.index < 1) {
          setFlyers(["", flyerMengajak[0], flyerMengajak[1]]);
        } else if (data?.index >= limit) {
          setFlyers([
            flyerMengajak[data?.index - 1],
            flyerMengajak[data?.index],
            "",
          ]);
        } else {
          setFlyers([
            flyerMengajak[data?.index - 1],
            flyerMengajak[data?.index],
            flyerMengajak[data?.index + 1],
          ]);
        }
        setLimit(limit);
      }
      refScroll.current.scrollTo({ animated: false, x: screenWidth, y: 0 });
    } catch (e) {
      console.error(e);
      setFlyers(defaultFlyers);
    }
    if (error) {
      setError(null);
    }
  }, [data]);

  useEffect(() => {
    console.log("transformedImage", transformedImage);
  }, [transformedImage]);

  useEffect(() => {
    console.log("downloadUri", downloadUri);
  }, [downloadUri]);

  const handleScroll = (event) => {
    let x = event.nativeEvent.contentOffset.x;
    if (
      (data?.index < 1 && x < screenWidth) ||
      (data?.index >= limit && x > screenWidth)
    ) {
      refScroll.current.scrollTo({ animated: true, x: screenWidth, y: 0 });
      return;
    }
    if (x < 1) {
      setData((data) => ({ ...data, index: data?.index - 1 }));
      setLock(false);
      return;
    }
    if (x >= screenWidth * 2) {
      setData((data) => ({ ...data, index: data?.index + 1 }));
      setLock(false);
      return;
    }
    setScrollPosition({
      x,
      y: event.nativeEvent.contentOffset.y,
    });
  };

  const goPrev = async () => {
    try {
      setLock(true);
      refScroll.current.scrollTo({ animated: true, x: 0, y: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const goNext = () => {
    try {
      setLock(true);
      refScroll.current.scrollTo({
        animated: true,
        x: screenWidth * 2,
        y: 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const transformImage = async () => {
    if (
      Platform.OS === "web" ||
      transformedImage === null ||
      !(
        transformedImage[data?.index] === undefined ||
        transformedImage[data?.index] === null
      )
    ) {
      //setError("ViewShot not available on Web");
      return;
    }
    setLoading(true);
    try {
      imageRef.current
        .capture()
        .then((uri) => {
          console.log(`index ${data?.index} captured`);
          let newImages = [];
          for (let i = 0; i < transformedImage?.length; i++) {
            if (i === data?.index) {
              newImages.push(uri);
            } else {
              newImages.push(transformedImage[i]);
            }
          }
          setTransformedImage(newImages);
          setLoading(false);
        })
        .catch((err) => {
          creatingErrorLogDebug(err);
          setLoading(false);
        });
    } catch (e) {
      creatingErrorLogDebug(e);
    }
    setLoading(false);
  };

  const startDownload = async () => {
    if (
      !(
        loading ||
        transformedImage === null ||
        transformedImage[data?.index] === null
      )
    ) {
      setError(null);
      setLoading(true);
      saveIos(transformedImage[data?.index]);
    }
  };

  const saveIos = async (uri) => {
    try {
      if (
        !(
          permissionResponse?.status === "granted" &&
          permissionResponse?.granted
        )
      ) {
        const request = await requestPermission();
        console.log("requestPermission", request);
      }
      console.log("saveToLibraryAsync", uri);
      const result = await MediaLibrary.saveToLibraryAsync(uri);
      console.log("savetoLibraryAsync result", data?.index, result);
      if (result === null) {
        setError("Gagal menyimpan foto");
        setSuccess(false);
      } else {
        setError(`Foto tersimpan di Galeri Foto`);
        let newUris = [];
        for (let i = 0; i < downloadUri?.length; i++) {
          if (i === data?.index) {
            newUris.push(result ? JSON.stringify(result) : null);
          } else {
            newUris.push(downloadUri[i]);
          }
        }
        setDownloadUri(newUris);
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setSuccess(false);
    }
    setLoading(false);
  };

  const shareJPGApple = async () => {
    const fileName = `daclen_foto_${
      flyers[1]?.id ? flyers[1]?.id.toString() : ""
    }.jpg`;
    try {
      const newUri = await FileSystem.getContentUriAsync(
        transformedImage[data?.index],
      );
      const imageProc = await ImageManipulator.manipulateAsync(newUri);
      let uri = `${FileSystem.documentDirectory}/${fileName}`;
      await FileSystem.copyAsync({
        from: imageProc?.uri ? imageProc?.uri : newUri,
        to: uri,
      });
      setSharing(true);
      await sharePhotoAsync(imageProc?.uri);
      setSharing(false);
    } catch (error) {
      creatingErrorLogDebug(error);
      shareJPGAndroid();
    }
  };

  const shareJPGAndroid = async () => {
    setSharing(true);
    //const newUri = await FileSystem.getContentUriAsync(transformedImage);
    await sharePhotoAsync(transformedImage[data?.index]);
    setSharing(false);
  };

  const sharePhotoAsync = async (uri) => {
    if (!sharingAvailability) {
      setError("Perangkat tidak mengizinkan untuk membagikan file");
      return;
    }

    try {
      setSharing(true);
      await shareAsync(uri, sharingOptionsJPEG);
      setSharing(false);
    } catch (e) {
      console.error(e);
      setError(e?.message);
    }
  };

  const onError = (e) => {
    console.log("Image onError", e);
    setError(
      `Foto tidak bisa diunduh, cek koneksi Internet${
        currentUser?.id === 8054 && Platform.OS !== "web" ? `\n${e?.error}` : ""
      }`,
    );
  };

  const creatingErrorLogDebug = (e) => {
    setSuccess(false);
    setError(e.toString());
    setLoading(false);
    //sentryLog(e);
  };

  /*

  */

  return (
    <SafeAreaView style={styles.container}>
      {flyers[1] === null ||
      flyers[1]?.foto === undefined ||
      flyers[1]?.foto === null ||
      watermarkData === undefined ||
      watermarkData === null ||
      transformedImage === null ? null : (
        <ViewShot
          ref={imageRef}
          options={{
            fileName: `daclenw_${
              flyers[1]?.id ? flyers[1]?.id.toString() : ""
            }`,
            format: "jpg",
            quality: 1,
            result: "tmpfile",
            useRenderInContext: Platform.OS === "ios",
          }}
          style={[
            styles.containerLargeImage,
            {
              width: calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).width,
              height: calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).height,
            },
          ]}
          captureMode=""
        >
          <Image
            source={flyers[1]?.foto}
            style={[
              styles.image,
              {
                width: calculateResizedImageDimensions(
                  flyers[1]?.width,
                  flyers[1]?.height,
                ).width,
                height: calculateResizedImageDimensions(
                  flyers[1]?.width,
                  flyers[1]?.height,
                ).height,
                zIndex: 2,
              },
            ]}
            contentFit="contain"
            placeholder={null}
            transition={0}
            onLoadEnd={() => transformImage()}
            onError={(e) => onError(e)}
          />
          <ImageLargeWatermarkModel
            style={styles.image}
            width={flyers[1]?.width}
            height={flyers[1]?.height}
            displayWidth={
              calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).width
            }
            displayHeight={
              calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).height
            }
            uri={null}
            link_x={flyers[1]?.link_x}
            link_y={flyers[1]?.link_y}
            text_x={flyers[1]?.text_x}
            text_y={flyers[1]?.text_y}
            fontSize={
              flyers[1]?.font?.size?.ukuran ? flyers[1]?.font?.size?.ukuran : 48
            }
            watermarkData={watermarkData}
            jenis_foto={data?.type}
            username={currentUser?.name}
          />
        </ViewShot>
      )}

      <ImageBackground
        source={require("../../assets/profilbg.png")}
        style={styles.background}
        resizeMode="cover"
      />

      {error ? (
        <Text
          allowFontScaling={false}
          style={[
            styles.textError,
            success && { backgroundColor: colors.daclen_green },
          ]}
        >
          {error}
        </Text>
      ) : null}

      <ScrollView
        ref={refScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={!loading || lock}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.containerScroll}
        contentContainerStyle={styles.containerInside}
      >
        <View style={styles.containerPhoto}>
          {flyers[0] ? (
            <ImageLargeWatermarkModel
              width={flyers[0]?.width}
              height={flyers[0]?.height}
              displayWidth={calculateFlyerDisplayWidth(
                flyers[0]?.width,
                flyers[0]?.height,
                photoWidth,
                photoHeight,
              )}
              displayHeight={calculateFlyerDisplayHeight(
                flyers[0]?.width,
                flyers[0]?.height,
                photoWidth,
                photoHeight,
              )}
              uri={flyers[0]?.foto}
              link_x={flyers[0]?.link_x}
              link_y={flyers[0]?.link_y}
              text_x={flyers[0]?.text_x}
              text_y={flyers[0]?.text_y}
              fontSize={
                flyers[0]?.font?.size?.ukuran
                  ? flyers[0]?.font?.size?.ukuran
                  : 48
              }
              watermarkData={watermarkData}
              jenis_foto={data?.type}
              username={currentUser?.name}
            />
          ) : null}
        </View>
        <View style={styles.containerPhoto}>
          {flyers[1] ? (
            <ImageLargeWatermarkModel
              width={flyers[1]?.width}
              height={flyers[1]?.height}
              displayWidth={calculateFlyerDisplayWidth(
                flyers[1]?.width,
                flyers[1]?.height,
                photoWidth,
                photoHeight,
              )}
              displayHeight={calculateFlyerDisplayHeight(
                flyers[1]?.width,
                flyers[1]?.height,
                photoWidth,
                photoHeight,
              )}
              uri={flyers[1]?.foto}
              link_x={flyers[1]?.link_x}
              link_y={flyers[1]?.link_y}
              text_x={flyers[1]?.text_x}
              text_y={flyers[1]?.text_y}
              fontSize={
                flyers[1]?.font?.size?.ukuran
                  ? flyers[1]?.font?.size?.ukuran
                  : 48
              }
              watermarkData={watermarkData}
              jenis_foto={data?.type}
              username={currentUser?.name}
            />
          ) : null}
        </View>
        <View style={styles.containerPhoto}>
          {flyers[2] ? (
            <ImageLargeWatermarkModel
              width={flyers[2]?.width}
              height={flyers[2]?.height}
              displayWidth={calculateFlyerDisplayWidth(
                flyers[2]?.width,
                flyers[2]?.height,
                photoWidth,
                photoHeight,
              )}
              displayHeight={calculateFlyerDisplayHeight(
                flyers[2]?.width,
                flyers[2]?.height,
                photoWidth,
                photoHeight,
              )}
              uri={flyers[2]?.foto}
              link_x={flyers[2]?.link_x}
              link_y={flyers[2]?.link_y}
              text_x={flyers[2]?.text_x}
              text_y={flyers[2]?.text_y}
              fontSize={
                flyers[2]?.font?.size?.ukuran
                  ? flyers[2]?.font?.size?.ukuran
                  : 48
              }
              watermarkData={watermarkData}
              jenis_foto={data?.type}
              username={currentUser?.name}
            />
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.containerPanel}>
        <TouchableOpacity
          onPress={() => startDownload()}
          style={[
            styles.button,
            {
              backgroundColor:
                loading ||
                transformedImage === null ||
                transformedImage[data?.index] === null
                  ? colors.daclen_lightgrey_button
                  : colors.daclen_light,
            },
          ]}
          disabled={
            loading ||
            transformedImage === null ||
            transformedImage[data?.index] === null ||
            !(downloadUri === null || downloadUri[data?.index] === null)
          }
        >
          {loading ||
          transformedImage === null ||
          transformedImage[data?.index] === null ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_black}
              style={{ alignSelf: "center" }}
            />
          ) : (
            <MaterialCommunityIcons
              name={
                downloadUri === null || downloadUri[data?.index] === null
                  ? "file-download"
                  : "check-bold"
              }
              size={18}
              color={colors.daclen_black}
            />
          )}

          <Text allowFontScaling={false} style={styles.textButton}>
            {downloadUri === null || downloadUri[data?.index] === null
              ? "Download"
              : "Tersimpan"}{" "}{data?.index}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Platform.OS === "ios" ? shareJPGApple() : shareJPGAndroid()
          }
          style={[
            styles.button,
            {
              backgroundColor:
                loading ||
                sharing ||
                transformedImage === null ||
                transformedImage[data?.index] === null
                  ? colors.daclen_lightgrey_button
                  : colors.daclen_light,
            },
          ]}
          disabled={
            loading ||
            sharing ||
            transformedImage === null ||
            transformedImage[data?.index] === null
          }
        >
          {sharing ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_black}
              style={{ alignSelf: "center" }}
            />
          ) : (
            <MaterialCommunityIcons
              name="share-variant"
              size={18}
              color={colors.daclen_black}
            />
          )}

          <Text allowFontScaling={false} style={styles.textButton}>
            Share{" "}{data?.index}
          </Text>
        </TouchableOpacity>
      </View>
      {data?.index < 1 ? null : (
        <TouchableOpacity
          style={styles.containerPrev}
          disabled={loading}
          onPress={() => goPrev()}
        >
          <MaterialCommunityIcons
            name="arrow-left-drop-circle"
            size={32}
            color={colors.daclen_gray}
            style={styles.arrow}
          />
        </TouchableOpacity>
      )}

      {data?.index >= limit ? null : (
        <TouchableOpacity
          style={styles.containerNext}
          disabled={loading}
          onPress={() => goNext()}
        >
          <MaterialCommunityIcons
            name="arrow-right-drop-circle"
            size={32}
            color={colors.daclen_gray}
            style={styles.arrow}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerLargeImage: {
    flex: 1,
    backgroundColor: colors.white,
    overflow: "visible",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: -1,
    opacity: 100,
  },
  containerPrev: {
    position: "absolute",
    zIndex: 99,
    opacity: 0.5,
    width: 32,
    height: 32,
    start: 12,
    top: previewHeight / 2 - 60,
    backgroundColor: "transparent",
  },
  containerNext: {
    position: "absolute",
    zIndex: 99,
    opacity: 0.5,
    width: 32,
    height: 32,
    start: screenWidth - 44,
    top: previewHeight / 2 - 60,
    backgroundColor: "transparent",
  },
  containerScroll: {
    zIndex: 3,
    width: screenWidth,
    flex: previewHeight,
    backgroundColor: "transparent",
  },
  containerInside: {
    width: screenWidth * 3,
    height: previewHeight,
    backgroundColor: "transparent",
    paddingTop,
  },
  containerPhoto: {
    backgroundColor: "transparent",
    width: screenWidth,
    height: previewHeight - paddingTop,
    top: -60,
    justifyContent: "center",
    alignItems: "center",
  },
  containerPanel: {
    zIndex: 4,
    start: 0,
    end: 0,
    top: photoHeight * 0.8,
    position: "absolute",
    width: screenWidth,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 60,
    height: 40,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 10,
    backgroundColor: colors.daclen_light,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginStart: 10,
    color: colors.daclen_black,
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: screenWidth,
    height: screenHeight,
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 4,
    overflow: "visible",
  },
  textError: {
    width: "100%",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 4,
  },
  arrow: {
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
  mediaKitPhotos: store.mediaKitState.photos,
  flyerMengajak: store.mediaKitState.flyerMengajak,
});

export default connect(mapStateToProps, null)(FlyerSliderView);
