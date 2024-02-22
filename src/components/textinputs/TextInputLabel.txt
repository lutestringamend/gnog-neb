import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import Checkbox from "../checkbox/Checkbox";
import TextBoxVerified from "../textbox/TextBoxVerified";

const height =  50 * dimensions.fullWidthAdjusted / 430;

const TextInputLabel = (props) => {
  const {
    label,
    active,
    compulsory,
    verified,
    showNotApplicable,
    secureTextEntry,
    inputMode,
    multiline,
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
    style,
    hideClose,
  } = props;
  //const [active, setActive] = useState(false);

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [notApplicable, setNotApplicable] = useState(false);

  useEffect(() => {
    if (notApplicable) {
      onChangeText("Not Applicable");
    } else if (!notApplicable && value === "Not Applicable") {
      onChangeText("");
    }
  }, [notApplicable]);

  function onChangeText(text) {
    if (!(props?.onChangeText === undefined || props?.onChangeText === null)) {
      props?.onChangeText(text);
    }
  }

  return (
    <View
      style={[
        styles.container,
        containerStyle ? containerStyle : null,
        { opacity: disabled ? 0.38 : 1 },
      ]}
    >
       {label ? (
            <View style={[styles.containerHorizontal, { marginBottom: 4 }]}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.text,
                  {
                    color: disabled
                      ? colors.daclen_button_disabled_grey
                      : colors.black,
                  },
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
      <View
        style={[
          styles.containerText,
          {
            backgroundColor:
              disabled || notApplicable
                ? colors.daclen_grey_light : active  ? colors.daclen_blue_textinput 
                : colors.white,
            borderColor:
              disabled || notApplicable
                ? colors.daclen_grey_placeholder : error ? colors.daclen_danger
                : active
                    ? colors.daclen_blue_light_border
                    : colors.daclen_grey_placeholder,
          },
          textContainerStyle ? textContainerStyle : null,
        ]}
      >
        <View style={styles.containerVertical}>
         
          <TextInput
            allowFontScaling={false}
            secureTextEntry={secureTextEntry && isPasswordSecure}
            editable={notApplicable || disabled || verified ? false : true}
            inputMode={inputMode ? inputMode : "text"}
            placeholder={placeholder ? placeholder : ""}
            placeholderTextColor={
              error ? colors.daclen_danger : colors.daclen_grey_placeholder
            }
            maxLength={
              maxCharacter ? maxCharacter : inputMode === "number" ? 14 : 100
            }
            multiline={multiline || maxCharacter > 30 ? true : false}
            style={[
              styles.textInput,
              {
                color: verified ? colors.buttonTextDisabled : colors.textBlack,
              },
              style ? style : null,
            ]}
            value={value ? value : ""}
            onChangeText={(text) => {
              onChangeText(text);
            }}
          />
        </View>

        {secureTextEntry ? <TouchableOpacity
           onPress={() =>
            setIsPasswordSecure((isPasswordSecure) => !isPasswordSecure)
          }
          >
            <MaterialCommunityIcons
              name={isPasswordSecure ? "eye" : "eye-off"}
              size={20}
              color={colors.daclen_black_old}
              style={styles.arrow}
            />
          </TouchableOpacity> : error ?
        <MaterialCommunityIcons
        name="alert-circle-outline"
        size={20}
        color={colors.daclen_danger}
        style={styles.arrow}
      />
        : verified ? (
          <TextBoxVerified />
        ) : !(value === null || value === "" || hideClose || disabled) ? (
          <TouchableOpacity
            onPress={() => {
              onChangeText("");
            }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={colors.daclen_black_old}
              style={styles.arrow}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {(note || error || maxCharacter) && !hideError ? (
        <View
          style={[
            styles.containerHorizontal,
            {
              marginTop: 4,
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
                  color: error ? colors.daclen_danger : colors.daclen_black_old,
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
    borderRadius: 12,
    borderWidth: 0.5,
    height,
    borderColor: colors.daclen_grey_placeholder,
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
    fontSize: 12,
    fontFamily: "Poppins-Light",
  },
  text: {
    backgroundColor: "transparent",
    color: colors.black,
    fontSize: 12,
    fontFamily: "Poppins",
    alignSelf: "center",
  },
  textCompulsory: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    color: colors.daclen_danger,
    fontSize: 8,
    fontFamily: "Poppins",
  },
  arrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: staticDimensions.marginHorizontal,
  },
});

export default TextInputLabel;
