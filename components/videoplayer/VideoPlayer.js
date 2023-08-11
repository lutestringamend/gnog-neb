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
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as FileSystem from "expo-file-system";
import { saveToLibraryAsync, usePermissions } from "expo-media-library";
import { Video, ResizeMode } from "expo-av";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import ViewShot from "react-native-view-shot";
import { isAvailableAsync, shareAsync } from "expo-sharing";

import { colors, staticDimensions } from "../../styles/base";
import {
  getFileName,
  setBasicFFMPEGCommand,
  setFFMPEGCommand,
  setFilterFFMPEG,
  updateWatermarkVideo,
  overwriteWatermarkVideos,
  setSkipWatermarkFFMPEGCommand,
} from "../media";
import MainHeader from "../main/MainHeader";
import { useNavigation } from "@react-navigation/native";
//import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { defaultffmpegcodec, sharingOptionsMP4 } from "../media/constants";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY } from "../asyncstorage/constants";
import {
  vwmarkdefaultsourceheight,
  vwmarkdefaultsourcewidth,
} from "../mediakit/constants";
import VideoLargeWatermarkModel from "../media/VideoLargeWatermarkModel";

function VideoPlayer(props) {
  const { id, title, uri, width, height, thumbnail, userId } =
    props.route?.params;

  const ratio =
    width === null || height === null
      ? vwmarkdefaultsourcewidth / vwmarkdefaultsourceheight
      : width / height;

  const videoToScreenRatio = width / Dimensions.get("window").width;
  const watermarkSize = {
    width,
    height,
  };

  const video = useRef(null);
  const waterRef = useRef(null);
  const navigation = useNavigation();
  const { watermarkData, watermarkVideos } = props;
  const videoDir = FileSystem.documentDirectory;
  const fileName = getFileName(uri);

  const [permissionResponse, requestPermission] = usePermissions();

  /*let screenData = useScreenDimensions();
    const initialVideoSize = {
      isLandscape: screenData?.isLandscape,
      videoWidth: Dimensions.get("window").width,
      videoHeight: screenData?.isLandscape
        ? Dimensions.get("window").height
        : Dimensions.get("window").width / ratio,
    };
    const [videoSize, setVideoSize] = useState(initialVideoSize);*/
  const videoSize = {
    isLandscape:
      Dimensions.get("window").width > Dimensions.get("window").height,
    videoWidth: Dimensions.get("window").width,
    videoHeight: Math.ceil((Dimensions.get("window").width * height) / width),
    videoOrientation: height > width ? "portrait" : "landscape",
  };

  //const [videoSize, setVideoSize] = useState(initialVideoSize);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [captureFailure, setCaptureFailure] = useState(false);
  //const [watermarkSize, setWatermarkSize] = useState();
  const [watermarkLoading, setWatermarkLoading] = useState(true);
  const [status, setStatus] = useState({ isLoaded: false });
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [rawUri, setRawUri] = useState(null);
  const [resultUri, setResultUri] = useState(null);
  const [output, setOutput] = useState("VIDEO PROCESSING LOGS");
  const [fullLogs, setFullLogs] = useState(userId === 8054 ? "test" : null);
  const [sharingAvailability, setSharingAvailability] = useState(false);
  const [updateStorage, setUpdateStorage] = useState(false);

  //debugging ffmpeg
  const [customFilter, setCustomFilter] = useState(
    `${setFilterFFMPEG("top-left", 0, 0)} ${defaultffmpegcodec}`
  );

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
      return;
    } else {
      requestPermission();
      checkSharing();
    }

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
  }, [uri]);

  useEffect(() => {
    setOutput(
      (output) =>
        `${output}\nMediaLibrary permissionResponse ${JSON.stringify(
          permissionResponse
        )}`
    );
  }, [permissionResponse]);

  useEffect(() => {
    console.log("redux savedWatermarkVideos", watermarkVideos);
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      checkAsyncWatermarkVideosSaved();
    } else {
      /*setOutput(
        (output) => `${output}\nredux ${JSON.stringify(watermarkVideos)}`
      );*/
      if (updateStorage) {
        setUpdateStorage(false);
        setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY, watermarkVideos);
      }
      checkRedux();
    }
  }, [watermarkVideos]);

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

  /*useEffect(() => {
    if (userId === 8054 && Platform.OS === "android") {
        ToastAndroid.show(`videoSize ${JSON.stringify(videoSize)}`,
          ToastAndroid.LONG
        );
      }
  }, [videoSize]);*/

  useEffect(() => {
    if (resultUri !== null) {
      setUpdateStorage(true);
      props.updateWatermarkVideo(id, rawUri, resultUri);
    }
  }, [resultUri]);

  /*useEffect(() => {
    if (watermarkLayout !== null) {
      //console.log("mediastate watermarkLayout", watermarkLayout);
      setWatermarkSize({
        width: watermarkLayout?.width + 1,
        height: watermarkLayout?.height,
      });
      setOutput(
        (output) =>
          `${output}\nwatermarkLayout ${JSON.stringify(watermarkLayout)}`
      );
    }
  }, [watermarkLayout]);*/

  useEffect(() => {
    if (captureFailure) {
      return;
    } else if (watermarkSize.width < width && watermarkSize.height < height) {
      console.log("watermarkSize and capturing", watermarkSize);
      setOutput(
        (output) =>
          `${output}\nwatermarkSize and capturing ${JSON.stringify(
            watermarkSize
          )}`
      );
      if (Platform.OS === "web") {
        setWatermarkLoading(false);
      } else if (!watermarkLoading) {
        setWatermarkLoading(true);
        waterRef.current
          .capture()
          .then((uri) => onManualCapture(uri))
          .catch((e) => onManualCaptureFailure(e));
      }
    } else {
      console.log("watermarkSize", watermarkSize);
      setOutput(
        (output) => `${output}\nwatermarkSize ${JSON.stringify(watermarkSize)}`
      );
    }
  }, [captureFailure]);

  useEffect(() => {
    setOutput((output) => `${output}\nwatermarkImage ${watermarkImage}`);
    if (watermarkImage !== null) {
      setWatermarkLoading(false);
    }
  }, [watermarkImage]);

  useEffect(() => {
    if (rawUri !== null) {
      setOutput((output) => `${output}\nrawUri ${rawUri}`);
    }
    updateReduxRawUri();
  }, [rawUri]);

  useEffect(() => {
    setOutput(
      (output) => `${output}\nvideo isLoaded ${JSON.stringify(status.isLoaded)}`
    );
  }, [status.isLoaded]);

  const resetResultUri = async () => {
    setRawUri(null);
    setResultUri(null);
    setOutput("resultUri reset");
    setFullLogs(null);
    setUpdateStorage(true);
    props.overwriteWatermarkVideos([]);
    //props.updateWatermarkVideo(uri, rawUri, null);
  };

  const checkAsyncWatermarkVideosSaved = async () => {
    const storageWatermarkVideosSaved = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY
    );
    if (
      storageWatermarkVideosSaved === undefined ||
      storageWatermarkVideosSaved === null ||
      storageWatermarkVideosSaved?.length === undefined ||
      storageWatermarkVideosSaved?.length < 1
    ) {
      setOutput((output) => `${output}\nredux data null}`);
      setUpdateStorage(true);
      props.updateWatermarkVideo(id, null, null);
    } else {
      props.overwriteWatermarkVideos(storageWatermarkVideosSaved);
    }
  };

  function updateReduxRawUri() {
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      return;
    }

    try {
      const check = watermarkVideos.find(({ id }) => id === id);
      console.log("redux watermarkvideos uri check", check);
      if (check === undefined || check === null) {
        if (rawUri !== null) {
          setUpdateStorage(true);
          props.updateWatermarkVideo(id, rawUri, resultUri);
        }
      } else {
        if (check?.rawUri === undefined || check?.rawUri === null) {
          if (rawUri !== null) {
            setUpdateStorage(true);
            props.updateWatermarkVideo(id, rawUri, resultUri);
          }
        } else if (rawUri === null) {
          setRawUri(check?.rawUri);
          if (
            !(
              check?.uri === undefined ||
              check?.uri === null ||
              check?.uri === ""
            )
          ) {
            setResultUri(check?.uri);
          }
        }
      }
    } catch (e) {
      console.error(e);
      setOutput(
        (output) => `${output}\nupdateReduxRawUri error ${e.toString()}`
      );
    }
  }

  function checkRedux() {
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      return;
    }

    try {
      const check = watermarkVideos.find(({ id }) => id === uri);
      setOutput(
        (output) => `${output}\nwatermarkVideos check ${JSON.stringify(check)}`
      );
      if (check === undefined || check === null) {
        return;
      } else {
        if (check?.uri === undefined || check?.uri === null) {
          return;
        } else if (resultUri === null) {
          setUpdateStorage(true);
          setResultUri(check?.uri);
        }
      }
    } catch (e) {
      console.error(e);
      setOutput((output) => `${output}\ncheckRedux error ${e.toString()}`);
    }
  }

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
    navigation.goBack();
  }

  function onManualCapture(uri) {
    //console.log("watermarkUri", uri, "watermarkSize", watermarkSize);
    setOutput((output) => `${output}\nnew capture Uri`);
    setWatermarkImage(uri);
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
      console.error(e);
      if (Platform.OS !== "web") {
        sentryLog(e);
      }
      setError(
        (error) =>
          `${error === null ? "" : `${error}\nGagal menciptakan watermark`}`
      );
      setOutput((output) => `${output}\nonCaptureFailure ${e.toString()}`);
    }
    setWatermarkLoading(false);
  };

  const onCaptureFailure = useCallback((e) => {
    if (!captureFailure) {
      setCaptureFailure(true);
      onManualCaptureFailure(e);
    } else {
      console.log("onCaptureFailure", e);
    }
  }, []);

  const getResultPath = async () => {
    async function ensureDirExists() {
      try {
        const dirInfo = await FileSystem.getInfoAsync(videoDir);
        if (!dirInfo.exists) {
          setOutput((output) => `${output}\ncreating directory ${videoDir}`);
          await FileSystem.makeDirectoryAsync(videoDir, {
            intermediates: true,
          });
        } else {
          setOutput((output) => `${output}\n${videoDir} exists, saving there`);
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
        setOutput((output) => `${output}\ngetInfoAsync error ${e.toString()}`);
        setError("Tidak mendapatkan izin penyimpanan");
      }
    }

    await ensureDirExists();
    return `${videoDir}${fileName}`;
  };

  const saveWatermarkVideo = async (resultUri) => {
    await saveMediaLibraryUri(resultUri);
    setSuccess(true);
    if (Platform.OS === "android") {
      setError(`Video dengan Watermark telah disimpan di Galeri`);
    } else {
      setError(`Video dengan Watermark telah disimpan di Camera Roll`);
    }
    shareFileAsync(resultUri, sharingOptionsMP4);
  };

  const processVideo = async () => {
    if (
      uri === undefined ||
      uri === null ||
      watermarkImage === null ||
      watermarkLoading ||
      loading
    )
      return;
    if (resultUri !== null) {
      if (sharingAvailability) {
        shareFileAsync(resultUri, sharingOptionsMP4);
      }
      return;
    }

    const resultVideo =
      Platform.OS === "web" ? "d:/test.mp4" : await getResultPath();

    let sourceVideo = rawUri;
    if (rawUri === undefined || rawUri === null) {
      sourceVideo = await startDownload();
    }

    const ffmpegCommand = setFFMPEGCommand(
      sourceVideo,
      watermarkImage,
      resultVideo,
      "top-left",
      0,
      0
    );

    /*videoSize.videoOrientation === "portrait"
    ? setSkipWatermarkFFMPEGCommand(sourceVideo, resultVideo)
    : s
    
    *userId === 8054
        ? setBasicFFMPEGCommand(
            sourceVideo,
            watermarkImage,
            resultVideo,
            customFilter
          )*/
    setOutput((output) => `${output}\nffmpeg ${ffmpegCommand}`);

    setLoading(true);
    setSuccess(true);
    setError("Memproses video dengan watermark...");

    try {
      FFmpegKit.execute(ffmpegCommand)
        .then(async (session) => {
          console.log("session", session);
          const returnCode = await session.getReturnCode();
          const sessionOutput = await session.getOutput();
          const sessionId = session.getSessionId();
          //const logs = await session.getLogs();
          setLoading(false);
          setFullLogs(sessionOutput.toString());
          if (ReturnCode.isSuccess(returnCode)) {
            setSuccess(true);
            setError(`Proses watermark disimpan di ${resultVideo}`);
            setOutput(
              (output) =>
                `${output}\nffmpeg session ${sessionId.toString()} successful returnCode ${returnCode.toString()}`
            );
            setResultUri(resultVideo);
            //shareFileAsync(resultUri, sharingOptionsMP4);
            saveWatermarkVideo(resultVideo);
          } else if (ReturnCode.isCancel(returnCode)) {
            setSuccess(false);
            setError(`Pembuatan video dibatalkan`);
            setOutput(
              (output) =>
                `${output}\nffmpeg session ${sessionId.toString()} cancelled returnCode ${returnCode.toString()}`
            );
          } else {
            setSuccess(false);
            setError(`Error memproses video`);
            setOutput(
              (output) =>
                `${output}\nffmpeg session ${sessionId.toString()} error returnCode ${returnCode.toString()}`
            );
            navigation.navigate("VideoLogsScreen", {
              text: `ffmpeg ${ffmpegCommand}\n\nsession ${sessionId.toString()} returnCode ${returnCode.toString()}\n\nsession output:\n\n${sessionOutput}`,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setSuccess(false);
          setError("Gagal memproses video dengan watermark");
          setOutput(
            (output) => `${output}\n${ffmpegCommand}\nprocessing error`
          );
          setFullLogs(error.toString());
          sentryLog(error);
        });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setSuccess(false);
      setError("Gagal memproses video dengan watermark");
      setOutput((output) => `${output}\n${ffmpegCommand}\nprocessing error`);
      setFullLogs(e.toString());
      sentryLog(e);
    }
  };

  const shareFileAsync = async (uri, sharingOptions) => {
    if (!sharingAvailability) {
      setError(
        (error) => `${error}\nPerangkat tidak mengizinkan untuk membagikan file`
      );
      setOutput((output) => `${output}\nisSharingAvailableAsync false`);
      return;
    }
    try {
      await shareAsync(uri, sharingOptions);
    } catch (e) {
      console.error(e);
      setError((error) => `${error}\nGagal share file`);
      setOutput((output) => `${output}\nshareAsync error${e.toString()}`);
    }
  };

  const startDownload = async () => {
    if (!loading) {
      setSuccess(true);
      setError("Memulai download video...");
      setLoading(true);
      try {
        const result = await FileSystem.downloadAsync(
          uri,
          FileSystem.documentDirectory + "raw_" + fileName
        );
        console.log(result);
        setSuccess(true);
        setOutput(
          (output) => `${output}\ndownloadAsync successful to ${result?.uri}`
        );
        setError("Video sumber berhasil didownload");
        setLoading(false);
        setRawUri(result?.uri);
        return result?.uri;
      } catch (e) {
        console.error(e);
        setSuccess(false);
        setError("Gagal download video");
        setOutput((output) => `${output}\ndownloadAsync catch ${e.toString()}`);
        setLoading(false);
        return null;
      }
    }
  };

  const saveMediaLibraryUri = async (uri) => {
    if (uri === null) return;
    if (!permissionResponse?.granted) {
      setOutput((output) => `${output}\nrequesting MediaLibrary permission`);
      await requestPermission();
    }
    await saveToLibraryAsync(uri);
    setOutput(
      (output) =>
        `${output}\nsaveToLibraryAsync ${uri} successful, check Galery/Camera Roll`
    );
  };

  const handleFilterChange = (e) => {
    e.preventDefault();
    setCustomFilter(e.target.value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ViewShot
        ref={waterRef}
        options={{
          fileName: "wtext",
          format: "png",
          quality: 1,
          width: watermarkSize.width / (Platform.OS === "ios" ? 2 : 1),
          height: watermarkSize.height / (Platform.OS === "ios" ? 2 : 1),
        }}
        style={[
          styles.containerViewShot,
          {
            width: watermarkSize.width,
            height: watermarkSize.height,
          },
        ]}
        captureMode={Platform.OS === "web" ? "" : "mount"}
        onCapture={onCapture}
        onCaptureFailure={onCaptureFailure}
      >
        <VideoLargeWatermarkModel
          width={width}
          height={height}
          videoToScreenRatio={videoToScreenRatio}
          watermarkData={watermarkData}
        />
      </ViewShot>

      {!videoSize.isLandscape ? (
        <View style={styles.containerHeader}>
          <TouchableOpacity
            onPress={() => onBackPress()}
            disabled={loading || videoLoading}
          >
            <MaterialCommunityIcons
              name={Platform.OS === "ios" ? "chevron-left" : "arrow-left"}
              size={24}
              color={colors.daclen_light}
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>

          <View style={styles.containerHeaderText}>
            <Text style={styles.textHeaderLandscape}>
              {title ? title : "Video Watermark"}
            </Text>
            <Text style={styles.textError}>{error}</Text>
          </View>
          {error ? (
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color={colors.daclen_red}
              style={{ alignSelf: "center" }}
            />
          ) : null}
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          videoSize.videoOrientation === "portrait"
            ? styles.containerBodyVideoPortrait
            : videoSize.isLandscape
            ? styles.containerBodyLandscape
            : styles.containerBodyPortrait
        }
      >
        {videoSize.isLandscape ? (
          <View
            style={[
              styles.containerHeader,
              {
                backgroundColor: colors.daclen_black,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={styles.textHeaderLandscape}>{title}</Text>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => onBackPress()}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={colors.daclen_black}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {videoLoading || videoSize.isLandscape === null ? null : (
          <View
            style={[
              styles.video,
              {
                position: videoSize.isLandscape ? "absolute" : "relative",
                width: "100%",
                height:
                  videoSize.videoOrientation === "landscape"
                    ? videoSize.videoHeight
                    : Dimensions.get("window").height,
                flex: 1,
              },
            ]}
          >
            <Video
              ref={video}
              style={[
                styles.video,
                {
                  width: videoSize.videoWidth,
                  height:
                    videoSize.videoOrientation === "landscape"
                      ? videoSize.videoHeight
                      : Dimensions.get("window").height,
                },
              ]}
              source={{
                uri,
              }}
              useNativeControls
              resizeMode={
                videoSize.videoOrientation === "portrait"
                  ? ResizeMode.STRETCH
                  : ResizeMode.COVER
              }
              videoStyle={{
                width: videoSize.videoWidth,
                height: videoSize.videoHeight,
              }}
              onReadyForDisplay={(params) => {
                if (Platform.OS !== "web") {
                  params.naturalSize.orientation = videoSize.videoOrientation;
                  console.log(
                    "onReadyForDisplay",
                    params.naturalSize.orientation
                  );
                }
              }}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />

            {watermarkLoading && Platform.OS !== "web" ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_orange}
                style={{
                  position: "absolute",
                  top: 32,
                  end: 20,
                  zIndex: 3,
                }}
              />
            ) : (
              <VideoLargeWatermarkModel
                width={videoSize.videoWidth}
                height={videoSize.videoHeight}
                videotoScreenRatio={parseInt(1)}
                watermarkData={watermarkData}
                style={{
                  position: "absolute",
                  zIndex: 4,
                  top: 0,
                  start: 0,
                }}
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
                  opacity: status.isLoaded ? 0 : 0.9,
                },
                videoSize.videoOrientation === "portrait" && {
                  top: 0,
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
            videoSize.videoOrientation === "portrait"
              ? [
                  styles.containerPanelVideoPortrait,
                  {
                    top: Dimensions.get("window").height - 120,
                  },
                ]
              : videoSize.isLandscape
              ? styles.containerPanelLandscape
              : styles.containerPanelPortrait
          }
        >
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor: status.isLoaded
                  ? colors.daclen_blue
                  : colors.daclen_gray,
                flex: 1,
              },
            ]}
            onPress={() =>
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }
            disabled={videoLoading || !status.isLoaded}
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
                  videoLoading || !status.isLoaded || watermarkImage === null
                    ? colors.daclen_gray
                    : colors.daclen_orange,
                flex: 1,
              },
            ]}
            onPress={() => processVideo()}
            disabled={
              loading ||
              videoLoading ||
              !status.isLoaded ||
              watermarkImage === null
            }
          >
            {watermarkLoading || loading ? (
              <ActivityIndicator
                size="small"
                color="white"
                style={{
                  alignSelf: "center",
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name={
                  rawUri === null
                    ? "download"
                    : resultUri === null
                    ? "pinwheel"
                    : sharingAvailability
                    ? "share-variant"
                    : "file-download"
                }
                size={18}
                color="white"
              />
            )}
            {videoSize.isLandscape ? null : (
              <Text style={styles.textButton}>
                {rawUri === null
                  ? "Download"
                  : resultUri === null
                  ? "Proses"
                  : sharingAvailability
                  ? "Share"
                  : Platform.OS === "android"
                  ? "Buka Galeri"
                  : "Buka Camera Roll"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {userId === 8054 && Platform.OS === "web" && !videoSize.isLandscape ? (
          <TextInput
            style={styles.textInput}
            value={customFilter}
            onChangeText={(text) => setCustomFilter((customFilter) => text)}
          />
        ) : null}

        {userId === 8054 && Platform.OS === "web" && !videoSize.isLandscape ? (
          <Text
            style={[
              styles.textUid,
              {
                fontWeight: "bold",
                color: colors.daclen_graydark,
                fontSize: 12,
                marginVertical: 10,
                paddingBottom: 0,
              },
            ]}
          >
            {setBasicFFMPEGCommand(
              "%RAWURI%",
              "%WTEXT%",
              "%RESULT%",
              customFilter
            )}
          </Text>
        ) : null}

        {userId !== 8054 ||
        fullLogs === null ||
        videoSize.isLandscape ? null : (
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor:
                  loading || videoLoading
                    ? colors.daclen_gray
                    : colors.daclen_indigo,
                width: "90%",
              },
            ]}
            onPress={() => openFullLogs()}
            disabled={videoLoading || loading}
          >
            <MaterialCommunityIcons name="text-box" size={18} color="white" />
            <Text style={styles.textButton}>Logs</Text>
          </TouchableOpacity>
        )}

        {userId === 8054 &&
        watermarkImage !== null &&
        !videoSize.isLandscape ? (
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor:
                  loading || videoLoading
                    ? colors.daclen_gray
                    : colors.daclen_reddishbrown,
                width: "90%",
                marginTop: 10,
              },
            ]}
            onPress={() => shareFileAsync(watermarkImage, sharingOptionsMP4)}
            disabled={loading || videoLoading}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={18}
              color="white"
            />
            <Text style={styles.textButton}>Share Watermark</Text>
          </TouchableOpacity>
        ) : null}

        {userId === 8054 && rawUri !== null && !videoSize.isLandscape ? (
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor:
                  loading || videoLoading
                    ? colors.daclen_gray
                    : colors.daclen_black,
                width: "90%",
                marginTop: 10,
              },
            ]}
            onPress={() => shareFileAsync(rawUri, sharingOptionsMP4)}
            disabled={loading || videoLoading}
          >
            <MaterialCommunityIcons name="share" size={18} color="white" />
            <Text style={styles.textButton}>Share Raw Video</Text>
          </TouchableOpacity>
        ) : null}

        {userId === 8054 &&
        rawUri !== null &&
        watermarkImage !== null &&
        !loading &&
        !videoLoading &&
        !videoSize.isLandscape ? (
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor:
                  loading || videoLoading
                    ? colors.daclen_gray
                    : colors.daclen_cyan,
                width: "90%",
                marginTop: 10,
              },
            ]}
            onPress={() => resetResultUri()}
          >
            <MaterialCommunityIcons name="restore" size={18} color="white" />
            <Text style={styles.textButton}>Reset</Text>
          </TouchableOpacity>
        ) : null}

        {userId !== 8054 || videoSize.isLandscape ? null : (
          <Text style={styles.textUid}>{output}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
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
  containerPanelVideoPortrait: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    start: 0,
    zIndex: 6,
  },
  containerBodyVideoPortrait: {
    position: "absolute",
    top: 0,
    start: 0,
    width: "100%",
    flex: 1,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
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
    elevation: 4,
    backgroundColor: colors.daclen_black,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: "100%",
    top: 0,
    start: 0,
  },
  containerHeaderText: {
    marginHorizontal: 10,
    alignSelf: "center",
    flex: 1,
    backgroundColor: "transparent",
  },
  video: {
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  button: {
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
    backgroundColor: colors.daclen_light,
    justifyContent: "center",
    alignItems: "center",
  },
  textHeaderLandscape: {
    backgroundColor: "transparent",
    fontWeight: "bold",
    color: colors.daclen_light,
    fontSize: 12,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginStart: 6,
  },
  textError: {
    marginTop: 2,
    fontSize: 10,
    color: colors.daclen_light,
    backgroundColor: "transparent",
    textAlignVertical: "center",
    zIndex: 4,
    height: 16,
  },
  textUid: {
    fontSize: 10,
    width: "90%",
    marginHorizontal: 10,
    marginTop: 10,
    paddingBottom: staticDimensions.pageBottomPadding,
    color: colors.daclen_gray,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    width: "90%",
    marginVertical: 4,
    fontSize: 14,
  },
});

const mapStateToProps = (store) => ({
  watermarkData: store.mediaKitState.watermarkData,
  watermarkVideos: store.mediaState.watermarkVideos,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { updateWatermarkVideo, overwriteWatermarkVideos },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(VideoPlayer);
