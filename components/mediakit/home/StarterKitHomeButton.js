import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { colors } from "../../../styles/base";
import {
  STARTER_KIT_DEFAULT_FONT_SIZE,
  STARTER_KIT_DEFAULT_ICON_HEIGHT,
  STARTER_KIT_DEFAULT_ICON_WIDTH,
} from "../constants";

const StarterKitHomeButton = (props) => {
  const { text, icon, style, fontSize, disabled } = props;
  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  if (disabled) {
    return <View style={[styles.containerBlank, style ? style : null]} />
  }

  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.container, style ? style : null]}
      disabled={disabled ? disabled : false}
    >
      {icon ? (
        <Image
          source={icon}
          resizeMode="contain"
          style={[
            styles.image,
            {
              width: fontSize
                ? Math.round(
                    (fontSize / STARTER_KIT_DEFAULT_FONT_SIZE) *
                      STARTER_KIT_DEFAULT_ICON_WIDTH
                  )
                : STARTER_KIT_DEFAULT_ICON_WIDTH,
              height: fontSize
                ? Math.round(
                    (fontSize / STARTER_KIT_DEFAULT_FONT_SIZE) *
                      STARTER_KIT_DEFAULT_ICON_HEIGHT
                  )
                : STARTER_KIT_DEFAULT_ICON_HEIGHT,
            },
          ]}
        />
      ) : null}
      <Text
        allowFontScaling={false}
        style={[
          styles.text,
          { fontSize: fontSize ? fontSize : STARTER_KIT_DEFAULT_FONT_SIZE },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerBlank: {
    flex: 1,
    backgroundColor: "transparent",
    height: 160,
  },
  container: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    height: 160,
  },
  image: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  text: {
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_black,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 10,
  },
});

export default StarterKitHomeButton;
