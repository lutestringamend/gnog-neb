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

import { colors, dimensions } from "../../styles/base";
import ShopItem from "./ShopItem";
import Search from "./Search";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../asyncstorage/constants";
import ShopPages from "./ShopPages";

function Shop(props) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.products?.length === undefined || props?.products?.length < 1) {
      setLoading(true);
    } else {
      /*if (props.products?.length !== products.length) {
        setCategory("");
        setProducts(props.products);
      }*/
      setLoading(false);
    }
  }, [props.products]);

  useEffect(() => {
    //console.log("searchFilter", props.searchFilter);
    if (
      (category === null || category === "") &&
      (props.searchFilter === null || props.searchFilter === "")
    ) {
      setProducts([]);
    } else {
      setLoading(true);
      filterStorageProductsCategory();
    }
  }, [props.searchFilter]);

  useEffect(() => {
    if (
      (category === null || category === "") &&
      (props.searchFilter === null || props.searchFilter === "")
    ) {
      setProducts([]);
    } else {
      setLoading(true);
      filterStorageProductsCategory();
    }
  }, [category]);

  const getStorageProducts = async () => {
    const storageProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
    if (
      storageProducts === undefined ||
      storageProducts === null ||
      storageProducts?.length === undefined ||
      storageProducts?.length < 1
    ) {
      console.log("storage products is null!");
      return null;
    } else {
      console.log(
        `reading storageProducts of ${storageProducts?.length} with category ${category}`
      );
      return storageProducts;
    }
  };

  const filterStorageProductsCategory = async () => {
    const storageProducts = await getStorageProducts();
    if (storageProducts === null) {
      return;
    }

    let filteredProducts = [];
    for (let i = 0; i < storageProducts.length; i++) {
      let isIncluded = true;

      if (category !== null && category !== "") {
        const check = storageProducts[i]?.tag_produk.find(
          ({ nama }) => nama === category
        );
        if (check === undefined) {
          isIncluded = false;
        }
      }

      if (props.searchFilter !== null && props.searchFilter !== "") {
        if (
          !storageProducts[i]?.nama
            .toLowerCase()
            .includes(props.searchFilter.toLowerCase())
        ) {
          isIncluded = false;
        }
      }

      if (isIncluded) {
        filteredProducts.push(storageProducts[i]);
      }
    }

    //console.log(filteredProducts);
    setProducts(filteredProducts);
    setLoading(false);
  };

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

      <Search />

      <View style={styles.containerFlatlist}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : category === "" && props.products.length < 1 ? (
          <Text style={styles.textUid}>Tidak ada produk tersedia</Text>
        ) : props.searchFilter !== null && products.length < 1 ? (
          <Text style={styles.textUid}>
            Tidak menemukan produk dari kata pencarian "{props.searchFilter}"
          </Text>
        ) : category !== "" && products.length < 1 ? (
          <Text style={styles.textUid}>
            Tidak ada produk tersedia di kategori ini
          </Text>
        ) : (
          <FlatList
            numColumns={2}
            horizontal={false}
            data={
              products?.length === undefined || products?.length < 1
                ? props.products
                : products
            }
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

        <View
          style={[
            styles.containerCounter,
            { opacity: products?.length < 1 ? 1 : 0 },
          ]}
        >
          <ShopPages disabled={products?.length > 0} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: dimensions.fullHeight / 3,
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
  containerCounter: {
    marginTop: 10,
    marginEnd: 10,
    alignSelf: "flex-end",
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
  searchFilter: store.productState.searchFilter,
  token: store.userState.token,
  cart: store.userState.cart,
});

export default connect(mapStateToProps, null)(Shop);
