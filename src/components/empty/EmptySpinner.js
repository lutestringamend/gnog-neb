import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { colors, dimensions } from "../../styles/base";

const EmptySpinner = ({ minHeight }) => {
  return (
    <View
      style={[
        styles.containerEmptyPromotions,
        { minHeight: minHeight ? minHeight : dimensions.fullHeight * 0.75 },
      ]}
    >
      <ActivityIndicator size="large" color={colors.daclen_button_disabled_grey} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerEmptyPromotions: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default EmptySpinner;
