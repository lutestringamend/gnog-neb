import React, { createRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  Linking,
  ToastAndroid,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ViewShot from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

import { colors, dimensions } from "../../styles/base";
import WatermarkModel from "../media/WatermarkModel";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  filePrintOptions,
  multiplephotoshtml,
  multiplephotosimgtag,
  pdfmimetype,
  pdfpageheight,
  pdfpagewidth,
} from "./constants";
import { ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../asyncstorage/constants";
import { updateReduxMediaKitPhotosUri } from "../../axios/mediakit";
import { ErrorView } from "../webview/WebviewChild";
import { webfotowatermark } from "../../axios/constants";
import { sharingOptionsPDF, watermarkStyle } from "../media/constants";

const MultipleImageView = (props) => {
  const { title, photos, sharingAvailability, userId } =
    props.route.params;

  const { watermarkData } = props;
  const productPhotoWidth = dimensions.fullWidth;

  try {
    //const [permission, setPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState(null);
    const [pageDimensions, setPageDimensions] = useState({
      width: 0,
      height: 0,
    });
    const [loadCount, setLoadCount] = useState(0);
    const [tiSize, setTiSize] = useState(0);
    const [transformedImages, setTransformedImages] = useState([]);
    const [savedUris, setSavedUris] = useState([]);
    const [html, setHtml] = useState(null);
    const navigation = useNavigation();
    const imageRefs = useRef([]);

    useEffect(() => {
      if (
        photos === undefined ||
        photos === null ||
        photos?.length === undefined ||
        photos?.length < 1 ||
        watermarkData === undefined ||
        watermarkData === null
      ) {
        navigation.goBack();
        return;
      }

      if (
        sharingAvailability === undefined ||
        sharingAvailability === null ||
        !sharingAvailability
      ) {
        addError("Perangkat tidak mengizinkan untuk membagikan file");
      }
      addLogs(`sharingAvailability ${sharingAvailability}`);

      /*if (Platform.OS === "android") {
        checkFileSystemPermission();
      } else {
        setPermission({
          granted: false,
        });
      }*/
      let width = pdfpagewidth;
      let height = pdfpageheight;
      for (let i = 0; i < photos.length; i++) {
        imageRefs.current[i] = createRef();
        if (photos[i]?.width > width || photos[i]?.height > height) {
          width = photos[i]?.width;
          height = photos[i]?.height;
        }
      }
      setPageDimensions({
        width,
        height,
      });

      if (title !== null && title !== undefined && title !== "") {
        props.navigation.setOptions({ title: `Download ${title}` });
      }
    }, []);

    /*useEffect(() => {
      if (permission === null) {
        checkFileSystemPermission();
      } else if (permission?.granted) {
        let width = pdfpagewidth;
        let height = pdfpageheight;
        for (let i = 0; i < photos.length; i++) {
          imageRefs.current[i] = createRef();
          if (photos[i]?.width > width || photos[i]?.height > height) {
            width = photos[i]?.width;
            height = photos[i]?.height;
          }
        }
        setPageDimensions({
          width,
          height,
        });

      } else if (!permission?.granted && Platform.OS === "android") {
        addError("Anda tidak memberikan izin untuk mengakses penyimpanan");
        navigation.goBack();
      }
    }, [permission]);*/

    useEffect(() => {
      if (pageDimensions?.width <= 0 || pageDimensions?.height <= 0) {
        return;
      }
      addLogs(`pageDimensions set ${JSON.stringify(pageDimensions)}`);
    }, [pageDimensions]);

    useEffect(() => {
      /*
      ||
        permission === null ||
        permission?.granted === undefined ||
        permission?.directoryUri === undefined
      */
      if (loadCount <= 0) {
        return;
      }
      // && permission?.granted
      if (loadCount === photos?.length) {
        startRendering();
      }
      addLogs(`loadCount ${loadCount}`);
    }, [loadCount]);

    useEffect(() => {
      if (
        photos === undefined ||
        photos === null ||
        photos?.length === undefined ||
        photos?.length < 1 ||
        tiSize < 1
      ) {
        return;
      }
      addLogs(
        `tiSize ${tiSize} transformedImages ${transformedImages?.length}`
      );
    }, [tiSize]);

    useEffect(() => {
      if (
        savedUris?.length === undefined ||
        savedUris?.length < 1 ||
        savedUris?.length < photos?.length
      ) {
        addLogs(`savedUris length ${savedUris?.length}`);
        return;
      }

      let imgTags = null;
      for (let img of savedUris) {
        imgTags = `${imgTags ? imgTags : ""}${multiplephotosimgtag
          .replace("#URI#", img)
          .replace("#WIDTH#", pageDimensions?.width)
          .replace("#HEIGHT#", pageDimensions?.height)}`;
      }
      let html = multiplephotoshtml
        .replace("#TITLE#", title)
        .replace("#IMGTAGS#", imgTags);
      setHtml(html);
    }, [savedUris]);

    useEffect(() => {
      if (html === null) {
        return;
      }
      addLogs(`\n\nHTML generated\n${html}`);
      printToFile();
    }, [html]);

    const addError = (text) => {
      setError((error) => `${error ? error + "\n" : ""}${text}`);
    };

    const addLogs = (text) => {
      setLogs((logs) => `${logs ? logs + "\n" : ""}${text}`);
    };

    /*const checkFileSystemPermission = async () => {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      addLogs(
        `FileSystem granted ${permissions?.granted} directoryUri ${permissions?.directoryUri}`
      );
      setPermission(permissions);
    };*/

    const noteImageLoaded = (
      index,
      id,
      width,
      height,
      newWidth,
      newHeight,
      ratio
    ) => {
      addLogs(
        `\nloading image index ${index} id ${id}\noriginal ${width}x${height}\nrezized to ${newWidth}x${newHeight}\nratio ${ratio}`
      );
      setLoadCount((loadCount) => loadCount + 1);
    };

    const startRendering = async () => {
      for (let i = 0; i < loadCount; i++) {
        await transformImage(i);
        addLogs(`index ${i} rendered`);
      }
    };

    const transformImage = async (index) => {
      //DEV TEMP WITHOUT WATERMARK
      /*let uri = photos[index]?.foto;
      if (!(uri === undefined || uri === null)) {
        setTransformedImages((transformedImages) => [
          ...transformedImages,
          uri,
        ]);
        setTiSize((tiSize) => tiSize + 1);
        return;
      }*/

      if (Platform.OS === "web") {
        addError("ViewShot not available on Web");
        setTransformedImages((transformedImages) => [
          ...transformedImages,
          `IMAGE INDEX ${index}`,
        ]);
        setTiSize((tiSize) => tiSize + 1);
        return;
      }
      try {
        imageRefs.current[index].current
          .capture()
          .then(async (uri) => {
            let newUri = uri;
            try {
              newUri = await FileSystem.getContentUriAsync(uri);
            } catch (error) {
              addError(
                `index ${index} getContentUriAsync error\n${error.toString()}`
              );
            }
            addLogs(`new capture index ${index} uri ${newUri}`);
            setSavedUris((savedUris) => [...savedUris, newUri]);
            setTiSize((tiSize) => tiSize + 1);
          })
          .catch((e) => {
            sentryLog(e);
            addError(`capture catch index ${index} ${e.toString()}`);
            setTiSize((tiSize) => tiSize + 1);
          });
      } catch (e) {
        sentryLog(e);
        addError(`capture fail index ${index} ${e.toString()}`);
        setTiSize((tiSize) => tiSize + 1);
      }
    };

    const printToFile = async () => {
      const result = await Print.printToFileAsync({
        ...filePrintOptions,
        width: pageDimensions.width - 80,
        height: pageDimensions.height - 100,
        html,
      });
      console.log("printToFileAsync", result);
      addLogs(`printToFileAsync ${JSON.stringify(result)}`);
      setLoading(false);
      if (Platform.OS === "web") {
        saveUriToAsyncStorage("WEBURI");
        return;
      }

      if (result?.uri) {
        /*if (Platform.OS === "android") {
          await saveFileToStorage(result?.uri);
        }*/
        saveUriToAsyncStorage(result?.uri);
        await shareFileAsync(result?.uri);
      } else if (Platform.OS === "android") {
        ToastAndroid.show("Gagal membuat file PDF", ToastAndroid.LONG);
      }
      /*if (userId !== 8054) {
      }*/
      //saveUriToAsyncStorage(result?.uri);
    };

    /*const saveFileToStorage = async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      let fileName = `Daclen_${title}.pdf`;
      await FileSystem.StorageAccessFramework.createFileAsync(
        permission?.directoryUri,
        fileName,
        pdfmimetype
      )
        .then(async (safUri) => {
          try {
            await FileSystem.writeAsStringAsync(safUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            let resultUri = `${permission?.directoryUri}/${fileName}`;
            addLogs(`\npdf saved to ${resultUri}`);
          } catch (e) {
            console.error(e);
            addError(`writeAsStringAsync catch\n${e.toString()}`);
            //reset();
          }
        })
        .catch((e) => {
          sentryLog(e);
          if (e?.code === "ERR_FILESYSTEM_CANNOT_CREATE_FILE") {
            ToastAndroid.show(
              `Tidak bisa menyimpan foto di folder ini.`,
              ToastAndroid.LONG
            );
          } else {
            addError(
              `createFileAsync catch\n${e.toString()}\n${base64.substring(
                0,
                64
              )}\n`
            );
          }
          //reset();
        });
    };

    const reset = () => {
      setPermission(null);
      setTiSize(0);
      setTransformedImages([]);
      setSavedUris([]);
      setHtml(null);
    };*/

    const saveUriToAsyncStorage = async (uri) => {
      let newArray = [];
      const storagePdfPhotos = await getObjectAsync(
        ASYNC_WATERMARK_PHOTOS_PDF_KEY
      );
      if (
        props.photosUri === undefined ||
        props.photosUri === null ||
        props.photosUri?.length === undefined ||
        props.photosUri?.length === null
      ) {
        if (
          !(
            storagePdfPhotos === undefined ||
            storagePdfPhotos === null ||
            storagePdfPhotos?.length === undefined ||
            storagePdfPhotos?.length < 1
          )
        ) {
          for (let pp of storagePdfPhotos) {
            if (!(pp?.title == title && pp?.userId === userId)) {
              newArray.push(pp);
            }
          }
        }
      } else {
        for (let pp of props.photosUri) {
          if (!(pp?.title === title && pp?.userId === userId)) {
            newArray.push(pp);
          }
        }
      }

      newArray.push({
        title,
        userId,
        uri: uri ? uri : null,
      });
      addLogs(`new asyncStorage pdfphotos\n${JSON.stringify(newArray)}`);
      props.updateReduxMediaKitPhotosUri(newArray);
      setObjectAsync(ASYNC_WATERMARK_PHOTOS_PDF_KEY, newArray);
    };

    const shareFileAsync = async (uri) => {
      if (sharingAvailability) {
        try {
          let result = await shareAsync(uri, sharingOptionsPDF);
          addLogs(`shareAsync ${JSON.stringify(result)}`);
        } catch (e) {
          console.error(e);
          addError(e.toString());
        }
      }
      navigation.goBack();
    };

    const getFileName = (index) => {
      return `daclen_${title}_${index.toString()}`;
    };

    //        {permission?.granted ?  : null}

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerInside}>
          {photos === undefined ||
          photos === null ||
          photos?.length === undefined ||
          photos?.length < 1 ||
          pageDimensions?.width <= 0 ||
          pageDimensions?.height <= 0
            ? null
            : photos.map(
                (
                  { id, foto, width, height, fontSize },
                  index
                ) => (
                  <ViewShot
                    key={index}
                    ref={
                      index < 1
                        ? imageRefs.current[0]
                        : imageRefs.current[index]
                    }
                    options={{
                      fileName: getFileName(index),
                      format: "jpg",
                      quality: 1,
                      result: "tmpfile",
                      useRenderInContext: true,
                    }}
                    style={[
                      styles.containerLargeImage,
                      {
                        width,
                        height,
                      },
                    ]}
                  >
                    <Image
                      source={foto}
                      style={{
                        width,
                        height,
                      }}
                      contentFit="contain"
                      placeholder={null}
                      transition={0}
                      onLoadEnd={() =>
                        noteImageLoaded(
                          index,
                          id,
                          width,
                          height,
                          width,
                          height,
                          width / productPhotoWidth
                        )
                      }
                    />
                    <WatermarkModel
                      watermarkData={watermarkData}
                      ratio={width / productPhotoWidth}
                      text_align={null}
                      height={height - Math.ceil(watermarkStyle?.paddingBottom * width / productPhotoWidth)}
                      color={null}
                      fontSize={Math.round(
                        ((fontSize ? fontSize : 16) * productPhotoWidth) / width
                      )}
                      paddingHorizontal={1}
                      paddingVertical={1}
                    />
                  </ViewShot>
                )
              )}
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.containerLoading}
        >
          {error ? <Text style={styles.textError}>{error}</Text> : null}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_black}
              style={styles.spinner}
            />
          ) : null}

          <Text style={styles.textLoading}>
            {loading
              ? `Menyimpan ${
                  tiSize <= 0 ? "foto" : `${tiSize} foto`
                } menjadi file PDF...`
              : "Berhasil menyimpan file PDF"}
          </Text>
          {Platform.OS === "web" ? (
            <Text style={styles.textLogs}>{logs}</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    sentryLog(error);
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          error={error.toString()}
          onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  containerLoading: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  containerInside: {
    flex: 1,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 0,
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
    backgroundColor: "white",
    overflow: "visible",
  },
  containerButton: {
    width: "100%",
    backgroundColor: colors.daclen_light,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: colors.daclen_orange,
  },
  textLogs: {
    fontFamily: "Poppins", fontSize: 12,
    margin: 20,
    color: colors.daclen_gray,
  },
  textLoading: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    backgroundColor: "transparent",
    color: colors.daclen_black,
  },
  textError: {
    width: "100%",
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
    zIndex: 1,
  },
  textWatermark: {
    position: "absolute",
    fontFamily: "Poppins-Bold",
  },
  spinner: {
    marginVertical: 20,
  },
});

const mapStateToProps = (store) => ({
  watermarkData: store.mediaKitState.watermarkData,
  photosUri: store.mediaKitState.photosUri,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxMediaKitPhotosUri,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(MultipleImageView);
