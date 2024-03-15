import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { isAvailableAsync } from "expo-sharing";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
//import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import * as FileSystem from "expo-file-system";
//import * as Print from "expo-print";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";

import { colors, dimensions } from "../../styles/base";
import { sentryLog } from "../../../sentry";
import { sharingOptionsJPEG } from "../../../components/media/constants";
import ImageLargeWatermarkModel from "../../../components/media/ImageLargeWatermarkModel";
import {
  STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_FLYER_PRODUK_TAG,
} from "../../constants/starterkit";
import {
  calculateFlyerDisplayHeight,
  calculateFlyerDisplayWidth,
  calculateResizedImageDimensions,
} from "../../utils/starterkit";
import { checkNumberEmpty } from "../../../axios";
import HeaderBar from "../../components/Header/HeaderBar";
import AlertBox from "../../components/alert/AlertBox";

const defaultFlyers = [null, null, null];
const screenWidth = dimensions.fullWidth;
const screenHeight = dimensions.fullHeight;
const screenAR = screenWidth / screenHeight;
const limitAR = 9 / 16;
const paddingTop = 20;
const photoMarginHorizontal = 10;

const previewHeight = screenAR >= limitAR ? 0.7 * screenHeight : screenHeight;
const photoWidth = screenWidth - 2 * photoMarginHorizontal;
const photoHeight = previewHeight - paddingTop;

const FlyerSliderScreen = (props) => {
  const { currentUser, watermarkData, mediaKitPhotos, flyerMengajak } = props;
  const initIndex = props.route.params?.index === undefined || props.route.params?.index === null ? null : checkNumberEmpty(props.route.params?.index);
  const navigation = useNavigation();
  const refScroll = useRef();
  const imageRef = useRef();

  const [title, setTitle] = useState("Flyer");
  const [sharingAvailability, setSharingAvailability] = useState(null);
  const [scrollInit, setScrollInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [enableButtons, setEnableButtons] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [data, setData] = useState({
    index: initIndex,
    type: null,
    product: null,
  });
  const [limit, setLimit] = useState(2);
  const [scrollPosition, setScrollPosition] = useState({
    x: screenWidth * (initIndex ? initIndex : 0),
    y: 0,
  });
  const [flyers, setFlyers] = useState(defaultFlyers);

  useEffect(() => {
    if (initIndex === null) {
      navigation.goBack();
      return;
    }

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

  /*useEffect(() => {
    console.log("MediaLibrary permissionResponse", permissionResponse);
  }, [permissionResponse]);*/

  useEffect(() => {
    if (
      props.route.params?.type === undefined ||
      props.route.params?.type === null
    ) {
      console.log("route params", props.route.params);
      navigation.goBack();
      return;
    }
    setScrollInit(false);
    

    let newData = {
      index: initIndex,
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
    //console.log("route params", props.route.params, newLength);
    console.log("screen AR limit AR", screenAR, limitAR);
  }, [props.route.params]);

  useEffect(() => {
    if (data?.type === null) {
      return;
    }

    setTitle(data?.type === STARTER_KIT_FLYER_MENGAJAK_TAG
      ? STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE
      : data?.product
        ? data?.product
        : "Flyer");

    try {
      if (data?.type === STARTER_KIT_FLYER_PRODUK_TAG) {
        //console.log("mediakitPhotos", mediaKitPhotos);
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
    } catch (e) {
      console.error(e);
      setFlyers(defaultFlyers);
    }
    if (error) {
      setError(null);
    }
  }, [data]);

  useEffect(() => {
    /*if (limit < 1 || transformedImage === null) {
        return;
    }*/
    if (
      scrollPosition?.x >= screenWidth * data?.index &&
      scrollPosition?.x < screenWidth * (data?.index + 1)
    ) {
      return;
    }
    setEnableButtons(false);
    refScroll.current.scrollTo({
      animated: true,
      x: screenWidth * data?.index,
      y: 0,
    });
    //console.log("scrolling to", data?.index, data?.index * screenWidth);
  }, [data?.index]);

  /*useEffect(() => {
    if (
      transformedImage === null ||
      transformedImage?.length === undefined ||
      transformedImage?.length < 1
    ) {
      return;
    }

    let checkArray = [];
    for (let i = 0; i < transformedImage?.length; i++) {
      if (transformedImage[i] === null) {
        checkArray.push(0);
      } else {
        checkArray.push(1);
      }
    }
    console.log("transformedImage", checkArray);
  }, [transformedImage,]);*/

  /*useEffect(() => {
    console.log("scrollPosition", scrollPosition);
  }, [scrollPosition]);*/

  const onScrollLayout = () => {
    if (!scrollInit) {
      refScroll.current.scrollTo({
        animated: false,
        x: screenWidth * initIndex,
        y: 0,
      });
      console.log("scrolling Init to", initIndex);
      setData({ ...data, index: initIndex });
      setScrollInit(true);
    }
  };

  const handleScroll = (event) => {
    let x = event.nativeEvent.contentOffset.x;
    setScrollPosition({
      x,
      y: event.nativeEvent.contentOffset.y,
    });
  };

  const onMomentumScrollBegin = () => {
    setEnableButtons(false);
  };

  const onMomentumScrollEnd = () => {
    let newIndex = Math.floor(scrollPosition?.x / screenWidth);
    if (newIndex === data?.index) {
      setEnableButtons(true);
    } else {
      setData({ ...data, index: newIndex });
    }
    //console.log("onMomentumScrollEnd", scrollPosition?.x, newIndex);
  };

  const goPrev = async () => {
    setData({ ...data, index: data?.index - 1 });
  };

  const goNext = () => {
    setData({ ...data, index: data?.index + 1 });
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
      if (loading) {
        setLoading(false);
      }
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
            /*
            if (Math.abs(i - data?.index) > 1) {
              newImages.push(null);
            } else 
            */
            if (i === data?.index) {
              newImages.push(uri);
            } else {
              //newImages.push(transformedImage[i]);
              newImages.push(null);
            }
          }
          setTransformedImage(newImages);
          setEnableButtons(true);
          setLoading(false);
        })
        .catch((err) => {
          creatingErrorLogDebug(err);
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
      //creatingErrorLogDebug(e);
      setLoading(false);
    }
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
      setDownloading(true);
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
      const imageProc = await ImageManipulator.manipulateAsync(uri);
      console.log("saveToLibraryAsync", uri, imageProc?.uri);
      const result = await MediaLibrary.saveToLibraryAsync(imageProc?.uri);
      console.log("savetoLibraryAsync result", data?.index, result);
      /*if (result === null) {
        setError("Gagal menyimpan foto");
        setSuccess(false);
      }*/
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
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setSuccess(false);
    }
    setDownloading(false);
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
    sentryLog(e);
  };

  return (
    <SafeAreaView style={styles.container}>
     
      {flyers[1] === null ||
      flyers[1]?.foto === undefined ||
      flyers[1]?.foto === null ||
      watermarkData === undefined ||
      watermarkData === null ||
      transformedImage === null ||
      !scrollInit ? null : (
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



      <View style={styles.background} />
      <HeaderBar title={title} />
    
      <ScrollView
        ref={refScroll}
        onScroll={handleScroll}
        onLayout={() => onScrollLayout()}
        scrollEventThrottle={16}
        scrollEnabled={!loading}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollBegin={() => onMomentumScrollBegin()}
        onMomentumScrollEnd={() => onMomentumScrollEnd()}
        style={styles.containerScroll}
        contentContainerStyle={[
          styles.containerInside,
          {
            opacity: scrollInit ? 1 : 0,
            width: limit < 1 ? screenWidth * 20 : screenWidth * (limit + 1),
            height:
              flyers[1] === null ||
              flyers[1]?.height === undefined ||
              flyers[1]?.height === null ||
              screenAR <= limitAR
                ? previewHeight
                : screenHeight * 0.8,
          },
        ]}
      >
        {transformedImage === null ||
        transformedImage?.length === undefined ||
        transformedImage?.length < 1
          ? null
          : transformedImage.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.containerPhoto,
                  {
                    width: screenWidth,
                    height:
                      calculateFlyerDisplayHeight(
                        flyers[index - data?.index + 1]?.width,
                        flyers[index - data?.index + 1]?.height,
                        photoWidth,
                        photoHeight,
                      ) +
                      (screenAR >= limitAR ? 4 : 2) * paddingTop,
                    zIndex: 60,
                    overflow: "visible",
                  },
                ]}
              >
                <ActivityIndicator
                  size={24}
                  color={colors.daclen_gray}
                  style={styles.spinnerPhoto}
                />
                {Math.abs(data?.index - index) < 2 ? (
                  <ImageLargeWatermarkModel
                    style={[
                      styles.previewPhoto,
                      {
                        opacity: loading ? 0.5 : 1,
                        height: calculateFlyerDisplayHeight(
                          flyers[index - data?.index + 1]?.width,
                          flyers[index - data?.index + 1]?.height,
                          photoWidth,
                          photoHeight,
                        ),
                        zIndex: 12,
                      },
                    ]}
                    width={flyers[index - data?.index + 1]?.width}
                    height={flyers[index - data?.index + 1]?.height}
                    displayWidth={calculateFlyerDisplayWidth(
                      flyers[index - data?.index + 1]?.width,
                      flyers[index - data?.index + 1]?.height,
                      photoWidth,
                      photoHeight,
                    )}
                    displayHeight={calculateFlyerDisplayHeight(
                      flyers[index - data?.index + 1]?.width,
                      flyers[index - data?.index + 1]?.height,
                      photoWidth,
                      photoHeight,
                    )}
                    uri={flyers[index - data?.index + 1]?.foto}
                    link_x={flyers[index - data?.index + 1]?.link_x}
                    link_y={flyers[index - data?.index + 1]?.link_y}
                    text_x={flyers[index - data?.index + 1]?.text_x}
                    text_y={flyers[index - data?.index + 1]?.text_y}
                    fontSize={
                      flyers[index - data?.index + 1]?.font?.size?.ukuran
                        ? flyers[index - data?.index + 1]?.font?.size?.ukuran
                        : 48
                    }
                    watermarkData={watermarkData}
                    jenis_foto={data?.type}
                    username={currentUser?.name}
                  />
                ) : null}
              </View>
            ))}
      </ScrollView>
      {scrollInit ? (
        <View style={styles.containerPanel}>
          <TouchableOpacity
            onPress={() => startDownload()}
            style={[
              styles.button,
              {
                backgroundColor:
                  loading || downloading || !enableButtons
                    ? colors.daclen_lightgrey_button
                    : colors.daclen_light,
              },
            ]}
            disabled={
              loading ||
              downloading ||
              !enableButtons ||
              !(downloadUri === null || downloadUri[data?.index] === null)
            }
          >
            {downloading ? (
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
                : "Tersimpan"}
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
                  loading || sharing || !enableButtons
                    ? colors.daclen_lightgrey_button
                    : colors.daclen_light,
              },
            ]}
            disabled={loading || sharing || !enableButtons}
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
              Share
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {data?.index < 1 || !scrollInit || loading ? null : (
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

      {data?.index >= limit || !scrollInit || loading ? null : (
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
      <AlertBox text={error} success={success} onClose={() => setError(null)} />
    </SafeAreaView>
  );
};
/*
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
*/

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
    top: screenHeight * (screenAR < limitAR ? 0.35 : 0.4) + 16,
    backgroundColor: "transparent",
  },
  containerNext: {
    position: "absolute",
    zIndex: 99,
    opacity: 0.5,
    width: 32,
    height: 32,
    start: screenWidth - 44,
    top: screenHeight * (screenAR < limitAR ? 0.35 : 0.4) + 16,
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
    top: paddingTop,
    justifyContent: "center",
    alignItems: "center",
  },
  containerPanel: {
    zIndex: 4,
    start: 0,
    end: 0,
    top: screenHeight * (screenAR > limitAR ? 0.85 : 0.82),
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
    backgroundColor: colors.white,
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
  previewPhoto: {
    zIndex: 10,
    backgroundColor: "transparent",
  },
  spinnerPhoto: {
    zIndex: 2,
    backgroundColor: "transparent",
    position: "absolute",
    top: photoHeight / (screenAR >= limitAR ? 2 : 3) - 24,
    start: (screenWidth - 24) / 2,
    end: (screenWidth - 24) / 2,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
  mediaKitPhotos: store.mediaKitState.photos,
  flyerMengajak: store.mediaKitState.flyerMengajak,
});

export default connect(mapStateToProps, null)(FlyerSliderScreen);
