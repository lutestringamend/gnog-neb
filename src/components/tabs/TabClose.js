import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, globalUIRatio } from "../../styles/base";

const TabClose = (props) => {
  const { backgroundColor, color, width, icon, disabled, style } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onPress()}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ? backgroundColor : "transparent",
          borderColor: color ? color : colors.daclen_black,
          width: width ? width : 40 * globalUIRatio,
          height: width ? width : 40 * globalUIRatio,
          borderRadius: width ? width / 2 : 20 * globalUIRatio,
        },
        style ? style : null,
      ]}
    >
      <MaterialCommunityIcons
        name={icon ? icon : "close-thick"}
        color={color ? color : colors.daclen_black}
        size={width ? (15 * width) / 20 : 15 * globalUIRatio}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default TabClose;
