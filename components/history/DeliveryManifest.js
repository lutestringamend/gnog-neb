import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";

export default function DeliveryManifest(props) {
  return (
    <View style={styles.container}>
      <View style={styles.verticalLine} />
      <View style={styles.containerItem}>
        <TouchableOpacity onPress={() => console.log(props?.item)}>
          <Text style={styles.textManifest}>
            {props?.item?.manifest_description}
          </Text>
          <Text style={styles.textEntry}>{props?.item?.city_name}</Text>

          <Text style={styles.textEntry}>
            {props?.item?.manifest_date === null &&
            props?.item?.manifest_time === null
              ? props?.waybill_date + "  " + props?.waybill_time
              : props?.item?.manifest_date + "  " + props?.item?.manifest_time}
          </Text>
        </TouchableOpacity>
      </View>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={20}
        color={colors.daclen_green}
        style={styles.circle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: "white",
  },
  circle: {
    position: "absolute",
    left: -8,
    top: 38,
    zIndex: 6,
    backgroundColor: "transparent",
  },
  verticalLine: {
    height: "100%",
    width: 2,
    backgroundColor: colors.daclen_green,
    marginEnd: 10,
  },
  containerItem: {
    flex: 1,
    alignItems: "flex-start",
    marginHorizontal: 10,
    marginVertical: 20,
    backgroundColor: colors.daclen_offgreen,
    padding: 12,
    borderRadius: 6,
  },
  textManifest: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.daclen_green,
    marginBottom: 8,
  },
  textEntry: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_gray,
  },
});
