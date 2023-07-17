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
      <View style={styles.containerLogo}>
        <Image
          source={require("../assets/splash.png")}
          style={{ width: 225, height: 60 }}
        />
      </View>

      <View style={styles.containerText}>
        {props?.errorText ? (
          <Text style={styles.textError}>{props?.errorText}</Text>
        ) : props?.loading ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_orange}
            style={styles.spinner}
          />
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
    backgroundColor: colors.daclen_black,
    alignItems: "center",
    justifyContent: "center",
  },
  containerLogo: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  containerText: {
    flex: 1,
  },
  textError: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_orange,
    textAlign: "center",
    marginBottom: 20,
  },
  textVersion: {
    fontSize: 12,
    color: colors.daclen_yellow,
    textAlign: "center",
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

export default SplashScreen;
