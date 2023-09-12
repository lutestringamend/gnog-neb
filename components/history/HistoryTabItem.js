import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/base";

export default function HistoryTabItem(props) {
  return (
    <TouchableOpacity
      onPress={props?.onPress}
      style={[
        styles.tabItem,
        {
          backgroundColor:
            props?.activeTab === props?.name
              ? props?.selectedColor === undefined ||
                props?.selectedColor === null
                ? colors.daclen_black
                : props?.selectedColor
              : props?.backgroundColor === undefined ||
                props?.backgroundColor === null
              ? colors.daclen_light
              : props?.backgroundColor,
          marginEnd:
            props?.marginEnd === undefined || props?.marginEnd === null
              ? 4
              : props?.marginEnd,
        },
        props?.style === undefined || props?.style === null
          ? null
          : props?.style,
      ]}
    >
      <MaterialCommunityIcons
        name={props?.icon}
        size={14}
        color={
          props?.activeTab === props?.name ||
          props?.backgroundColor !== undefined
            ? "white"
            : "black"
        }
        style={{ alignSelf: "center" }}
      />
      <Text
        style={[
          styles.text,
          props?.activeTab === props?.name
            ? { color: colors.daclen_light, fontFamily: "Poppins-Bold" }
            : props?.backgroundColor === undefined ||
              props?.backgroundColor === null
            ? null
            : { color: colors.daclen_light },
        ]}
      >
        {props?.title === undefined || props?.title === null
          ? props?.name
          : props?.title}
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
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 10,
    width: "100%",
  },
  text: {
    fontFamily: "Poppins", fontSize: 14,
    color: colors.daclen_black,
    marginStart: 8,
    textAlign: "center",
  },
});
