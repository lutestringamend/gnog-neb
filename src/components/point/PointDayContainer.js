import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { dimensions, colors, staticDimensions } from "../../styles/base";
import PointHistoryItem from "./PointHistoryItem";

const ratio = dimensions.fullWidthAdjusted / 430;

const PointDayContainer = (props) => {
  const { header, list, isLast } = props;

  function onPress(e) {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress(e);
  }

  return (
    <View
      style={[styles.container, { paddingBottom: isLast ? 120 * ratio : 0 }]}
    >
      {header ? (
        <Text allowFontScaling={false} style={styles.textHeader}>
          {header}
        </Text>
      ) : null}
      {list === undefined || list?.length === undefined || list?.length < 1
        ? null
        : list.map((item, index) => (
            <PointHistoryItem
              key={index}
              {...item}
              onPress={() => onPress(item)}
            />
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    width: dimensions.fullWidthAdjusted,
  },
  textHeader: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.black,
    marginVertical: 16 * ratio,
  },
});

export default PointDayContainer;
