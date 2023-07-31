import React from "react";
import { View, Text } from "react-native";
//import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { bottomNav } from "../../styles/base";

export default function TabBarIcon(props) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>

      <Text
        style={{
          fontSize: bottomNav.fontSize,
          color: props?.focused ? bottomNav.focusedColor : bottomNav.color,
          fontWeight: props?.focused ? "bold" : "normal",
        }}
      >
        {props?.title}
      </Text>
    </View>
  );
}

/*
      <MaterialCommunityIcons
        name={props?.iconName}
        color={props?.focused ? bottomNav.focusedColor : bottomNav.color}
        size={bottomNav.iconSize}
      />
*/
