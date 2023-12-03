import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { blurhash, colors } from "../../styles/base";
import {
  vwmarktextnamecharlimit,
  vwmarktextphonecharlimit,
  wmarkhorizontalmargin,
} from "../mediakit/constants";
import {
  tokoonlineurlshort,
  personalwebsiteurlshort,
} from "../../axios/constants";
import { STARTER_KIT_FLYER_PRODUK_TAG } from "../mediakit/constants";

function ImageLargeWatermarkModel(props) {
  const {
    watermarkData,
    style,
    jenis_foto,
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
    username,
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
          overflow: "visible",
        },
        style ? style : null,
      ]}
    >
      {uri === undefined || uri === null ? null : (
        <Image
          source={uri}
          style={[
            styles.image,
            {
              width: displayWidth ? displayWidth : width,
              height: displayHeight ? displayHeight : height,
              overflow: "visible",
            },
          ]}
          contentFit="contain"
          placeholder={null}
          transition={0}
        />
      )}

      <View
        style={[
          styles.containerUrl,
          {
            width: displayWidth,
            top: Math.round(ratio * (link_y - 3)),
            start: 0,
          },
        ]}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.textUrl,
            {
              width: displayWidth,
              fontSize: displayFontSize,
            },
          ]}
        >
          {`${
            username
              ? `${
                  jenis_foto === STARTER_KIT_FLYER_PRODUK_TAG
                    ? tokoonlineurlshort
                    : personalwebsiteurlshort
                }${username}`
              : ""
          }`}
        </Text>
      </View>

      <View
        style={[
          styles.containerUrl,
          {
            width: displayWidth * 0.8,
            top: ratio * (text_y - 2),
            start: displayWidth * 0.1,
            end: displayWidth * 0.1,
            alignSelf: "center",
          },
        ]}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.textUrl,
            {
              flex: 1,
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
          allowFontScaling={false}
          style={[
            styles.textUrl,
            {
              flex: 1,
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
    zIndex: 4,
    elevation: 4,
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  textUrl: {
    backgroundColor: "transparent",
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default ImageLargeWatermarkModel;
