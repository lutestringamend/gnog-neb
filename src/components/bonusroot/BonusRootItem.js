import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import {
  BONUS_ROOT_HPV_DESC,
  BONUS_ROOT_HPV_TITLE,
  BONUS_ROOT_RPV_DESC,
  BONUS_ROOT_RPV_TITLE,
} from "../../constants/bonusroot";

const ratio = dimensions.fullWidthAdjusted / 430;

export function VerticalLine({ style }) {
  return <View style={[styles.verticalLine, style]} />;
}

const BonusRootItem = ({ title, content, isParent, isLastItem, onPress }) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginStart: isParent ? 0 : staticDimensions.marginHorizontal / 2,
        },
      ]}
    >
      {isParent ? null : (
        <VerticalLine
          style={{
            height: isLastItem ? "51%" : "100%",
          }}
        />
      )}
      {isParent ? null : <View style={styles.horizontalLine} />}

      <TouchableOpacity
        onPress={() =>
          onPress === undefined ? console.log(title, content) : onPress()
        }
        style={[
          styles.containerTouchable,
          {
            marginVertical: isParent ? 0 : 12,
          },
        ]}
      >
        <Text allowFontScaling={false} style={styles.textHeader}>
          {title}
        </Text>
        <Text allowFontScaling={false} style={styles.textPoint}>
          {content}
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          {title === BONUS_ROOT_HPV_TITLE
            ? BONUS_ROOT_HPV_DESC
            : title === BONUS_ROOT_RPV_TITLE
              ? BONUS_ROOT_RPV_DESC
              : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
  },
  containerTouchable: {
    backgroundColor: colors.daclen_grey_container,
    minHeight: 120 * ratio,
    maxWidth: 240 * ratio,
    padding: 12 * ratio,
    borderRadius: 12 * ratio,
    overflow: "hidden",
    elevation: 4,
  },
  verticalLine: {
    height: "100%",
    width: 4 * ratio,
    alignSelf: "flex-start",
    backgroundColor: colors.daclen_grey_container,
  },
  horizontalLine: {
    width: 24,
    height: 4 * ratio,
    backgroundColor: colors.daclen_grey_container,
  },
  textHeader: {
    fontSize: 14 * ratio,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
    backgroundColor: "transparent",
  },
  textPoint: {
    fontSize: 12 * ratio,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_grey_placeholder,
    backgroundColor: "transparent",
    marginTop: 2,
  },
  text: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    backgroundColor: "transparent",
    maxWidth: 216 * ratio,
    marginTop: 2,
  },
});

export default BonusRootItem;
