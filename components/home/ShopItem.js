import React from "react";
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

export default function ShopItem(props) {
  const { id, nama, harga_currency, foto_url } = props;
  const navigation = useNavigation();

  const openProduct = () => {
    navigation.navigate("Product", { id, nama });
  };

  /*const formatPostTimestamp = (date) => {
        return date.toDateString() + " " + date.toLocaleTimeString();
      };
    */

  return (
    <View style={styles.containerItem}>
      {nama === "" || nama === null || nama === undefined ? (
        <ActivityIndicator
          size="small"
          color={colors.daclen_gray}
          style={{ alignSelf: "center" }}
        />
      ) : (
        <TouchableOpacity onPress={() => openProduct()}>
          <Image
            style={styles.image}
            source={foto_url}
            onClick={() => openProduct()}
            contentFit="cover"
            placeholder={blurhash}
            transition={1000}
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
    flex: 1 / 2,
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    fontSize: 14,
    color: colors.daclen_black,
    marginTop: 10,
    marginHorizontal: 10,
    textAlign: "center",
  },
  image: {
    width: 120,
    height: 120,
    padding: 2,
    alignSelf: "center",
  },
  textPrice: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
    color: colors.daclen_orange,
    marginHorizontal: 10,
    textAlign: "center",
  },
});
