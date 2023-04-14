import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ActivityIndicator,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ToastAndroid,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { shareAsync, isAvailableAsync } from "expo-sharing";
import * as Sentry from "sentry-expo";

import { colors, dimensions } from "../../styles/base";
import { getFileName } from "../media";

export default function ImageViewer(props) {
  let title = props.route.params?.title;
  let uri = props.route.params?.uri;
  let isSquare = props.route.params?.isSquare;
  let watermarkData = props.route.params?.watermarkData;

  let width = props.route.params?.width;
  let height = props.route.params?.height;
  let ratio = width / dimensions.productPhotoWidth;

  let text_align = props.route.params?.text_align;
  let text_x = props.route.params?.text_x;
  let text_y = props.route.params?.text_y;
  let font = props.route.params?.font;
  let fontSize = font?.size?.ukuran
    ? font?.size?.ukuran > 32
      ? font?.size?.ukuran / 2
      : font?.size?.ukuran
    : 16;

  let generalStyle = {
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 1,
    textAlign: text_align,
    top: text_y / ratio,
    start: text_x / ratio,
    backgroundColor: "transparent",
    color: font?.color?.warna ? font?.color?.warna : colors.daclen_red,
    fontSize: Math.round(fontSize / ratio),
  };

  let textStyle = {
    ...generalStyle,
    fontSize,
    paddingVertical: generalStyle.paddingVertical * ratio,
    paddingHorizontal: generalStyle.paddingHorizontal * ratio,
    borderRadius: generalStyle.borderRadius * ratio,
    top: text_y,
    start: text_x,
  };

  const sharingOptions = {
    UTI: "JPEG",
    dialogTitle: "Share Foto Daclen",
    mimeType: "image/jpeg",
  };

  //const [productPhotoHeight, setProductPhotoHeight] = useState(0);
  const productPhotoHeight = isSquare
    ? dimensions.productPhotoWidth
    : height / ratio;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transformedImage, setTransformedImage] = useState(null);
  const [downloadUri, setDownloadUri] = useState(null);
  const [sharingAvailability, setSharingAvailability] = useState(false);

  const imageRef = useRef();

  useEffect(() => {
    const transformImage = async () => {
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
            setError(JSON.stringify(e));
            setLoading(false);
            if (Platform.OS === "android") {
              ToastAndroid.show(`${e?.message}`, ToastAndroid.LONG);
            }
          });
      } catch (e) {
        console.error(e);
        setError(JSON.stringify(e));
        setLoading(false);
        if (Platform.OS === "web") {
          Sentry.Browser.captureException(e);
        } else {
          Sentry.Native.captureException(e);
          if (Platform.OS === "android") {
            ToastAndroid.show(`${e?.message}`, ToastAndroid.LONG);
          }
        }
      }
    };

    const checkSharing = async () => {
      const result = await isAvailableAsync();
      if (!result) {
        setError("Perangkat tidak mengizinkan untuk membagikan file");
      } else {
        setLoading(true);
        transformImage();
      }
      setSharingAvailability(result);

      const report = {
        width,
        height,
        ppw: dimensions.productPhotoWidth,
        pph: productPhotoHeight,
        ratio,
        generalStyle,
        textStyle,
        sharingAvailability: result,
      };
      console.log(report);
    };

    if (
      watermarkData !== undefined &&
      watermarkData !== null &&
      (uri !== null) & (uri !== undefined)
    ) {
      checkSharing();
    }

    if (title !== null && title !== undefined && title !== "") {
      props.navigation.setOptions({ title });
    }
  }, [uri]);

  const sharePhotoAsync = async (uri) => {
    if (!sharingAvailability) {
      setError("Perangkat tidak mengizinkan untuk membagikan file");
      return;
    }

    try {
      await shareAsync(uri, sharingOptions);
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
                (error) =>
                  error + "\nwriteAsStringAsync catch\n" + JSON.stringify(e)
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
                  JSON.stringify(e)
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {watermarkData === undefined || watermarkData === null ? null : (
        <ViewShot
          ref={imageRef}
          options={{ fileName: "watermarkphoto", format: "jpg", quality: 1 }}
          style={[styles.containerLargeImage, { width, height }]}
        >
          <ImageBackground
            source={{ uri }}
            style={{
              width,
              height,
            }}
            resizeMode="cover"
          >
            <Text style={[styles.textWatermark, textStyle]}>
              {`${watermarkData?.name}\n${watermarkData?.phone}\n${watermarkData?.url}`}
            </Text>
          </ImageBackground>
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
          <View style={styles.containerImage}>
            <Image source={{ uri }} resizeMode="contain" style={styles.image} />
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
              <View style={styles.containerImagePreview}>
                <ImageBackground
                  source={{ uri }}
                  style={{
                    width: dimensions.productPhotoWidth,
                    height: productPhotoHeight,
                  }}
                  resizeMode="cover"
                >
                  <Text style={[styles.textWatermark, generalStyle]}>
                    {`${watermarkData?.name}\n${watermarkData?.phone}\n${watermarkData?.url}`}
                  </Text>
                </ImageBackground>
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
    width: dimensions.fullWidth,
  },
  scrollView: {
    flexGrow: 1,
    width: dimensions.fullWidth,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInside: {
    flex: 1,
    width: dimensions.fullWidth,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  containerLargeImage: {
    flex: 1,
    backgroundColor: "transparent",
    overflow: "visible",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: -1,
    opacity: 100,
  },
  containerImage: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: dimensions.productPhotoWidth,
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
    width: dimensions.productPhotoWidth,
    height: dimensions.productPhotoWidth,
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
    width: dimensions.fullWidth,
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textWatermark: {
    position: "absolute",
    fontWeight: "bold",
  },
  spinner: {
    marginVertical: 20,
  },
});
