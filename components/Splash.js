import React from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";

import packageJson from "../package.json";
import { colors } from "../styles/base";

function SplashScreen(props) {
  const versionText = `Versi Aplikasi ${packageJson?.version}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require("../assets/splash.png")}
          style={{ width: 225, height: 60 }}
        />
      </View>

      <Text style={styles.version}>
        {props?.errorText === undefined ? versionText : props?.errorText}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_black,
    alignItems: "center",
    justifyContent: "center",
  },
  containerLogo: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  version: {
    flex: 1,
    fontSize: 12,
    color: colors.daclen_yellow,
    textAlign: "center",
  },
});

export default SplashScreen;
