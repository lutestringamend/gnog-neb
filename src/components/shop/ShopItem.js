import React, { memo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";

const screenWidth =
  dimensions.fullWidth > staticDimensions.shopMaxWidth
    ? staticDimensions.shopMaxWidth
    : dimensions.fullWidth;
const width = (180 * screenWidth) / 430;
const imageWidth = (140 * width) / 180;
const marginInter =
  (screenWidth - 2 * width - 2 * staticDimensions.marginHorizontal) / 2;

const ShopItem = (props) => {
  const { id, index, nama, harga_currency, foto_url } = props;
  const navigation = useNavigation();

  const openProduct = () => {
    navigation.navigate("Product", { id, nama });
  };

  return (
    <TouchableOpacity
      onPress={() => openProduct()}
      style={[
        styles.containerItem,
        {
          marginStart: index % 2 === 0 ? 0 : marginInter,
          marginEnd: index % 2 === 0 ? marginInter : 0,
          marginTop: index < 2 ? 20 : 0,
          marginBottom: 20,
        },
      ]}
    >
      {foto_url ? (
        <View style={styles.containerImage}>
          <ActivityIndicator
            size={16}
            color={colors.daclen_button_disabled_grey}
            style={styles.spinner}
          />
          <Image
            style={[styles.image, index > 9 ? styles.imageBundle : null]}
            source={foto_url}
            contentFit={index > 9 ? "contain" : "cover"}
            placeholder={null}
            transition={100}
          />
        </View>
      ) : null}
      <Text
        allowFontScaling={false}
        style={[styles.textName, { marginTop: 4 }]}
      >
        {nama}
      </Text>
      <Text
        allowFontScaling={false}
        style={[styles.textName, { fontFamily: "Poppins-Light" }]}
      >
        {`Rp. ${harga_currency}`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    backgroundColor: "transparent",
    width,
    flex: 1 / 2,
  },
  containerImage: {
    width,
    height: width,
    backgroundColor: colors.daclen_grey_container,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textName: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_grey_placeholder,
    textAlign: "center",
    width,
    backgroundColor: "transparent",
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    alignSelf: "center",
    backgroundColor: colors.daclen_grey_container,
  },
  spinner: {
    alignSelf: "center",
    backgroundColor: "transparent",
    top: (width - 16) / 2,
    start: (width - 16) / 2,
    position: "absolute",
  },
});

export default memo(ShopItem);
