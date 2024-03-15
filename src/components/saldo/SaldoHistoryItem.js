import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";
import { formatPrice } from "../../../axios/cart";
import { checkSaldoMutationType } from "../../../axios/user";
import { dimensions, staticDimensions } from "../../styles/base";
import { checkNumberEmpty } from "../../axios/cart";

const ratio = dimensions.fullWidthAdjusted / 430;

const SaldoHistoryItem = (props) => {
  const { status, saldo, keterangan, biaya_admin, checkout, total_saldo } =
    props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.containerSaldo}>
      <View style={styles.containerHeader}>
        <View style={styles.containerIcon}>
          <MaterialCommunityIcons
            name={saldo > 0 ? "cash-plus" : saldo < 0 ? "cash-minus" : "cash"}
            size={20 * ratio}
            color={colors.daclen_grey_icon}
          />
        </View>

        <View
          style={[
            styles.containerDescVertical,
            { flex: 1, marginHorizontal: 10 * ratio },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.textPrice,
              {
                color:
                  checkNumberEmpty(saldo) === 0
                    ? colors.black
                    : checkSaldoMutationType(props) < 0
                      ? colors.daclen_danger
                      : colors.daclen_green,
              },
            ]}
          >
            {checkNumberEmpty(saldo) === 0
              ? "Rp 0"
              : (parseInt(biaya_admin) > 0 && parseInt(Math.abs(saldo)) === parseInt(biaya_admin)) ? `-${formatPrice(parseInt(biaya_admin))}` : `${checkSaldoMutationType(props) < 0 ? "-" : "+"}${formatPrice(Math.abs(saldo))}`}
          </Text>
          <Text allowFontScaling={false} style={styles.textStatus}>
            {(status === "Saldo Keluar" && parseInt(Math.abs(saldo)) === parseInt(biaya_admin)) ? "Biaya admin penarikan saldo"  : keterangan ? keterangan : "Tidak ada perubahan saldo"}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24 * ratio}
          color={colors.black}
        />
      </View>
      <View style={styles.containerDescHorizontal}>
        <Text allowFontScaling={false} style={styles.textType}>
          {`${status}${
            checkout !== null
              ? " • Transaksi"
              : biaya_admin !== null
                ? " • Tarik Saldo"
                : ""
          }`}
        </Text>
        <View style={styles.containerDescVertical}>
          <Text allowFontScaling={false} style={styles.textLight}>
            Sisa saldo
          </Text>
          <Text allowFontScaling={false} style={styles.textBalance}>
            {total_saldo <= 0 ? "Rp 0" : formatPrice(total_saldo)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerSaldo: {
    backgroundColor: colors.white,
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    maxHeight: 120 * ratio,
    borderRadius: 12 * ratio,
    padding: 10 * ratio,
    elevation: 4,
    alignSelf: "center",
    marginBottom: 10 * ratio,
  },
  containerHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerIcon: {
    backgroundColor: colors.daclen_grey_light,
    width: 40 * ratio,
    height: 40 * ratio,
    borderRadius: 20 * ratio,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDescVertical: {
    backgroundColor: "transparent",
  },
  containerDescHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4 * ratio,
  },
  containerPoints: {
    marginHorizontal: 10,
  },
  icon: {
    alignSelf: "center",
  },
  textPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18 * ratio,
  },
  textStatus: {
    fontFamily: "Poppins",
    fontSize: 12 * ratio,
    marginTop: 4 * ratio,
    color: colors.black,
  },
  textType: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.black,
  },
  textLight: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.daclen_grey_placeholder,
  },
  textBalance: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * ratio,
    color: colors.black,
  },
});

export default memo(SaldoHistoryItem);
