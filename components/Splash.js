import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import packageJson from "../package.json";
import { colors } from "../styles/base";

function SplashScreen(props) {
  const versionText = `Versi Aplikasi ${packageJson?.version}`;

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/splash.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.containerText}>
        {props?.errorText ? (
          <Text style={styles.textError}>{props?.errorText}</Text>
        ) : props?.loading ? (
          <ActivityIndicator size="small" color={colors.daclen_orange} />
        ) : null}
        <Text style={styles.textVersion}>{versionText}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_black_old,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 0,
    backgroundColor: "transparent",
  },
  containerText: {
    backgroundColor: "transparent",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 0,
    start: 0,
    zIndex: 1,
  },
  textError: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_orange,
    textAlign: "center",
    backgroundColor: "transparent",
    marginHorizontal: 20,
  },
  textVersion: {
    fontSize: 12,
    color: colors.daclen_yellow,
    textAlign: "center",
    marginVertical: 32,
    backgroundColor: "transparent",
  },
});

export default SplashScreen;
