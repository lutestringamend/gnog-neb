import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";

import { colors, dimensions } from "../../styles/base";
import { getFileName } from "../media";

export default function VideoPlayer(props) {
  const { title, uri, width, height, thumbnail } = props.route?.params;
  let ratio = width / height;

  const video = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isLoaded: false });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (uri === undefined || uri === null) {
      setError("Tidak ada Uri");
    } else if (title !== null && title !== undefined && title !== "") {
      props.navigation.setOptions({ title });
    }
  }, [uri]);

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
    <View style={styles.container}>
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

      <Video
        ref={video}
        style={[styles.video, { height: dimensions.fullWidth / ratio }]}
        source={{
          uri,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />

      {!status.isLoaded || hidden ? (
        <ImageBackground
          source={{ uri: thumbnail }}
          style={[
            styles.video,
            {
              height: dimensions.fullWidth / ratio,
              position: "absolute",
              top: 0,
              start: 0,
              zIndex: 2,
              backgroundColor: colors.daclen_black,
            },
          ]}
          resizeMode="cover"
        />
      ) : null}

      {!status.isLoaded || loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={styles.spinner}
        />
      ) : null}

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
        <Text style={styles.textButton}>
          {status.isPlaying ? "Pause" : "Play"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setHidden(() => !hidden)}
      >
        <MaterialCommunityIcons name="view-day" size={18} color="white" />
        <Text style={styles.textButton}>{hidden ? "Show" : "Hide"}</Text>
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

        <Text style={styles.textButton}>Download Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.fullWidth,
    alignItems: "center",
    backgroundColor: "white",
  },
  video: {
    alignSelf: "center",
    width: dimensions.fullWidth,
    backgroundColor: colors.daclen_black,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 20,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginStart: 6,
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
  spinner: {
    position: "absolute",
    top: dimensions.fullWidth / (ratio * 2),
    start: dimensions.fullWidth / 2,
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 4,
  },
});
