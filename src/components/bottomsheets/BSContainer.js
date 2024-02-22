import React from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions } from "../../styles/base";
import BSListItem from "./BSListItem";

export default function BSContainer(props) {
  let listSize = props?.list?.length ? props?.list?.length : 0;

  function passItemtoParent(item) {
    props?.onPress(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text allowFontScaling={false} style={styles.textTitle}>{props?.title}</Text>
        <TouchableOpacity style={styles.icon} onPress={() => props?.closeThis()}>
          <MaterialCommunityIcons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {listSize > 0 && (
        <FlashList
          estimatedItemSize={20}
          contentContainerStyle={styles.containerFlatlist}
          numColumns={1}
          horizontal={false}
          data={props?.list}
          renderItem={({ item }) => (
            <BSListItem item={item} isLast={false} onPress={passItemtoParent} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: dimensions.fullWidth,
    paddingHorizontal: (dimensions.fullWidth - dimensions.fullWidthAdjusted) / 2,
    flex: 1,
    backgroundColor: "transparent",
    borderTopWidth: 2,
    borderTopColor: colors.daclen_gray,
    elevation: 10,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.daclen_black,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  containerFlatlist: {
    backgroundColor: colors.daclen_light,
    paddingBottom: 60,
  },
  icon: {
    backgroundColor: colors.daclen_black,
  },
  textTitle: {
    flex: 1,
    fontFamily: "Poppins", fontSize: 14,
    color: colors.white,
    fontFamily: "Poppins-Bold",
  },
});
