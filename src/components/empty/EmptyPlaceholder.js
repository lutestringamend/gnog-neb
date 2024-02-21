import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import Button from "../Button/Button";

const iconDimension =
  dimensions.fullWidth - 8 * staticDimensions.marginHorizontal;

const EmptyPlaceholder = (props) => {
  const { title, text, vector, buttonText, buttonInverted, minHeight } = props;
  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress();
    }
  }

  return (
    <View style={[styles.container, { minHeight: minHeight ? minHeight : dimensions.fullHeight * 0.75}]}>
      {vector ? (
        <Image source={vector} style={styles.icon} contentFit="contain" />
      ) : null}
      {title ? <Text style={styles.textTitle}>{title}</Text> : null}
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {buttonText ? (
        <Button
          text={buttonText}
          onPress={() => onPress()}
          style={styles.button}
          inverted={buttonInverted ? buttonInverted : false}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    paddingVertical: 32,
    paddingHorizontal: staticDimensions.marginHorizontal,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: iconDimension,
    height: iconDimension,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  textTitle: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
    fontSize: 18,
    textAlign: "center",
    marginTop: 24,
    width: 253,
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-Light",
    color: colors.black,
    fontSize: 12,
    textAlign: "center",
    marginVertical: 4,
    width: 253,
  },
  button: {
    marginVertical: 12,
    maxWidth: 200,
  },
});

export default EmptyPlaceholder;
