import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import { capitalizeFirstLetter, formatPrice } from "../../../axios/cart";

export default function DashboardUser(props) {
  const { currentUser, profilePicture, saldoAkumulasi } = props;
  const navigation = useNavigation();

  function openWithdrawal() {
    navigation.navigate("SaldoReportScreen");
  }

  if (
    currentUser === undefined ||
    currentUser === null ||
    currentUser?.id === undefined ||
    currentUser?.detail_user === undefined
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.containerPhoto}
      >
        <Image
          key="userImage"
          style={styles.image}
          source={
            profilePicture
              ? profilePicture
              : require("../../../assets/user.png")
          }
          alt={currentUser?.name}
          placeholder={
            Platform.OS === "ios" ? null : require("../../../assets/user.png")
          }
          contentFit={
            Platform.OS === "ios" && profilePicture === null
              ? "contain"
              : "cover"
          }
          transition={0}
        />
      </TouchableOpacity>

      <View style={styles.containerVertical}>
        <Text allowFontScaling={false} style={styles.text}>{`${
          currentUser?.status
            ? capitalizeFirstLetter(currentUser?.status)
            : "Reseller"
        } Daclen`}</Text>
        <Text allowFontScaling={false} style={styles.textName}>
          {currentUser?.detail_user?.nama_lengkap
            ? currentUser?.detail_user?.nama_lengkap
            : currentUser?.name}
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.text, { marginTop: 4 }]}
        >
          {saldoAkumulasi ? "Saldo Akumulasi" : "Saldo"}
        </Text>

        <Text
          allowFontScaling={false}
          style={[styles.textName, { color: colors.daclen_yellow }]}
        >
          {saldoAkumulasi
            ? saldoAkumulasi > 0
              ? formatPrice(saldoAkumulasi)
              : "Rp 0"
            : currentUser?.komisi_user
            ? formatPrice(currentUser?.komisi_user?.total_currency)
              ? formatPrice(currentUser?.komisi_user?.total_currency)
              : "Rp 0"
            : "Rp 0"}
        </Text>

        
      </View>
      <TouchableOpacity style={styles.button} onPress={() => openWithdrawal()}>
        <Text allowFontScaling={false} style={styles.textButton}>
          {`CAIRKAN\nSALDO`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/*
<Text allowFontScaling={false} style={styles.textReferral}>
          {`Referral Id: ${currentUser?.name}`}
        </Text>
*/

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginHorizontal: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  containerPhoto: {
    marginStart: 10,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "center",
    elevation: 4,
  },
  containerVertical: {
    marginHorizontal: 10,
    backgroundColor: "transparent",
    flex: 1,
  },
  button: {
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 12,
    borderColor: colors.daclen_green_button,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    opacity: 0.95,
    backgroundColor: colors.daclen_grey_button,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_green_button,
    textAlign: "center",
  },
  textName: {
    fontSize: 14,
    color: colors.daclen_light,
    fontFamily: "Poppins-SemiBold",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_light,
  },
  textReferral: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_lightgrey,
    marginTop: 6,
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: colors.daclen_light,
    borderRadius: 45,
  },
});
