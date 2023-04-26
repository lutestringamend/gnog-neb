import React, { useState, useRef, useEffect, useCallback } from "react";
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
  ToastAndroid,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
//import { bindActionCreators } from "redux";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import ViewShot from "react-native-view-shot";
import { isAvailableAsync, shareAsync } from "expo-sharing";

import { colors } from "../../styles/base";
import { getFileName, setFFMPEGCommand } from "../media";
import MainHeader from "../main/MainHeader";
import { useNavigation } from "@react-navigation/native";
import { WATERMARK_VIDEO } from "../dashboard/constants";
//import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import WatermarkModel from "../media/WatermarkModel";
import {
  sharingOptionsJPEG,
  sharingOptionsMP4,
  tempffmpegdesc,
} from "../media/constants";
import { sentryLog } from "../../sentry";

function VideoPlayer(props) {
  const { title, uri, width, height, thumbnail, userId, watermarkData } =
    props.route?.params;
  let ratio = width / height;
  const video = useRef(null);
  const waterRef = useRef(null);
  const navigation = useNavigation();
  const { watermarkLayout } = props;
  const videoDir = `${FileSystem.cacheDirectory}video/`;

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
  const [watermarkSize, setWatermarkSize] = useState({
    width,
    height,
  });
  const [watermarkLoading, setWatermarkLoading] = useState(true);
  const [status, setStatus] = useState({ isLoaded: false });
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [resultUri, setResultUri] = useState(null);
  const [output, setOutput] = useState("Video processing log");
  const [fullLogs, setFullLogs] = useState(null);
  const [sharingAvailability, setSharingAvailability] = useState(false);

  useEffect(() => {
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
    } else {
      checkSharing();
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
    if (videoSize.isLandscape === undefined || videoSize.isLandscape === null) {
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

  useEffect(() => {
    if (resultUri !== null) {
      shareFileAsync(resultUri, sharingOptionsMP4);
    }
  }, [resultUri]);

  useEffect(() => {
    if (watermarkLayout !== null) {
      //console.log("mediastate watermarkLayout", watermarkLayout);
      setWatermarkSize({
        width:
          Platform.OS === "web"
            ? watermarkLayout?.width
            : watermarkLayout?.width + 2,
        height: watermarkLayout?.height,
      });
      setOutput((output) => `${output}\nwatermarkLayout ${JSON.stringify(watermarkLayout)}`);
    }
  }, [watermarkLayout]);

  useEffect(() => {
    if (watermarkSize.width < width && watermarkSize.height < height) {
      console.log("watermarkSize and capturing", watermarkSize);
      setOutput((output) => `${output}\nwatermarkSize and capturing ${JSON.stringify(watermarkSize)}`);
      waterRef.current
        .capture()
        .then((uri) => onManualCapture(uri))
        .catch((e) => onManualCaptureFailure(e));
    } else {
      console.log("watermarkSize", watermarkSize);
      setOutput((output) => `${output}\nwatermarkSize ${JSON.stringify(watermarkSize)}`);
    }
    
  }, [watermarkSize]);

  useEffect(() => {
    setOutput((output) => `${output}\nwatermarkImage ${watermarkImage}`);
    if (watermarkImage !== null) {
      setWatermarkLoading(false);
    }
  }, [watermarkImage]);

  function openFullLogs() {
    navigation.navigate("VideoLogsScreen", {
      text: error + "\n\n" + output + "\n\n" + fullLogs,
    });
  }

  /*function changeVideoOrientation(isLandscape) {
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
  }*/

  function onBackPress() {
    navigation.navigate("MediaKitFiles", { activeTab: WATERMARK_VIDEO });
  }

  function onManualCapture(uri) {
    //console.log("watermarkUri", uri, "watermarkSize", watermarkSize);
    setOutput((output) => `${output}\new capture Uri ${uri}`);
    setWatermarkImage(uri);
  }

  const onCapture = useCallback((uri) => {
    onManualCapture(uri);
  }, []);

  function onManualCaptureFailure(e) {
    console.error(e);
    sentryLog(e);
    setError(
      (error) => `${error === null ? "" : `${error}\nonCaptureFailure `}`
    );
    setOutput((output) => `${output}\n${e.toString()}`);
    setWatermarkLoading(false);
  }

  const onCaptureFailure = useCallback((e) => {
    onManualCaptureFailure(e);
  }, []);

  const getResultPath = async () => {
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

  /*const saveWatermarkImage = async () => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(watermarkImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const fileName = "daclen_wt.jpg";
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
              const resultUri = `${permissions.directoryUri}/${fileName}`;
              setError(`Foto watermark disimpan di ${resultUri}`);
              setSuccess(true);
              return resultUri;
            } catch (e) {
              console.error(e);
              setError(
                (error) => error + "\nwriteAsStringAsync catch\n" + e.toString()
              );
              setSuccess(false);
              return null;
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
            return null;
          });
      } else {
        setSuccess(false);
        setError("Anda tidak memberikan izin untuk mengakses penyimpanan");
      }
    }
    return null;
  };*/

  const processVideo = async () => {
    if (uri === undefined || uri === null || watermarkImage === null || loading)
      return;
    if (resultUri !== null) {
      shareFileAsync(resultUri, sharingOptionsMP4);
      return;
    }

    const resultVideo =
      Platform.OS === "web" ? "d:/test.mp4" : await getResultPath();
    const sourceVideo = await startDownload();
    //const watermarkFile = await saveWatermarkImage();
    const ffmpegCommand = setFFMPEGCommand(
      sourceVideo,
      watermarkImage,
      resultVideo,
      "top-left",
      Math.round(ratio)
    );
    if (Platform.OS === "android") {
      ToastAndroid.show(ffmpegCommand, ToastAndroid.LONG);
    } else {
      console.log("ffmpeg", ffmpegCommand);
    }
    if (sourceVideo === null) return;

    setLoading(true);
    setSuccess(true);
    setError("Memulai download video dengan watermark...");

    try {
      FFmpegKit.execute(ffmpegCommand)
        .then(async (session) => {
          console.log("session", session);
          const returnCode = await session.getReturnCode();
          const sessionOutput = await session.getOutput();
          const sessionId = session.getSessionId();
          const logs = await session.getLogs();
          setLoading(false);
          setFullLogs(sessionOutput.toString());
          if (ReturnCode.isSuccess(returnCode)) {
            setSuccess(true);
            setError(`Video berhasil disimpan di ${resultVideo}`);
            setResultUri(resultVideo);
          } else if (ReturnCode.isCancel(returnCode)) {
            setSuccess(false);
            setError(`Pembuatan video dibatalkan ${returnCode.toString()}`);
            setOutput(logs);
          } else {
            setSuccess(false);
            setError(`Error memproses video ${returnCode.toString()}`);
            setOutput(logs.toString());
            navigation.navigate("VideoLogsScreen", {
              text:
                sessionId.toString() +
                "\n\n" +
                logs.toString() +
                "\n\n" +
                sessionOutput,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setSuccess(false);
          setError("ffmpeg process error");
          setOutput(`${ffmpegCommand}\n${error.toString()}`);
          sentryLog(error);
        });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setSuccess(false);
      setError("ffmpeg loading error");
      setOutput(`${ffmpegCommand}\n${e.toString()}`);
      sentryLog(e);
    }
  };

  const shareFileAsync = async (uri, sharingOptions) => {
    if (!sharingAvailability) {
      setError("Perangkat tidak mengizinkan untuk membagikan file");
      return;
    }
    try {
      if (Platform.OS === "android" && userId === 8054) {
        ToastAndroid.show(uri, ToastAndroid.LONG);
      }
      await shareAsync(uri, sharingOptions);
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  const startDownload = async () => {
    if (!loading) {
      setSuccess(true);
      setError("Memulai download video tanpa watermark...");
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
        setError("downloadAsync catch\n" + e.toString());
        setLoading(false);
        return null;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "web" ? null : (
        <ViewShot
          ref={waterRef}
          options={{
            fileName: "daclen_wtext",
            format: "jpg",
            quality: 1,
            width: watermarkSize.width / 2,
            height: watermarkSize.height / 2,
          }}
          style={[
            styles.containerViewShot,
            {
              width: watermarkSize.width,
              height: watermarkSize.height,
            },
          ]}
          captureMode="mount"
          onCapture={onCapture}
          onCaptureFailure={onCaptureFailure}
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
            getLayout={true}
          />
        </ViewShot>
      )}

      {!videoSize.isLandscape ? (
        <MainHeader
          icon="arrow-left"
          title={title}
          onBackPress={() => onBackPress()}
          disabled={loading}
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
              disabled={loading}
            >
              <MaterialCommunityIcons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ) : null}

        {videoLoading || videoSize.isLandscape === null ? null : (
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
                videoSize.isLandscape ? ResizeMode.STRETCH : ResizeMode.CONTAIN
              }
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />

            {watermarkLoading && Platform.OS !== "web" ? (
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
                style={{ zIndex: 3 }}
                getLayout={false}
              />
            )}

            <ImageBackground
              source={{ uri: thumbnail }}
              style={[
                styles.video,
                {
                  flex: 1,
                  position: "absolute",
                  width: videoSize.videoWidth,
                  height: videoSize.videoHeight,
                  zIndex: 3,
                  backgroundColor: colors.daclen_light,
                  opacity: !status.isLoaded ? 0.8 : 0,
                },
              ]}
              resizeMode="cover"
            >
              <ActivityIndicator
                size="large"
                color={colors.daclen_orange}
                style={{ zIndex: 10, alignSelf: "center" }}
              />
            </ImageBackground>
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
            style={videoSize.isLandscape ? styles.buttonCircle : styles.button}
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
              {
                backgroundColor:
                  videoLoading
                    ? colors.daclen_gray
                    : colors.daclen_orange,
              },
            ]}
            onPress={() =>
              watermarkImage === null ? startDownload() : processVideo()
            }
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
                name={watermarkImage === null ? "file-download" : "download"}
                size={18}
                color="white"
              />
            )}
            {videoSize.isLandscape ? null : (
              <Text style={styles.textButton}>Download</Text>
            )}
          </TouchableOpacity>
          {fullLogs === null ? null : (
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              { backgroundColor: colors.daclen_graydark },
            ]}
            onPress={() => openFullLogs()}
            disabled={videoLoading}
          >
            <MaterialCommunityIcons name="text-box" size={18} color="white" />
            {videoSize.isLandscape ? null : (
              <Text style={styles.textButton}>Full Logs</Text>
            )}
          </TouchableOpacity>
        )}
        </View>
        <Text style={styles.textUid}>{output}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/*


                    {sharingAvailability && watermarkImage !== null ? (
            <TouchableOpacity
              style={[
                videoSize.isLandscape ? styles.buttonCircle : styles.button,
                { backgroundColor: colors.daclen_reddishbrown },
              ]}
              onPress={() => shareFileAsync(watermarkImage, sharingOptionsJPEG)}
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
                <Text style={styles.textButton}>Text</Text>
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
              <Text style={styles.textButton}>Full</Text>
            )}
          </TouchableOpacity>
*/

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
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
  },
  containerPanelPortrait: {
    width: "100%",
    marginVertical: 10,
    marginHorizontal: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  containerPanelLandscape: {
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "flex-end",
    zIndex: 6,
    marginEnd: 20,
  },
  containerBodyLandscape: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  containerBodyPortrait: {
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 10,
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
  textUid: {
    fontSize: 10,
    textAlign: "center",
    color: colors.daclen_gray,
    marginHorizontal: 10,
  },
});

const mapStateToProps = (store) => ({
  watermarkLayout: store.mediaState.watermarkLayout,
});

/*const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { updateWatermarkLayout },
    dispatch
  );*/

export default connect(mapStateToProps, null)(VideoPlayer);
