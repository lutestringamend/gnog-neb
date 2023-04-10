import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

import Cart from "./Cart";
import Separator from "../profile/Separator";
import { colors } from "../../styles/base";

export default function CartItem(props) {
  const openProduct = (id) => {
    navigation.navigate("Product", { id });
  };

  if (
    props?.item === undefined ||
    props?.item === null ||
    props?.item?.jumlah < 1
  ) {
    return null;
  }

  return (
    <View>
      <View style={styles.containerItem}>
        <Image
          style={styles.image}
          source={{ uri: props?.item?.foto_url }}
          onClick={() => openProduct(props?.item?.id)}
        />

        <View style={styles.containerProductHeader}>
          <TouchableOpacity
            style={styles.containerHorizontal}
            onPress={() => openProduct(props?.item?.id)}
          >
            <Text style={styles.textProduct}>
              {props?.item?.nama}
              {!props?.isCart && ` x${props?.item?.jumlah}`}
            </Text>
            <Text style={styles.textProductPrice}>
              Rp {props?.item?.subtotal_currency}
            </Text>
          </TouchableOpacity>
          {props?.isCart && (
            <Cart produk_id={props?.item?.id} iconSize={14} textSize={14} />
          )}
        </View>
      </View>
      <Separator thickness={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    alignContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  containerProductHeader: {
    flex: 1,
    padding: 4,
    marginStart: 20,
  },
  containerHorizontal: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    aspectRatio: 1 / 1,
    alignSelf: "center",
  },
  textProduct: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    color: colors.daclen_gray,
    textAlignVertical: "center",
    marginEnd: 10,
  },
  textProductPrice: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.daclen_black,
    alignSelf: "center",
  },
});
