import React, { memo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import CartOld from "./CartOld";
import {
  colors,
  dimensions,
  globalUIRatio,
  staticDimensions,
} from "../../styles/base";
import { checkNumberEmpty } from "../../axios/cart";

const CartItem = (props) => {
  const navigation = useNavigation();
  const { item, isLast, style } = props;
  const openProduct = (id) => {
    navigation.navigate("Product", { id, nama: item?.nama });
  };

  if (item === undefined || item === null || item?.jumlah < 1) {
    return null;
  }

  return (
    <View
      style={[
        styles.containerItem,
        { marginBottom: isLast ? 0 : 8 * globalUIRatio },
        style ? style : null,
      ]}
    >
      <TouchableOpacity
        style={styles.containerImage}
        onPress={() => openProduct(item?.id)}
      >
        <Image
          style={styles.image}
          source={
            item?.thumbnail_url
              ? item?.thumbnail_url
              : item?.foto_url
                ? item?.foto_url
                : require("../../assets/favicon.png")
          }
          onClick={() => openProduct(item?.id)}
          contentFit="contain"
          placeholder={null}
          transition={100}
        />
      </TouchableOpacity>

      <View style={styles.containerProductHeader}>
        <View style={styles.containerVertical}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.textProduct}
          >
            {item?.nama}
            {!props?.isCart && ` x${checkNumberEmpty(item?.jumlah)}`}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[styles.textProductPrice, { marginTop: 2 * globalUIRatio }]}
          >
            Rp {item?.harga_currency}
          </Text>
        </View>

        <View style={styles.containerHorizontal}>
          {props?.isCart && (
            <CartOld
              produk_id={item?.id}
              iconSize={25 * globalUIRatio}
              textSize={14 * globalUIRatio}
            />
          )}
          <View style={styles.containerVertical}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.textProductPrice}
            >
              Subtotal
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.textProduct, { marginTop: 2 * globalUIRatio }]}
            >
              Rp {item?.subtotal_currency}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    alignContent: "center",
    padding: 13 * globalUIRatio,
    backgroundColor: colors.daclen_grey_light,
    borderRadius: 12 * globalUIRatio,
    alignSelf: "center",
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
  },
  containerProductHeader: {
    flex: 1,
    marginStart: 13 * globalUIRatio,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerImage: {
    backgroundColor: colors.white,
    width: 90 * globalUIRatio,
    height: 90 * globalUIRatio,
    borderRadius: 12 * globalUIRatio,
  },
  image: {
    width: 90 * globalUIRatio,
    height: 90 * globalUIRatio,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  textProduct: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12 * globalUIRatio,
    color: colors.black,
    backgroundColor: "transparent",
  },
  textProductPrice: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * globalUIRatio,
    color: colors.daclen_grey_placeholder,
  },
});

export default memo(CartItem);
