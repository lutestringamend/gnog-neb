import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Linking,
} from "react-native";
//import YoutubePlayer from "react-native-youtube-iframe";
import { youtubeurl } from "../profile/constants";
import { staticDimensions } from "../../styles/base";

export default function Youtube(props) {
  const [loading, setLoading] = useState(true);

  return null;
  /*
  https://github.com/LonelyCpp/react-native-youtube-iframe/blob/master/src/YoutubeIframe.js
  
  function openItem() {
    if (!loading) {
      Linking.openURL(youtubeurl);
    }
  }

  function onReady() {
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        width={"100%"}
        height={"100%" / staticDimensions.youtubeEmbedAspectRatio}
        play={false}
        videoId={"ScMzIvxBSi4"}
      />
    </View>
  );*/
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  containerItem: {
    flex: 1 / 3,
    paddingHorizontal: 2,
  },
  imageBanner: {
    aspectRatio: 1 / 1,
  },
});
