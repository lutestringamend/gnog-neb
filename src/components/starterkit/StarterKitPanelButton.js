import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions } from "../../styles/base";

const width = 110 * dimensions.fullWidthAdjusted / 430;
const containerSize = 30 * dimensions.fullWidthAdjusted / 430;


const StarterKitPanelButton = (props) => {
  const { icon, text, disabled } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled}
      style={styles.containerItem}
    >
      {icon ? (
        <View style={styles.containerImage}>
         <MaterialCommunityIcons
            name={icon}
            size={20 * dimensions.fullWidthAdjusted / 430}
            color={colors.black}
          />
        </View>
      ) : null}
      <Text
        allowFontScaling={false}
        style={styles.textName}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    backgroundColor: "transparent",
    alignItems: "center",
    flex: 1,
    width,
  },
  containerImage: {
    width: containerSize,
    height: containerSize,
    backgroundColor: colors.daclen_grey_container,
    borderRadius: 6 * dimensions.fullWidthAdjusted / 430,
    justifyContent: "center",
    alignItems: "center",
  },
  textName: {
    width,
    fontFamily: "Poppins-Light",
    fontSize: 10 * dimensions.fullWidthAdjusted / 430,
    color: colors.black,
    textAlign: "center",
    marginTop: 6,
    backgroundColor: "transparent",
  },
});

export default StarterKitPanelButton;
