import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors, dimensions, staticDimensions } from "../../styles/base";

const ratio = dimensions.fullWidthAdjusted / 430;

const HistoryHiddenView = (props) => {
  const {
    leftText,
    rightText,
    leftDisabled,
    rightDisabled,
    leftTextColor,
    rightTextColor,
  } = props;

  function onLeftPress() {
    if (props?.onLeftPress === undefined || props?.onLeftPress === null) {
      return;
    }
    props?.onLeftPress();
  }

  function onRightPress() {
    if (props?.onRightPress === undefined || props?.onRightPress === null) {
      return;
    }
    props?.onRightPress();
  }

  return (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.button}
        disabled={leftDisabled}
        onPress={() => onLeftPress()}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.textHiddenButton,
            leftTextColor ? { color: leftTextColor } : null,
          ]}
        >
          {leftText ? leftText : "Detail"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onRightPress()}
        style={styles.button}
        disabled={rightDisabled}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.textHiddenButton,
            rightTextColor ? { color: rightTextColor } : null,
          ]}
        >
          {rightText ? rightText : "Hapus"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: staticDimensions.marginHorizontal,
    width: dimensions.fullWidthAdjusted,
    height: 140 * ratio,
  },
  button: {
    justifyContent: "center",
    height: 140 * ratio,
    marginHorizontal: 10 * ratio,
    backgroundColor: "transparent",
  },
  textHiddenButton: {
    fontSize: 12 * ratio,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
});

export default HistoryHiddenView;
