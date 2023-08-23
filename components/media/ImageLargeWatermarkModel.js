import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { blurhash, colors } from "../../styles/base";
import {
  vmwarkdefaultpositionendtovideotruewidthratio,
  vmwarkportraittopenlargementconstant,
  vwmarkdefaultpositiontoptovideotrueheightratio,
  vwmarkdefaultwmarktovideotruewidthratio,
  vwmarkportraitenlargementconstant,
  vwmarktemplatewidth,
  vwmarktextnamecharlimit,
  vwmarktextphonecharlimit,
  vwmarkurlborderradius,
  vwmarkurlfontsize,
  vwmarkurlmargintop,
  vwmarkurlpaddinghorizontal,
  vwmarkurlpaddingvertical,
  wmarkhorizontalmargin,
} from "../mediakit/constants";
import VWatermarkModel from "./VWatermarkModel";
import { personalwebsiteurlshort } from "../../axios/constants";

function ImageLargeWatermarkModel(props) {
  const {
    watermarkData,
    style,
    uri,
    width,
    height,
    displayWidth,
    displayHeight,
    link_x,
    link_y,
    text_x,
    text_y,
    fontSize,
  } = props;

  const ratio = displayWidth / width;
  const displayFontSize = Math.round(
    ratio * (fontSize >= 48 ? fontSize / 1.25 : fontSize)
  );

  if (
    watermarkData === undefined ||
    watermarkData === null ||
    width === undefined ||
    width === null ||
    height === undefined ||
    height === null
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: displayWidth ? displayWidth : width,
          height: displayHeight ? displayHeight : height,
        },
        style ? style : null,
      ]}
    > 
    {uri === undefined || uri === null ? null : 
    <Image
    source={uri}
    style={[
      styles.image,
      {
        width: displayWidth ? displayWidth : width,
        height: displayHeight ? displayHeight : height,
      },
    ]}
    contentFit="contain"
    placeholder={blurhash}
    transition={100}
  />
    }
      
      <View
        style={[
          styles.containerUrl,
          {
            width: displayWidth,
            top: Math.round(ratio * link_y) - 2,
            start: 0,
          },
        ]}
      >
        <Text
          style={[
            styles.textUrl,
            {
              width: displayWidth,
              fontSize: displayFontSize,
            },
          ]}
        >
          {`${personalwebsiteurlshort}${
            watermarkData?.name?.length > vwmarktextnamecharlimit
              ? watermarkData?.name.substring(0, vwmarktextnamecharlimit)
              : watermarkData?.name
          }`}
        </Text>
      </View>

      <View
        style={[
          styles.containerUrl,
          {
            width: displayWidth,
            top: Math.round(ratio * text_y) - 2,
            start: 0,
          },
        ]}
      >
        <Text
          style={[
            styles.textUrl,
            {
              fontSize: displayFontSize,
              marginEnd: wmarkhorizontalmargin,
            },
          ]}
        >
          {`${
            watermarkData?.name?.length > vwmarktextnamecharlimit
              ? watermarkData?.name.substring(0, vwmarktextnamecharlimit)
              : watermarkData?.name
          }`}
        </Text>
        <Text
          style={[
            styles.textUrl,
            {
              fontSize: displayFontSize,
              marginStart: wmarkhorizontalmargin,
            },
          ]}
        >
          {`${
            watermarkData?.phone?.length > vwmarktextphonecharlimit
              ? watermarkData?.phone.substring(0, vwmarktextphonecharlimit)
              : watermarkData?.phone
          }`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerUrl: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 4,
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
  },
  textUrl: {
    backgroundColor: "transparent",
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default ImageLargeWatermarkModel;
