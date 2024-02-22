import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import {
  colors,
  staticDimensions,
  dimensions,
} from "../../styles/base";
import ShopItem from "../../components/shop/ShopItem";
import { getObjectAsync } from "../../asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../../asyncstorage/constants";
import { productpaginationnumber } from "../../axios/constants";
import { updateProductSearchFilter } from "../../axios/product";
import { openCheckout } from "../../utils/checkout";
import {
  checkNumberEmpty,
  alterKeranjang,
  clearKeranjang,
} from "../../axios/cart";
import AlertBox from "../../components/alert/AlertBox";
import EmptySpinner from "../../components/empty/EmptySpinner";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import { TEMP_SHOP_CATEGORIES } from "../../models/shop";
import ShopCategory from "../../components/shop/ShopCategory";
import ShopSearch from "../../components/shop/ShopSearch";
import CenteredView from "../../components/view/CenteredView";

const headerHeight = (60 * dimensions.fullWidthAdjusted) / 430;

function ShopScreen(props) {
  const [storageProducts, setStorageProducts] = useState(null);
  const [category, setCategory] = useState("");
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
        null,
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
        `reading asyncProducts of ${asyncProducts?.length} with category ${category}`,
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
          ({ nama }) => nama === category,
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

  const loadCart = () => {
    setCartLoading(true);
    props.alterKeranjang(token, tempCart);
  };

  /*
{
            marginBottom:
              dimensions.fullWidth > staticDimensions.shopMaxWidth
                ? bottomNav.height + staticDimensions.marginHorizontal
                : 0,
          },
  */

  return (
    <CenteredView style={styles.container}>
       <View style={styles.containerHeader}>
          <ShopSearch height={headerHeight} />

          {currentUser?.level === "spv" ||
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
                <ActivityIndicator size="small" color={colors.white} />
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
                      ? "cart"
                      : "cart"
                  }
                  size={(25 * headerHeight) / 60}
                  color={colors.white}
                />
              )}

              {(cart?.produk === undefined ||
                cart?.produk === null ||
                cart?.produk?.length === undefined ||
                cart?.produk?.length < 1 ||
                cart?.jumlah_produk === undefined ||
                cart?.jumlah_produk === null ||
                cart?.jumlah_produk < 1) &&
              tempCartSize < 1 ? null : (
                <View style={styles.containerNumber}>
                  <Text allowFontScaling={false} style={styles.textCartNumber}>
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

        <ScrollView style={styles.containerScroll}>
          {props.searchFilter === null || props.searchFilter === "" ? 
          <View style={styles.containerCategory}>
          <Text
            allowFontScaling={false}
            style={[
              styles.textHeader,
              {
                color: colors.white,
                marginHorizontal: staticDimensions.marginHorizontal,
                marginBottom: 10,
              },
            ]}
          >
            Kategori Produk
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.containerCategoryScroll}
          >
            {TEMP_SHOP_CATEGORIES.map((item, index) => (
              <ShopCategory key={index} {...item} />
            ))}
          </ScrollView>
        </View>
          : null}
          

          <View style={styles.containerFlatlist}>
            {loading ? (
              <EmptySpinner />
            ) : category === "" && props.products.length < 1 ? (
              <EmptyPlaceholder
                title="Shop Kosong"
                text="Tidak ada produk tersedia."
                minHeight={dimensions.fullHeight * 0.5}
              />
            ) : props.searchFilter !== null && products.length < 1 ? (
              <EmptyPlaceholder
                title="Hasil Pencarian Kosong"
                text={`Tidak menemukan produk dari kata pencarian "${props.searchFilter}".`}
                minHeight={dimensions.fullHeight * 0.5}
              />
            ) : category !== "" && products.length < 1 ? (
              <EmptyPlaceholder
                title="Shop Kosong"
                text="Tidak ada produk tersedia di kategori ini."
                minHeight={dimensions.fullHeight * 0.5}
              />
            ) : (
              <View style={styles.containerList}>
                <Text allowFontScaling={false} style={styles.textHeader}>
                  Produk
                </Text>
                <FlashList
                  estimatedItemSize={productpaginationnumber}
                  numColumns={2}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  data={
                    props?.searchFilter === null ||
                    props?.searchFilter === "" ||
                    products?.length === undefined ||
                    products?.length < 1
                      ? props.products
                      : products
                  }
                  contentContainerStyle={styles.containerFlatlistBottom}
                  renderItem={({ item, index }) => (
                    <ShopItem
                      id={index}
                      index={index}
                      {...item}
                      foto_url={
                        item?.thumbnail_url
                          ? item?.thumbnail_url
                          : item?.foto_url
                            ? item?.foto_url
                            : require("../../assets/favicon.png")
                      }
                    />
                  )}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <AlertBox text={cartError} success={false} />
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.daclen_black,
  },
  containerScroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  containerHeader: {
    marginTop: 36,
    marginBottom: 12,
    backgroundColor: "transparent",
    alignItems: "center",
    flexDirection: "row",
    height: headerHeight,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerCart: {
    backgroundColor: colors.daclen_grey_placeholder,
    justifyContent: "center",
    alignItems: "center",
    marginStart: staticDimensions.marginHorizontal,
    width: headerHeight,
    height: headerHeight,
    borderRadius: headerHeight / 2,
  },
  containerCategory: {
    backgroundColor: "transparent",
    marginBottom: staticDimensions.marginHorizontal,
  },
  containerCategoryScroll: {
    backgroundColor: "transparent",
    height: 180,
  },
  containerNumber: {
    backgroundColor: colors.daclen_orange,
    width: headerHeight / 3.5,
    height: headerHeight / 3.5,
    borderRadius: headerHeight / 7,
    position: "absolute",
    top: headerHeight / 7,
    end: headerHeight / 7,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  containerList: {
    flex: 1,
    backgroundColor: "transparent",
  },
  containerFlatlistBottom: {
    backgroundColor: "transparent",
    paddingHorizontal: staticDimensions.marginHorizontal,
    paddingBottom: (320 * dimensions.fullWidthAdjusted) / 430,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 20,
    marginEnd: 10,
    marginVertical: 20,
  },
  containerFlatlist: {
    flex: 1,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    backgroundColor: colors.daclen_grey_light,
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
    marginTop: staticDimensions.marginHorizontal,
    marginStart: 30,
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
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
    fontSize: headerHeight / 5,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  image: {
    width: 28,
    height: 28,
    padding: 2,
    borderRadius: 10,
    marginHorizontal: 6,
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
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(ShopScreen);
