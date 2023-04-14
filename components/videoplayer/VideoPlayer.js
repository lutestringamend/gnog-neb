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
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";
import { getOrientationAsync, Orientation } from "expo-screen-orientation";

import { colors, dimensions } from "../../styles/base";
import { getFileName } from "../media";

export default function VideoPlayer(props) {
  const { title, uri, width, height, thumbnail } = props.route?.params;
  let ratio = width / height;

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
    };

    if (uri === undefined || uri === null) {
      setError("Tidak ada Uri");
    } else if (title !== null && title !== undefined && title !== "") {
      props.navigation.setOptions({ title });
    }
    checkInitialOrientation();
  }, [uri]);

  useEffect(() => {
    console.log("videoSize", videoSize);
  }, [videoSize]);

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
      {error ? (
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
      ) : null}

      <ScrollView style={styles.scrollView}>
        {videoSize.isLandscape === null ? null : (
          <View
            style={[
              styles.video,
              {
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
            style={styles.button}
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
            style={styles.button}
            onPress={() => setHidden(() => !hidden)}
          >
            <MaterialCommunityIcons name="view-day" size={18} color="white" />
            {videoSize.isLandscape ? null : (
              <Text style={styles.textButton}>{hidden ? "Show" : "Hide"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.daclen_orange }]}
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
    marginHorizontal: 20,
    paddingBottom: dimensions.pageBottomPadding,
  },
  containerPanelLandscape: {
    position: "absolute",
    top: 10,
    end: 10,
    backgroundColor: "transparent",
    zIndex: 10,
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
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10,
    backgroundColor: colors.daclen_blue,
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
