import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, globalUIRatio } from "../../styles/base";

const RadioButton = (props) => {
  const { size, selected, disabled } = props;

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
          width: size ? size : 16 * globalUIRatio,
          height: size ? size : 16 * globalUIRatio,
        },
      ]}
      disabled={disabled}
      onPress={() => onPress()}
    >
      <MaterialCommunityIcons
        name={selected ? "radiobox-marked" : "radiobox-blank"}
        color={
          selected ? colors.daclen_blue_link : colors.daclen_grey_placeholder
        }
        size={size ? size : 16 * globalUIRatio}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

export default RadioButton;
