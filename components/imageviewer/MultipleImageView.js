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
import { ErrorView } from "../webview/WebviewChild";
import ViewShot from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

import { colors, staticDimensions, dimensions } from "../../styles/base";
import WatermarkModel from "../media/WatermarkModel";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  filePrintOptions,
  multiplephotoshtml,
  multiplephotosimgtag,
  pdfpageheight,
  pdfpagewidth,
} from "./constants";
import { ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../asyncstorage/constants";
import { webfotowatermark } from "../../axios/constants";

export default function MultipleImageView(props) {
  const { title, photos, watermarkData, sharingAvailability, userId } =
    props.route.params;

  const productPhotoWidth =
    pdfpagewidth - (staticDimensions.productPhotoWidthMargin * 6);

  try {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState(null);
    /*const [pageDimensions, setPageDimensions] = useState({
      width: 0,
      height: 0,
    });*/
    const [loadCount, setLoadCount] = useState(0);
    const [tiSize, setTiSize] = useState(0);
    const [transformedImages, setTransformedImages] = useState([]);
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

      for (let i = 0; i < photos.length; i++) {
        imageRefs.current[i] = createRef();
      }

      /*let width = pdfpagewidth;
      let height = pdfpageheight;
      for (let i = 0; i < photos.length; i++) {
        imageRefs.current[i] = createRef();
        if (photos[i]?.width > width || photos[i]?.height > height) {
          width = photos[i]?.width;
          height = photos[i]?.height;
        }
      }
      setPageDimensions({
        width: width + staticDimensions.productPhotoWidthMargin * 6,
        height: height + staticDimensions.productPhotoWidthMargin * 15,
      });*/
      /*imageRefs.current = photos.map(
        (ref, index) => (imageRefs.current[index] = createRef())
      );*/

      if (
        sharingAvailability === undefined ||
        sharingAvailability === null ||
        !sharingAvailability
      ) {
        addError("Perangkat tidak mengizinkan untuk membagikan file");
      }
      addLogs(
        `sharingAvailability ${sharingAvailability}\npageDimensions ${pdfpagewidth}x${pdfpageheight}`
      );

      if (title !== null && title !== undefined && title !== "") {
        props.navigation.setOptions({ title: `Download ${title}` });
      }
    }, []);

    /*useEffect(() => {
      if (pageDimensions?.width <= 0 || pageDimensions?.height <= 0) {
        return;
      }
      addLogs(`pageDimensions set ${JSON.stringify(pageDimensions)}`);
    }, [pageDimensions]);*/

    useEffect(() => {
      if (loadCount <= 0) {
        return;
      }
      if (loadCount === photos?.length) {
        startRendering();
      }
      addLogs(`loadCount ${loadCount}`);
    }, [loadCount]);

    useEffect(() => {
      //let tiSize = transformedImages.length;
      if (
        photos === undefined ||
        photos === null ||
        photos?.length === undefined ||
        photos?.length < 1 ||
        tiSize < 1
      ) {
        return;
      }
      addLogs(`tiSize ${tiSize} transformedImages ${transformedImages.length}`);
      if (tiSize === photos?.length) {
        let imgTags = null;
        for (let img of transformedImages) {
          imgTags = `${imgTags ? imgTags : ""}${multiplephotosimgtag.replace(
            "#URI#",
            img
          )}`;
        }
        /*
        .replace("#WIDTH#", pageDimensions?.width)
        .replace("#HEIGHT#", pageDimensions?.height)*/
        let html = multiplephotoshtml
          .replace("#TITLE#", title)
          .replace("#IMGTAGS#", imgTags);
        setHtml(html);
      }
    }, [tiSize]);

    useEffect(() => {
      if (html === null) {
        return;
      }
      addLogs(`\n\nHTML generated\n${Platform.OS === "web" ? html : ""}`);
      printToFile();
    }, [html]);

    /*useEffect(() => {
      console.log("imageRefs", imageRefs);
      addLogs(`imageRefs ${JSON.stringify(imageRefs)}`);
    }, [imageRefs]);*/

    const addError = (text) => {
      setError((error) => `${error ? error + "\n" : ""}${text}`);
    };

    const addLogs = (text) => {
      setLogs((logs) => `${logs ? logs + "\n" : ""}${text}`);
    };

    const noteImageLoaded = (index, id, width, height, newWidth, newHeight) => {
      addLogs(
        `\nloading image index ${index} id ${id}\noriginal ${width}x${height}\nrezized to ${newWidth}x${newHeight}`
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
      if (Platform.OS === "web") {
        //addError("ViewShot not available on Web");
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
          .then((uri) => {
            setTransformedImages((transformedImages) => [
              ...transformedImages,
              uri,
            ]);
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
        html,
      });
      console.log("printToFileAsync", result);
      addLogs(`printToFileAsync ${JSON.stringify(result)}`);
      setLoading(false);
      if (result?.uri) {
        saveUriToAsyncStorage(result?.uri);
        await shareFileAsync(result?.uri);
        //save(result?.uri);
      } else {
        if (Platform.OS === "android") {
          ToastAndroid.show("Gagal membuat file PDF", ToastAndroid.LONG);
        }
        //saveUriToAsyncStorage(result?.uri);
      }
      navigation.goBack();
    };

    const save = async (uri) => {
      const fileName = `Daclen_${watermarkData?.name}_${title}.pdf`;

      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "application/pdf"
          )
            .then(async (safUri) => {
              addLogs(`after save uri ${safUri}`);
              try {
                let result = await FileSystem.writeAsStringAsync(
                  safUri,
                  base64,
                  {
                    encoding: FileSystem.EncodingType.Base64,
                  }
                );
                addLogs(`PDF berhasil disimpan dan siap dibagikan ${result}`);
                shareFileAsync(uri);
              } catch (e) {
                console.error(e);
                addError("\nwriteAsStringAsync catch\n" + e.toString());
                shareFileAsync(uri);
              }
            })
            .catch((e) => {
              sentryLog(e);
              if (e?.code === "ERR_FILESYSTEM_CANNOT_CREATE_FILE") {
                addError(
                  "Tidak bisa menyimpan foto di folder sistem. Mohon pilih folder lain."
                );
              } else {
                addError(
                  base64.substring(0, 64) +
                    "\ncreateFileAsync catch\n" +
                    e.toString()
                );
              }
              shareFileAsync(uri);
            });
        } else {
          addError("Anda tidak memberikan izin untuk mengakses penyimpanan");
          shareFileAsync(uri);
        }
      } else {
        addLogs("PDF siap dibagikan");
        shareFileAsync(uri);
      }
    };

    const saveUriToAsyncStorage = async (uri) => {
      const storagePdfPhotos = await getObjectAsync(
        ASYNC_WATERMARK_PHOTOS_PDF_KEY
      );
      let newArray = [];
      if (
        !(
          storagePdfPhotos === undefined ||
          storagePdfPhotos === null ||
          storagePdfPhotos?.length === undefined ||
          storagePdfPhotos?.length < 1
        )
      ) {
        for (let pp of storagePdfPhotos) {
          if (!(pp?.title === title && pp?.userId === userId)) {
            newArray(pp);
          }
        }
      }
      newArray.push({
        title,
        userId,
        uri: uri ? uri : null,
      });
      await setObjectAsync(ASYNC_WATERMARK_PHOTOS_PDF_KEY, newArray);
      addLogs(`new asyncStorage pdfphotos\n${JSON.stringify(newArray)}`);
    };

    const shareFileAsync = async (uri) => {
      if (sharingAvailability) {
        try {
          let result = await shareAsync(uri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
          });
          addLogs(`shareAsync ${JSON.stringify(result)}`);
        } catch (e) {
          console.error(e);
          addError(e.toString());
        }
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerInside}>
          {photos === undefined ||
          photos === null ||
          photos?.length === undefined ||
          photos?.length < 1
            ? null
            : photos.map(
                ({ id, foto, width, height, text_x, text_y, font }, index) => (
                  <ViewShot
                    key={index}
                    ref={
                      index < 1
                        ? imageRefs.current[0]
                        : imageRefs.current[index]
                    }
                    options={{
                      fileName: `daclenwatermarkfoto_${id.toString()}`,
                      format: "jpg",
                      quality: 1,
                      result: "data-uri",
                    }}
                    style={[
                      styles.containerLargeImage,
                      {
                        width: productPhotoWidth,
                        height: Math.round(
                          (height * productPhotoWidth) / width
                        ),
                      },
                    ]}
                  >
                    <Image
                      source={foto}
                      style={{
                        width: productPhotoWidth,
                        height: Math.round(
                          (height * productPhotoWidth) / width
                        ),
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
                          productPhotoWidth,
                          Math.round((height * productPhotoWidth) / width)
                        )
                      }
                    />
                    <WatermarkModel
                      watermarkData={watermarkData}
                      ratio={width / productPhotoWidth}
                      text_align={null}
                      text_x={(text_x * productPhotoWidth) / width}
                      text_y={(text_y * productPhotoWidth) / width}
                      color={null}
                      fontSize={null}
                      paddingHorizontal={1}
                      paddingVertical={1}
                    />
                  </ViewShot>
                )
              )}
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollView}
        >
          {error ? <Text style={styles.textError}>{error}</Text> : null}
          {loading ? (
            <View
              style={[
                styles.containerLoading,
                userId !== 8054 ? { flex: 1 } : null,
              ]}
            >
              <ActivityIndicator
                size="large"
                color={colors.daclen_black}
                style={styles.spinner}
              />
              <Text style={styles.textLoading}>
                {`Menyimpan ${
                  tiSize <= 0 ? "foto" : `${tiSize} foto`
                } menjadi file PDF...`}
              </Text>
            </View>
          ) : null}
          {Platform.OS === "web" || userId === 8054 || !loading ? (
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerLoading: {
    width: "100%",
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
    fontSize: 12,
    margin: 20,
    color: colors.daclen_gray,
  },
  textLoading: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent",
    color: colors.daclen_black,
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
