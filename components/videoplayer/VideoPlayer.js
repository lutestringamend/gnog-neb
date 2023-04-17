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
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";

import { colors, staticDimensions } from "../../styles/base";
import { getFileName } from "../media";
import MainHeader from "../main/MainHeader";
import { useNavigation } from "@react-navigation/native";
import { WATERMARK_VIDEO } from "../dashboard/constants";
//import { useScreenDimensions } from "../../hooks/useScreenDimensions";
import { ErrorView } from "../webview/WebviewChild";

export default function VideoPlayer(props) {
  const { title, uri, width, height, thumbnail, userId } = props.route?.params;
  let ratio = width / height;
  const video = useRef(null);
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
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
      videoWidth: Dimensions.get("window").width,
      videoHeight: Dimensions.get("window").width > Dimensions.get("window").height
        ? Dimensions.get("window").height
        : Dimensions.get("window").width / ratio,
    }
    const [videoSize, setVideoSize] = useState(initialVideoSize);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [status, setStatus] = useState({ isLoaded: false });
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
      if (uri === undefined || uri === null) {
        setError("Tidak ada Uri");
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
      console.log("videoSize", videoSize, "userId", userId);
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
      changeOrie
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
          setError(JSON.stringify(result.uri, result.headers["Content-Type"]));
          setLoading(false);
        } catch (e) {
          console.error(e);
          setSuccess(false);
          setError("downloadAsync catch\n" + e?.message);
          setLoading(false);
        }
      }
    };

    return (
      <SafeAreaView style={[styles.container, { width: videoSize.videoWidth }]}>
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
              

              <ImageBackground
                source={{ uri: thumbnail }}
                style={[
                  styles.video,
                  {
                    position: "absolute",
                    width: videoSize.videoWidth,
                    height: videoSize.videoHeight,
                    zIndex: 2,
                    backgroundColor: colors.daclen_light,
                    opacity: !status.isLoaded || hidden ? 100 : 0,
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
              style={
                videoSize.isLandscape ? styles.buttonCircle : styles.button
              }
              onPress={() => changeVideoOrientation(!videoSize.isLandscape)}
              disabled={videoLoading}
            >
              <MaterialCommunityIcons name="view-day" size={18} color="white" />
              {videoSize.isLandscape ? null : (
                <Text style={styles.textButton}>
                  Landscape
                </Text>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
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
