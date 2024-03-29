import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import Button from "../Button/Button";

const ratio = dimensions.fullWidthAdjusted / 430;

const DashboardContainer = (props) => {
  const { header, text, content, buttonText, disabled, loading, style, maxTextWidth, buttonWidth } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <View style={[styles.container, style ? style : null]}>
      {header ? (
        <Text allowFontScaling={false} style={[styles.textHeader, { width: (maxTextWidth ? maxTextWidth : 220) * ratio, }]}>
          {header}
        </Text>
      ) : null}
      {content ? (
        content
      ) : text ? (
        <Text allowFontScaling={false} style={styles.text}>
          {text}
        </Text>
      ) : null}
      {buttonText ? (
        <Button
          text={buttonText}
          disabled={disabled}
          loading={loading}
          style={[styles.button, buttonWidth ? { width: buttonWidth, paddingHorizontal: 0 } : null]}
          fontSize={14 * ratio}
          onPress={() => onPress()}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16 * ratio,
    backgroundColor: colors.white,
    padding: 14 * ratio,
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 160 * ratio,
  },
  button: {
    height: 38 * ratio,
    borderRadius: 100 * ratio,
    alignSelf: "flex-end",
    paddingHorizontal: staticDimensions.marginHorizontal * ratio,
  },
  textHeader: {
    fontSize: 18 * ratio,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.black,
  },
  text: {
    fontSize: 12 * ratio,
    fontFamily: "Poppins-Light",
    backgroundColor: "transparent",
    color: colors.black,
    maxWidth: 220 * ratio,
  },
});

export default DashboardContainer;
