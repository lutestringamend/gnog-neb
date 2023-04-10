import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../styles/base";
import Separator from "../profile/Separator";

export default function BSListItem(props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props?.onPress(props?.item)}
    >
      <Text style={styles.text}>{props?.item?.name ? props?.item?.name : props?.item?.nama}</Text>
      {!props?.isLast && <Separator thickness={1} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.daclen_light,
  },
  text: {
    fontSize: 14,
    color: colors.daclen_graydark,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
