import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../styles/base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export function VerticalLine({ style }) {
  return <View style={[styles.verticalLine, style]} />;
}

const BonusRootItem = ({
  title,
  content,
  isParent,
  color,
  isLastItem,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {isParent ? null : (
        <VerticalLine
          style={{
            height: isLastItem ? "51%" : "100%",
            backgroundColor:
              color === undefined || color === null ? colors.daclen_red : color,
          }}
        />
      )}
      {isParent ? null : (
        <View
          style={[
            styles.horizontalLine,
            {
              backgroundColor:
                color === undefined || color === null
                  ? colors.daclen_red
                  : color,
            },
          ]}
        />
      )}

      <TouchableOpacity
        onPress={() =>
          onPress === undefined ? console.log(title, content) : onPress()
        }
        style={[
          styles.containerTouchable,
          {
            marginVertical: isParent ? 0 : 12,
            borderRadius: isParent ? 0 : 6,
            borderTopStartRadius: 6,
            borderTopEndRadius: 6,
          },
        ]}
      >
        <View
          style={[
            styles.containerMain,
            {
              borderColor:
                color === undefined || color === null
                  ? colors.daclen_red
                  : color,
              borderRadius: 6,
              borderBottomStartRadius: isParent ? 0 : 6,
              borderWidth: isParent ? 2 : 1,
              borderTopWidth: 0,
            },
          ]}
        >
          <View
            style={[
              styles.containerHeader,
              {
                backgroundColor:
                  color === undefined || color === null
                    ? colors.daclen_red
                    : color,
                borderTopStartRadius: 6,
                borderTopEndRadius: 6,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isParent ? "account-star" : "star-four-points"}
              size={14}
              color={colors.daclen_light}
            />
            <Text style={styles.textHeader}>{title}</Text>
          </View>
          <View style={styles.containerValue}>
            <Text
              style={[
                styles.text,
                {
                  color:
                    color === undefined || color === null
                      ? colors.daclen_red
                      : color,
                },
              ]}
            >
              {content}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
  },
  containerTouchable: {
    flex: 1,
    width: "50%",
    backgroundColor: "white",
  },
  containerMain: {
    flex: 1,
    width: "50%",
    backgroundColor: "white",
  },
  verticalLine: {
    height: "100%",
    width: 2,
    alignSelf: "flex-start",
    backgroundColor: colors.daclen_red,
  },
  horizontalLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.daclen_red,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
  },
  containerValue: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 8,
  },
  textHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginStart: 10,
    color: colors.daclen_light,
    overflow: "hidden",
  },
  text: {
    fontSize: 16,
    backgroundColor: "transparent",
  },
});

export default BonusRootItem;
