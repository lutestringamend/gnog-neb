import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import ViewShot from "react-native-view-shot";
import { isAvailableAsync, shareAsync } from "expo-sharing";

import { colors, staticDimensions } from "../../styles/base";
import { getFileName } from "../media";
import MainHeader from "../main/MainHeader";
import { useNavigation } from "@react-navigation/native";
import { WATERMARK_VIDEO } from "../dashboard/constants";
//import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { ErrorView } from "../webview/WebviewChild";
import WatermarkModel from "../media/WatermarkModel";
import { sentryLog } from "../../sentry";

export default function VideoPlayer(props) {
  const { title, uri, width, height, thumbnail, userId, watermarkData } =
    props.route?.params;
  let ratio = width / height;
  const video = useRef(null);
  const imageRef = useRef();
  const navigation = useNavigation();

  try {
    /*let screenData = useScreenDimensions();
    const initialVideoSize = {
      isLandscape: screenData?.isLandscape,
      videoWidth: Dimensions.get("window").width,
      videoHeight: screenData?.isLandscape
        ? Dimensions.get("window").height
        : Dimensions.get("window").width / ratio,
    };
    const [videoSize, setVideoSize] = useState(initialVideoSize);*/
    const initialVideoSize = {
      isLandscape:
        Dimensions.get("window").width > Dimensions.get("window").height,
      videoWidth: Dimensions.get("window").width,
      videoHeight:
        Dimensions.get("window").width > Dimensions.get("window").height
          ? Dimensions.get("window").height
          : Dimensions.get("window").width / ratio,
    };
    const [videoSize, setVideoSize] = useState(initialVideoSize);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [watermarkLoading, setWatermarkLoading] = useState(false);
    const [status, setStatus] = useState({ isLoaded: false });
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [sharingAvailability, setSharingAvailability] = useState(false);

    useEffect(() => {
      const captureText = async () => {
        setWatermarkLoading(true);
      
        imageRef.current
          .capture()
          .then((uri) => {
            console.log(uri);
            setWatermarkLoading(false);
            setWatermarkImage(uri);
          })
          .catch((e) => {
            console.error(e);
            setError(
              (error) => `${error === null ? "" : `${error}\n`}${e.toString()}`
            );
            setWatermarkLoading(false);
            sentryLog(e);
          });
      };

      const checkSharing = async () => {
        const result = await isAvailableAsync();
        if (!result) {
          setError(
            (error) =>
              `${
                error === null ? "" : `${error}\n`
              }Perangkat tidak mengizinkan untuk membagikan file`
          );
        }
        setSharingAvailability(result);
      };

      if (uri === undefined || uri === null) {
        setError("Tidak ada Uri");
      } else if (Platform.OS !== "web") {
        checkSharing();
        captureText();
      }
    }, [uri]);

    /*useEffect(() => {
      if (
        screenData?.isLandscape === undefined ||
        screenData?.isLandscape === null
      ) {
        return;
      }

      if (screenData?.isLandscape !== videoSize.isLandscape) {
        console.log("new screenData", screenData);
        changeVideoOrientation(screenData?.isLandscape);
        if (userId === 8054 && Platform.OS === "android") {
          ToastAndroid.show(
            `change orientation ${JSON.stringify(screenData)}`,
            ToastAndroid.LONG
          );
        }
      }
    }, [screenData]);*/

    useEffect(() => {
      console.log("videoSize", videoSize, "ratio", ratio, "userId", userId);
      if (
        videoSize.isLandscape === undefined ||
        videoSize.isLandscape === null
      ) {
        setError("unknown screen orientation");
      } else if (
        videoSize.videoWidth === undefined ||
        videoSize.videoWidth === null ||
        videoSize.videoWidth < 1
      ) {
        setError(`unknown videoWidth ${videoSize.videoWidth}`);
      } else if (
        videoSize.videoHeight === undefined ||
        videoSize.videoHeight === null ||
        videoSize.videoHeight < 1
      ) {
        setError(`unknown videoHeight ${videoSize.videoHeight}`);
      } else if (videoLoading) {
        setVideoLoading(false);
      }
      /*if (userId === 8054 && Platform.OS === "android") {
        ToastAndroid.show(`videoSize ${JSON.stringify(videoSize)}`,
          ToastAndroid.LONG
        );
      }*/
    }, [videoSize]);

    function changeVideoOrientation(isLandscape) {
      if (isLandscape === undefined || isLandscape === null) {
        return;
      } else if (!videoLoading) {
        setVideoLoading(true);
      }
      //changeOrie;
      if (isLandscape) {
        setVideoSize({
          isLandscape: true,
          videoWidth: Dimensions.get("window").width,
          videoHeight: Dimensions.get("window").height,
        });
      } else {
        setVideoSize({
          isLandscape: false,
          videoWidth: Dimensions.get("window").width,
          videoHeight: Dimensions.get("window").width / ratio,
        });
      }
    }

    function onBackPress() {
      navigation.navigate("MediaKitFiles", { activeTab: WATERMARK_VIDEO });
    }

    const getResultPath = async () => {
      const videoDir = `${FileSystem.cacheDirectory}video/`;

      async function ensureDirExists() {
        try {
          const dirInfo = await FileSystem.getInfoAsync(videoDir);
          if (!dirInfo.exists) {
            console.log(`creating directory ${videoDir}`);
            await FileSystem.makeDirectoryAsync(videoDir, {
              intermediates: true,
            });
          }
        } catch (e) {
          console.error(e);
          setLoading(false);
          setError(
            `filesystem getInfoAsync error\n${e?.message}\n${e.toString()}`
          );
        }
      }

      await ensureDirExists();
      return `${videoDir}test.mp4`;
    };

    const processVideo = async () => {
      if (uri === undefined || uri === null || loading) return;
      const resultVideo =
        Platform.OS === "web" ? "d:/test.mp4" : await getResultPath();
      const sourceVideo = uri;
      if (sourceVideo === null) return;

      setLoading(true);
      const ffmpegCommand = `-i ${sourceVideo} -c:v mpeg4 -y ${resultVideo}`;
      console.log("command", ffmpegCommand);
      setError(ffmpegCommand);

      try {
        FFmpegKit.execute(ffmpegCommand)
          .then((session) => {
            console.log("session", session);
            setLoading(false);
            setSuccess(true);
            setError(`result in ${resultVideo}\n${JSON.stringify(session)}`);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
            setSuccess(false);
            setError(
              `ffmpeg process error\n${ffmpegCommand}\n${error.toString()}`
            );
          });
      } catch (e) {
        console.error(e);
        setLoading(false);
        setError(`ffmpeg loading error\n${ffmpegCommand}\n${e.toString()}`);
      }
    };

    const sharePhotoAsync = async (uri) => {
      if (!sharingAvailability) {
        setError("Perangkat tidak mengizinkan untuk membagikan file");
        return;
      }
      try {
        await shareAsync(uri, {
          UTI: "JPEG",
          dialogTitle: "Share Watermark",
          mimeType: "image/jpeg",
        });
      } catch (e) {
        console.error(e);
        setError(e.toString());
      }
    };

    const startDownload = async () => {
      if (!loading) {
        setError(null);
        setLoading(true);
        try {
          const fileName = getFileName(uri);
          const result = await FileSystem.downloadAsync(
            uri,
            FileSystem.documentDirectory + fileName
          );
          console.log(result);
          setSuccess(true);
          setError(`Berhasil didownload ke ${result.uri}`);
          setLoading(false);
          return result.uri;
        } catch (e) {
          console.error(e);
          setSuccess(false);
          setError("downloadAsync catch\n" + e?.message);
          setLoading(false);
          return null;
        }
      }
    };

    return (
      <SafeAreaView style={[styles.container, { width: videoSize.videoWidth }]}>
        <ViewShot
          ref={imageRef}
          options={{
            fileName: "watermarktext",
            format: "jpg",
            quality: 1,
          }}
          style={styles.containerViewShot}
        >
          <WatermarkModel
            watermarkData={watermarkData}
            ratio={ratio}
            fontSize={Math.round(16 / ratio)}
            backgroundColor={colors.daclen_black}
            color={colors.daclen_orange}
            paddingHorizontal={3}
            paddingVertical={3}
            borderRadius={4}
            text_x={0}
            text_y={0}
          />
        </ViewShot>

        {!videoSize.isLandscape ? (
          <MainHeader
            icon="arrow-left"
            title={title}
            onBackPress={() => onBackPress()}
          />
        ) : null}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            videoSize.isLandscape
              ? styles.containerBodyLandscape
              : styles.containerBodyPortrait
          }
        >
          {error ? (
            <View
              style={[
                styles.containerHeader,
                { position: videoSize.isLandscape ? "absolute" : "relative" },
              ]}
            >
              <Text
                style={[
                  styles.textError,
                  {
                    backgroundColor: success
                      ? colors.daclen_green
                      : colors.daclen_red,
                    width: videoSize.videoWidth,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          ) : videoSize.isLandscape ? (
            <View
              style={[
                styles.containerHeader,
                {
                  position: "absolute",
                  backgroundColor: colors.daclen_light,
                  opacity: 0.4,
                  padding: 10,
                },
              ]}
            >
              <Text style={styles.textHeaderLandscape}>{title}</Text>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => onBackPress()}
              >
                <MaterialCommunityIcons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : null}

          {videoLoading || videoSize.isLandscape === null ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={{ marginVertical: 20, zIndex: 10 }}
            />
          ) : (
            <View
              style={[
                styles.video,
                {
                  position: videoSize.isLandscape ? "absolute" : "relative",
                  width: videoSize.videoWidth,
                  height: videoSize.videoHeight,
                },
              ]}
            >
              <Video
                ref={video}
                style={[
                  styles.video,
                  {
                    width: videoSize.videoWidth,
                    height: videoSize.videoHeight,
                  },
                ]}
                source={{
                  uri,
                }}
                useNativeControls
                resizeMode={
                  videoSize.isLandscape
                    ? ResizeMode.STRETCH
                    : ResizeMode.CONTAIN
                }
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />

              {watermarkLoading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_graydark}
                  style={{
                    position: "absolute",
                    top: 10,
                    start: 10,
                    zIndex: 3,
                  }}
                />
              ) : (
                <WatermarkModel
                  watermarkData={watermarkData}
                  ratio={1}
                  fontSize={Math.round(16 / ratio)}
                  backgroundColor={colors.daclen_black}
                  color={colors.daclen_orange}
                  paddingHorizontal={3}
                  paddingVertical={3}
                  borderRadius={4}
                  style={{ zIndex: 3, opacity: 30 }}
                />
              )}

              <ImageBackground
                source={{ uri: thumbnail }}
                style={[
                  styles.video,
                  {
                    position: "absolute",
                    width: videoSize.videoWidth,
                    height: videoSize.videoHeight,
                    zIndex: 3,
                    backgroundColor: colors.daclen_light,
                    opacity: !status.isLoaded ? 100 : 0,
                  },
                ]}
                resizeMode="cover"
              />
            </View>
          )}

          <View
            style={
              videoSize.isLandscape
                ? styles.containerPanelLandscape
                : styles.containerPanelPortrait
            }
          >
            <TouchableOpacity
              style={
                videoSize.isLandscape ? styles.buttonCircle : styles.button
              }
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
              disabled={videoLoading}
            >
              <MaterialCommunityIcons
                name={status.isPlaying ? "pause" : "play"}
                size={18}
                color="white"
              />
              {videoSize.isLandscape ? null : (
                <Text style={styles.textButton}>
                  {status.isPlaying ? "Pause" : "Play"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                videoSize.isLandscape ? styles.buttonCircle : styles.button,
                { backgroundColor: colors.daclen_graydark },
              ]}
              onPress={() => changeVideoOrientation(!videoSize.isLandscape)}
              disabled={videoLoading}
            >
              <MaterialCommunityIcons name="view-day" size={18} color="white" />
              {videoSize.isLandscape ? null : (
                <Text style={styles.textButton}>Landscape</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                videoSize.isLandscape ? styles.buttonCircle : styles.button,
                { backgroundColor: colors.daclen_orange },
              ]}
              onPress={() => startDownload()}
              disabled={loading || videoLoading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{
                    alignSelf: "center",
                  }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="download"
                  size={18}
                  color="white"
                />
              )}
              {videoSize.isLandscape ? null : (
                <Text style={styles.textButton}>Download Video</Text>
              )}
            </TouchableOpacity>

            {sharingAvailability && watermarkImage !== null ? (
              <TouchableOpacity
                style={[
                  videoSize.isLandscape ? styles.buttonCircle : styles.button,
                  { backgroundColor: colors.daclen_reddishbrown },
                ]}
                onPress={() => sharePhotoAsync(watermarkImage)}
                disabled={loading || videoLoading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="white"
                    style={{
                      alignSelf: "center",
                    }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="content-save"
                    size={18}
                    color="white"
                  />
                )}
                {videoSize.isLandscape ? null : (
                  <Text style={styles.textButton}>Save Text</Text>
                )}
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                videoSize.isLandscape ? styles.buttonCircle : styles.button,
                { backgroundColor: colors.daclen_indigo },
              ]}
              onPress={() => processVideo()}
              disabled={loading || videoLoading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{
                    alignSelf: "center",
                  }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="file-download"
                  size={18}
                  color="white"
                />
              )}
              {videoSize.isLandscape ? null : (
                <Text style={styles.textButton}>Watermarked</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <SafeAreaView>
        <ErrorView error={e.toString()} />
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
    backgroundColor: "white",
  },
  containerViewShot: {
    flex: 1,
    backgroundColor: "transparent",
    overflow: "visible",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: -1,
    opacity: 100,
  },
  containerPanelPortrait: {
    width: "100%",
    marginHorizontal: 20,
    paddingBottom: staticDimensions.pageBottomPadding,
    alignItems: "center",
  },
  containerPanelLandscape: {
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "flex-end",
    zIndex: 6,
    marginEnd: 20,
  },
  containerBodyLandscape: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  containerBodyPortrait: {
    flex: 1,
    alignItems: "center",
  },
  containerHeader: {
    zIndex: 4,
    width: "100%",
    top: 0,
    start: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  video: {
    top: 0,
    start: 0,
    backgroundColor: colors.daclen_black,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10,
    backgroundColor: colors.daclen_blue,
  },
  buttonCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 12,
    backgroundColor: colors.daclen_blue,
  },
  buttonClose: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: colors.daclen_black,
    borderColor: colors.daclen_gray,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  textHeaderLandscape: {
    backgroundColor: "transparent",
    fontWeight: "bold",
    color: colors.daclen_black,
    fontSize: 16,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginStart: 6,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
    zIndex: 6,
  },
});
