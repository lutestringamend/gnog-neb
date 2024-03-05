import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { checkNumberEmpty, formatPrice } from "../../axios/cart";

const width =
  dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal;
const ratio = dimensions.fullWidthAdjusted / 430;

const DashboardSaldo = (props) => {
  const { disabled, style } = props;
  const navigation = useNavigation();

  return (
    <View style={[styles.container, style ? style : null]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SaldoReportScreen")}
        disabled={disabled}
        style={styles.containerInfo}
      >
        <View
          style={[
            styles.containerIcon,
            { width: 40 * ratio, height: 40 * ratio, borderRadius: 20 * ratio },
          ]}
        >
          <MaterialCommunityIcons
            name="wallet"
            size={20 * ratio}
            color={colors.black}
          />
        </View>
        <View style={styles.containerText}>
          {props?.total_komisi_user ? (
            <Text allowFontScaling={false} style={styles.textHeader}>
              {formatPrice(parseInt(props?.total_komisi_user))}
            </Text>
          ) : null}
          {props?.poin_user ? (
            <Text allowFontScaling={false} style={styles.text}>
              {`${checkNumberEmpty(props?.poin_user?.total)} poin`}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <View style={styles.containerActions}>
        <TouchableOpacity
          style={styles.containerAction}
          onPress={() => navigation.navigate("PointWithdrawal")}
          disabled={disabled}
        >
          <View style={styles.containerIcon}>
            <MaterialCommunityIcons
              name="transfer"
              size={20 * ratio}
              color={colors.black}
            />
          </View>
          <Text allowFontScaling={false} style={styles.text}>
            Tukar Poin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.containerAction}
          onPress={() => navigation.navigate("Withdrawal")}
          disabled={disabled}
        >
          <View style={styles.containerIcon}>
            <MaterialCommunityIcons
              name="arrow-down"
              size={20 * ratio}
              color={colors.black}
            />
          </View>
          <Text allowFontScaling={false} style={styles.text}>
            Tarik Saldo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    borderRadius: 16 * ratio,
    backgroundColor: colors.white,
    paddingHorizontal: 14 * ratio,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70 * ratio,
  },
  containerInfo: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerText: {
    marginStart: 14 * ratio,
    backgroundColor: "transparent",
  },
  containerIcon: {
    backgroundColor: colors.daclen_grey_container_background,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 30 * ratio,
    height: 30 * ratio,
    borderRadius: 8 * ratio,
  },
  containerActions: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerAction: {
    backgroundColor: "transparent",
    marginStart: staticDimensions.marginHorizontal / 2,
    alignSelf: "center",
  },
  textHeader: {
    fontSize: 18 * ratio,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.black,
  },
  text: {
    fontSize: 11 * ratio,
    fontFamily: "Poppins-Light",
    backgroundColor: "transparent",
    color: colors.black,
    marginTop: 2,
  },
});

export default DashboardSaldo;
