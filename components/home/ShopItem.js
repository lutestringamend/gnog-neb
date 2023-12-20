import React, { memo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import Cart from "../cart/Cart";
import { colors, blurhash } from "../../styles/base";

const ShopItem = (props) => {
  const { id, index, nama, harga_currency, foto_url, isPremium } = props;
  const navigation = useNavigation();

  const openProduct = () => {
    navigation.navigate("Product", { id, nama });
  };

  function openDashboard() {
    if (props?.goDashboard === undefined || props?.goDashboard === null) {
      return;
    }
    props?.goDashboard();
  }

  return (
    <ImageBackground
      source={require("../../assets/shopitembg.png")}
      style={[styles.containerItem, { marginTop: index === 0 ? 24 : 10 }]}
      key={id}
    >
      {foto_url ? (
        <TouchableOpacity
          onPress={() => openProduct()}
          style={styles.containerImage}
        >
          <ActivityIndicator
            size={16}
            color={colors.daclen_gray}
            style={styles.spinner}
          />
          <Image
            key={id}
            style={[styles.image, index > 9 ? styles.imageBundle : null]}
            source={foto_url}
            onClick={() => openProduct()}
            contentFit={index > 9 ? "contain" : "cover"}
            placeholder={null}
            transition={100}
          />
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        style={styles.containerRightTop}
        onPress={() => openProduct()}
      >
        {nama === "" || nama === null || nama === undefined ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_gray}
            style={{ flex: 2, alignSelf: "center" }}
          />
        ) : (
          <View style={styles.containerInfo}>
            <Text allowFontScaling={false} style={styles.textName}>
              {nama}
            </Text>
            <Text allowFontScaling={false} style={styles.textPrice}>
              Rp {harga_currency}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.containerRightBottom}>
        <Cart
          isShop={true}
          isPremium={isPremium}
          produk_id={id}
          navigation={navigation}
          goDashboard={() => openDashboard()}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    backgroundColor: colors.daclen_bg,
    opacity: 0.9,
    width: "100%",
    height: 120,
  },
  containerImage: {
    position: "absolute",
    height: "100%",
    top: 0,
    bottom: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 3,
    justifyContent: "center",
  },
  containerLeft: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  containerInfo: {
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  containerRightTop: {
    position: "absolute",
    top: 12,
    end: 10,
    zIndex: 2,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  containerRightBottom: {
    position: "absolute",
    bottom: 4,
    end: 10,
    zIndex: 2,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  textName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_light,
    alignSelf: "flex-end",
    textAlign: "right",
    backgroundColor: "transparent",
  },
  image: {
    width: 68,
    height: 76,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  imageBundle: {
    width: 90,
    height: 100,
  },
  textPrice: {
    textAlign: "right",
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_light,
    marginTop: 4,
    backgroundColor: "transparent",
  },
  spinner: { 
    alignSelf: "center",
    backgroundColor: "transparent",
    top: 52,
    start: 26,
    position: "absolute",
  }
});

export default memo(ShopItem);
