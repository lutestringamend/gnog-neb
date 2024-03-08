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

const SaldoWithdrawalItem = (props) => {
  const { status, tanggal_dibuat, tanggal_diubah, tanggal_penarikan, jumlah, bank, nomor_rekening, biaya_admin, jumlah_yang_diminta, foto_bukti_transfer_url } = props;
  return (
    <View style={styles.containerSaldo}>
      {status ? (
        <View style={styles.containerHeader}>
          <MaterialCommunityIcons
            name={status === "selesai" ? "check-bold" : "progress-clock"}
            size={24}
            color={
              status === "selesai"
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
                  status === "selesai"
                    ? colors.daclen_black
                    : colors.daclen_gray,
              },
            ]}
          >
            {`Penarikan ${capitalizeFirstLetter(status)}`}
          </Text>
          <Text allowFontScaling={false} style={styles.textDate}>
            {moment(
              tanggal_dibuat
                ? tanggal_dibuat
                : tanggal_diubah
                ? tanggal_diubah
                : tanggal_penarikan
            ).format("DD MMMM YYYY")}
          </Text>
        </View>
      ) : null}
      <View style={styles.containerDescHorizontal}>
        <View style={styles.containerDescVertical}>
          {bank === undefined ||
          bank === null ||
          nomor_rekening === undefined ||
          nomor_rekening === null ? null : (
            <Text allowFontScaling={false} style={styles.textReferral}>
              {`${bank?.nama}\n${nomor_rekening}`}
            </Text>
          )}

          {jumlah_yang_diminta ? (
            <Text
              allowFontScaling={false}
              style={styles.textReferral}
            >{`Jumlah Penarikan: ${formatPrice(
              jumlah_yang_diminta
            )}`}</Text>
          ) : null}

          {biaya_admin ? (
            <Text
              allowFontScaling={false}
              style={styles.textReferral}
            >{`Biaya Admin: ${formatPrice(biaya_admin)}`}</Text>
          ) : null}

          {jumlah ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.textTotalPoint,
                {
                  color:
                    status === "selesai"
                      ? colors.daclen_blue
                      : colors.daclen_gray,
                },
              ]}
            >
              {`${
                status === "selesai"
                  ? "Jumlah Diterima:"
                  : "Jumlah Akan Diterima:"
              } ${jumlah <= 0 ? "Rp 0" : formatPrice(jumlah)}`}
            </Text>
          ) : null}
        </View>

        {foto_bukti_transfer_url ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(foto_bukti_transfer_url)}
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
