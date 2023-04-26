import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";

export default function MainHeader(props) {
  const navigation = useNavigation();

  function backArrow() {
    if (props?.onBackPress === null || props?.onBackPress === undefined) {
      navigation.navigate("Main");
    } else {
      props?.onBackPress();
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => backArrow()} disabled={props?.disabled}>
        <MaterialCommunityIcons
          name={props?.icon}
          size={24}
          color="white"
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
      <Text style={styles.text}>{props?.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_black,
    elevation: 4,
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
    marginStart: 20,
    color: "white",
    alignSelf: "center",
    flex: 1,
  },
});
