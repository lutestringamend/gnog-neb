import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions } from "../../styles/base";

export default function UserRootHeaderItem({
  title,
  content,
  icon,
  color,
  backgroundColor,
}) {
  return (
    <View
      style={[
        styles.containerHorizontal,
        {
          backgroundColor: backgroundColor
            ? backgroundColor
            : colors.daclen_light,
        },
      ]}
    >
      <View style={styles.container}>
        <Text
          style={{ fontSize: 12, fontWeight: "bold", color: color ? color : colors.daclen_gray }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: color ? color : colors.daclen_gray,
            marginTop: 6,
          }}
        >
          {content ? content : "0"}
        </Text>
      </View>
      <View style={styles.containerIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={40}
          color={color ? color : colors.daclen_gray}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerHorizontal: {
    flex: 1,
    maxWidth:
      "100%" / 2 - dimensions.dashboardBoxHorizontalMargin * 2,
    marginHorizontal: dimensions.dashboardBoxHorizontalMargin,
    borderRadius: 4,
    justifyContent: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "stretch",
  },
  container: {
    flex: 2,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    margin: 10,
  },
  containerIcon: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});
