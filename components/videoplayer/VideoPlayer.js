import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Video, ResizeMode } from "expo-av";
import { colors, dimensions } from "../../styles/base";

import {
  tempvideoheight,
  tempvideourl,
  tempvideowidth,
} from "../media/constants";

export default function VideoPlayer({ title, uri }) {
  let width = tempvideowidth;
  let height = tempvideoheight;
  let ratio = width / height;

  const video = useRef(null);
  const [status, setStatus] = useState({ isLoaded: false });
  const [hidden, setHidden] = useState(false);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={[styles.video, { height: dimensions.fullWidth / ratio }]}
        source={{
          uri: tempvideourl,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      {!status.isLoaded || hidden ? (
        <View
          style={[
            styles.video,
            {
              height: dimensions.fullWidth / ratio,
              position: "absolute",
              top: 0,
              start: 0,
              zIndex: 2,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.daclen_black,
            },
          ]}
        >
          <ActivityIndicator size="large" color={colors.daclen_gray} />
        </View>
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
});
