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
  const { id, nama, harga_currency, foto_url, key } = props;
  const navigation = useNavigation();

  const openProduct = () => {
    navigation.navigate("Product", { id, nama });
  };

  /*const formatPostTimestamp = (date) => {
        return date.toDateString() + " " + date.toLocaleTimeString();
      };
    */

  return (
    <View style={styles.containerItem} key={id}>
      {nama === "" || nama === null || nama === undefined ? (
        <ActivityIndicator
          size="small"
          color={colors.daclen_gray}
          style={{ alignSelf: "center" }}
        />
      ) : (
        <TouchableOpacity onPress={() => openProduct()}>
          <Image
            key={id}
            style={styles.image}
            source={foto_url}
            onClick={() => openProduct()}
            contentFit="cover"
            placeholder={blurhash}
            transition={0}
          />
          <Text style={styles.text}>{nama}</Text>
          <Text style={styles.textPrice}>Rp {harga_currency}</Text>
        </TouchableOpacity>
      )}

      {id !== null && id !== undefined && <Cart produk_id={id} />}
    </View>
  );
}

const styles = StyleSheet.create({
  containerItem: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderColor: colors.daclen_gray,
    borderWidth: 0.5,
    backgroundColor: colors.daclen_light,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 6,
  },
  text: {
    fontWeight: "bold",
    width: 140,
    fontSize: 14,
    color: colors.daclen_black,
    marginTop: 10,
    textAlignVertical: "center",
    height: 48,
    textAlign: "center",
    alignSelf: "center",
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: "center",
    backgroundColor: "center",
  },
  textPrice: {
    fontSize: 14,
    width: 120,
    marginTop: 8,
    marginBottom: 20,
    color: colors.daclen_orange,
    marginHorizontal: 10,
    textAlign: "center",
    alignSelf: "center",
  },
});

export default memo(ShopItem)
