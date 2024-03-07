import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, dimensions } from "../../styles/base";

const ratio = dimensions.fullWidthAdjusted / 430;

const TabItem = (props) => {
  const { item, activeTab, disabled } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity
      style={[
        styles.tabItem,
        item === activeTab ? { borderBottomWidth: 1 } : null,
      ]}
      onPress={() => onPress()}
      disabled={disabled || item === activeTab}
    >
      <Text allowFontScaling={false} style={styles.text}>
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomColor: colors.white,
    height: "100%",
  },
  text: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * ratio,
    color: colors.white,
  },
});
