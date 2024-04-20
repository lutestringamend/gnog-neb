import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, globalUIRatio } from "../../styles/base";

const TabButton = (props) => {
  const {
    backgroundColor,
    color,
    icon,
    text,
    withRightArrow,
    selected,
    disabled,
    style,
  } = props;

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
          backgroundColor: selected
            ? color
              ? color
              : colors.daclen_black
            : backgroundColor
              ? backgroundColor
              : "transparent",
          borderColor: color ? color : colors.daclen_black,
        },
        style ? style : null,
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          color={
            selected
              ? backgroundColor
                ? colors.daclen_black
                : backgroundColor
              : color
                ? color
                : colors.daclen_black
          }
          size={12 * globalUIRatio}
          style={{ marginEnd: 15 * globalUIRatio }}
        />
      ) : null}
      {text ? (
        <Text
          allowFontScaling={false}
          style={[
            styles.text,
            {
              color: selected
                ? backgroundColor
                  ? colors.daclen_black
                  : backgroundColor
                : color
                  ? color
                  : colors.daclen_black,
            },
          ]}
        >
          {text}
        </Text>
      ) : null}
      {withRightArrow ? (
        <MaterialCommunityIcons
          name="chevron-down"
          color={color ? color : colors.daclen_black}
          size={12 * globalUIRatio}
          style={{ marginStart: 15 * globalUIRatio }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 15 * globalUIRatio,
    paddingVertical: 11 * globalUIRatio,
    borderRadius: 100 * globalUIRatio,
    borderWidth: 1,
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12 * globalUIRatio,
    alignSelf: "center",
  },
});

export default TabButton;
