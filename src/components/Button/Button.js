import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, globalUIRatio, staticDimensions } from "../../styles/base";

const Button = (props) => {
  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      disabled={props?.disabled}
      onPress={() => onPress()}
      style={[
        styles.container,
        {
          backgroundColor: props?.backgroundColor
            ? props?.backgroundColor
            : props?.disabled
              ? colors.daclen_button_disabled_grey
              : props?.inverted
                ? colors.white
                : colors.daclen_black_old,
          borderColor: props?.borderColor
            ? props?.borderColor
            : colors.buttonBorder,
          borderWidth: props?.bordered ? globalUIRatio : 0,
          paddingVertical: props?.paddingVertical ? props?.paddingVertical : 0,
        },
        props?.style ? props?.style : null,
      ]}
    >
      {props?.icon ? (
        <MaterialCommunityIcons
          name={props?.icon}
          size={props?.iconSize ? props?.iconSize : 18 * globalUIRatio}
          color={
            props?.fontColor
              ? props?.fontColor
              : props?.disabled
                ? colors.daclen_button_disabled_grey
                : props?.inverted
                  ? colors.daclen_black_old
                  : colors.white
          }
          style={styles.icon}
        />
      ) : null}
      {props?.loading ? (
        <ActivityIndicator
          size={props?.fontSize ? props?.fontSize : 12 * globalUIRatio}
          color={
            props?.fontColor
              ? props?.fontColor
              : props?.disabled
                ? colors.daclen_button_disabled_grey
                : props?.inverted
                  ? colors.daclen_black_old
                  : colors.white
          }
          style={styles.spinner}
        />
      ) : (
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.text,
            {
              color: props?.fontColor
                ? props?.fontColor
                : props?.inverted
                    ? colors.daclen_black_old
                    : colors.white,
              fontSize: props?.fontSize ? props?.fontSize : 14 * globalUIRatio,
              fontFamily: props?.fontFamily
                ? props?.fontFamily
                : "Poppins-SemiBold",
            },
            props?.icon ? null : { flex: 1 },
            props?.textStyle ? props?.textStyle : null,
          ]}
        >
          {props?.text}
        </Text>
      )}

      {props?.withArrow ? (
        <MaterialCommunityIcons
          name={props?.rightArrow ? props?.rightArrow : "chevron-right"}
          size={props?.arrowSize ? props?.arrowSize : 14 * globalUIRatio}
          color={
            props?.fontColor
              ? props?.fontColor
              : props?.disabled
                ? colors.daclen_button_disabled_grey
                : props?.inverted
                  ? colors.daclen_black_old
                  : colors.white
          }
          style={styles.arrow}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8 * globalUIRatio,
    borderColor: colors.daclen_black_old,
    paddingHorizontal: staticDimensions.marginHorizontal,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40 * globalUIRatio,
  },
  text: {
    color: colors.white,
    backgroundColor: "transparent",
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * globalUIRatio,
  },
  icon: {
    alignSelf: "center",
    backgroundColor: "transparent",
    marginEnd: 6 * globalUIRatio,
  },
  arrow: {
    alignSelf: "center",
    backgroundColor: "transparent",
    marginStart: 6 * globalUIRatio,
  },
  spinner: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

export default Button;
