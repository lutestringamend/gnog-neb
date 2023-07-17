import React, { useEffect, useRef, useState } from "react";
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

export default function ImageViewer(props) {
  const {
    id,
    title,
    uri,
    isSquare,
    watermarkData,
    width,
    height,
    text_align,
    text_x,
    text_y,
    font,
    sharingAvailability,
  } = props.route.params;

  let productPhotoWidth =
    dimensions.fullWidth - staticDimensions.productPhotoWidthMargin;
  let ratio = width / productPhotoWidth;
  let fontSize = font?.size?.ukuran
    ? font?.size?.ukuran > 32
      ? font?.size?.ukuran / 2
      : font?.size?.ukuran
    : 16;

  //const [productPhotoHeight, setProductPhotoHeight] = useState(0);
  const productPhotoHeight = isSquare ? productPhotoWidth : height / ratio;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);

  const imageRef = useRef();

  useEffect(() => {
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

    console.log("ImageViewer route params", props.route.params);
  }, [uri]);

  //debug
  /*useEffect(() => {
    if (transformedImage === null) {
      return;
    }
    let uriText = transformedImage;
    if (uriText?.length > 50) {
      uriText = uriText.substring(0,47) + "..."
    }
    setError(uriText);
  }, [transformedImage]);*/

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
        .catch((e) => {
          console.error(e);
          setError(e.toString());
          setLoading(false);
          sentryLog(e);
        });
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setLoading(false);
      sentryLog(e);
    }
  };

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
            /*if (Platform.OS === "android") {
              ToastAndroid.show(
                base64.substring(0, 64) +
                  "\ncreateFileAsync catch\n" +
                  e.toString(),
                ToastAndroid.LONG
              );
            }*/
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
            setError("downloadAsync catch\n" + e.toString());
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {watermarkData === undefined || watermarkData === null ? null : (
        <ViewShot
          ref={imageRef}
          options={{
            fileName: `daclenwatermarkfoto_${id.toString()}`,
            format: "jpg",
            quality: 1,
          }}
          style={[styles.containerLargeImage, { width, height }]}
        >
          <Image
            source={uri}
            style={{
              width,
              height,
              position: "absolute",
              top: 0,
              start: 0,
            }}
            contentFit="contain"
            placeholder={null}
            transition={0}
            onLoadEnd={() => transformImage()}
          />
          <WatermarkModel
            watermarkData={watermarkData}
            ratio={ratio}
            text_align={text_align}
            text_x={text_x / ratio}
            text_y={text_y / ratio}
            color={font?.color?.warna}
            fontSize={Math.round(fontSize / ratio)}
            paddingHorizontal={1}
            paddingVertical={1}
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

      {watermarkData === null || watermarkData === undefined ? null : (
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() =>
              startDownload(
                transformedImage !== null && transformedImage !== ""
              )
            }
            style={[
              styles.button,
              loading ||
                ((downloadUri !== null ||
                  transformedImage !== null ||
                  Platform.OS === "web") &&
                  !sharingAvailability && {
                    backgroundColor: colors.daclen_gray,
                  }),
            ]}
            disabled={
              loading ||
              ((downloadUri !== null ||
                transformedImage !== null ||
                Platform.OS === "web") &&
                !sharingAvailability)
            }
          >
            <MaterialCommunityIcons
              name={
                downloadUri !== null ||
                transformedImage !== null ||
                Platform.OS === "web"
                  ? "share-variant"
                  : "download"
              }
              size={18}
              color="white"
            />
            <Text style={styles.textButton}>
              {downloadUri !== null ||
              transformedImage !== null ||
              Platform.OS === "web"
                ? "Share Foto"
                : "Download Foto"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        {watermarkData === null || watermarkData === undefined ? (
          <View style={[styles.containerImage, { width: productPhotoWidth }]}>
            <Image
              source={uri}
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
                <Image
                  source={uri}
                  style={{
                    width: productPhotoWidth,
                    height: productPhotoHeight,
                    position: "absolute",
                    zIndex: 0,
                  }}
                  contentFit="cover"
                  placeholder={blurhash}
                  transition={0}
                />
                <WatermarkModel
                  watermarkData={watermarkData}
                  ratio={1}
                  text_align={text_align}
                  text_x={text_x / ratio}
                  text_y={text_y / ratio}
                  color={font?.color?.warna}
                  fontSize={Math.round(fontSize / ratio)}
                  paddingHorizontal={1}
                  paddingVertical={1}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
