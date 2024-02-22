import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

import { colors } from "../../../styles/base";
import Separator from "../Separator";
import { capitalizeFirstLetter, formatPrice } from "../../../axios/cart";

const SaldoWithdrawalItem = ({ item }) => {
  return (
    <View style={styles.containerSaldo}>
      {item?.status ? (
        <View style={styles.containerHeader}>
          <MaterialCommunityIcons
            name={item?.status === "selesai" ? "check-bold" : "progress-clock"}
            size={24}
            color={
              item?.status === "selesai"
                ? colors.daclen_black
                : colors.daclen_gray
            }
            style={styles.icon}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.textTitle,
              {
                color:
                  item?.status === "selesai"
                    ? colors.daclen_black
                    : colors.daclen_gray,
              },
            ]}
          >
            {`Penarikan ${capitalizeFirstLetter(item?.status)}`}
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
      <View style={styles.containerDescHorizontal}>
        <View style={styles.containerDescVertical}>
          {item?.bank === undefined ||
          item?.bank === null ||
          item?.nomor_rekening === undefined ||
          item?.nomor_rekening === null ? null : (
            <Text allowFontScaling={false} style={styles.textReferral}>
              {`${item?.bank?.nama}\n${item?.nomor_rekening}`}
            </Text>
          )}

          {item?.jumlah_yang_diminta ? (
            <Text
              allowFontScaling={false}
              style={styles.textReferral}
            >{`Jumlah Penarikan: ${formatPrice(
              item?.jumlah_yang_diminta
            )}`}</Text>
          ) : null}

          {item?.biaya_admin ? (
            <Text
              allowFontScaling={false}
              style={styles.textReferral}
            >{`Biaya Admin: ${formatPrice(item?.biaya_admin)}`}</Text>
          ) : null}

          {item?.jumlah ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.textTotalPoint,
                {
                  color:
                    item?.status === "selesai"
                      ? colors.daclen_blue
                      : colors.daclen_gray,
                },
              ]}
            >
              {`${
                item?.status === "selesai"
                  ? "Jumlah Diterima:"
                  : "Jumlah Akan Diterima:"
              } ${item?.jumlah <= 0 ? "Rp 0" : formatPrice(item?.jumlah)}`}
            </Text>
          ) : null}
        </View>

        {item?.foto_bukti_transfer_url ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(item?.foto_bukti_transfer_url)}
            style={styles.button}
          >
            <Text allowFontScaling={false} style={styles.textButton}>
              Bukti Transfer
            </Text>
          </TouchableOpacity>
        ) : null}
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  containerPoints: {
    marginHorizontal: 10,
  },
  button: {
    alignSelf: "center",
    marginEnd: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  icon: {
    alignSelf: "center",
  },
  textTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
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

export default memo(SaldoWithdrawalItem);
