import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as ImageManipulator from "expo-image-manipulator";
//import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";

import {
  colors,
  staticDimensions,
  dimensions,
  blurhash,
} from "../../styles/base";
import { sentryLog } from "../../sentry";
import {
  sharingOptionsJPEG,
  sharingOptionsPDF,
  watermarkStyle,
} from "../media/constants";
import {
  filePrintOptions,
  multiplephotoshtml,
  multiplephotosimgtag,
  multiplephotosimgtagcustomwidthheight,
  pdfpageheight,
  pdfpagewidth,
} from "./constants";
import ImageLargeWatermarkModel from "../media/ImageLargeWatermarkModel";

const ImageViewer = (props) => {
  const {
    id,
    title,
    uri,
    thumbnail,
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
  const resizedImgWidth = pdfpagewidth - 20;
  const resizedImgHeight = Math.ceil((height * resizedImgWidth) / width);

  const productPhotoWidth =
    dimensions.fullWidth - staticDimensions.productPhotoWidthMargin;
  const ratio = width / productPhotoWidth;
  const pdfRatio = resizedImgWidth / productPhotoWidth;
  const fontSize = font?.size?.ukuran ? font?.size?.ukuran : 48;

  //const [productPhotoHeight, setProductPhotoHeight] = useState(0);
  const productPhotoHeight = isSquare ? productPhotoWidth : height / ratio;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captureFailure, setCaptureFailure] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);

  const { watermarkData, currentUser } = props;
  const imageRef = useRef();

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

    console.log("ImageViewer route params", props.route.params);
  }, [uri]);

  useEffect(() => {
    if (transformedImage === null) {
      return;
    }
    if (Platform.OS !== "web") {
      renderPDF(transformedImage);
    }
  }, [transformedImage]);

  const transformImage = async () => {
    if (Platform.OS === "web") {
      setError("ViewShot not available on Web");
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
      if (currentUser?.id === 8054 && Platform.OS === "ios") {
        /*setSuccess(true);
        setError(`html\n${html}`);*/
        console.log("pdf html", html);
      }
      const result = await Print.printToFileAsync({
        width: resizedImgWidth - 60,
        height: resizedImgHeight - 40,
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
    if (Platform.OS === "android") {
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
              setError("Foto berhasil disimpan dan siap dibagikan");
              setSuccess(true);
              sharePhotoAsync(safUri);
            } catch (e) {
              console.error(e);
              setError(
                (error) => error + "\nwriteAsStringAsync catch\n" + e.toString()
              );
              setSuccess(false);
            }
          })
          .catch((e) => {
            sentryLog(e);
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
    } else if (Platform.OS === "ios") {
      //sharePhotoAsync()
      renderPDF(uri);
    }
  };*/

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

  /*const startDownload = async (useWatermark) => {
    if (!loading) {
      if (downloadUri === null) {
        setError(null);
        setLoading(true);
        if (
          transformedImage === null ||
          transformedImage === "" ||
          !useWatermark
        ) {
          try {
            const fileName = getFileName(props.route.params?.uri);
            const result = await FileSystem.downloadAsync(
              transformedImage ? transformedImage : uri,
              FileSystem.documentDirectory + fileName
            );
            console.log(result);
            setDownloadUri(result.uri, result.headers["Content-Type"]);
            save(result.uri);
          } catch (e) {
            console.error(e);
            setSuccess(false);
            setError("downloadAsync catch\n" + e.toString());
          }
        } else {
          try {
            sharePhotoAsync(transformedImage);
          } catch (e) {
            console.error(e);
            setSuccess(false);
            setError("transformedImage catch\n" + e?.message);
          }
        }
        setLoading(false);
      } else {
        sharePhotoAsync(downloadUri);
      }
    }
  };*/

  const sharePDF = async () => {
    setSharing(true);
    await shareAsync(pdfUri, sharingOptionsPDF);
    setSharing(false);
  };

  //startDownload(transformedImage !== null && transformedImage !== "")

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
              { width: resizedImgWidth, height: resizedImgHeight, zIndex: 1 },
            ]}
            contentFit="contain"
            placeholder={null}
            transition={0}
            onLoadEnd={() => transformImage()}
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
          />
        </ViewShot>
      )}
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

      {watermarkData === null ||
      watermarkData === undefined ||
      disableWatermark || !sharingAvailability || Platform.OS === "web" ? null : (
        <View style={styles.containerHorizontal}>
          <View style={styles.containerButton}>
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
                      transformedImage === null
                        ? colors.daclen_gray
                        : colors.daclen_orange,
                  },
                ]}
                disabled={
                  loading ||
                  sharing ||
                  transformedImage === null
                }
              >
                {loading || transformedImage === null ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.daclen_light}
                    style={{ alignSelf: "center" }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={18}
                    color={colors.daclen_light}
                  />
                )}

                <Text style={styles.textButton}>Share Foto</Text>
              </TouchableOpacity>
            </View>

          <View style={styles.containerButton}>
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

              <Text style={styles.textButton}>Share PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        {watermarkData === null ||
        watermarkData === undefined ||
        disableWatermark ? (
          <View style={[styles.containerImage, { width: productPhotoWidth }]}>
            <Image
              source={thumbnail ? thumbnail : uri}
              style={[
                styles.image,
                { width: productPhotoWidth, height: productPhotoWidth },
              ]}
              contentFit="contain"
              placeholder={blurhash}
              transition={0}
            />
          </View>
        ) : (
          <View style={styles.containerInside}>
            {loading ? (
              <ActivityIndicator
                size="large"
                style={styles.spinner}
                color={colors.daclen_orange}
              />
            ) : (
              <View
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
                  uri={thumbnail}
                  link_x={link_x}
                  link_y={link_y}
                  text_x={text_x}
                  text_y={text_y}
                  fontSize={fontSize}
                  watermarkData={watermarkData}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInside: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  containerLargeImage: {
    flex: 1,
    backgroundColor: "white",
    overflow: "visible",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 0,
    opacity: 100,
  },
  containerImage: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  containerImagePreview: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 2,
    overflow: "visible",
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerButton: {
    flex: 1,
    backgroundColor: colors.daclen_light,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 10,
    color: "white",
  },
  textError: {
    width: "100%",
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
    zIndex: 1,
  },
  textWatermark: {
    position: "absolute",
    fontWeight: "bold",
  },
  spinner: {
    marginVertical: 20,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
});

export default connect(mapStateToProps, null)(ImageViewer);
