import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Cart from "../cart/Cart";
import { colors } from "../../styles/base";

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
            source={{ uri: foto_url }}
            onClick={() => openProduct()}
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
    width: 100,
    aspectRatio: 1 / 1,
    padding: 5,
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
