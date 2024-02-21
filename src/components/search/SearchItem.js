import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, staticDimensions } from "../../styles/base";
import Separator from "../Separator";

const SearchItem = (props) => {
  const { item, index, isLast } = props;
  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props.onPress(item);
    }
  }
  return (
    <View style={[styles.container, {marginTop: index <= 0 ? 20 : 12}]}>
      <TouchableOpacity onPress={() => onPress()} style={styles.containerItem}>
        <MaterialCommunityIcons name="magnify" color={colors.black} size={16} />

        <Text allowFontScaling={false} style={styles.text}>
          {item?.name}
        </Text>

        <MaterialCommunityIcons
          name="arrow-top-left"
          color={colors.bottomNavInactive}
          size={16}
        />
      </TouchableOpacity>
      {isLast ? null : <Separator thickness={1} style={styles.separator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  containerItem: {
    height: 32,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  text: {
    alignSelf: "center",
    flex: 1,
    marginHorizontal: staticDimensions.marginHorizontal,
    color: colors.textInputText,
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
  },
  separator: {
    marginTop: 12,
  },
});

export default SearchItem;
