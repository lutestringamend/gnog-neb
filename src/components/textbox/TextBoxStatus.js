import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { dimensions } from "../../styles/base";

const ratio = dimensions.fullWidthAdjusted / 430;

const TextBoxStatus = ({
  isShort,
  text,
  backgroundColor,
  color,
  style,
  icon,
}) => {
  return (
    <View
      style={[
        styles.containerVerified,
        { backgroundColor },
        style ? style : null,
      ]}
    >
      {isShort || text === undefined || text === null ? null : (
        <Text allowFontScaling={false} style={[styles.textVerified, { color }]}>
          {text}
        </Text>
      )}

      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={11 * ratio}
          color={color}
          style={styles.verified}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerVerified: {
    borderRadius: 6 * ratio,
    height: 20 * ratio,
    paddingHorizontal: 8 * ratio,
    flexDirection: "row",
    alignItems: "center",
  },
  textVerified: {
    backgroundColor: "transparent",
    fontFamily: "Poppins",
    fontSize: 11 * ratio,
  },
  verified: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: 4 * ratio,
  },
});

export default TextBoxStatus;
