import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";
import ShopItem from "./ShopItem";
import Search from "./Search";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../asyncstorage/constants";
import { productpaginationnumber } from "../../axios/constants";
import { updateProductSearchFilter } from "../../axios/product";
import { openCheckout } from "../main/CheckoutScreen";
import {
  checkNumberEmpty,
  alterKeranjang,
  clearKeranjang,
} from "../../axios/cart";

function Shop(props) {
  const [storageProducts, setStorageProducts] = useState(null);
  const [category, setCategory] = useState("");
  const [isSearch, setSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [tempCartSize, setTempCartSize] = useState(0);
  const navigation = useNavigation();
  const { token, currentUser, cart, tempCart, cartError } = props;

  const products = useMemo(() => {
    if (
      (category === null || category === "") &&
      (props.searchFilter === null || props.searchFilter === "")
    ) {
      return [];
    } else {
      let newArray = filterStorageProductsCategory();
      return newArray;
    }
  }, [category, props.searchFilter]);

  useEffect(() => {
    if (
      props.products?.length === undefined ||
      props?.products?.length < 1 ||
      storageProducts === undefined ||
      storageProducts === null
    ) {
      setLoading(true);
      getStorageProducts();
    } else {
      setLoading(false);
    }
  }, [props.products, storageProducts]);

  useEffect(() => {
    if (cart === null) {
      return;
    } else if (cartLoading) {
      setCartLoading(false);
      openCheckout(
        navigation,
        false,
        token,
        currentUser,
        tempCartSize > 0 ? tempCartSize : cart?.jumlah_produk,
        null
      );
    }
    console.log("redux cart", cart);
  }, [cart]);

  useEffect(() => {
    if (
      tempCart === null ||
      tempCart?.length === undefined ||
      tempCart?.length < 1
    ) {
      return;
    }
    let newNum = 0;
    for (let i = 0; i < tempCart?.length; i++) {
      newNum += checkNumberEmpty(tempCart[i].jumlah);
    }
    setTempCartSize(newNum);
    if (
      newNum < 1 &&
      !(
        cart?.jumlah_produk === undefined ||
        cart?.jumlah_produk === null ||
        cart?.jumlah_produk < 1
      )
    ) {
      props.clearKeranjang(token);
    }
    console.log("redux tempCart", tempCart);
  }, [tempCart]);

  useEffect(() => {
    if (cartError === null) {
      return;
    } else if (cartLoading) {
      if (Platform.OS === "android") {
        ToastAndroid.show(cartError, ToastAndroid.LONG);
      }
      setCartLoading(false);
    }
  }, [cartError]);

  async function getStorageProducts() {
    const asyncProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
    if (
      asyncProducts === undefined ||
      asyncProducts === null ||
      asyncProducts?.length === undefined ||
      asyncProducts?.length < 1
    ) {
      console.log("asyncProducts is null!");
      setStorageProducts(null);
    } else {
      console.log(
        `reading asyncProducts of ${asyncProducts?.length} with category ${category}`
      );
      setStorageProducts(asyncProducts);
    }
  }

  function filterStorageProductsCategory() {
    if (storageProducts === undefined || storageProducts === null) {
      return [];
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

    //console.log("filteredProducts", filteredProducts);
    if (loading) {
      setLoading(false);
    }
    return filteredProducts;
  }

  function openLogo() {
    if (currentUser?.id === 8054) {
      navigation.navigate("LocationPin");
    } else {
      navigation.navigate("About");
    }
  }

  function toggleSearchIcon() {
    if (isSearch) {
      props.updateProductSearchFilter(null);
    }
    setSearch((isSearch) => !isSearch);
  }

  function openDashboard() {
    if (props?.goDashboard === undefined || props?.goDashboard === null) {
      return;
    }
    props?.goDashboard();
  }

  const loadCart = () => {
    setCartLoading(true);
    props.alterKeranjang(token, tempCart);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom:
            token === null ||
            currentUser === null ||
            currentUser?.id === undefined ||
            currentUser?.isActive === undefined ||
            currentUser?.isActive === null ||
            !currentUser?.isActive
              ? 24
              : 96,
        },
      ]}
    >
      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ? null : (
        <View style={styles.containerHeader}>
          <View style={styles.containerLogo}>
            {isSearch ? (
              <Search />
            ) : (
              <TouchableOpacity onPress={() => openLogo()}>
                <Image
                  source={require("../../assets/splashsmall.png")}
                  style={styles.imageLogo}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.containerSearchIcon}
            onPress={() => toggleSearchIcon()}
          >
            <MaterialCommunityIcons
              name={isSearch ? "close" : "magnify"}
              size={20}
              color={colors.daclen_light}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => loadCart()}
            style={[
              styles.containerCart,
              {
                backgroundColor:
                  tempCartSize < 1 ||
                  cart === null ||
                  cart?.jumlah_produk === undefined ||
                  cart?.jumlah_produk === null ||
                  tempCartSize === parseInt(cart?.jumlah_produk)
                    ? colors.daclen_gray
                    : colors.daclen_blue,
              },
            ]}
            disabled={
              token === null ||
              ((cart?.jumlah_produk === undefined ||
                cart?.jumlah_produk === null ||
                cart?.jumlah_produk < 1) &&
                tempCartSize < 1) 
            }
          >
            {cartLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_light}
                style={styles.spinner}
              />
            ) : (
              <MaterialCommunityIcons
                name="cart"
                size={28}
                color={colors.daclen_light}
              />
            )}

            {token === null ||
            ((cart?.jumlah_produk === undefined ||
              cart?.jumlah_produk === null ||
              cart?.jumlah_produk < 1) &&
              tempCartSize < 1) ? null : (
              <View style={styles.containerNumber}>
                <Text style={styles.textCartNumber}>
                  {tempCartSize > 0
                    ? tempCartSize
                    : cart?.jumlah_produk
                    ? cart?.jumlah_produk
                    : 0}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {cartError ? <Text style={styles.textError}>{cartError}</Text> : null}

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
          <FlashList
            estimatedItemSize={productpaginationnumber}
            numColumns={1}
            horizontal={false}
            data={
              props?.searchFilter === null ||
              props?.searchFilter === "" ||
              products?.length === undefined ||
              products?.length < 1
                ? props.products
                : products
            }
            renderItem={({ item }) => (
              <ShopItem
                id={item?.id}
                nama={item?.nama}
                harga_currency={item?.harga_currency}
                foto_url={
                  item?.thumbnail_url
                    ? item?.thumbnail_url
                    : item?.foto_url
                    ? item?.foto_url
                    : require("../../assets/favicon.png")
                }
                isPremium={currentUser?.isActive}
                goDashboard={() => openDashboard()}
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
    backgroundColor: "transparent",
  },
  containerHeader: {
    width: "100%",
    backgroundColor: colors.black,
    flexDirection: "row",
    height: 54,
  },
  containerLogo: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerSearchIcon: {
    backgroundColor: "transparent",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 54,
    marginEnd: 10,
  },
  containerCart: {
    width: 60,
    backgroundColor: colors.daclen_gray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    borderTopStartRadius: 6,
    borderBottomStartRadius: 6,
  },
  containerNumber: {
    backgroundColor: colors.daclen_orange,
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    top: 2,
    end: 2,
    zIndex: 4,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
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
  imageLogo: {
    width: 76,
    height: 20,
    backgroundColor: "transparent",
  },
  textHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  textCartNumber: {
    backgroundColor: "transparent",
    fontSize: 10,
    fontWeight: "bold",
    color: colors.daclen_light,
  },
  image: {
    width: 28,
    height: 28,
    padding: 2,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textUid: {
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: colors.daclen_light,
    marginHorizontal: 12,
  },
  spinner: {
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  products: store.productState.products,
  productItems: store.productState.productItems,
  searchFilter: store.productState.searchFilter,
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  cart: store.userState.cart,
  cartError: store.userState.cartError,
  tempCart: store.userState.tempCart,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateProductSearchFilter,
      alterKeranjang,
      clearKeranjang,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Shop);
