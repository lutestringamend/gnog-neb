import React, { createRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { shareAsync, isAvailableAsync } from "expo-sharing";

import {
  colors,
  staticDimensions,
  dimensions,
  blurhash,
} from "../../styles/base";
import { getFileName } from "../media";
import WatermarkModel from "../media/WatermarkModel";
import { sentryLog } from "../../sentry";
import { sharingOptionsJPEG } from "../media/constants";
import {
  filePrintOptions,
  multiplephotoshtml,
  multiplephotosimgtag,
  temporaryimgurl,
} from "./constants";

export default function MultipleImageView(props) {
  const { title, photos, watermarkData, sharingAvailability } =
    props.route.params;

  const productPhotoWidth =
    dimensions.fullWidth - staticDimensions.productPhotoWidthMargin;

  /*
  title: `Download ${title}`,
      photoArray,
      isSquare: false,
      width: item?.width,
      height: item?.height,
      text_align: item?.text_align,
      text_x: item?.text_x,
      text_y: item?.text_y,
      font: item?.font,
      watermarkData,
      userId,
  */

  /*
  let ratio = width / productPhotoWidth;
  let fontSize = font?.size?.ukuran
    ? font?.size?.ukuran > 32
      ? font?.size?.ukuran / 2
      : font?.size?.ukuran
    : 16;*/

  //const [productPhotoHeight, setProductPhotoHeight] = useState(0);
  // const productPhotoHeight = isSquare ? productPhotoWidth : height / ratio;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState(null);
  const [tiSize, setTiSize] = useState(0);
  const [transformedImages, setTransformedImages] = useState([]);
  const [html, setHtml] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);
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
    /*imageRefs.current = photos.map(
      (ref, index) => (imageRefs.current[index] = createRef())
    );*/

    if (
      sharingAvailability === undefined ||
      sharingAvailability === null ||
      !sharingAvailability
    ) {
      setError("Perangkat tidak mengizinkan untuk membagikan file");
    }

    if (title !== null && title !== undefined && title !== "") {
      props.navigation.setOptions({ title });
    }
  }, []);

  useEffect(() => {
    //let tiSize = transformedImages.length;
    addLogs(`tiSize ${tiSize} transformedImages ${transformedImages.length}`);
    if (
      photos === undefined ||
      photos === null ||
      photos?.length === undefined ||
      photos?.length < 1 ||
      tiSize < 1
    ) {
      return;
    }
    if (tiSize === photos?.length) {
      let imgTags = null;
      for (let img of transformedImages) {
        imgTags = `${imgTags ? imgTags : ""}${multiplephotosimgtag.replace(
          "#URI#",
          img
        )}`;
      }
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
    addLogs(`\n\nHTML generated\n${html}`);
    printToFile();
  }, [html]);

  useEffect(() => {
    console.log("imageRefs", imageRefs);
    addLogs(`imageRefs ${JSON.stringify(imageRefs)}`);
  }, [imageRefs]);

  const addError = (text) => {
    setError((error) => `${error ? error + "\n" : ""}${text}`);
  };

  const addLogs = (text) => {
    setLogs((logs) => `${logs ? logs + "\n" : ""}${text}`);
  };

  const transformImage = async (index, id) => {
    addLogs(`photo index ${index} id ${id} loaded`);
    if (Platform.OS === "web") {
      //addError("ViewShot not available on Web");
      setTransformedImages((transformedImages) => [
        ...transformedImages,
        temporaryimgurl,
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
          console.error(e);
          addError(`capture catch index ${index} ${e.toString()}`);
          setTiSize((tiSize) => tiSize + 1);
          sentryLog(e);
        });
    } catch (e) {
      console.error(e);
      addError(`capture fail index ${index} ${e.toString()}`);
      setTiSize((tiSize) => tiSize + 1);
      sentryLog(e);
    }
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const result = await Print.printToFileAsync({ ...filePrintOptions, html });
    console.log("printToFileAsync", result);
    addLogs(JSON.stringify(result));
    if (sharingAvailability && result?.uri) {
      await shareAsync(result?.uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    }
    setLoading(false);
  };

  /*


  const sharePhotoAsync = async (uri) => {
    if (!sharingAvailability) {
      setError("Perangkat tidak mengizinkan untuk membagikan file");
      return;
    }

    try {
      await shareAsync(uri, sharingOptionsJPEG);
    } catch (e) {
      console.error(e);
      setError(e?.message);
    }
  };

  const save = async (uri, mimeType) => {
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
            setError(safUri);
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
            console.error(e);
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
            if (Platform.OS === "android") {
              ToastAndroid.show(
                base64.substring(0, 64) +
                  "\ncreateFileAsync catch\n" +
                  e.toString(),
                ToastAndroid.LONG
              );
            }
          });
      } else {
        setSuccess(false);
        setError("Anda tidak memberikan izin untuk mengakses penyimpanan");
      }
    } else {
      setSuccess(true);
      setError("Foto siap dibagikan");
      sharePhotoAsync(uri);
    }
  };

  const startDownload = async (useWatermark) => {
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
            setError("downloadAsync catch\n" + e?.message);
          }
        } else {
          try {
            //save(transformedImage);
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
                    index < 1 ? imageRefs.current[0] : imageRefs.current[index]
                  }
                  options={{
                    fileName: `daclenwatermarkfoto_${id.toString()}`,
                    format: "jpg",
                    quality: 1,
                    result: "base64",
                  }}
                  style={[styles.containerLargeImage, { width, height }]}
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
                    onLoadEnd={() => transformImage(index, id)}
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
          <ActivityIndicator
            size="large"
            color={colors.daclen_black}
            style={styles.spinner}
          />
        ) : null}
        <Text style={styles.textLogs}>{logs}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
//                  onLoadEnd={() => transformImage()}

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
    alignItems: "center",
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
