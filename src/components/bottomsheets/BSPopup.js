import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, globalUIRatio, staticDimensions } from "../../styles/base";
import Button from "../Button/Button";

const BSPopup = (props) => {
  const {
    title,
    content,
    closeText,
    closeTextColor,
    buttonText,
    buttonBackgroundColor,
    buttonCloseText,
    buttonCloseBorderColor,
    buttonCloseTextColor,
    buttonInverted,
    buttonDisabled,
    buttonLoading,
    hideClose,
    hideContentMarginTop,
    hideSeparator,
    titleStyle,
    headerSeparator,
  } = props;

  function closeThis() {
    if (!(props?.onClosePress === undefined || props?.onClosePress === null)) {
      props?.onClosePress();
    } else if (!(props?.closeThis === undefined || props?.closeThis === null)) {
      props?.closeThis();
    }
  }

  function onSecondaryPress() {
    if (
      props?.onSecondaryPress === undefined ||
      props?.onSecondaryPress === null
    ) {
      closeThis();
    } else {
      props?.onSecondaryPress();
    }
  }

  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {hideSeparator ? null : (
        <TouchableOpacity
          style={styles.containerSeparator}
          onPress={() => closeThis()}
        >
          <View style={styles.separator} />
        </TouchableOpacity>
      )}

      {title ? (
        <View
          style={[
            styles.containerHeader,
            {
              borderBottomWidth: !headerSeparator || closeText === undefined || closeText === null ? 0 : 1,
            },
          ]}
        >
          <Text style={[styles.textHeader, titleStyle ? titleStyle : null]}>
            {title}
          </Text>
          {hideClose &&
          (Platform.OS !== "ios" ||
            !(titleStyle === undefined || titleStyle === null)) ? null : (
            <TouchableOpacity onPress={() => closeThis()}>
              {closeText ? (
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textClose,
                    { color: closeTextColor ? closeTextColor : colors.danger },
                  ]}
                >
                  {closeText}
                </Text>
              ) : (
                <MaterialCommunityIcons
                  name="close"
                  color={colors.daclen_black}
                  size={18 * globalUIRatio}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      <View
        style={[
          styles.containerInside,
          hideContentMarginTop ? null : { marginTop: 20 * globalUIRatio },
        ]}
      >
        {content ? content : null}
      </View>

      {buttonText ? (
        <Button
          text={buttonText}
          onPress={() => onPress()}
          loading={buttonLoading}
          backgroundColor={
            buttonDisabled
              ? colors.grey_shadow
              : buttonBackgroundColor
                ? buttonBackgroundColor
                : colors.buttonPrimary
          }
          style={[styles.button, { marginBottom: buttonCloseText ? 0 : 40 }]}
          disabled={buttonDisabled}
          inverted={buttonInverted ? buttonInverted : false}
        />
      ) : null}
      {buttonCloseText ? (
        <Button
          inverted
          bordered
          text={buttonCloseText}
          borderColor={
            buttonCloseBorderColor
              ? buttonCloseBorderColor
              : colors.buttonBorder
          }
          fontColor={
            buttonCloseTextColor ? buttonCloseTextColor : colors.buttonPrimary
          }
          onPress={() => onSecondaryPress()}
          style={styles.buttonCancel}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: staticDimensions.maxScreenWidth,
    backgroundColor: colors.white,
    borderTopStartRadius: 40 * globalUIRatio,
    borderTopEndRadius: 40 * globalUIRatio,
  },
  containerInside: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
  },
  containerHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: staticDimensions.marginHorizontal,
    borderBottomColor: colors.grey_shadow,
  },
  containerSeparator: {
    backgroundColor: "transparent",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 18 * globalUIRatio,
    marginBottom: 24 * globalUIRatio,
  },
  separator: {
    backgroundColor: colors.daclen_grey_container_background,
    width: 200 * globalUIRatio,
    height: 6 * globalUIRatio, 
  },
  textHeader: {
    fontFamily: "Poppins-Bold",
    color: colors.daclen_black,
    fontSize: 18 * globalUIRatio,
    marginEnd: 10 * globalUIRatio,
    flex: 1,
  },
  textClose: {
    fontFamily: "Poppins-Light",
    color: colors.daclen_danger,
    fontSize: 11 * globalUIRatio,
  },
  button: {
    marginTop: 12,
    marginHorizontal: staticDimensions.marginHorizontal,
    height: 36,
  },
  buttonCancel: {
    marginHorizontal: staticDimensions.marginHorizontal,
    marginTop: 12,
    marginBottom: 40,
    height: 36,
  },
});

export default BSPopup;
