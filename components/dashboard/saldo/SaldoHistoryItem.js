import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

import { colors } from "../../../styles/base";
import Separator from "../../profile/Separator";
import { formatPrice } from "../../../axios/cart";

const SaldoHistoryItem = ({ item }) => {
  return (
    <View style={styles.containerSaldo}>
      {item?.status ? (
        <View style={styles.containerHeader}>
          <MaterialCommunityIcons
            name={
              item?.saldo > 0
                ? "cash-plus"
                : item?.saldo < 0
                ? "cash-minus"
                : "cash"
            }
            size={24}
            color={
              item?.saldo > 0
                ? colors.daclen_green
                : item?.saldo < 0
                ? colors.daclen_danger
                : colors.daclen_black
            }
            style={styles.icon}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.textTitle,
              {
                color:
                  item?.saldo > 0
                    ? colors.daclen_green
                    : item?.saldo < 0
                    ? colors.daclen_danger
                    : colors.daclen_black,
              },
            ]}
          >
            {item?.status}
          </Text>
          <Text allowFontScaling={false} style={styles.textDate}>
            {moment(
              item?.tanggal_dibuat
                ? item?.tanggal_dibuat
                : item?.tanggal_diubah
                ? item?.tanggal_diubah
                : item?.tanggal_penarikan
            ).format("DD MMMM YYYY")}
          </Text>
        </View>
      ) : null}
      <View style={styles.containerDescVertical}>
        {item?.saldo === undefined ||
        item?.saldo === null ||
        item?.saldo === 0 ? null : (
          <Text
            allowFontScaling={false}
            style={[
              styles.textPoint,
              {
                color:
                  item?.saldo < 0 ? colors.daclen_red : colors.daclen_green,
              },
            ]}
          >
            {formatPrice(Math.abs(item?.saldo))}
          </Text>
        )}

        {item?.keterangan || item?.nomor_invoice ? (
          <Text allowFontScaling={false} style={styles.textReferral}>{`${
            item?.keterangan ? `${item?.keterangan}\n` : ""
          }${
            item?.nomor_invoice ? `Nomor Invoice ${item?.nomor_invoice}` : ""
          }`}</Text>
        ) : null}

        {item?.total_saldo === undefined ||
        item?.total_saldo === null ? null : (
          <Text allowFontScaling={false} style={styles.textTotalPoint}>
            {`Saldo Total: ${
              item?.total_saldo <= 0 ? "Rp 0" : formatPrice(item?.total_saldo)
            }`}
          </Text>
        )}
      </View>
      <Separator thickness={2} style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerSaldo: {
    backgroundColor: colors.white,
    width: "100%",
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  containerDescVertical: {
    flex: 1,
    marginHorizontal: 10,
  },
  containerDescHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  containerPoints: {
    marginHorizontal: 10,
  },
  icon: {
    alignSelf: "center",
  },
  textTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.daclen_black,
    marginStart: 10,
    flex: 1,
  },
  textPoint: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: colors.daclen_orange,
  },
  textDate: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
    marginStart: 6,
    alignSelf: "center",
  },
  textReferral: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
    marginTop: 4,
  },
  textCheckout: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: colors.daclen_blue,
    marginTop: 2,
  },
  textTotalPoint: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_blue,
    marginTop: 6,
  },
});

export default memo(SaldoHistoryItem);