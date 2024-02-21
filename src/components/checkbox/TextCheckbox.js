import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { staticDimensions } from "../../styles/base";
import Checkbox from "./Checkbox";

const TextCheckbox = (props) => {
  const { active, style, checkboxStyle, disabled, textComponent, width, height, error } = props;

  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress();
    }
  }

  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled}
      style={[
        styles.container,
        style ? style : null,
      ]}
    >
      <Checkbox active={active} onPress={() => onPress()} {...props} style={checkboxStyle} />
      <View style={styles.containerText}>
        {textComponent}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerText: {
    flex: 1,
    marginStart: staticDimensions.marginHorizontal / 2,
    alignSelf: "center",
    backgroundColor: "transparent",
  }
});

export default TextCheckbox;
