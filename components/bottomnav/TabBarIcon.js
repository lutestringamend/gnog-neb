import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
//import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { bottomNav, colors } from "../../styles/base";

export default function TabBarIcon(props) {
  const { focused, title, isLogin } = props;
  const screenWidth = Dimensions.get("window").width;

  if (focused) {
    return (
      <ImageBackground
        source={require("../../assets/buttonfocused.png")}
        resizeMode="stretch"
        style={[
          styles.backgroundFocused,
          { width: isLogin ? screenWidth / 3 : screenWidth / 2 },
        ]}
      >
        <Text allowFontScaling={false} style={[styles.textFocused, { width: isLogin ? screenWidth / 3 : screenWidth / 2 }]}>{title}</Text>
      </ImageBackground>
    );
  }

  return (
    <View
      style={[
        styles.backgroundFocused,
        { width: isLogin ? screenWidth / 3 : screenWidth / 2 },
      ]}
    >
      <Text allowFontScaling={false} style={[styles.text, { width: isLogin ? screenWidth / 3 : screenWidth / 2 }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundFocused: {
    paddingHorizontal: 6,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    zIndex: 0,
    top: -16,
  },
  text: {
    height: 60,
    fontSize: bottomNav.fontSize,
    color: bottomNav.color,
    fontFamily: "Poppins",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: Platform.OS === "ios" ? 48 : 24,
    zIndex: 6,
  },
  textFocused: {
    height: 60,
    fontSize: bottomNav.fontSize,
    color: bottomNav.focusedColor,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: Platform.OS === "ios" ? 48 : 24,
    zIndex: 6,
  },
});

/*
      <MaterialCommunityIcons
        name={props?.iconName}
        color={props?.focused ? bottomNav.focusedColor : bottomNav.color}
        size={bottomNav.iconSize}
      />
*/
