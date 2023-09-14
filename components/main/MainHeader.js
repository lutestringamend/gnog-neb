import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";

export default function MainHeader(props) {
  const navigation = useNavigation();

  function backArrow() {
    if (props?.onBackPress === undefined || props?.onBackPress === null) {
      //navigation.navigate("Main");
      navigation.goBack();
    } else {
      props?.onBackPress();
    }
  }

  return (
    <View style={[styles.container, props?.style ? props.style : null]}>
      <TouchableOpacity onPress={() => backArrow()} disabled={props?.disabled}>
        <MaterialCommunityIcons
          name={props?.icon === "arrow-left" && Platform.OS === "ios" ? "chevron-left" : props?.icon}
          size={props?.iconSize ? props?.iconSize : 24}
          color={colors.daclen_light}
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
      <Text allowFontScaling={false} style={[styles.text, { fontFamily: "Poppins", fontSize: props?.textSize ? props?.textSize : null }]}>{props?.title}</Text>
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
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginStart: 20,
    color: colors.white,
    alignSelf: "center",
    flex: 1,
  },
});
