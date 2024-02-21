import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, staticDimensions } from "../../styles/base";
import Checkbox from "../checkbox/Checkbox";
import TextBoxVerified from "../textbox/TextBoxVerified";

const TextInputButton = (props) => {
  const {
    label,
    compulsory,
    verified,
    showNotApplicable,
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
  const [notApplicable, setNotApplicable] = useState(false);

  useEffect(() => {
    if (notApplicable) {
      setText("Not Applicable");
    } else if (!notApplicable && value === "Not Applicable") {
      setText("");
    }
  }, [notApplicable]);

  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress();
    }
  }

  return (
    <View style={[styles.container, containerStyle ? containerStyle : null]}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[
          styles.containerText,
          {
            backgroundColor:
              disabled || notApplicable || verified
                ? colors.grey_textinput_disabled
                : colors.white,
            borderColor: error
              ? colors.danger
              : disabled || notApplicable || verified
                ? colors.grey_textinput_border
                : colors.grey_box,
          },
          textContainerStyle ? textContainerStyle : null,
        ]}
      >
        <View style={styles.containerVertical}>
          {label && !(value === null || value === "") ? (
            <View style={[styles.containerHorizontal, { marginBottom: 2 }]}>
              <Text
                allowFontScaling={false}
                style={[styles.text, labelStyle ? labelStyle : null]}
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
                  : notApplicable || disabled
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

        {verified ? (
          <TextBoxVerified />
        ) : (
          <MaterialCommunityIcons
            name={arrow ? arrow : "chevron-down"}
            size={16}
            color={colors.grey_box}
            style={styles.arrow}
          />
        )}
      </TouchableOpacity>

      {(note || error || maxCharacter) && !hideError ? (
        <View
          style={[
            styles.containerHorizontal,
            {
              marginTop: 2,
              justifyContent:
                maxCharacter && !error ? "flex-end" : "flex-start",
            },
          ]}
        >
          {note || error ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.text,
                {
                  color: error ? colors.danger : colors.bottomNavInactive,
                  flex: 1,
                },
              ]}
            >
              {error ? error : note}
            </Text>
          ) : null}

          {maxCharacter ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.text,
                {
                  textAlign: "right",
                  color: error ? colors.danger : colors.bottomNavInactive,
                },
                labelStyle ? labelStyle : null,
              ]}
            >
              {`${
                value ? (value?.length ? value?.length : "0") : "0"
              }/${maxCharacter}`}
            </Text>
          ) : null}
        </View>
      ) : null}
      {showNotApplicable ? (
        <View style={[styles.containerHorizontal, { marginTop: 6 }]}>
          <Checkbox
            width={12}
            height={12}
            active={notApplicable}
            onPress={() => setNotApplicable((notApplicable) => !notApplicable)}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.text,
              { marginStart: 6 },
              labelStyle ? labelStyle : null,
            ]}
          >
            {"Not Applicable"}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerText: {
    borderRadius: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    height: 50,
    borderColor: colors.grey_separator,
    flexDirection: "row",
    alignItems: "center",
  },
  containerVertical: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
    flex: 1,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  text: {
    backgroundColor: "transparent",
    color: colors.bottomNavInactive,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "PlusJakartaSans-Regular",
    alignSelf: "center",
  },
  textCompulsory: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    color: colors.danger,
    fontSize: 8,
    fontFamily: "PlusJakartaSans-Medium",
  },
  arrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: staticDimensions.marginHorizontal,
  },
});

export default TextInputButton;
