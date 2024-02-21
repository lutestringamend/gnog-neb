import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../styles/base";
import ShopItem from "../../src/components/shop/ShopItem";
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

const screenWidth = Dimensions.get("window").width;

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
    if (cart !== null && cartLoading) {
      openCheckout(
        navigation,
        false,
        token,
        currentUser,
        tempCartSize > 0 ? tempCartSize : cart?.jumlah_produk,
        null
      );
    }
    if (cartLoading) {
      setCartLoading(false);
    }
    //console.log("redux cart", cart);
  }, [cart]);

  useEffect(() => {
    if (
      tempCart === null ||
      tempCart?.length === undefined ||
      tempCart?.length < 1
    ) {
      setTempCartSize(0);
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
      setCartLoading(true);
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
    <View style={styles.container}>
      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ? null : (
        <View
          style={[
            styles.containerHeader,
            isSearch
              ? {
                  backgroundColor: colors.daclen_black,
                  width: screenWidth - 60,
                }
              : {
                  backgroundColor:
                    cart === null ||
                    cart?.produk === undefined ||
                    cart?.produk === null ||
                    cart?.produk?.length === undefined ||
                    cart?.produk?.length < 1 ||
                    cart?.jumlah_produk === undefined ||
                    cart?.jumlah_produk === null ||
                    cart?.jumlah_produk < 1
                      ? tempCartSize < 1
                        ? colors.daclen_black
                        : tempCartSize === parseInt(cart?.jumlah_produk)
                        ? colors.daclen_gray
                        : colors.daclen_blue
                      : colors.daclen_blue,
                },
          ]}
        >
          <View style={[styles.containerLogo, isSearch ? { flex: 1 } : null]}>
            {isSearch ? (
              null
            ) : currentUser?.level === "spv" ||
              currentUser?.status_member === "supervisor" ? null : (
              <TouchableOpacity
                onPress={() => loadCart()}
                style={styles.containerCart}
                disabled={
                  (cart?.produk === undefined ||
                    cart?.produk === null ||
                    cart?.produk?.length === undefined ||
                    cart?.produk?.length < 1 ||
                    cart?.jumlah_produk === undefined ||
                    cart?.jumlah_produk === null ||
                    cart?.jumlah_produk < 1) &&
                  tempCartSize < 1
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
                    name={
                      (cart?.produk === undefined ||
                        cart?.produk === null ||
                        cart?.produk?.length === undefined ||
                        cart?.produk?.length < 1 ||
                        cart?.jumlah_produk === undefined ||
                        cart?.jumlah_produk === null ||
                        cart?.jumlah_produk < 1) &&
                      tempCartSize < 1
                        ? "cart-outline"
                        : "cart"
                    }
                    size={18}
                    color={colors.daclen_light}
                  />
                )}

                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textCart,
                    {
                      fontFamily:
                        (cart?.produk === undefined ||
                          cart?.produk === null ||
                          cart?.produk?.length === undefined ||
                          cart?.produk?.length < 1 ||
                          cart?.jumlah_produk === undefined ||
                          cart?.jumlah_produk === null ||
                          cart?.jumlah_produk < 1) &&
                        tempCartSize < 1
                          ? "Poppins"
                          : "Poppins-SemiBold",
                    },
                  ]}
                >
                  Keranjang Belanja
                </Text>

                {(cart?.produk === undefined ||
                  cart?.produk === null ||
                  cart?.produk?.length === undefined ||
                  cart?.produk?.length < 1 ||
                  cart?.jumlah_produk === undefined ||
                  cart?.jumlah_produk === null ||
                  cart?.jumlah_produk < 1) &&
                tempCartSize < 1 ? null : (
                  <View style={styles.containerNumber}>
                    <Text
                      allowFontScaling={false}
                      style={styles.textCartNumber}
                    >
                      {tempCartSize > 0
                        ? tempCartSize
                        : cart?.jumlah_produk
                        ? cart?.jumlah_produk
                        : 0}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.containerSearchIcon}
            onPress={() => toggleSearchIcon()}
          >
            <MaterialCommunityIcons
              name={isSearch ? "close" : "magnify"}
              size={24}
              color={colors.daclen_light}
            />
          </TouchableOpacity>
        </View>
      )}

      {cartError ? (
        <Text allowFontScaling={false} style={styles.textError}>
          {cartError}
        </Text>
      ) : null}

      <View
        style={[
          styles.containerFlatlist,
          { justifyContent: loading ? "center" : "flex-start" },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : category === "" && props.products.length < 1 ? (
          <Text allowFontScaling={false} style={styles.textUid}>
            Tidak ada produk tersedia
          </Text>
        ) : props.searchFilter !== null && products.length < 1 ? (
          <Text allowFontScaling={false} style={styles.textUid}>
            Tidak menemukan produk dari kata pencarian "{props.searchFilter}"
          </Text>
        ) : category !== "" && products.length < 1 ? (
          <Text allowFontScaling={false} style={styles.textUid}>
            Tidak ada produk tersedia di kategori ini
          </Text>
        ) : (
          <View style={styles.containerList}>
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
            contentContainerStyle={[
              styles.containerFlatlistBottom,
              screenWidth > staticDimensions.shopMaxWidth
                ? {
                    borderEndWidth: 1,
                    borderEndColor: colors.daclen_gray,
                  }
                : null,
            ]}
            renderItem={({ item, index }) => (
              <ShopItem
                id={item?.id}
                index={index}
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
            </View>
          
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
    marginBottom: 20,
  },
  containerHeader: {
    marginTop: 20,
    marginBottom: 12,
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    alignItems: "center",
    flexDirection: "row",
    maxWidth: screenWidth - 60,
    height: 36,
    borderWidth: 1,
    borderColor: colors.daclen_light,
    borderTopStartRadius: 6,
    borderBottomStartRadius: 6,
  },
  containerLogo: {
    marginHorizontal: 12,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerSearchIcon: {
    backgroundColor: colors.daclen_search_grey,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: "100%",
  },
  containerCart: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  containerNumber: {
    backgroundColor: colors.daclen_orange,
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  containerList: {
    flex: 1,
    backgroundColor: "transparent",
    alignSelf: "center",
    width:
      screenWidth < staticDimensions.shopMaxWidth
        ? screenWidth
        : staticDimensions.shopMaxWidth,
  },
  containerFlatlistBottom: {
    backgroundColor: "transparent",
    paddingBottom: staticDimensions.pageBottomPadding / 2,
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
    zIndex: 2,
    backgroundColor: "transparent",
    alignSelf: "center",
    width:
      screenWidth < staticDimensions.shopMaxWidth
        ? screenWidth
        : staticDimensions.shopMaxWidth,
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
    fontFamily: "Poppins-Bold",
    textAlign: "left",
  },
  textCart: {
    backgroundColor: "transparent",
    fontSize: 12,
    fontFamily: "Poppins",
    height: "100%",
    textAlignVertical: "center",
    color: colors.daclen_light,
    alignSelf: "center",
    marginHorizontal: 6,
  },
  textCartNumber: {
    backgroundColor: "transparent",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
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
    fontFamily: "Poppins-Bold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textUid: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
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
