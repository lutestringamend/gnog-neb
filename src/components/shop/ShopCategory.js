import React, { memo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";

import { colors, staticDimensions, dimensions } from "../../styles/base";

const screenWidth =
  dimensions.fullWidth > staticDimensions.shopMaxWidth
    ? staticDimensions.shopMaxWidth
    : dimensions.fullWidth;
const width = (320 * screenWidth) / 430;
const height = 180;
const imageWidth = (140 * width) / 180;

const ShopCategory = (props) => {
  const { index, nama, foto_url, backgroundColor, textColor } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        styles.container,
        { backgroundColor: backgroundColor ? backgroundColor : colors.white },
      ]}
    >
      <View style={styles.containerText}>
        <Text
          allowFontScaling={false}
          style={[
            styles.textName,
            { color: textColor ? textColor : colors.black },
          ]}
        >
          {nama}
        </Text>
        <Text
          allowFontScaling={false}
          style={[
            styles.textMore,
            { color: textColor ? textColor : colors.black },
          ]}
        >
          {`Lebih Banyak >>`}
        </Text>
      </View>

      {foto_url ? (
        <View style={styles.containerImage}>
          <ActivityIndicator
            size={16}
            color={colors.daclen_button_disabled_grey}
            style={styles.spinner}
          />
          <Image
            style={[styles.image, index > 9 ? styles.imageBundle : null]}
            source={foto_url}
            contentFit={index > 9 ? "contain" : "cover"}
            placeholder={null}
            transition={100}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    width,
    height,
    borderRadius: 20,
    flexDirection: "row",
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerText: {
    justifyContent: "space-between",
    marginVertical: 22,
    marginHorizontal: 19,
    backgroundColor: "transparent",
  },
  containerImage: {
    width,
    height: width,
    backgroundColor: colors.daclen_grey_container,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textName: {
    fontFamily: "Poppins-Bold",
    maxWidth: 100,
    fontSize: 18,
    color: colors.black,
    backgroundColor: "transparent",
  },
  textMore: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: colors.black,
    backgroundColor: "transparent",
    textDecorationLine: "underline",
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    alignSelf: "center",
    backgroundColor: colors.daclen_grey_container,
  },
  spinner: {
    alignSelf: "center",
    backgroundColor: "transparent",
    top: (width - 16) / 2,
    start: (width - 16) / 2,
    position: "absolute",
  },
});

export default memo(ShopCategory);
