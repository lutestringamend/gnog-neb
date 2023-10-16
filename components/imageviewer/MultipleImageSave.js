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
  Dimensions,
  ToastAndroid,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as MediaLibrary from "expo-media-library";

import ViewShot from "react-native-view-shot";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

import { colors, staticDimensions } from "../../styles/base";
import { sentryLog } from "../../sentry";
import { pdfpagewidth } from "./constants";
import { updateReduxMediaKitPhotosMultipleSave } from "../../axios/mediakit";
import { ErrorView } from "../webview/WebviewChild";
import { webfotowatermark } from "../../axios/constants";
import ImageLargeWatermarkModel from "../media/ImageLargeWatermarkModel";
import { imageviewerportraitheightmargin } from "../mediakit/constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const calculateImageDimension = (width, height) => {
  const resizedImgWidth = Platform.OS === "ios" ? width : pdfpagewidth - 20;
  const resizedImgHeight =
    Platform.OS === "ios"
      ? height
      : Math.ceil((height * resizedImgWidth) / width);

  const projectedImageHeight = screenHeight - imageviewerportraitheightmargin;
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
    width > height
      ? screenWidth - staticDimensions.productPhotoWidthMargin
      : portraitImageWidth;
  const ratio = width / productPhotoWidth;
  const productPhotoHeight =
    width > height ? height / ratio : portraitImageHeight;
  //const fontSize = font?.size?.ukuran ? font?.size?.ukuran : 48;*/
  return {
    resizedImgWidth,
    resizedImgHeight,
  };
};

const MultipleImageSave = (props) => {
  const { title, photos, jenis_foto } = props.route.params;
  const { watermarkData, currentUser } = props;

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  //const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState(null);
  const [loadCount, setLoadCount] = useState(0);
  const [tiSize, setTiSize] = useState(0);
  const [transformedImages, setTransformedImages] = useState([]);
  const [fetchingStates, setFetchingStates] = useState({});

  const [savedUris, setSavedUris] = useState([]);
  const navigation = useNavigation();
  const imageRefs = useRef([]);

  try {
    useEffect(() => {
      if (
        photos === undefined ||
        photos === null ||
        photos?.length === undefined ||
        photos?.length < 1 ||
        watermarkData === undefined ||
        watermarkData === null
      ) {
        props.updateReduxMediaKitPhotosMultipleSave({
          success: false,
          error: null,
        });
        navigation.goBack();
        return;
      }

      let newStates = {};
      for (let i = 0; i < photos.length; i++) {
        imageRefs.current[i] = createRef();
        newStates[i] = true;
      }
      setFetchingStates(newStates);

      if (title !== null && title !== undefined && title !== "") {
        props.navigation.setOptions({ title });
      }
    }, []);

    useEffect(() => {
      checkPermission();
    }, [permissionResponse]);

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
      if (savedUris?.length === photos?.length) {
        savePhotos();
      }
    }, [savedUris]);

    const checkPermission = async () => {
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
      } catch (e) {
        console.error(e);
        setError(`Gagal menyimpan Flyer\n${e.toString()}`);
      }
    };

    const addError = (text) => {
      setError((error) => `${error ? error + "\n" : ""}${text}`);
    };

    const addLogs = (text) => {
      setLogs((logs) => `${logs ? logs + "\n" : ""}${text}`);
    };

    const noteImageLoaded = (
      e,
      index,
      id,
      width,
      height,
      newWidth,
      newHeight,
      text_y,
      link_y
    ) => {
      //console.log(`onImageLoaded ${index}`, e);
      addLogs(
        `\nloading image index ${index} id ${id}\noriginal ${width}x${height}\nrezized to ${newWidth}x${newHeight}\ntext_y ${text_y} link_y ${link_y}`
      );
      setLoadCount((loadCount) => loadCount + 1);
    };

    const startRendering = async () => {
      for (let i = 0; i < loadCount; i++) {
        if (fetchingStates[i]) {
          await transformImage(i);
          addLogs(`index ${i} rendered`);
        } else {
          //addError(`Flyer ${i + 1} tidak bisa diunduh`);
          addLogs(`index ${i} not rendered, false fetchingState`);
        }
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
          .then(async (uri) => {
            let newUri = uri;
            /*try {
              newUri = await FileSystem.getContentUriAsync(uri);
            } catch (error) {
              addError(
                `index ${index} getContentUriAsync error\n${error.toString()}`
              );
            }*/
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

    const savePhotos = async () => {
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

        for (let i = 0; i < savedUris?.length; i++) {
          const result = await MediaLibrary.saveToLibraryAsync(savedUris[i]);
          addLogs(`savetoLibraryAsync ${i} ${JSON.stringify(result)}`);
        }

        props.updateReduxMediaKitPhotosMultipleSave({
          success: true,
          error: `Berhasil menyimpan ${savedUris?.length} Flyer ke Galeri`,
        });
        navigation.goBack();
      } catch (e) {
        console.error(e);
        addError(e.toString());
        props.updateReduxMediaKitPhotosMultipleSave({
          success: false,
          error,
        });
      }
      setLoading(false);
    };

    const onError = (index, e) => {
      //console.log(`Image onError ${index}`, e);
      if (loading) {
        setLoading(false);
      }
      props.updateReduxMediaKitPhotosMultipleSave({
        success: false,
        error: "Gagal mengunduh flyer",
      });
      addLogs(`image ${index} ${e?.error}`);
      setError("Flyer tidak bisa diunduh. Cek koneksi Internet Anda.");
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
                ({ id, foto, width, height, text_y, link_y }, index) => (
                  <ViewShot
                    key={index}
                    ref={
                      index < 1
                        ? imageRefs.current[0]
                        : imageRefs.current[index]
                    }
                    options={{
                      fileName: `daclenw_${id ? id.toString() : ""}`,
                      format: "jpg",
                      quality: 1,
                      result: "tmpfile",
                      useRenderInContext: Platform.OS === "ios",
                    }}
                    style={[
                      styles.containerLargeImage,
                      {
                        width: calculateImageDimension(width, height)
                          .resizedImgWidth,
                        height: calculateImageDimension(width, height)
                          .resizedImgHeight,
                      },
                    ]}
                  >
                    <Image
                      source={foto}
                      style={[
                        styles.image,
                        {
                          width: calculateImageDimension(width, height)
                            .resizedImgWidth,
                          height: calculateImageDimension(width, height)
                            .resizedImgHeight,
                          zIndex: index * 2,
                        },
                      ]}
                      contentFit="contain"
                      placeholder={null}
                      transition={0}
                      onError={(e) => onError(index, e)}
                      onLoadEnd={(e) =>
                        noteImageLoaded(
                          e,
                          index,
                          id,
                          width,
                          height,
                          calculateImageDimension(width, height)
                            .resizedImgWidth,
                          calculateImageDimension(width, height)
                            .resizedImgHeight,
                          text_y,
                          link_y
                        )
                      }
                    />
                    <ImageLargeWatermarkModel
                      style={[styles.image, { zIndex: index * 2 + 1 }]}
                      width={width}
                      height={height}
                      displayWidth={
                        calculateImageDimension(width, height).resizedImgWidth
                      }
                      displayHeight={
                        calculateImageDimension(width, height).resizedImgHeight
                      }
                      uri={null}
                      link_x={null}
                      link_y={link_y}
                      text_x={null}
                      text_y={text_y}
                      fontSize={48}
                      watermarkData={watermarkData}
                      jenis_foto={jenis_foto}
                      username={currentUser?.name}
                    />
                  </ViewShot>
                )
              )}
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.containerLoading}
        >
          {error ? (
            <Text allowFontScaling={false} style={styles.textError}>
              {error}
            </Text>
          ) : null}

          <View style={styles.containerInfo}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.daclen_gray}
                style={styles.spinner}
              />
            ) : null}

            <Text allowFontScaling={false} style={styles.textLoading}>
              {loading
                ? `Menyimpan ${tiSize <= 0 ? "flyer" : `${tiSize} flyer`}...`
                : error === "null"
                ? "Berhasil menyimpan flyer"
                : "Gagal menyimpan flyer"}
            </Text>
            {Platform.OS === "web" || currentUser?.id === 8054 ? (
              <Text allowFontScaling={false} style={styles.textLogs}>
                {logs}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error(error);
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
    backgroundColor: colors.white,
  },
  containerLoading: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    zIndex: 1,
  },
  containerInside: {
    flex: 1,
    backgroundColor: colors.white,
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 0,
  },
  containerInfo: {
    backgroundColor: "transparent",
    width: "100%",
    flex: 1,
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
    zIndex: 0,
    opacity: 100,
  },
  containerImage: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  containerImagePreview: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 4,
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
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 12,
    marginVertical: 20,
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    color: colors.daclen_gray,
  },
  textLoading: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    backgroundColor: "transparent",
    color: colors.daclen_bg,
    marginVertical: 20,
  },
  textError: {
    width: "100%",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
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
    marginTop: 20,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
  photosUri: store.mediaKitState.photosUri,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxMediaKitPhotosMultipleSave,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(MultipleImageSave);
