import React from "react";
import { Linking } from "react-native";
import { StyleSheet, TouchableHighlight, Image } from "react-native";

import { colors } from "../../styles/base";

export default function SocialsItem(props) {
  const openLink = () => {
    if (props?.link === undefined || props?.link === null || props?.link === "") {
      if (!(props?.onPress === undefined || props?.onPress === null)) {
        props.onPress();
      }
      return;
    }
    Linking.openURL(props?.link);
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
      <Image source={imageSource} style={styles.icon} resizeMode="contain" />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.daclen_bg_highlighted,
    width: 48,
    height: 48,
    borderRadius: 24,
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
