import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/base";

const defaultDimension = 25;

const Checkbox = (props) => {
  const { active, style, disabled, width, height, error } = props;

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
        {
          width: width ? width : defaultDimension,
          height: height ? height : defaultDimension,
          backgroundColor: active ? colors.daclen_blue_textinput : colors.white,
          borderColor: error ? colors.daclen_danger : active ? colors.daclen_blue_light_border : colors.daclen_grey_placeholder,
          borderWidth: active ? 0 : 1,
        },
        style ? style : null,
      ]}
    >
      {active ? (
       <MaterialCommunityIcons
       name="check-bold"
       size={14}
       color={colors.daclen_grey_placeholder}
       style={styles.check}
     />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  check: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

export default Checkbox;
