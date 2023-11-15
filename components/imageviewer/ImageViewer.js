import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";

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
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_FLYER_PRODUK_TAG,
  videoplayerportraitiosheight,
  videoplayerportraitpanelandroidheight,
} from "../mediakit/constants";
//import { getFileName } from "../media";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const defaultSliderItems = {
  prevThumbnail: null,
  nextThumbnail: null,
};

const marginTop = 48;
const panelHeight =
  Platform.OS === "ios"
    ? videoplayerportraitiosheight
    : videoplayerportraitpanelandroidheight;

const ImageViewer = (props) => {
  const {
    id,
    title,
    uri,
    thumbnail,
    jenis_foto,
    photoIndex,
    isSquare,
    width,
    height,
    text_x,
    text_y,
    link_x,
    link_y,
    font,
    sharingAvailability,
    disableWatermark,
  } = props.route.params;

  const resizedImgWidth = Platform.OS === "ios" ? width : pdfpagewidth - 20;
  const resizedImgHeight =
    Platform.OS === "ios"
      ? height
      : Math.ceil((height * resizedImgWidth) / width);

  const projectedImageHeight = screenHeight - marginTop - panelHeight;
  const projectedImageWidth = Math.round(
    (width * projectedImageHeight) / height
  );

  const portraitImageWidth =
    projectedImageWidth >=
    screenWidth - 2 * staticDimensions.productPhotoWidthMargin
      ? screenWidth - 2 * staticDimensions.productPhotoWidthMargin
      : projectedImageWidth;
  const portraitImageHeight =
    projectedImageWidth >=
    screenWidth - 2 * staticDimensions.productPhotoWidthMargin
      ? Math.round((height * portraitImageWidth) / width)
      : projectedImageHeight;

  const productPhotoWidth =
    width > height || isSquare
      ? screenWidth - staticDimensions.productPhotoWidthMargin
      : portraitImageWidth;
  const ratio = width / productPhotoWidth;
  const productPhotoHeight = isSquare
    ? productPhotoWidth
    : width > height
    ? height / ratio
    : portraitImageHeight;
  //const pdfRatio = resizedImgWidth / productPhotoWidth;
  const fontSize = font?.size?.ukuran ? font?.size?.ukuran : 48;

  //const [productPhotoHeight, setProductPhotoHeight] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);
  //const [captureFailure, setCaptureFailure] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [sliderItems, setSliderItems] = useState(defaultSliderItems);
  const [pdfUri, setPdfUri] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const { watermarkData, currentUser, mediaKitPhotos, flyerMengajak } = props;
  const imageRef = useRef();

  useEffect(() => {
    console.log("MediaLibrary permissionResponse", permissionResponse);
  }, [permissionResponse]);

  useEffect(() => {
    if (title !== null && title !== undefined && title !== "") {
      props.navigation.setOptions({ title });
    }

    if (
      id === undefined ||
      id === null ||
      watermarkData === undefined ||
      watermarkData === null ||
      disableWatermark
    ) {
      return;
    }

    if (
      sharingAvailability === undefined ||
      sharingAvailability === null ||
      !sharingAvailability
    ) {
      setError("Perangkat tidak mengizinkan untuk membagikan file");
    }

    let logs = props.route.params;
    console.log("init params", {
      ...logs,
      jenis_foto,
      screenWidth,
      screenHeight,
      projectedImageWidth,
      projectedImageHeight,
      portraitImageWidth,
      portraitImageHeight,
      productPhotoWidth,
      productPhotoHeight,
    });
  }, [uri]);

  useEffect(() => {
    if (transformedImage === null) {
      return;
    }
    if (Platform.OS !== "web") {
      renderPDF(transformedImage);
    }
  }, [transformedImage]);

  useEffect(() => {
    if (
      jenis_foto !== STARTER_KIT_FLYER_PRODUK_TAG ||
      mediaKitPhotos === null ||
      mediaKitPhotos[title] === undefined ||
      mediaKitPhotos[title] === null ||
      photoIndex === undefined ||
      photoIndex === null
    ) {
      return;
    }
    setSliderItemsAccordingly(photoIndex, mediaKitPhotos[title]);
  }, [mediaKitPhotos]);

  useEffect(() => {
    if (
      jenis_foto !== STARTER_KIT_FLYER_MENGAJAK_TAG ||
      flyerMengajak === null ||
      photoIndex === undefined ||
      photoIndex === null
    ) {
      return;
    }
    setSliderItemsAccordingly(photoIndex, flyerMengajak);
  }, [flyerMengajak]);

  useEffect(() => {
    console.log("sliderItems", sliderItems);
  }, [sliderItems]);

  const setSliderItemsAccordingly = (index, photos) => {
    let prevThumbnail = null;
    let nextThumbnail = null;
    if (photoIndex > 0) {
      prevThumbnail = photos[photoIndex - 1]?.thumbnail;
    }
    if (!(photos[index + 1] === undefined || photos[index + 1] === null)) {
      nextThumbnail = photos[photoIndex + 1]?.thumbnail;
    }
    setSliderItems({ prevThumbnail, nextThumbnail });
  };

  const transformImage = async () => {
    if (Platform.OS === "web") {
      //setError("ViewShot not available on Web");
      return;
    }
    try {
      imageRef.current
        .capture()
        .then((uri) => {
          console.log(uri);
          setTransformedImage(uri);
          setLoading(false);
        })
        .catch((err) => {
          creatingErrorLogDebug(err);
        });
    } catch (e) {
      creatingErrorLogDebug(e);
    }
  };

  const creatingErrorLogDebug = (e) => {
    setSuccess(false);
    setError(e.toString());
    setLoading(false);
    sentryLog(e);
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

  const renderPDF = async (uri) => {
    try {
      //render HTML
      let imageWidth = pdfpagewidth;
      let imageHeight = pdfpageheight;
      if (width > imageWidth || height > imageHeight) {
        imageWidth = width;
        imageHeight = height;
      }

      let newUri = await FileSystem.getContentUriAsync(uri);

      /*

        Platform.OS === "ios"
          ? `${multiplephotosimgtag
              .replace("#URI#", newUri)
              .replace("#WIDTH#", pdfpagewidth)
              .replace(
                "#HEIGHT#",
                pdfpageheight > resizedImgHeight
                  ? pdfpageheight
                  : resizedImgHeight
              )}`
          : 
      */

      let imgTag = `${multiplephotosimgtagcustomwidthheight
        .replace("#URI#", newUri)
        .replace("#WIDTH#", resizedImgWidth)
        .replace(
          "#HEIGHT#",
          pdfpageheight > resizedImgHeight ? pdfpageheight : resizedImgHeight
        )
        .replace("#IMGWIDTH#", resizedImgWidth)
        .replace("#IMGHEIGHT#", resizedImgHeight)}`;
      const html = multiplephotoshtml
        .replace("#TITLE#", title)
        .replace("#IMGTAGS#", imgTag);
      if (currentUser?.id === 8054) {
        /*setSuccess(true);
        setError(`html\n${html}`);*/
        //console.log("pdf html", html);
      }
      const result = await Print.printToFileAsync({
        width: resizedImgWidth,
        height: resizedImgHeight,
        html,
      });
      if (result?.uri) {
        setPdfUri(result?.uri);
      } else {
        setSuccess(false);
        setError("Gagal membuat file PDF");
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setSuccess(false);
      setError(`Gagal membuat file PDF\n${e.toString()}`);
    }
  };

  /*function onManualCapture(uri) {
    setTransformedImage(uri);
  }

  const onCapture = useCallback((uri) => {
    onManualCapture(uri);
  }, []);

  const onManualCaptureFailure = (e) => {
    if (captureFailure) {
      console.log("onCaptureFailure", e);
      if (Platform.OS === "android") {
        ToastAndroid.show(e.toString(), ToastAndroid.LONG);
      }
    } else {
      creatingErrorLogDebug(e);
    }
    setLoading(false);
  };

  const onCaptureFailure = useCallback((e) => {
    if (!captureFailure) {
      setCaptureFailure(true);
      onManualCaptureFailure(e);
    } else {
      console.log("onCaptureFailure", e);
    }
  }, []);*/

  /*const save = async (uri, mimeType) => {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const fileName = getFileName(props.route.params?.uri);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        mimeType ? mimeType : "image/jpeg"
      )
        .then(async (safUri) => {
          //setError(safUri);
          try {
            await FileSystem.writeAsStringAsync(safUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setError("Foto berhasil disimpan");
            setDownloadUri(safUri);
            setSuccess(true);
          } catch (e) {
            console.error(e);
            setError(
              (error) => error + "\nwriteAsStringAsync catch\n" + e.toString()
            );
            setDownloadUri(null);
            setSuccess(false);
          }
        })
        .catch((e) => {
          sentryLog(e);
          setDownloadUri(null);
          setSuccess(false);
          if (e?.code === "ERR_FILESYSTEM_CANNOT_CREATE_FILE") {
            setError(
              "Tidak bisa menyimpan foto di folder sistem. Mohon pilih folder lain."
            );
          } else {
            setError(
              base64.substring(0, 64) +
                "\ncreateFileAsync catch\n" +
                e.toString()
            );
          }
        });
    } else {
      setSuccess(false);
      setError("Anda tidak memberikan izin untuk mengakses penyimpanan");
    }
  };*/

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
      const result = await MediaLibrary.saveToLibraryAsync(uri);
      console.log("savetoLibraryAsync result", result);
      setError(`Foto tersimpan di Galeri Foto`);
      setDownloadUri(JSON.stringify(result));
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setDownloadUri(null);
      setSuccess(false);
    }
  };

  const shareJPGApple = async () => {
    const fileName = `daclen_foto_${id ? id.toString() : ""}.jpg`;
    try {
      const newUri = await FileSystem.getContentUriAsync(transformedImage);
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
    await sharePhotoAsync(transformedImage);
    setSharing(false);
  };

  const startDownload = async (useWatermark) => {
    if (!loading && transformImage !== null) {
      saveIos(transformedImage);
      /*if (Platform.OS === "ios") {
        return;
      }
      try {
        const fileName = getFileName(props.route.params?.uri);
        const result = await FileSystem.downloadAsync(
          transformedImage && useWatermark ? transformedImage : uri,
          FileSystem.documentDirectory + fileName
        );
        console.log(result);

        save(result?.uri, result?.headers["Content-Type"]);
      } catch (e) {
        console.error(e);
        setSuccess(false);
        setError(e.toString());
      }*/
    }
  };

  /*const sharePDF = async () => {
    setSharing(true);
    await shareAsync(pdfUri, sharingOptionsPDF);
    setSharing(false);
  };*/

  const onError = (e) => {
    console.log("Image onError", e);
    setError(
      `Foto tidak bisa diunduh, cek koneksi Internet${
        currentUser?.id === 8054 && Platform.OS !== "web" ? `\n${e?.error}` : ""
      }`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {id === undefined ||
      id === null ||
      watermarkData === undefined ||
      watermarkData === null ||
      disableWatermark ? null : (
        <ViewShot
          ref={imageRef}
          options={{
            fileName: `daclenw_${id ? id.toString() : ""}`,
            format: "jpg",
            quality: 1,
            result: "tmpfile",
            useRenderInContext: Platform.OS === "ios",
          }}
          style={[
            styles.containerLargeImage,
            { width: resizedImgWidth, height: resizedImgHeight },
          ]}
          captureMode=""
        >
          <Image
            source={uri}
            style={[
              styles.image,
              { width: resizedImgWidth, height: resizedImgHeight, zIndex: 2 },
            ]}
            contentFit="contain"
            placeholder={null}
            transition={0}
            onLoadEnd={() => transformImage()}
            onError={(e) => onError(e)}
          />
          <ImageLargeWatermarkModel
            style={styles.image}
            width={width}
            height={height}
            displayWidth={resizedImgWidth}
            displayHeight={resizedImgHeight}
            uri={null}
            link_x={link_x}
            link_y={link_y}
            text_x={text_x}
            text_y={text_y}
            fontSize={fontSize}
            watermarkData={watermarkData}
            jenis_foto={jenis_foto}
            username={currentUser?.name}
          />
        </ViewShot>
      )}
      {watermarkData === null ||
      watermarkData === undefined ||
      disableWatermark ? null : (
        <ImageBackground
          source={require("../../assets/profilbg.png")}
          style={styles.background}
          resizeMode="cover"
        />
      )}
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

      <View
        style={[
          styles.containerInside,
          {
            height: productPhotoHeight,
          },
        ]}
      >
        {error === null ? null : (
          <ActivityIndicator
            size={24}
            color={
              loading ? colors.daclen_lightgrey_button : colors.daclen_light
            }
            style={styles.spinnerMain}
          />
        )}

        {watermarkData === null ||
        watermarkData === undefined ||
        disableWatermark ? (
          <ReactNativeZoomableView
            maxZoom={2}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            style={[
              styles.imageNormal,
              {
                width: productPhotoWidth,
                height: productPhotoHeight,
              },
            ]}
          >
            <Image
              source={uri}
              style={[
                styles.imageNormal,
                {
                  width: productPhotoWidth,
                  height: productPhotoHeight,
                },
              ]}
              contentFit="contain"
              placeholder={null}
              transition={0}
              onError={(e) => onError(e)}
            />
          </ReactNativeZoomableView>
        ) : (
          <ReactNativeZoomableView
            maxZoom={2}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            style={[
              styles.containerImagePreview,
              { width: productPhotoWidth, height: productPhotoHeight },
            ]}
          >
            <ImageLargeWatermarkModel
              width={width}
              height={height}
              displayWidth={productPhotoWidth}
              displayHeight={productPhotoHeight}
              uri={uri}
              link_x={link_x}
              link_y={link_y}
              text_x={text_x}
              text_y={text_y}
              fontSize={fontSize}
              style={{
                position: "absolute",
                top: 0,
                start: 0,
                zIndex: 4,
              }}
              watermarkData={watermarkData}
              jenis_foto={jenis_foto}
              username={currentUser?.name}
            />
          </ReactNativeZoomableView>
        )}
      </View>
      {id === undefined ||
      id === null ||
      watermarkData === undefined ||
      watermarkData === null ||
      disableWatermark ? null : (
        <View
          style={[
            styles.containerHorizontal,
            {
              width: screenWidth,
              height: panelHeight,
              backgroundColor: "transparent",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => startDownload()}
            style={[
              styles.button,
              {
                backgroundColor:
                  loading || transformedImage === null
                    ? colors.daclen_lightgrey_button
                    : colors.daclen_light,
              },
            ]}
            disabled={
              loading || transformedImage === null || downloadUri !== null
            }
          >
            {loading || transformedImage === null ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_black}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <MaterialCommunityIcons
                name={downloadUri === null ? "file-download" : "check-bold"}
                size={18}
                color={colors.daclen_black}
              />
            )}

            <Text allowFontScaling={false} style={styles.textButton}>
              {downloadUri === null ? "Download" : "Tersimpan"}
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
                  loading || sharing || transformedImage === null
                    ? colors.daclen_lightgrey_button
                    : colors.daclen_light,
              },
            ]}
            disabled={loading || sharing || transformedImage === null}
          >
            {loading || sharing ? (
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
      )}
    </SafeAreaView>
  );
};

/*

<ScrollView contentContainerStyle={styles.scrollView}>
        
      </ScrollView>


              onZoomAfter={(e, gestureState, z) => console.log("onZoomAfter", e, gestureState, z)}

            <TouchableOpacity
              onPress={() => sharePDF()}
              style={[
                styles.button,
                {
                  backgroundColor:
                    loading ||
                    sharing ||
                    pdfUri === null ||
                    transformedImage === null
                      ? colors.daclen_gray
                      : colors.daclen_blue,
                },
              ]}
              disabled={
                loading ||
                sharing ||
                pdfUri === null ||
                transformedImage === null
              }
            >
              {loading || transformedImage === null || pdfUri === null ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_light}
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="file-download"
                  size={18}
                  color={colors.daclen_light}
                />
              )}

              <Text allowFontScaling={false} style={styles.textButton}>
                Share PDF
              </Text>
            </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
    marginTop: 24,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInside: {
    zIndex: 3,
    marginTop,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
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
  containerImagePreview: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 4,
    overflow: "visible",
  },
  imageNormal: {
    backgroundColor: "transparent",
    zIndex: 4,
    alignSelf: "center",
  },
  containerHorizontal: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: staticDimensions.pageBottomPadding / 3,
    top: -20,
    zIndex: 20,
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
  textWatermark: {
    position: "absolute",
    fontFamily: "Poppins-Bold",
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
  },
  spinner: {
    marginVertical: 20,
    backgroundColor: colors.white,
    zIndex: 2,
  },
  spinnerMain: {
    zIndex: 1,
    backgroundColor: "transparent",
    alignSelf: "center",
    position: "absolute",
    top: (screenHeight - 24) / 4,
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

export default connect(mapStateToProps, null)(ImageViewer);
