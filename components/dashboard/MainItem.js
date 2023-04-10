import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { colors, dimensions } from "../../styles/base";

export default function MainItem(props) {
  function buttonPress() {
    props?.onButtonPress(props?.title);
  }

  return (
    <TouchableHighlight
      onPress={() => buttonPress()}
      underlayColor={
        props?.underlayColor ? props?.underlayColor : colors.daclen_light
      }
      style={styles.touchableContainer}
    >
      <View style={styles.containerHorizontal}>
        <View style={styles.container}>
          <Text
            style={[
              styles.text,
              { color: props?.color ? props?.color : colors.daclen_light },
            ]}
          >
            {props?.title}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: props?.fontSize ? props?.fontSize : 24,
                color: props?.color ? props?.color : colors.daclen_light,
                marginTop: 6,
              },
            ]}
          >
            {props?.content}
          </Text>
        </View>
        <View style={styles.containerIcon}>
        <MaterialCommunityIcons
              name={props?.icon}
              size={40}
              color={props?.color ? props?.color : colors.daclen_light}
            />
        </View>
      </View>
    </TouchableHighlight>
  );
}

/*
{props?.fontawesome !== undefined && props?.fontawesome !== null ? (
            <FontAwesomeIcon
              icon={props?.fontawesome}
              color={props?.color ? props?.color : colors.daclen_light}
              size="2x"
            />
          ) : (
            <MaterialCommunityIcons
              name={props?.icon}
              size={36}
              color={props?.color ? props?.color : colors.daclen_light}
            />
          )}
*/

const styles = StyleSheet.create({
  touchableContainer: {
    flex: 1,
    maxWidth: (dimensions.fullWidth / 2) - (dimensions.dashboardBoxHorizontalMargin * 2),
    marginHorizontal: dimensions.dashboardBoxHorizontalMargin,
    borderWidth: 1,
    borderColor: colors.daclen_light,
    borderRadius: 4,
    backgroundColor: colors.daclen_black,
    justifyContent: "center",
  },
  containerHorizontal: {
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
  text: {
    color: colors.daclen_light,
    fontSize: 12,
    fontWeight: "bold",
  },
});
