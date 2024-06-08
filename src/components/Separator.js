import React from "react";
import { View } from "react-native";
import { colors, globalUIRatio } from "../styles/base";

export default function Separator({ color, thickness, style }) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style ? style : null ]}>
      <View
        style={{ flex: 1, width: "100%", height: thickness * globalUIRatio, backgroundColor: color ? color : colors.daclen_grey_shadow }}
      />
    </View>
  );
}
