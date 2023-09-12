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

import Cart from "../cart/Cart";
import { colors, blurhash } from "../../styles/base";

const ShopItem = (props) => {
  const { id, nama, harga_currency, foto_url, isPremium } = props;
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
    <View style={styles.containerItem} key={id}>
      {nama === "" || nama === null || nama === undefined ? (
        <ActivityIndicator
          size="small"
          color={colors.daclen_gray}
          style={{ flex: 2, alignSelf: "center" }}
        />
      ) : (
        <View style={styles.containerLeft}>
          <TouchableOpacity onPress={() => openProduct()}>
            <Image
              key={id}
              style={styles.image}
              source={foto_url}
              onClick={() => openProduct()}
              contentFit="cover"
              placeholder={blurhash}
              transition={50}
            />
          </TouchableOpacity>
          <View style={styles.containerInfo}>
            <Text style={styles.textName}>{nama}</Text>
            <Text style={styles.textPrice}>Rp {harga_currency}</Text>
          </View>
        </View>
      )}

      <View style={styles.containerRight}>
        <TouchableOpacity
          style={[
            styles.containerRightButton,
            {
              borderBottomWidth: 0.5,
              borderBottomColor: colors.daclen_black,
              borderTopEndRadius: 10,
            },
          ]}
          onPress={() => openProduct()}
        >
          <Text style={styles.textButton}>DETAIL</Text>
        </TouchableOpacity>
        <View
          style={[
            styles.containerRightButton,
            {
              borderTopWidth: 0.5,
              borderTopColor: colors.daclen_black,
              borderBottomEndRadius: 10,
            },
          ]}
        >
          <Cart
            isShop={true}
            isPremium={isPremium}
            produk_id={id}
            navigation={navigation}
            goDashboard={() => openDashboard()}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: colors.daclen_light,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 4,
  },
  containerLeft: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  containerInfo: {
    flex: 1,
    backgroundColor: "center",
    marginStart: 10,
    alignSelf: "flex-start",
    height: 100,
  },
  containerRight: {
    flex: 1,
    borderStartWidth: 1,
    borderStartColor: colors.daclen_black,
    backgroundColor: "transparent",
  },
  containerRightButton: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    height: 50,
  },
  textName: {
    fontFamily: "Poppins-Bold",
    width: 120,
    fontSize: 14,
    color: colors.daclen_black,
    alignSelf: "flex-start",
  },
  image: {
    width: 94,
    height: 94,
    alignSelf: "center",
    backgroundColor: "transparent",
    marginStart: 12,
  },
  textPrice: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_orange,
    position: "absolute",
    zIndex: 2,
    end: 10,
    bottom: 0,
  },
  textButton: {
    fontFamily: "Poppins", fontSize: 14,
    color: colors.daclen_black,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default memo(ShopItem);
