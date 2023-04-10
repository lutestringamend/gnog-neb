import React from "react";
import { View } from "react-native";
import { colors } from "../../styles/base";

export default function Separator(props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{ flex: 1, height: props?.thickness, backgroundColor: colors.daclen_light }}
      />
    </View>
  );
}
