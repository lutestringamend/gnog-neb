import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  colors,
  dimensions,
  globalUIRatio,
  staticDimensions,
} from "../../styles/base";
import RadioButton from "../radiobutton/RadioButton";

const CheckoutCourierItem = (props) => {
  const { selected, disabled, isArrow, text, style, isLast } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          marginBottom: isLast ? 0 : 16 * globalUIRatio,
        },
        style ? style : null,
      ]}
      disabled={disabled}
      onPress={() => onPress()}
    >
      <Text allowFontScaling={false} numberOfLines={1} style={styles.text}>
        {text}
      </Text>
      {isArrow ? (
        <MaterialCommunityIcons
          name="chevron-right"
          color={colors.daclen_black}
          size={15 * globalUIRatio}
        />
      ) : (
        <RadioButton
          selected={selected}
          disabled={disabled}
          onPress={() => onPress()}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignSelf: "center",
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    height: 22 * globalUIRatio,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * globalUIRatio,
    color: colors.daclen_black,
  },
});

export default CheckoutCourierItem;
