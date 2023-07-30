import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Platform,
} from "react-native";
import { colors } from "../styles/base";
import MediaKitFiles from "./dashboard/MediaKitFiles";
import Dashboard from "./dashboard/Dashboard";
import Home from "./home/Home";

const Top = ({ token, currentUser }) => {
  const [tab, setTab] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      {tab === "mediakit" ? (
        <MediaKitFiles />
      ) : tab === "profile" ? (
        <Dashboard />
      ) : (
        <Home />
      )}
      <View
        style={[
          styles.containerNav,
          Platform.OS === "web" ? styles.containerNavWeb : null,
        ]}
      >
        <TouchableHighlight
          onPress={() => setTab(null)}
          style={[
            styles.button,
            {
              backgroundColor:
                tab === null ? colors.daclen_bg_highlighted : colors.daclen_bg,
            },
          ]}
          underlayColor={colors.daclen_light}
        >
          <Text style={[styles.text, tab === null ? styles.textFocused : null]}>
            BELANJA
          </Text>
        </TouchableHighlight>
        {token === null ||
        currentUser === null ||
        currentUser?.id === undefined ? null : (
          <TouchableHighlight
            onPress={() => setTab("mediakit")}
            style={[
              styles.button,
              {
                backgroundColor:
                  tab === "mediakit"
                    ? colors.daclen_bg_highlighted
                    : colors.daclen_bg,
              },
            ]}
            underlayColor={colors.daclen_light}
          >
            <Text
              style={[
                styles.text,
                tab === "mediakit" ? styles.textFocused : null,
              ]}
            >
              {"MATERI\nPROMOSI"}
            </Text>
          </TouchableHighlight>
        )}
        <TouchableHighlight
          onPress={() => setTab("profile")}
          style={[
            styles.button,
            {
              backgroundColor:
                tab === "profile"
                  ? colors.daclen_bg_highlighted
                  : colors.daclen_bg,
            },
          ]}
          underlayColor={colors.daclen_light}
        >
          <Text
            style={[styles.text, tab === "profile" ? styles.textFocused : null]}
          >
            PROFIL
          </Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_bg,
  },
  containerNav: {
    width: "100%",
    backgroundColor: colors.daclen_bg,
    flexDirection: "row",
    elevation: 4,
  },
  containerNavWeb: {
    position: "absolute",
    bottom: 0,
    start: 0,
    zIndex: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "transparent",
    color: colors.daclen_light,
  },
  textFocused: {
    fontWeight: "bold",
    color: colors.white,
  },
});

export default Top;
