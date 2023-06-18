import React from "react";
import { Linking, SafeAreaView } from "react-native";
//import { colors } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";
import { websaldo } from "../../axios/constants";

const SaldoReport = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <ErrorView
          error="Mohon membuka website Daclen untuk membaca Laporan Saldo"
          onOpenExternalLink={() => Linking.openURL(websaldo)}
        />
    </SafeAreaView>
  );
};

export default SaldoReport;
