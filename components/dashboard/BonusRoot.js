import React from "react";
import { SafeAreaView, Text } from "react-native";
import { colors } from "../../styles/base";

const BonusRoot = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.daclen_indigo,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.daclen_light }}>SYARAT BONUS ROOT</Text>
    </SafeAreaView>
  );
};

export default BonusRoot;
