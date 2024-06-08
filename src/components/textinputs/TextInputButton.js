import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, staticDimensions, dimensions, globalUIRatio } from "../../styles/base";
import TextBoxVerified from "../textbox/TextBoxVerified";

const TextInputButton = (props) => {
  const {
    label,
    compulsory,
    verified,
    value,
    note,
    error,
    hideError,
    placeholder,
    maxCharacter,
    disabled,
    labelStyle,
    containerStyle,
    textContainerStyle,
    arrow,
    style,
  } = props;

  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress();
    }
  }

  return (
    <View style={[styles.container, containerStyle ? containerStyle : null]}>
      <TouchableOpacity
        onPress={() => onPress()}
        disabled={disabled}
        style={[
          styles.containerText,
          {
            backgroundColor: disabled
              ? colors.daclen_grey_light
              : verified
                ? colors.daclen_success_light
                : colors.white,
            borderColor: error
              ? colors.daclen_danger
              : colors.daclen_grey_placeholder,
          },
          textContainerStyle ? textContainerStyle : null,
        ]}
      >
        <View style={styles.containerVertical}>
          {label ? (
            <View style={[styles.containerHorizontal, { marginBottom: 1 }]}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.text,
                  { fontSize: (value ? 10 : 12) * globalUIRatio },
                  labelStyle ? labelStyle : null,
                ]}
              >
                {label}
              </Text>
              {compulsory ? (
                <Text allowFontScaling={false} style={styles.textCompulsory}>
                  *
                </Text>
              ) : null}
            </View>
          ) : null}
          <Text
            style={[
              styles.textInput,
              {
                color: verified
                  ? colors.buttonTextDisabled
                  : disabled
                    ? colors.grey_textinput_disabled
                    : colors.textBlack,
              },
              style ? style : null,
            ]}
            value={value}
          >
            {value ? value : placeholder ? placeholder : ""}
          </Text>
        </View>

        {error ? (
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20 * globalUIRatio}
            color={colors.daclen_danger}
            style={styles.arrow}
          />
        ) : verified ? (
          <TextBoxVerified />
        ) : (
          <MaterialCommunityIcons
            name={arrow ? arrow : "chevron-down"}
            size={20 * globalUIRatio}
            color={colors.daclen_grey_placeholder}
            style={styles.arrow}
          />
        )}
      </TouchableOpacity>

      {(note || error || maxCharacter) && !hideError ? (
        <View
          style={[
            styles.containerHorizontal,
            {
              marginTop: 2 * globalUIRatio,
              justifyContent:
                maxCharacter && !error ? "flex-end" : "flex-start",
            },
          ]}
        >
          {error ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.text,
                {
                  color: colors.daclen_danger,
                },
              ]}
            >
              {error}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginBottom: 20 * globalUIRatio,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerText: {
    borderRadius: (12 * dimensions.fullWidthAdjusted) / 430,
    paddingVertical: 4 * globalUIRatio,
    borderWidth: globalUIRatio / 2,
    height: (50 * dimensions.fullWidthAdjusted) / 430,
    borderColor: colors.daclen_box_grey,
    flexDirection: "row",
    alignItems: "center",
  },
  containerVertical: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal / 2,
    flex: 1,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 11 * globalUIRatio,
    fontFamily: "Poppins-Light",
  },
  text: {
    backgroundColor: "transparent",
    color: colors.black,
    fontSize: 12 * globalUIRatio,
    fontFamily: "Poppins",
    alignSelf: "center",
  },
  textCompulsory: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    color: colors.black,
    fontSize: 8 * globalUIRatio,
    fontFamily: "PlusJakartaSans-Medium",
  },
  arrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: staticDimensions.marginHorizontal / 2,
  },
});

export default TextInputButton;
