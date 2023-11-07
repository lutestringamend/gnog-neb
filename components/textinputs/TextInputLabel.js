import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/base";
/*import Checkbox from "../checkbox/Checkbox";
import { ADDRESS_NOT_APPLICABLE_LABEL } from "../../constants/strings";*/
import TextBoxVerified from "./TextBoxVerified";

const TextInputLabel = (props) => {
  const {
    label,
    compulsory,
    verified,
    showNotApplicable,
    secureTextEntry,
    inputMode,
    value,
    error,
    placeholder,
    maxCharacter,
    disabled,
    labelStyle,
    containerStyle,
    textContainerStyle,
    style,
    rightArrow,
  } = props;
  const [notApplicable, setNotApplicable] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  useEffect(() => {
    if (notApplicable && value !== "") {
      setText("Tidak berlaku");
    } else if (!notApplicable && value === "Tidak berlaku") {
      setText("");
    }
  }, [notApplicable]);

  function onChangeText(text) {
    if (!(props?.onChangeText === undefined || props?.onChangeText === null)) {
      props?.onChangeText(text);
    }
  }

  function onEndEditing() {
    if (!(props?.onEndEditing === undefined || props?.onEndEditing === null)) {
      props?.onEndEditing();
    }
  }

  return (
    <View style={[styles.container, containerStyle ? containerStyle : null]}>
      {label ? (
        <View style={[styles.containerHorizontal, { marginBottom: 6 }]}>
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

      <View
        style={[
          styles.containerText,
          {
            backgroundColor:
              disabled || notApplicable || verified
                ? colors.daclen_lightgrey
                : colors.white,
            borderColor: error
              ? colors.daclen_danger
              : disabled || notApplicable || verified
              ? colors.daclen_lightgrey
              : colors.daclen_box_grey,
          },
          textContainerStyle ? textContainerStyle : null,
        ]}
      >
        <TextInput
          allowFontScaling={false}
          secureTextEntry={secureTextEntry && isPasswordSecure}
          editable={notApplicable || disabled || verified ? false : true}
          inputMode={inputMode ? inputMode : "text"}
          placeholder={placeholder ? placeholder : ""}
          placeholderTextColor={colors.daclen_lightgrey}
          maxLength={
            maxCharacter ? maxCharacter : inputMode === "number" ? 14 : 100
          }
          onEndEditing={() => onEndEditing()}
          multiline={maxCharacter > 30 ? true : false}
          style={[
            styles.textInput,
            {
              color: verified
                ? colors.daclen_gray
                : notApplicable || disabled
                ? colors.daclen_lightgrey
                : colors.daclen_label_grey,
            },
            style ? style : null,
          ]}
          value={value ? value : ""}
          onChangeText={(text) => onChangeText(text)}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() =>
              setIsPasswordSecure((isPasswordSecure) => !isPasswordSecure)
            }
          >
            <MaterialCommunityIcons
              name={isPasswordSecure ? "eye-off" : "eye"}
              size={16}
              color={colors.daclen_box_grey}
              style={styles.arrow}
            />
          </TouchableOpacity>
        ) : verified ? (
          <TextBoxVerified />
        ) : rightArrow ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color={colors.daclen_box_grey}
            style={styles.arrow}
          />
        ) : null}
      </View>

      {maxCharacter ? (
        <View
          style={[
            styles.containerHorizontal,
            { marginTop: 6, justifyContent: "flex-end" },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.text,
              { textAlign: "right" },
              labelStyle ? labelStyle : null,
            ]}
          >
            {`${
              value ? (value?.length ? value?.length : "0") : "0"
            }/${maxCharacter}`}
          </Text>
        </View>
      ) : null}
      {error ? (
        <View style={[styles.containerHorizontal, { marginTop: 6 }]}>
          <Text
            allowFontScaling={false}
            style={[styles.text, { color: colors.daclen_danger }]}
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

/*


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
            {ADDRESS_NOT_APPLICABLE_LABEL}
          </Text>
        </View>
      ) : null}
*/

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
    borderRadius: 4,
    paddingVertical: 4,
    borderWidth: 1,
    height: 40,
    borderColor: colors.daclen_box_grey,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    marginHorizontal: 8,
    backgroundColor: "transparent",
    fontSize: 14,
    fontFamily: "Poppins",
    alignSelf: "center",
    flex: 1,
  },
  text: {
    backgroundColor: "transparent",
    color: colors.daclen_label_grey,
    fontSize: 12,
    fontFamily: "Poppins",
    alignSelf: "center",
  },
  textCompulsory: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    color: colors.daclen_label_grey,
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
  },
  arrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 10,
  },
});

export default TextInputLabel;
