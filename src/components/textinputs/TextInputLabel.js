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
/*import Checkbox from "../checkbox/Checkbox";
import { ADDRESS_NOT_APPLICABLE_LABEL } from "../../constants/strings";*/
import TextBoxVerified from "../textbox/TextBoxVerified";

const TextInputLabel = (props) => {
  const {
    label,
    compulsory,
    verified,
    shortVerified,
    showNotApplicable,
    secureTextEntry,
    inputMode,
    value,
    error,
    notes,
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
              disabled || notApplicable
                ? colors.daclen_grey_light : verified ? colors.daclen_success_light 
                : colors.white,
            borderColor: error
              ? colors.daclen_danger
              : colors.daclen_grey_placeholder,
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
          placeholderTextColor={colors.daclen_grey_placeholder}
          maxLength={
            maxCharacter ? maxCharacter : inputMode === "decimal" ? 14 : 100
          }
          onEndEditing={() => onEndEditing()}
          multiline={maxCharacter > 30 ? true : false}
          style={[
            styles.textInput,
            {
              color: verified
                ? colors.daclen_grey_placeholder
                : notApplicable || disabled
                ? colors.daclen_
                : colors.daclen_label_grey,
            },
            style ? style : null,
          ]}
          value={value ? value : ""}
          onChangeText={(text) => onChangeText(text)}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.containerEye}
            onPress={() =>
              setIsPasswordSecure((isPasswordSecure) => !isPasswordSecure)
            }
          >
            <MaterialCommunityIcons
              name={isPasswordSecure ? "eye" : "eye-off"}
              size={20}
              color={colors.daclen_grey_placeholder}
              style={{
                backgroundColor: "transparent",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        ) : error ? (<MaterialCommunityIcons
          name="alert-circle-outline"
          size={20}
          color={colors.daclen_danger}
          style={styles.check}
        /> ) : verified ? (
          shortVerified ? (
            <MaterialCommunityIcons
              name="check-bold"
              size={20}
              color={colors.daclen_success}
              style={styles.check}
            />
          ) : (
            <TextBoxVerified isShort={shortVerified} />
          )
        ) : rightArrow ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.daclen_grey_placeholder}
            style={styles.arrow}
          />
        ) : null}
      </View>

      {notes || error || maxCharacter ? (
        <View
          style={[
            styles.containerHorizontal,
            {
              marginTop: 6,
              justifyContent:
                maxCharacter && !error ? "flex-end" : "flex-start",
            },
          ]}
        >
          {error ? (
            <Text
              allowFontScaling={false}
              style={[styles.text, { color: colors.daclen_danger, flex: 1 }]}
            >
              {error}
            </Text>
          ) : notes ? 
          <Text
              allowFontScaling={false}
              style={[styles.text, { flex: 1 }]}
            >
              {notes}
            </Text>
          : null}

          {maxCharacter ? (
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
          ) : null}
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
    marginBottom: staticDimensions.marginHorizontal,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerText: {
    borderRadius: 12 * dimensions.fullWidthAdjusted / 430,
    paddingVertical: 4,
    borderWidth: 0.5,
    height: 50 * dimensions.fullWidthAdjusted / 430,
    borderColor: colors.daclen_box_grey,
    flexDirection: "row",
    alignItems: "center",
  },
  containerEye: {
    alignSelf: "center",
    marginEnd: 10,
  },
  textInput: {
    marginHorizontal: 8,
    backgroundColor: "transparent",
    fontSize: 12,
    fontFamily: "Poppins-Light",
    alignSelf: "center",
    flex: 1,
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
    color: colors.daclen_label_grey,
    fontSize: 8,
    fontFamily: "Poppins-SemiBold",
  },
  arrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 10,
  },
  check: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginHorizontal: 10,
  },
});

export default TextInputLabel;
