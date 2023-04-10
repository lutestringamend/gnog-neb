import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/base";

export default function BSProductBenefit(props) {
  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <MaterialCommunityIcons
          name="hand-coin"
          color={colors.daclen_green}
          size={20}
        />
        <Text style={styles.textCashback}>
          Anda bisa mendapatkan hingga {props?.poin} poin untuk pembelian produk
          ini, dan cashback Rp{" "}
          {((props?.komisi * props?.harga_value) / 100).toFixed(0)}.
        </Text>
      </View>

      <View
        style={[
          styles.containerHorizontal,
          { marginTop: 20, backgroundColor: colors.daclen_palepink },
        ]}
      >
        <MaterialCommunityIcons
          name="truck-delivery"
          color={colors.daclen_reddishbrown}
          size={20}
        />
        <Text style={styles.textDelivery}>
          Gratis pengiriman untuk wilayah Jabodetabek dan potongan biaya sebesar
          50% sampai dengan Rp20.000 untuk seluruh wilayah.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.daclen_light,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.daclen_offgreen,
    paddingStart: 12,
    paddingVertical: 10,
  },
  textCashback: {
    color: colors.daclen_green,
    fontSize: 12,
    paddingHorizontal: 20,
  },
  textDelivery: {
    color: colors.daclen_reddishbrown,
    fontSize: 12,
    paddingHorizontal: 20,
  },
});
