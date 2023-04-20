import React from "react";
import { SafeAreaView, Text } from "react-native";
import { colors } from "../../styles/base";

const SaldoReport = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.daclen_reddishbrown,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.daclen_light }}>SALDO REPORT</Text>
    </SafeAreaView>
  );
};

export default SaldoReport;
