import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { bottomNav, dimensions } from "../../styles/base";

export default function TabBarIcon(props) {
  const { focused, title, iconName, style } = props;

  return (
    <View style={[styles.container, style ? style : null]}>
      <MaterialCommunityIcons
        name={iconName}
        size={bottomNav.iconSize}
        color={focused ? bottomNav.activeColor : bottomNav.inactiveColor}
      />
      <Text
        allowFontScaling={false}
        style={[
          styles.text,
          { color: focused ? bottomNav.activeColor : bottomNav.inactiveColor },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 56 * dimensions.fullWidthAdjusted / 430,
    backgroundColor: "transparent",
    height: 42 * dimensions.fullWidthAdjusted / 430,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: bottomNav.paddingVertical,
  },
  text: {
    fontSize: bottomNav.fontSize,
    color: bottomNav.color,
    fontFamily: bottomNav.fontFamily,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

/*
      <MaterialCommunityIcons
        name={props?.iconName}
        color={props?.focused ? bottomNav.focusedColor : bottomNav.color}
        size={bottomNav.iconSize}
      />
*/
