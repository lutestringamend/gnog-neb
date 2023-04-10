import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../../styles/base";

export default function HistoryTabItem(props) {
  return (
    <TouchableOpacity
      onPress={props?.onPress}
      style={[
        styles.tabItem,
        props?.activeTab === props?.name
          ? { backgroundColor: colors.daclen_black, borderRadius: 8 }
          : null,
      ]}
    >
      <MaterialCommunityIcons
          name={props?.icon}
          size={14}
          color={
            props?.activeTab === props?.name
              ? "white"
              : "black"
          }
          style={{ alignSelf: "center" }}
        />
        <Text
          style={[
            styles.text,
            props?.activeTab === props?.name
              ? { color: colors.daclen_light, fontWeight: "bold" }
              : null,
          ]}
        >
          {props?.name}
        </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.daclen_light,
    paddingHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 10,
    width: "100%",
  },
  text: {
    fontSize: 14,
    color: colors.daclen_black,
    marginStart: 8,
    textAlign: "center",
  },
});
