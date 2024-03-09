import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import { MIDTRANS_PROD_DOMAIN, MIDTRANS_SB_DOMAIN, dashboardkodeetikpdf, devhttp, mainhttp, webdashboard } from "../../../axios/constants";
import {
  dashboardonboardingbutton,
  dashboardonboardingtext1,
  dashboardonboardingtext2,
  dashboardonboardingtext3,
} from "../../../src/constants/dashboard";

const DashboardUpgrade = (props) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { registerSnapToken, fetchingToken } = props;

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);
    }
  }, [registerSnapToken]);

  function loadData() {
    if (props?.loadData === undefined || props?.loadData === null) {
      return;
    }
    props?.loadData();
  }

  function refreshPage() {
    if (fetchingToken || refreshing) {
      return;
    }
    setRefreshing(true);
    loadData();
  }

  function proceedJoin() {
    if (
      fetchingToken ||
      registerSnapToken === null ||
      registerSnapToken?.snap_token === undefined
    ) {
      Linking.openURL(webdashboard);
      return;
    }
    let domain = mainhttp === devhttp ? MIDTRANS_SB_DOMAIN : MIDTRANS_PROD_DOMAIN;
    let snap_url = `${domain}snap/v3/redirection/${registerSnapToken?.snap_token}`;
    try {
      const params = {
        snapToken: registerSnapToken?.snap_token,
        snap_url,
        checkoutId: registerSnapToken?.bayar_register_id,
      };
      console.log("open snap", snap_url);
      navigation.navigate("OpenMidtrans", params);
    } catch (e) {
      console.log(e);
      Linking.openURL(snap_url);
    }
  }

  function openKodeEtik() {
    Linking.openURL(dashboardkodeetikpdf);
    /*navigation.navigate("PDFViewer", {
      title: "Kode Etik",
      uri: dashboardkodeetikpdf,
    });*/
  }

  return (
    <ScrollView
      style={styles.containerLogin}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refreshPage()}
        />
      }
    >
      <Text allowFontScaling={false} style={styles.text}>{dashboardonboardingtext1}</Text>
      <Text allowFontScaling={false} style={styles.textPrice}>Rp 300.000,-</Text>
      {dashboardonboardingtext2 ? (
        <Text allowFontScaling={false} style={styles.text}>{dashboardonboardingtext2}</Text>
      ) : null}
      <Text allowFontScaling={false} style={styles.textInner}>
        {registerSnapToken?.message_pembayaran
          ? registerSnapToken?.message_pembayaran
          : dashboardonboardingtext3}
      </Text>

      <TouchableOpacity
        onPress={() => proceedJoin()}
        style={[
          styles.button,
          {
            backgroundColor:
              fetchingToken || registerSnapToken === null
                ? colors.daclen_lightgrey_button
                : colors.daclen_light,
          },
        ]}
      >
          <MaterialCommunityIcons
            name="cursor-pointer"
            size={20}
            color={colors.daclen_black}
          />
        <Text allowFontScaling={false} style={styles.textButton}>{dashboardonboardingbutton}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => loadData()}
        style={[
          styles.button,
          {
            backgroundColor:
              fetchingToken || registerSnapToken === null
                ? colors.daclen_lightgrey_button
                : colors.daclen_light,
          },
        ]}
      >
        {registerSnapToken === null || fetchingToken ? (
          <ActivityIndicator
            color={colors.daclen_black}
            size="small"
            style={styles.spinner}
          />
        ) : (
          <MaterialCommunityIcons
            name="refresh"
            size={20}
            color={colors.daclen_black}
          />
        )}
        <Text allowFontScaling={false} style={styles.textButton}>Cek Status Pembayaran</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openKodeEtik()}
        style={styles.button}
      >
        <MaterialCommunityIcons
          name="file-document-multiple"
          size={20}
          color={colors.daclen_black}
        />
        <Text allowFontScaling={false} style={styles.textButton}>Kode Etik</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    backgroundColor: colors.daclen_gold,
    opacity: 0.95,
    marginHorizontal: 12,
    marginVertical: 20,
    paddingVertical: 20,
    borderRadius: 6,
    elevation: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 12,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_light,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_black,
    marginStart: 10,
  },
  text: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    marginHorizontal: 12,
    color: colors.daclen_light,
    backgroundColor: "transparent",
  },
  textInner: {
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.daclen_gold_dark,
    marginHorizontal: 12,
    color: colors.daclen_light,
    elevation: 6,
  },
  textPrice: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 40,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 20,
    color: colors.daclen_light,
    backgroundColor: "transparent",
  },
  spinner: {
    alignSelf: "center",
  },
});

export default DashboardUpgrade;
