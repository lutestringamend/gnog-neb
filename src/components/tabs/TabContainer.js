import React from "react";
import { StyleSheet, View } from "react-native";

import { colors, dimensions } from "../../styles/base";
import TabItem from "./TabItem";

const ratio = dimensions.fullWidthAdjusted / 430;

const TabContainer = (props) => {
  const { activeTab, tabList, disabled } = props;
  function onPress(e) {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress(e);
  }

  return (
    <View style={styles.container}>
      {tabList === undefined || tabList?.length < 1
        ? null
        : tabList.map((item, index) => (
            <TabItem
              key={index}
              item={item}
              disabled={disabled}
              activeTab={activeTab}
              onPress={() => onPress(item)}
            />
          ))}
    </View>
  );
};

export default TabContainer;

const styles = StyleSheet.create({
  container: {
    width: dimensions.fullWidthAdjusted,
    height: 41 * ratio,
    backgroundColor: colors.daclen_black,
    flexDirection: "row",
    alignItems: "center",
    top: -1,
  },
});
