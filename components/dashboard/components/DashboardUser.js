import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Linking } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";

export default function DashboardUser(props) {
  const { currentUser } = props;
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
      <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={styles.containerPhoto}>
        <Image
          key="userImage"
          style={styles.image}
          source={
            currentUser?.detail_user?.foto
              ? currentUser?.detail_user?.foto
              : require("../../../assets/user.png")
          }
          alt={currentUser?.name}
          contentFit="contain"
          placeholder={null}
          transition={100}
        />
      </TouchableOpacity>

      <View style={styles.containerVertical}>
        <Text style={styles.textName}>
          {currentUser?.detail_user?.nama_lengkap
            ? currentUser?.detail_user?.nama_lengkap
            : currentUser?.name}
        </Text>
        {currentUser?.komisi_user ? (
          <Text style={[styles.textName, { color: colors.daclen_yellow }]}>
            {`Saldo: Rp ${
              currentUser?.komisi_user?.total_currency
                ? currentUser?.komisi_user?.total_currency
                : "0"
            }`}
          </Text>
        ) : null}

        <Text style={styles.text}>Reseller Daclen</Text>
        <Text style={styles.textReferral}>
          {`Referral Id: ${currentUser?.name}`}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => openWithdrawal()}>
            <Text style={styles.textButton}>
                {`CAIRKAN\nSALDO`}
            </Text>
      </TouchableOpacity>
    </View>
  );
}

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
    height: 72,
    width: 72,
    borderRadius: 36,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: colors.daclen_bg,
    marginVertical: 4,
  },
  containerVertical: {
    marginHorizontal: 12,
    backgroundColor: "transparent",
    flex: 1,
  },
  button: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.daclen_green_button,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.95,
    backgroundColor: colors.daclen_grey_button,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  textButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_green_button,
    textAlign: "center",
  },
  textName: {
    fontSize: 14,
    color: colors.daclen_light,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    color: colors.daclen_light,
  },
  textReferral: {
    fontSize: 10,
    color: colors.daclen_lightgrey,
    marginTop: 6,
  },
  image: {
    width: 72,
    height: 72,
    aspectRatio: 1 / 1,
  },
});
