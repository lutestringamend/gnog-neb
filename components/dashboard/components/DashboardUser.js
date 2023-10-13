import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import { capitalizeFirstLetter } from "../../../axios/cart";
import { convertDateISOStringtoDisplayDate } from "../../../axios/profile";

export default function DashboardUser(props) {
  const { currentUser, regDate, profilePicture } = props;
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
          contentFit="cover"
          placeholder={require("../../../assets/user.png")}
          transition={100}
        />
      </TouchableOpacity>

      <View style={styles.containerVertical}>
        <Text allowFontScaling={false} style={styles.textName}>
          {currentUser?.detail_user?.nama_lengkap
            ? currentUser?.detail_user?.nama_lengkap
            : currentUser?.name}
        </Text>
        {currentUser?.komisi_user ? (
          <Text
            allowFontScaling={false}
            style={[styles.textName, { color: colors.daclen_yellow }]}
          >
            {`Saldo: Rp ${
              currentUser?.komisi_user?.total_currency
                ? currentUser?.komisi_user?.total_currency
                : "0"
            }`}
          </Text>
        ) : null}

        <Text allowFontScaling={false} style={styles.text}>{`${
          currentUser?.status
            ? capitalizeFirstLetter(currentUser?.status)
            : "Reseller"
        } Daclen`}</Text>
        {regDate === undefined || regDate === null ? null : (
          <Text allowFontScaling={false} style={styles.text}>
            {`Join Date ${convertDateISOStringtoDisplayDate(regDate, true)}`}
          </Text>
        )}

        <Text allowFontScaling={false} style={styles.textReferral}>
          {`Referral Id: ${currentUser?.name}`}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_green_button,
    textAlign: "center",
  },
  textName: {
    fontSize: 12,
    color: colors.daclen_light,
    fontFamily: "Poppins-SemiBold",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_light,
  },
  textReferral: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_lightgrey,
    marginTop: 6,
  },
  image: {
    width: 72,
    height: 72,
    backgroundColor: colors.daclen_light,
    borderRadius: 36,
  },
});
