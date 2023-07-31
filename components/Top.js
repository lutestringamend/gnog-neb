import React, { useState } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} from "react-native";
import { colors } from "../styles/base";
import MediaKitFiles from "./mediakit/MediaKitFiles";
import Dashboard from "./dashboard/Dashboard";
import Home from "./home/Home";

const TabButton = (props) => {
  function onPress() {
    if (props?.setTab === undefined || props?.setTab === null) {
      return;
    }
    props?.setTab();
  }
  return (
    <TouchableHighlight
      onPress={() => onPress()}
      style={[
        styles.button,
        {
          backgroundColor: props?.isActive
            ? colors.daclen_bg_highlighted
            : colors.daclen_bg,
        },
      ]}
      underlayColor={colors.daclen_blue}
      disabled={props?.isActive}
    >
      <Text style={[styles.text, props?.isActive ? styles.textFocused : null]}>
        {props?.title}
      </Text>
    </TouchableHighlight>
  );
};

const Top = ({ token, currentUser }) => {
  const [tab, setTab] = useState("home");

  return (
    <View style={styles.container}>
      {tab === "mediakit" ? (
        <MediaKitFiles />
      ) : tab === "profile" ? (
        <Dashboard />
      ) : (
        <Home goDashboard={() => setTab("profile")} />
      )}
      <View style={styles.containerNav}>
        <TabButton
          tab={tab}
          key="home"
          title="BELANJA"
          isActive={tab === "home"}
          setTab={() => setTab("home")}
        />

        {token === null ||
        currentUser === null ||
        currentUser?.id === undefined ? null : (
          <TabButton
            tab={tab}
            key="mediakit"
            title={`MATERI\nPROMOSI`}
            isActive={tab === "mediakit"}
            setTab={() => setTab("mediakit")}
          />
        )}
        <TabButton
          tab={tab}
          key="profile"
          title="PROFIL"
          isActive={tab === "profile"}
          setTab={() => setTab("profile")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerNav: {
    width: "100%",
    backgroundColor: colors.daclen_bg,
    flexDirection: "row",
    elevation: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
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
