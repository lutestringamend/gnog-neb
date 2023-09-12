import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import CartOld from "./CartOld";
import Separator from "../profile/Separator";
import { colors, blurhash } from "../../styles/base";

const CartItem = (props) => {
  const navigation = useNavigation();
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
        <TouchableOpacity
          style={styles.containerImage}
          onPress={() => openProduct(props?.item?.id)}
        >
          <Image
            style={styles.image}
            source={
              props?.item?.thumbnail_url
                ? props?.item?.thumbnail_url
                : props?.item?.foto_url
                ? props?.item?.foto_url
                : require("../../assets/favicon.png")
            }
            onClick={() => openProduct(props?.item?.id)}
            contentFit="contain"
            placeholder={null}
            transition={100}
          />
        </TouchableOpacity>

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
            <CartOld produk_id={props?.item?.id} iconSize={14} textSize={14} />
          )}
        </View>
      </View>
      <Separator thickness={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    alignContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  containerProductHeader: {
    flex: 1,
    marginStart: 12,
    backgroundColor: "transparent",
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    marginBottom: 12,
  },
  containerImage: {
    backgroundColor: "transparent",
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  textProduct: {
    flex: 1,
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.daclen_gray,
    textAlignVertical: "center",
    backgroundColor: "transparent",
    marginEnd: 12,
  },
  textProductPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.daclen_black,
    alignSelf: "center",
  },
});

export default memo(CartItem);
