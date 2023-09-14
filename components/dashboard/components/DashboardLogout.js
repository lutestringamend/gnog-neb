import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/base";

const DashboardLogout = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.containerLogin}>
      <Text allowFontScaling={false} style={styles.text}>
        Login / Register untuk berbelanja dengan Daclen
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text allowFontScaling={false} style={styles.textButton}>Login / Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    backgroundColor: colors.daclen_bg_highlighted,
    opacity: 0.9,
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 24,
    borderRadius: 6,
    elevation: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
  },
  text: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    marginHorizontal: 12,
    color: colors.daclen_light,
  },
});

export default DashboardLogout;
