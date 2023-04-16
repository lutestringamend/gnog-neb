import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import { connect } from "react-redux";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import ShopItem from "./ShopItem";

function Shop(props) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.products?.length === undefined || props?.products?.length < 1) {
      setLoading(true);
    } else {
      if (props.products?.length !== products.length) {
        setCategory("");
        setProducts(props.products);
      }
      setLoading(false);
    }
  }, [props.products]);

  useEffect(() => {
    if (category === "") {
      setProducts(props.products);
    } else {
      console.log("filtering category to " + category);
      let filteredProducts = [];

      for (let i = 0; i < props.products?.length; i++) {
        const check = props.products[i]?.tag_produk.find(
          ({ nama }) => nama === category
        );
        if (check !== undefined) {
          filteredProducts.push(props.products[i]);
        }
      }

      console.log(filteredProducts);
      setProducts(filteredProducts);
    }
  }, [category]);

  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text style={styles.textHeader}>
          {category ? category : "Semua Produk"}
        </Text>
        <View style={styles.containerCategory}>
          <TouchableOpacity onPress={() => setCategory("")}>
            <Image
              source={require("../../assets/all.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory("Slingbag")}>
            <Image
              source={require("../../assets/slingbag.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory("Backpack")}>
            <Image
              source={require("../../assets/backpack.png")}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory("Waistbag")}>
            <Image
              source={require("../../assets/waistbag.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerFlatlist}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : products.length < 1 ? (
          <Text style={styles.textUid}>
            Tidak ada produk tersedia di kategori ini
          </Text>
        ) : (
          <FlatList
            numColumns={2}
            horizontal={false}
            data={products}
            renderItem={({ item }) => (
              <ShopItem
                id={item?.id}
                nama={item?.nama}
                harga_currency={item?.harga_currency}
                foto_url={item?.foto_url}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 20,
    marginEnd: 10,
    marginVertical: 20,
  },
  containerCategory: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: colors.daclen_gray,
    borderWidth: 0.5,
    borderRadius: 4,
    elevation: 5,
  },
  containerFlatlist: {
    flex: 1,
    marginHorizontal: 5,
  },
  textHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  image: {
    width: 24,
    height: 24,
    marginHorizontal: 6,
  },
  textUid: {
    fontSize: 12,
    marginBottom: 12,
    color: colors.daclen_graydark,
    marginHorizontal: 20,
  },
});

const mapStateToProps = (store) => ({
  products: store.productState.products,
  productItems: store.productState.productItems,
  token: store.userState.token,
  cart: store.userState.cart,
});

export default connect(mapStateToProps, null)(Shop);
