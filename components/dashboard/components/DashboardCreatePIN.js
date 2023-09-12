import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/base";

const DashboardCreatePIN = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.containerLogin}>
      <Text style={styles.text}>
        Anda perlu membuat PIN 4 digit untuk mengamankan halaman Profil
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CreatePIN")}
      >
        <Text style={styles.textButton}>Buat PIN Baru</Text>
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
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
  },
  text: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    marginHorizontal: 12,
    color: colors.daclen_light,
  },
});

export default DashboardCreatePIN;
