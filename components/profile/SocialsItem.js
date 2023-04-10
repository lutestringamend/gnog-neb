import React from "react";
import { Linking } from "react-native";
import { StyleSheet, TouchableHighlight, Image } from "react-native";

import { colors } from "../../styles/base";

export default function SocialsItem(props) {
  const openLink = () => {
    console.log("opening " + props?.link);
    if (props?.link !== undefined && props?.link !== null) {
      Linking.openURL(props?.link);
    }
  };

  let imageSource = null;
  switch (props?.icon) {
    case "fb":
      imageSource = require("../../assets/fb.png");
      break;
    case "twitter":
      imageSource = require("../../assets/twitter.png");
      break;
    case "tiktok":
      imageSource = require("../../assets/tiktok.png");
      break;
    case "youtube":
      imageSource = require("../../assets/youtube.png");
      break;
    default:
      imageSource = require("../../assets/ig.png");
      break;
  }

  return (
    <TouchableHighlight
      onPress={() => openLink()}
      style={styles.container}
      underlayColor={colors.daclen_orange}
    >
      <Image source={imageSource} style={styles.icon} />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.daclen_gray,
    width: 54,
    height: 54,
    borderRadius: 27,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
});
