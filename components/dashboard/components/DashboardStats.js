import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import { monthNames } from "../../../axios/constants";

export default function DashboardStats(props) {
  const { currentUser } = props;
  const navigation = useNavigation();

  if (
    currentUser === undefined ||
    currentUser === null ||
    currentUser?.id === undefined ||
    currentUser?.detail_user === undefined
  ) {
    return null;
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

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>
        {`${monthNames[new Date().getMonth()]} ${new Date()
          .getFullYear()
          .toString()}`}
      </Text>

      <View style={styles.containerHorizontal}>
        <View style={styles.containerVertical}>
          <Text style={styles.text}>Penjualan Bulan Ini</Text>
          <Text style={styles.textYellow}>{`#NUM# Invoice`}</Text>
          <Text style={styles.textYellow}>{`Rp #TOTAL#`}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => openHistory()}>
          <Text style={styles.textButton}>{`Riwayat\nTransaksi`}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerHorizontal}>
        <View style={styles.containerVertical}>
          <Text style={styles.text}>Home Point Value</Text>
          <Text style={styles.text}>{`${currentUser?.poin_user?.hpv ? currentUser?.poin_user?.hpv : "0"} Point`}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => openSyaratBonusRoot()}>
          <Text style={styles.textButton}>{`Syarat\nBonus Root`}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerHorizontal}>
        <View style={styles.containerVertical}>
          <Text style={styles.text}>Point Akumulasi</Text>
          <Text style={styles.text}>{`${currentUser?.poin_user?.total ? currentUser?.poin_user?.total : "0"} Point`}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => openLaporanPoint()}>
          <Text style={styles.textButton}>{`Laporan\nPoint`}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerHorizontal}>
        <View style={styles.containerVertical}>
          <Text style={[styles.textYellow, {color: colors.daclen_green_pale}]}>{`Bonus Jaringan Level #D#`}</Text>
          <Text style={styles.text}>{`Agen Anda: #NUM# Orang`}</Text>
          <Text style={styles.text}>{`Reseller Anda: #NUM# Orang`}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => openUserRoots()}>
          <Text style={styles.textButton}>{`Tampilkan\nReseller & Agen`}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.textBottom}>
        {`Minimal Rekruitment Bulan Ini: #NUM# Reseller`}
      </Text>
    </View>
  );
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
    fontWeight: "bold",
    color: colors.daclen_light,
    textAlign: "center",
  },
  textHeader: {
    backgroundColor: colors.daclen_black_header,
    opacity: 1,
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_light,
  },
  textYellow: {
    fontSize: 12,
    color: colors.daclen_yellow,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    color: colors.daclen_light,
  },
  textBottom: {
    backgroundColor: "transparent",
    textAlign: "center",
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 12,
    fontSize: 14,
    color: colors.daclen_light,
  },
  image: {
    width: 72,
    height: 72,
    aspectRatio: 1 / 1,
  },
});
