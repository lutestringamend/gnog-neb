import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";
import { getOrientationAsync, Orientation } from "expo-screen-orientation";
import { DeviceMotion } from "expo-sensors";

import { colors, dimensions } from "../../styles/base";
import { getFileName } from "../media";
import MainHeader from "../main/MainHeader";
import { useNavigation } from "@react-navigation/native";
import { WATERMARK_VIDEO } from "../dashboard/constants";

export default function VideoPlayer(props) {
  const { title, uri, width, height, thumbnail, userId } = props.route?.params;
  let ratio = width / height;

  const navigation = useNavigation();
  const initialVideoSize = {
    isLandscape: null,
    videoWidth: Dimensions.get("window").width,
    videoHeight: 0,
  };
  const video = useRef(null);
  const [videoSize, setVideoSize] = useState(initialVideoSize);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isLoaded: false });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
 
    const checkInitialOrientation = async () => {
      const result = await getOrientationAsync();
      //console.log("getOrientationAsync", result);
      if (
        result === Orientation.LANDSCAPE_LEFT ||
        result === Orientation.LANDSCAPE_RIGHT
      ) {
        setVideoSize({
          isLandscape: true,
          videoWidth: Dimensions.get("window").width,
          videoHeight: Dimensions.get("window").height,
        });
      } else if (
        result === Orientation.PORTRAIT_DOWN ||
        result === Orientation.PORTRAIT_UP
      ) {
        setVideoSize({
          isLandscape: false,
          videoWidth: Dimensions.get("window").width,
          videoHeight: Dimensions.get("window").width / ratio,
        });
      } else {
        setVideoSize(initialVideoSize);
        setError("Unknown screen orientation");
      }

      const availability = await DeviceMotion.isAvailableAsync();
      console.log("sensors availability", availability);

      const sensorPermission = await DeviceMotion.requestPermissionsAsync();
      console.log("sensorPermission", sensorPermission);

      if (userId === 8054 && Platform.OS === "android") {
        ToastAndroid.show(`${JSON.stringify(availability)}\n${JSON.stringify(sensorPermission)}`, ToastAndroid.LONG);
      }
    };

    if (uri === undefined || uri === null) {
      setError("Tidak ada Uri");
    } else {
      checkInitialOrientation();
    }
  }, [uri]);

  useEffect(() => {
    console.log("videoSize", videoSize, "userId", userId);
  }, [videoSize]);

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
    <View style={[styles.container, { width: videoSize.videoWidth }]}>
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

        {videoSize.isLandscape === null ? null : (
          <View
            style={[
              styles.video,
              {
                position: videoSize.isLandscape ? "absolute" : "relative",
                width: videoSize.width,
                height: videoSize.height,
              },
            ]}
          >
            <Video
              ref={video}
              style={[
                styles.video,
                {
                  position: "relative",
                  width: videoSize.videoWidth,
                  height: videoSize.videoHeight,
                  zIndex: 1,
                },
              ]}
              source={{
                uri,
              }}
              useNativeControls
              resizeMode={
                videoSize.isLandscape ? ResizeMode.STRETCH : ResizeMode.CONTAIN
              }
              isLooping
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

            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.daclen_orange}
                style={{ zIndex: 4 }}
              />
            ) : null}
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
            style={videoSize.isLandscape ? styles.buttonCircle : styles.button}
            onPress={() => setHidden(() => !hidden)}
          >
            <MaterialCommunityIcons name="view-day" size={18} color="white" />
            {videoSize.isLandscape ? null : (
              <Text style={styles.textButton}>{hidden ? "Show" : "Hide"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              videoSize.isLandscape ? styles.buttonCircle : styles.button,
              { backgroundColor: colors.daclen_orange },
            ]}
            onPress={() => startDownload()}
            disabled={loading}
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
              <MaterialCommunityIcons name="download" size={18} color="white" />
            )}
            {videoSize.isLandscape ? null : (
              <Text style={styles.textButton}>Download Video</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  containerPanelPortrait: {
    position: "relative",
    marginHorizontal: 20,
    paddingBottom: dimensions.pageBottomPadding,
    alignItems: "center",
  },
  containerPanelLandscape: {
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
