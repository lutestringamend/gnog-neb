import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import TextBoxStatus from "../textbox/TextBoxStatus";
import { capitalizeFirstLetter } from "../../axios/cart";
import { convertDDMMYYYtoDateDisplay } from "../../utils/history";

const ratio = dimensions.fullWidthAdjusted / 430;

const DeliveryCard = (props) => {
  const { nomor_resi, status, tgl_pengiriman, nama_kurir } = props;

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
              {nomor_resi ? nomor_resi : "Pengiriman"}
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
          <Text allowFontScaling={false} style={styles.textName}>
              Nomor Resi
            </Text>
        </View>

        <Text style={[styles.textName, { color: colors.black }]}>
          {`Ekspedisi ${nama_kurir ? nama_kurir : ""}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.containerVertical, { justifyContent: "space-between", alignItems: "flex-end" }]}
      >
          {tgl_pengiriman ? (
            <Text allowFontScaling={false} style={styles.textName}>
              {`Dikirim ${convertDDMMYYYtoDateDisplay(
                tgl_pengiriman,
                true,
              )}`}
            </Text>
          ) : null}
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

/*

*/

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    alignSelf: "center",
    elevation: 2,
    borderRadius: 12 * ratio,
    padding: 12 * ratio,
    height: 88 * ratio,
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

export default DeliveryCard;
