import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, dimensions, staticDimensions } from "../../styles/base";

const width = (40 * dimensions.fullWidthAdjusted) / 430;

const DashboardButton = (props) => {
  const { icon, iconColor, disabled, style } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, style ? style : null]}
      onPress={() => onPress()}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={(25 * dimensions.fullWidthAdjusted) / 430}
          color={iconColor ? iconColor : colors.black}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    width,
    height: width,
    borderRadius: width / 2,
  },
});

export default DashboardButton;
