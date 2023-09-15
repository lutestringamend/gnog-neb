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
import { bindActionCreators } from "redux";

import * as FileSystem from "expo-file-system";
import { saveToLibraryAsync, usePermissions } from "expo-media-library";
import { Video, ResizeMode } from "expo-av";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import ViewShot from "react-native-view-shot";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../styles/base";
import {
  getFileName,
  setBasicFFMPEGCommand,
  setFFMPEGCommand,
  setFilterFFMPEG,
  updateWatermarkVideo,
  overwriteWatermarkVideos,
} from "../media";
//import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { defaultffmpegcodec, sharingOptionsMP4 } from "../media/constants";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY } from "../asyncstorage/constants";
import {
  videoplayermargintop,
  videoplayerportraitiosheight,
  videoplayerportraitpanelandroidheight,
  vwmarkdebuguserid,
  vwmarkdefaultsourceheight,
  vwmarkdefaultsourcewidth,
  vwmarkrenderlandscapeheightcompressionconstant,
  vwmarkrenderlandscapewidthcompressionconstant,
  vwmarkrenderportraitheightcompressionconstant,
  vwmarkrenderportraitwidthcompressionconstant,
} from "../mediakit/constants";
import VideoLargeWatermarkModel from "../media/VideoLargeWatermarkModel";

function VideoPlayer(props) {
  const { videoId, title, uri, width, height, thumbnail, userId } =
    props.route?.params;

  const ratio =
    width === null || height === null
      ? vwmarkdefaultsourcewidth / vwmarkdefaultsourceheight
      : width / height;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const screenRatio = screenWidth / screenHeight;

  const projectedPortraitVideoHeight = Math.round(screenWidth / ratio);
  const readjustedPortraitVideoHeight =
    screenHeight -
    (Platform.OS === "ios"
      ? videoplayerportraitiosheight
      : videoplayerportraitpanelandroidheight);
  const readjustedPortraitVideoWidth = Math.round(
    readjustedPortraitVideoHeight * ratio
  );

  const videoSize = {
    isLandscape: false,
    videoWidth: height > width ? readjustedPortraitVideoWidth : screenWidth,
    videoHeight:
      height > width
        ? readjustedPortraitVideoHeight
        : projectedPortraitVideoHeight,
    videoOrientation: height > width ? "portrait" : "landscape",
  };

  const videoToScreenRatio = parseFloat(width / screenWidth);
  const videoToPreviewRatio = parseFloat(videoSize.videoWidth / screenWidth);
  const watermarkSize = {
    width,
    height,
  };

  const video = useRef(null);
  const waterRef = useRef(null);
  const navigation = useNavigation();
  const { watermarkData, watermarkVideos, currentUser } = props;
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

  //const [videoSize, setVideoSize] = useState(initialVideoSize);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [captureFailure, setCaptureFailure] = useState(false);
  //const [watermarkSize, setWatermarkSize] = useState();
  const [watermarkLoading, setWatermarkLoading] = useState(false);
  const [status, setStatus] = useState({ isLoaded: false });
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [rawUri, setRawUri] = useState(null);
  const [resultUri, setResultUri] = useState(null);
  const [output, setOutput] = useState("VIDEO PROCESSING LOGS");
  const [fullLogs, setFullLogs] = useState(
    userId === vwmarkdebuguserid ? "test" : null
  );
  const [sharingAvailability, setSharingAvailability] = useState(false);
  const [updateStorage, setUpdateStorage] = useState(false);

  //debugging ffmpeg
  /*const [customFilter, setCustomFilter] = useState(
    `${setFilterFFMPEG("top-left", 0, 0)} ${defaultffmpegcodec}`
  );*/

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

    let logs = {
      videoId,
      width,
      height,
      screenWidth,
      screenHeight,
      screenRatio,
      projectedPortraitVideoHeight,
      readjustedPortraitVideoWidth,
      readjustedPortraitVideoHeight,
      videoSize,
      ratio,
      videoToScreenRatio,
      videoToPreviewRatio,
    };

    console.log("init logs", logs);
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
        if (userId === vwmarkdebuguserid && Platform.OS === "android") {
          ToastAndroid.show(
            `change orientation ${JSON.stringify(screenData)}`,
            ToastAndroid.LONG
          );
        }
      }
    }, [screenData]);*/

  /*useEffect(() => {
    if (userId === vwmarkdebuguserid && Platform.OS === "android") {
        ToastAndroid.show(`videoSize ${JSON.stringify(videoSize)}`,
          ToastAndroid.LONG
        );
      }
  }, [videoSize]);*/

  useEffect(() => {
    if (resultUri !== null) {
      setUpdateStorage(true);
      props.updateWatermarkVideo(videoId, rawUri, resultUri);
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
    //props.overwriteWatermarkVideos([]);
    props.updateWatermarkVideo(id, null, null);
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
      props.updateWatermarkVideo(videoId, null, null);
    } else {
      props.overwriteWatermarkVideos(storageWatermarkVideosSaved);
    }
  };

  function updateReduxRawUri() {
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      return;
    }

    try {
      const check = watermarkVideos.find(({ id }) => id === videoId);
      console.log(`redux watermarkvideos id ${videoId} uri check`, check);
      if (check === undefined || check === null) {
        if (rawUri !== null) {
          setUpdateStorage(true);
          props.updateWatermarkVideo(videoId, rawUri, resultUri);
        }
      } else {
        if (check?.rawUri === undefined || check?.rawUri === null) {
          if (rawUri !== null) {
            setUpdateStorage(true);
            props.updateWatermarkVideo(videoId, rawUri, resultUri);
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

  const renderWatermark = async () => {
    if (captureFailure || watermarkLoading || watermarkImage !== null) {
      return;
    }
    console.log("renderWatermark", watermarkSize);
    setOutput(
      (output) =>
        `${output}\nwatermarkSize and capturing ${JSON.stringify(
          watermarkSize
        )}`
    );
    if (Platform.OS === "web") {
      setWatermarkLoading(true);
    } else if (!watermarkLoading) {
      setWatermarkLoading(true);
      waterRef.current
        .capture()
        .then((uri) => onManualCapture(uri))
        .catch((e) => onManualCaptureFailure(e));
    }
  };

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
    setError(`Video dengan Watermark telah siap untuk dibagikan`);
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
      /*if (sharingAvailability) {
        shareFileAsync(resultUri, sharingOptionsMP4);
      }*/
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
      0,
      width,
      height
    );

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
            if (userId === 8054) {
              navigation.navigate("VideoLogsScreen", {
                text: `ffmpeg ${ffmpegCommand}\n\nsession ${sessionId.toString()} returnCode ${returnCode.toString()}\n\nsession output:\n\n${sessionOutput}`,
              });
            }
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
        const targetDownload = FileSystem.documentDirectory + "raw_" + fileName;
        console.log("downloadAsync", uri, targetDownload);
        const result = await FileSystem.downloadAsync(uri, targetDownload, {
          cache: true,
          sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        });
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

  /*const handleFilterChange = (e) => {
    e.preventDefault();
    setCustomFilter(e.target.value);
  };*/

  return (
    <SafeAreaView style={styles.container}>
      <ViewShot
        ref={waterRef}
        options={{
          fileName: "wtext",
          format: "png",
          quality: 1,
          width:
            watermarkSize.width /
            ((videoSize.videoOrientation === "portrait"
              ? vwmarkrenderportraitwidthcompressionconstant
              : vwmarkrenderlandscapewidthcompressionconstant) *
              (Platform.OS === "ios" ? 2 : 1)),
          height:
            watermarkSize.height /
            ((videoSize.videoOrientation === "portrait"
              ? vwmarkrenderportraitheightcompressionconstant
              : vwmarkrenderlandscapeheightcompressionconstant) *
              (Platform.OS === "ios" ? 2 : 1)),
        }}
        style={[
          styles.containerViewShot,
          {
            width: watermarkSize.width,
            height: watermarkSize.height,
          },
        ]}
        captureMode=""
        onCapture={onCapture}
        onCaptureFailure={onCaptureFailure}
      >
        <VideoLargeWatermarkModel
          width={width}
          height={height}
          videoToScreenRatio={videoToScreenRatio}
          watermarkData={watermarkData}
          orientation={videoSize?.videoOrientation}
          username={currentUser?.name}
          onLoadEnd={() => renderWatermark()}
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
            <Text
              allowFontScaling={false}
              style={[
                styles.textHeaderLandscape,
                loading || error === null
                  ? { fontFamily: "Poppins", fontSize: 16, paddingVertical: 9 }
                  : null,
              ]}
            >
              {title ? title : "Video Watermark"}
            </Text>
            {loading || error === null ? null : (
              <Text allowFontScaling={false} style={styles.textError}>
                {error}
              </Text>
            )}
          </View>
          {watermarkLoading || videoLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_light}
              style={{ alignSelf: "center" }}
            />
          ) : !loading && error ? (
            <MaterialCommunityIcons
              name={success ? "check-circle" : "alert-circle"}
              size={20}
              color={success ? colors.daclen_green_light : colors.daclen_red}
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
        scrollEnabled={
          videoSize.isLandscape &&
          (videoSize.videoOrientation === "landscape" ||
            videoSize.videoHeight > screenHeight)
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
            <Text allowFontScaling={false} style={styles.textHeaderLandscape}>
              {title}
            </Text>
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
                width: screenWidth,
                height:
                  videoSize.videoOrientation === "landscape"
                    ? videoSize.videoHeight
                    : screenHeight,
                flex: 1,
              },
            ]}
          >
            <Video
              ref={video}
              style={[
                styles.video,
                {
                  position: "absolute",
                  top: videoplayermargintop,
                  start: (screenWidth - videoSize.videoWidth) / 2,
                  end: (screenWidth - videoSize.videoWidth) / 2,
                  width: videoSize.videoWidth,
                  height:
                    videoSize.videoOrientation === "landscape"
                      ? videoSize.videoHeight
                      : screenHeight === videoSize.videoHeight
                      ? screenHeight
                      : videoSize.videoHeight,
                },
              ]}
              source={{
                uri,
              }}
              useNativeControls={true}
              isMuted={false}
              resizeMode={ResizeMode.STRETCH}
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
                  top: 24,
                  end: 24,
                  zIndex: 3,
                  elevation: 3,
                }}
              />
            ) : (
              <VideoLargeWatermarkModel
                width={videoSize.videoWidth}
                height={videoSize.videoHeight}
                videoToScreenRatio={videoToPreviewRatio}
                watermarkData={watermarkData}
                orientation={videoSize?.videoOrientation}
                style={{
                  position: "absolute",
                  zIndex: 4,
                  top: videoplayermargintop,
                  start:
                    screenWidth !== videoSize.videoWidth
                      ? (screenWidth - videoSize.videoWidth) / 2
                      : 0,
                }}
                username={currentUser?.name}
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
                    top:
                      videoSize.videoHeight - (Platform.OS === "ios" ? 60 : 40),
                    width: screenWidth,
                    height:
                      Platform.OS === "ios"
                        ? videoplayerportraitiosheight
                        : videoplayerportraitpanelandroidheight,
                    backgroundColor: "transparent",
                  },
                ]
              : videoSize.isLandscape
              ? styles.containerPanelLandscape
              : styles.containerPanelPortrait
          }
        >
                   <TouchableOpacity
            style={[
              styles.buttonCircle,
              {
                backgroundColor: status.isLoaded
                  ? colors.daclen_blue
                  : colors.daclen_gray,
                marginTop: 0,
                marginStart: 10,
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
              color={colors.daclen_light}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor:
                  loading ||
                  videoLoading ||
                  !status.isLoaded ||
                  watermarkImage === null
                    ? colors.daclen_gray
                    : rawUri === null || resultUri === null
                    ? colors.daclen_blue
                    : colors.daclen_green,
                flex: 1,
              },
            ]}
            onPress={() => processVideo()}
            disabled={
              loading ||
              videoLoading ||
              !status.isLoaded ||
              watermarkImage === null ||
              (rawUri !== null && resultUri !== null)
            }
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_light}
                style={{
                  alignSelf: "center",
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name={
                  rawUri === null
                    ? "file-download"
                    : resultUri === null
                    ? "pinwheel"
                    : "check-bold"
                }
                size={18}
                color={colors.daclen_light}
              />
            )}
            {videoSize.isLandscape ? null : (
              <Text allowFontScaling={false} style={styles.textButton}>
                {rawUri === null
                  ? "Download"
                  : resultUri === null
                  ? "Proses"
                  : Platform.OS === "android"
                  ? "Terproses"
                  : "Terproses"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              {
                backgroundColor:
                  !sharingAvailability ||
                  videoLoading ||
                  loading ||
                  !status.isLoaded ||
                  watermarkImage === null ||
                  rawUri === null ||
                  resultUri === null
                    ? colors.daclen_gray
                    : colors.daclen_orange,
                flex: 1,
              },
            ]}
            onPress={() => shareFileAsync(resultUri, sharingOptionsMP4)}
            disabled={
              !sharingAvailability ||
              loading ||
              videoLoading ||
              !status.isLoaded ||
              watermarkImage === null ||
              rawUri === null ||
              resultUri === null
            }
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={18}
              color={colors.daclen_light}
            />
            {videoSize.isLandscape ? null : (
              <Text allowFontScaling={false} style={styles.textButton}>
                Share
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading ? (
        <View style={styles.containerLoading}>
          <View style={styles.containerProgress}>
            <ActivityIndicator
              size="large"
              color={colors.daclen_light}
              style={{ alignSelf: "center" }}
            />
            {error ? (
              <Text allowFontScaling={false} style={styles.textErrorLarge}>
                {error}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

/*

        {userId === vwmarkdebuguserid &&
        Platform.OS === "web" &&
        !videoSize.isLandscape ? (
          <TextInput
            style={styles.textInput}
            value={customFilter}
            onChangeText={(text) => setCustomFilter((customFilter) => text)}
          />
        ) : null}

        {userId === vwmarkdebuguserid &&
        Platform.OS === "web" &&
        !videoSize.isLandscape ? (
          <Text allowFontScaling={false}
            style={[
              styles.textUid,
              {
                fontFamily: "Poppins-Bold",
                color: colors.daclen_graydark,
                fontFamily: "Poppins", fontSize: 12,
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

        {userId !== vwmarkdebuguserid ||
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
            <Text allowFontScaling={false} style={styles.textButton}>Logs</Text>
          </TouchableOpacity>
        )}

        {userId === vwmarkdebuguserid &&
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
            <Text allowFontScaling={false} style={styles.textButton}>Share Watermark</Text>
          </TouchableOpacity>
        ) : null}

        {userId === vwmarkdebuguserid &&
        rawUri !== null &&
        !videoSize.isLandscape ? (
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
            <Text allowFontScaling={false} style={styles.textButton}>Share Raw Video</Text>
          </TouchableOpacity>
        ) : null}

        {userId === vwmarkdebuguserid &&
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
            <Text allowFontScaling={false} style={styles.textButton}>Reset</Text>
          </TouchableOpacity>
        ) : null}

        {userId !== vwmarkdebuguserid || videoSize.isLandscape ? null : (
          <Text allowFontScaling={false} style={styles.textUid}>{output}</Text>
        )}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerLoading: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerProgress: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: colors.daclen_black,
    elevation: 6,
    alignItems: "center",
    borderRadius: 6,
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
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    start: 0,
    zIndex: 20,
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
    marginStart: 16,
    marginEnd: 10,
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
    alignSelf: "center",
    width: 60,
    height: 40,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 10,
    backgroundColor: colors.daclen_blue,
  },
  buttonCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
    fontSize: 12,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    alignSelf: "center",
    marginStart: 6,
  },
  textError: {
    marginTop: 2,
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_light,
    backgroundColor: "transparent",
    textAlignVertical: "center",
    zIndex: 4,
    height: 16,
  },
  textErrorLarge: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: colors.daclen_light,
    backgroundColor: "transparent",
    textAlignVertical: "center",
  },
  textUid: {
    fontFamily: "Poppins",
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
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
  watermarkVideos: store.mediaState.watermarkVideos,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { updateWatermarkVideo, overwriteWatermarkVideos },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(VideoPlayer);
