import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/base";

const DashboardVerification = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.containerVerification}>
      <View style={styles.containerLogo}>
        <Image
          source={require("../../../assets/whatsappverify.png")}
          style={styles.logo}
          contentFit="cover"
          placeholder={null}
          transition={0}
        />
      </View>
      <View style={styles.containerContent}>
        <Text allowFontScaling={false} style={styles.textHeader}>Verifikasi Nomor Handphone</Text>
        <Text allowFontScaling={false} style={styles.text}>
          Anda perlu verifikasi nomor handphone melalui Whatsapp sebelum bisa
          menggunakan Dashboard.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("VerifyPhone")}
          style={styles.button}
        >
          <Text allowFontScaling={false} style={styles.textButton}>Verifikasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerVerification: {
    flex: 1,
    backgroundColor: colors.daclen_bg_highlighted,
    opacity: 0.9,
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 6,
    elevation: 2,
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  containerLogo: {
    marginVertical: 32,
    backgroundColor: "transparent",
    alignSelf: "center",
    alignItems: "center",
  },
  containerContent: {
    backgroundColor: "transparent",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
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
    backgroundColor: colors.daclen_light,
  },
  textHeader: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: colors.daclen_light,
  },
  text: {
    fontFamily: "Poppins", fontSize: 14,
    marginVertical: 20,
    color: colors.daclen_light,
    textAlign: "center",
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_black,
  },
});

export default DashboardVerification;
