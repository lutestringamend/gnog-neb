import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../../styles/base";
import { monthNames } from "../../../axios/constants";
import { formatPrice } from "../../../axios/cart";
import { sentryLog } from "../../../sentry";

export default function DashboardStats(props) {
  const { currentUser, recruitmentTimer } = props;
  const navigation = useNavigation();

  if (
    currentUser === undefined ||
    currentUser === null ||
    currentUser?.id === undefined ||
    currentUser?.detail_user === undefined
  ) {
    return null;
  }

  function showTimerModal() {
    if (props?.showTimerModal === undefined || props?.showTimerModal === null) {
        return;
    }
    props?.showTimerModal();
    console.log("recruitmentTimer", recruitmentTimer);
}

  function openHistory() {
    navigation.navigate("History");
  }

  function openSyaratBonusRoot() {
    navigation.navigate("BonusRootScreen");
  }

  function openUserRoots() {
    navigation.navigate("UserRootsScreen");
  }

  function openLaporanPoint() {
    navigation.navigate("PointReportScreen");
  }

  try {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.textHeader}>
          {`${monthNames[new Date().getMonth()]} ${new Date()
            .getFullYear()
            .toString()}`}
        </Text>
  
        <View style={styles.containerHorizontal}>
          <View style={styles.containerVertical}>
            <Text allowFontScaling={false} style={styles.text}>Penjualan Bulan Ini</Text>
            <Text allowFontScaling={false} style={styles.textYellow}>{`${
              currentUser?.jumlah_invoice ? currentUser?.jumlah_invoice : "0"
            } Invoice`}</Text>
            <Text allowFontScaling={false} style={styles.textYellow}>
              {currentUser?.total_nominal_penjualan
                ? formatPrice(currentUser?.total_nominal_penjualan)
                : "Rp 0"}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => openHistory()}>
            <Text allowFontScaling={false} style={styles.textButton}>{`Riwayat\nTransaksi`}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.containerHorizontal}>
          <View style={styles.containerVertical}>
            <Text allowFontScaling={false} style={styles.text}>Home Point Value</Text>
            <Text allowFontScaling={false} style={styles.text}>{`${
              currentUser?.poin_user?.hpv ? currentUser?.poin_user?.hpv : "0"
            } Point`}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openSyaratBonusRoot()}
          >
            <Text allowFontScaling={false} style={styles.textButton}>{`Syarat\nBonus Root`}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.containerHorizontal}>
          <View style={styles.containerVertical}>
            <Text allowFontScaling={false} style={styles.text}>Akumulasi Poin</Text>
            <Text allowFontScaling={false} style={styles.text}>{`${
              currentUser?.poin_user?.total ? currentUser?.poin_user?.total : "0"
            } Point`}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openLaporanPoint()}
          >
            <Text allowFontScaling={false} style={styles.textButton}>{`Laporan\nPoint`}</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.containerHorizontal}>
          <View style={styles.containerVertical}>
            <Text allowFontScaling={false}
              style={[styles.textYellow, { color: colors.daclen_green_pale }]}
            >{`Bonus Jaringan Level A`}</Text>
            <Text allowFontScaling={false} style={styles.text}>{`Agen Anda: ${
              currentUser?.jumlah_agen ? currentUser?.jumlah_agen : "0"
            } Orang`}</Text>
            <Text allowFontScaling={false} style={styles.text}>{`Reseller Anda: ${
              currentUser?.jumlah_reseller ? currentUser?.jumlah_reseller : "0"
            } Orang`}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => openUserRoots()}>
            <Text allowFontScaling={false} style={styles.textButton}>{`Tampilkan\nAgen & Reseller`}</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={styles.containerBottom} onPress={() => showTimerModal()}>
        <Text allowFontScaling={false} style={styles.textBottom}>
            Countdown Recruitment
        </Text>
        <MaterialCommunityIcons
          name="timer"
          size={16}
          color={colors.daclen_light}
          style={styles.timer}
        />
        </TouchableOpacity>
        
      </View>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return null;
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.daclen_black_bg,
    opacity: 0.9,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 2,
  },
  containerHorizontal: {
    marginTop: 12,
    marginHorizontal: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerBottom: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 12,
  },
  containerVertical: {
    marginEnd: 12,
    backgroundColor: "transparent",
    flex: 1,
  },
  button: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.daclen_light,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    opacity: 0.9,
    backgroundColor: colors.daclen_lightgrey_button,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 120,
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
    textAlign: "center",
  },
  textHeader: {
    backgroundColor: colors.daclen_black_header,
    opacity: 1,
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
  },
  textYellow: {
    fontSize: 12,
    color: colors.daclen_yellow,
    fontFamily: "Poppins-SemiBold",
  },
  text: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_light,
  },
  textBottom: {
    backgroundColor: "transparent",
    textAlign: "center",
    fontFamily: "Poppins-SemiBold", fontSize: 12,
    color: colors.daclen_light,
  },
  image: {
    width: 72,
    height: 72,
    aspectRatio: 1 / 1,
  },
  timer: {
    alignSelf: "center",
    marginHorizontal: 10,
  },
});
