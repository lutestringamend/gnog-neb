import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { blurhash, colors } from "../../../styles/base";

const PhotoItem = (props) => {
  const { item, index, selected, style, selectMode, imageStyle, imageWidth } = props;

  function onLongPress() {
    if (props?.onLongPress === undefined || props?.onLongPress === null) {
      return;
    }
    props?.onLongPress();
  }

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress()}
      onPress={() => onPress()}
      key={index}
      style={[styles.containerImage, style ? style : null]}
    >
      <Image
        style={[
          styles.image,
          imageStyle
            ? imageStyle
            : {
                width: imageWidth ? imageWidth : 94,
                height: imageWidth ? 125 * imageWidth / 94 : 125,
                alignSelf: "flex-start",
              },
        ]}
        source={item?.thumbnail ? item?.thumbnail : null}
        contentFit="cover"
        placeholder={blurhash}
        transition={0}
        cachepolicy="memory-disk"
      />

      {selectMode ? (
        <View style={styles.containerSelected}>
          <MaterialCommunityIcons
            name={selected ? "check-circle" : "checkbox-blank-circle-outline"}
            size={24}
            color={colors.daclen_light}
            style={styles.check}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

//onClick={() => openSegmentScreen()}

const styles = StyleSheet.create({
  containerImage: {
    backgroundColor: "transparent",
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.daclen_lightgrey,
    alignSelf: "center",
  },
  containerSelected: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    zIndex: 20,
    opacity: 0.8,
    backgroundColor: colors.daclen_bg,
    borderRadius: 6,
  },
  image: {
    alignSelf: "center",
    backgroundColor: colors.daclen_light,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_lightgrey,
    marginStart: 0,
    elevation: 4,
  },
  check: {
    position: "absolute",
    end: 10,
    bottom: 10,
  },
});

export default PhotoItem;
