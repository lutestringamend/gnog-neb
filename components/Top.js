import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  Platform,
  Dimensions,
} from "react-native";
import { colors, dimensions } from "../styles/base";
import MediaKitFiles from "./mediakit/MediaKitFiles";
import Dashboard from "./dashboard/Dashboard";
import Home from "./home/Home";

const screenWidth = Dimensions.get("window").width;

const TabButton = (props) => {
  function onPress() {
    if (props?.setTab === undefined || props?.setTab === null) {
      return;
    }
    props?.setTab();
  }
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.button, {
        width: props?.isLogin ? screenWidth / 3 : screenWidth / 2,
      }]}
      disabled={props?.isActive}
    >
      <View style={styles.button}>
        {props?.isActive ? (
          <ImageBackground
            source={require("../assets/buttonfocused.png")}
            resizeMode="stretch"
            style={[styles.backgroundFocused, {
              width: props?.isLogin ? screenWidth / 3 : screenWidth / 2,
            }]}
          >
            <Text allowFontScaling={false} style={styles.textFocused}>
              {props?.title}
            </Text>
          </ImageBackground>
        ) : (
          <View style={styles.containerTextNormal}><Text allowFontScaling={false} style={styles.text}>
          {props?.title}
        </Text></View>
          
        )}
      </View>
    </TouchableOpacity>
  );
};

const Top = ({ token, currentUser, recruitmentTimer }) => {
  const [tab, setTab] = useState("home");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            Platform.OS === "web" ? colors.daclen_bg : "transparent",
        },
      ]}
    >
      {tab === "mediakit" ? (
        <MediaKitFiles />
      ) : tab === "profile" ? (
        <Dashboard recruitmentTimer={recruitmentTimer} />
      ) : (
        <Home goDashboard={() => setTab("profile")} />
      )}
      <View
        style={[
          styles.containerNav,
          ,
          Platform.OS === "web" && {
            position: "absolute",
            zIndex: 12,
            start: 0,
            top: dimensions.fullHeight - 60,
          },
        ]}
      >
        <TabButton
          tab={tab}
          key="home"
          title="BELANJA"
          isActive={tab === "home"}
          setTab={() => setTab("home")}
          isLogin={!(token === null || currentUser === null)}
        />

        {token === null ||
        currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.isActive === undefined ||
        currentUser?.isActive === null ||
        !currentUser?.isActive ? null : (
          <TabButton
            tab={tab}
            key="mediakit"
            title={`STARTER KIT`}
            isActive={tab === "mediakit"}
            setTab={() => setTab("mediakit")}
            isLogin={!(token === null || currentUser === null)}
          />
        )}
        <TabButton
          tab={tab}
          key="profile"
          title="PROFIL"
          isActive={tab === "profile"}
          setTab={() => setTab("profile")}
          isLogin={!(token === null || currentUser === null)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    backgroundColor: "transparent",
  },
  containerNav: {
    width: screenWidth,
    backgroundColor: colors.daclen_bg,
    flexDirection: "row",
    elevation: 4,
  },
  button: {
    flex: 1,
    backgroundColor: "transparent",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTextNormal: {
    backgroundColor: "transparent",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundFocused: {
    height: 60,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 14,
    backgroundColor: colors.daclen_bg,
    color: colors.daclen_light,
    paddingHorizontal: 12,
    elevation: 2,
    zIndex: 2,
  },
  textFocused: {
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.white,
    zIndex: 2,
    elevation: 2,
  },
});

export default Top;
