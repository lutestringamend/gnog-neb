import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import TextBoxStatus from "../textbox/TextBoxStatus";
import { capitalizeFirstLetter, formatPrice } from "../../axios/cart";

const ratio = dimensions.fullWidthAdjusted / 430;

const CheckoutCard = (props) => {
  const { invoice, status, detail_checkout, keranjang, total, kurir } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.containerVertical, { justifyContent: "space-between" }]}
      >
        <View style={styles.containerVertical}>
          <View style={styles.containerHorizontal}>
            <Text allowFontScaling={false} style={styles.textHeader}>
              {invoice ? invoice : "Checkout"}
            </Text>
            <TextBoxStatus
              style={{ marginStart: 6 }}
              text={capitalizeFirstLetter(status)}
              backgroundColor={
                status === "diproses"
                  ? colors.daclen_yellow_background
                  : status === "diterima"
                    ? colors.daclen_green_background
                    : status === "ditolak"
                      ? colors.daclen_danger_background
                      : colors.daclen_blue_textinput
              }
              color={
                status === "diproses"
                  ? colors.daclen_red_light
                  : status === "diterima"
                    ? colors.daclen_green
                    : status === "ditolak"
                      ? colors.daclen_red_light
                      : colors.daclen_blue_link
              }
            />
          </View>
          {detail_checkout ? (
            <Text allowFontScaling={false} style={styles.textName}>
              {detail_checkout?.nama_lengkap
                ? detail_checkout?.nama_lengkap
                : detail_checkout?.nama_depan
                  ? detail_checkout?.nama_depan
                  : ""}
            </Text>
          ) : null}

          {keranjang ? (
            keranjang?.produk ? (
              keranjang?.produk[0] ? (
                <Text allowFontScaling={false} style={styles.text}>
                  {keranjang?.produk[0]?.nama ? keranjang?.produk[0]?.nama : ""}
                </Text>
              ) : null
            ) : null
          ) : null}

          {total ? (
            <Text
              allowFontScaling={false}
              style={[
                styles.textHeader,
                { marginTop: 4 * ratio, fontSize: 12 * ratio },
              ]}
            >
              {total ? formatPrice(total) : ""}
            </Text>
          ) : null}
        </View>

        <Text style={[styles.textName, { color: colors.black }]}>
          {`${
            keranjang
              ? keranjang?.jumlah_produk
                ? `${keranjang?.jumlah_produk} item`
                : ""
              : ""
          } • ${kurir ? (kurir?.nama ? kurir?.nama : "") : ""}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.containerVertical, { alignItems: "center" }]}
      >
        <View style={styles.containerPhoto}>
          {keranjang ? (
            keranjang?.produk ? (
              keranjang?.produk[0] ? (
                keranjang?.produk[0]?.foto_url ? (
                  <Image
                    source={keranjang?.produk[0]?.foto_url}
                    contentFit="contain"
                    style={styles.photo}
                  />
                ) : null
              ) : null
            ) : null
          ) : null}
        </View>
        <View style={[styles.containerHorizontal, { marginTop: 10 * ratio }]}>
          <Text
            allowFontScaling={false}
            style={[styles.text, { marginTop: 0 }]}
          >
            Lihat Info
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={14 * ratio}
            color={colors.black}
            style={{ marginStart: 4 * ratio }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    alignSelf: "center",
    elevation: 2,
    borderRadius: 12 * ratio,
    padding: 12 * ratio,
    height: 140 * ratio,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10 * ratio,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerPhoto: {
    backgroundColor: colors.daclen_grey_light,
    width: 80 * ratio,
    height: 80 * ratio,
    borderRadius: 6 * ratio,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: {
    width: 70 * ratio,
    height: 70 * ratio,
    backgroundColor: "transparent",
  },
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * ratio,
    color: colors.black,
  },
  textName: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.daclen_grey_placeholder,
    marginTop: 4 * ratio,
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "Poppins",
    fontSize: 12 * ratio,
    color: colors.black,
    marginTop: 4 * ratio,
  },
});

export default CheckoutCard;
