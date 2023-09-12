import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../styles/base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import { faMedal, faDollarSign, faCoins, faPercent } from '@fortawesome/free-solid-svg-icons'

import MainItem from "./MainItem";
import {
  bonusrootpopup,
  komisiuserpopup,
  poinuserhpvpopup,
  poinuserpopup,
  poinusertotalpopup,
  userroottitle,
} from "./constants";

export default function Main(props) {
  const { poin_user, komisi_user, bonus_level_user, referral_number } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <MainItem
          title={poinuserpopup.title}
          content={poin_user?.poin ? poin_user?.poin : 0}
          color={colors.daclen_light}
          icon={poinuserpopup.icon}
          onButtonPress={(e) => props?.onButtonPress(e)}
        />
        <MainItem
          title={poinuserhpvpopup.title}
          content={poin_user?.hpv ? poin_user?.hpv : 0}
          color={colors.daclen_red}
          icon={poinuserhpvpopup.icon}
          onButtonPress={(e) => props?.onButtonPress(e)}
        />
      </View>
      <View style={styles.containerHorizontal}>
        <MainItem
          title={poinusertotalpopup.title}
          content={poin_user?.total ? poin_user?.total : 0}
          color={colors.daclen_blue}
          icon={poinusertotalpopup.icon}
          onButtonPress={(e) => props?.onButtonPress(e)}
        />
        <MainItem
          title={komisiuserpopup.title}
          content={`Rp ${
            komisi_user?.total_currency ? komisi_user?.total_currency : 0
          }`}
          color={colors.daclen_yellow}
          fontSize={16}
          icon={komisiuserpopup.icon}
          onButtonPress={(e) => props?.onButtonPress(e)}
        />
      </View>
      <View style={styles.containerHorizontal}>
        <MainItem
          title={bonusrootpopup.title}
          content={bonus_level_user?.total ? bonus_level_user?.total : 0}
          color={colors.daclen_teal}
          icon={bonusrootpopup.icon}
          onButtonPress={(e) => props?.onButtonPress(e)}
        />
        <MainItem
          title={userroottitle}
          content={referral_number ? referral_number : 0}
          color={colors.daclen_orange}
          icon="account-group"
          onButtonPress={() => navigation.navigate("UserRootsScreen")}
          disabled={referral_number === undefined || referral_number < 1}
        />
      </View>

      <View style={styles.containerMediaKit}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MediaKitFiles")}
          style={styles.button}
        >
          <MaterialCommunityIcons name="briefcase" size={18} color="white" />
          <Text style={styles.textButton}>Materi Promosi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("PointReportScreen")}
          style={[
            styles.button,
            { backgroundColor: colors.daclen_green, marginTop: 12 },
          ]}
        >
          <MaterialCommunityIcons name="hand-coin" size={18} color="white" />
          <Text style={styles.textButton}>Laporan Poin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("BonusRootScreen")}
          style={[
            styles.button,
            { backgroundColor: colors.daclen_indigo, marginTop: 12 },
          ]}
        >
          <MaterialCommunityIcons name="percent" size={18} color="white" />
          <Text style={styles.textButton}>Syarat Bonus Root</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/*
<TouchableOpacity
          onPress={() => navigation.navigate("SaldoReportScreen")}
          style={[
            styles.button,
            { backgroundColor: colors.daclen_reddishbrown, marginTop: 12 },
          ]}
        >
          <MaterialCommunityIcons name="bitcoin" size={18} color="white" />
          <Text style={styles.textButton}>Laporan Saldo</Text>
        </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.daclen_black,
    flex: 1,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.daclen_black,
    alignItems: "stretch",
    paddingHorizontal: staticDimensions.dashboardBoxHorizontalMargin,
    marginVertical: 10,
  },
  containerMediaKit: {
    padding: 20,
    backgroundColor: colors.daclen_black,
  },
  imageLogo: {
    width: 75,
    height: 20,
    marginStart: 14,
    marginVertical: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginStart: 10,
  },
  textReferral: {
    color: "white",
    fontFamily: "Poppins", fontSize: 12,
    textAlign: "center",
    flex: 1,
  },
  iconLogin: {
    marginHorizontal: 14,
  },
});
