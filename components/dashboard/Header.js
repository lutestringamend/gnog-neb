import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";

export default function Header(props) {
  const { username } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("About")}
        style={styles.containerLogo}
      >
        <Image
          source={require("../../assets/splashsmall.png")}
          style={styles.imageLogo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Profile", { username })}
        style={styles.containerUser}
      >
        <Text style={styles.textLogin}>SETTING</Text>
        <Image source={require("../../assets/gear.png")} style={styles.gear} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  containerLogo: {
    marginHorizontal: 12,
    marginVertical: 12,
    flex: 1,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerUser: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 14,
  },
  imageLogo: {
    width: 75,
    height: 20,
    backgroundColor: "transparent",
  },
  gear: {
    backgroundColor: "transparent",
    alignSelf: "center",
    width: 20,
    height: 20,
  },
  textLogin: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_light,
    marginEnd: 6,
  },
});
