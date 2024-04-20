import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";
import { getObjectAsync } from "../../../components/asyncstorage";

import { colors, staticDimensions, globalUIRatio } from "../../styles/base";
import { showProduct } from "../../../axios/product";
import ProductSlider from "../../components/product/ProductSlider";
import ProductDesc from "../../components/product/ProductDesc";
import { openCheckout } from "../../utils/checkout";
import { ASYNC_MEDIA_WATERMARK_PHOTOS_KEY } from "../../../components/asyncstorage/constants";
import {
  checkNumberEmpty,
  alterKeranjang,
  clearKeranjang,
} from "../../axios/cart";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import TabClose from "../../components/tabs/TabClose";
import Button from "../../components/Button/Button";
import CartOld from "../../components/cart/CartOld";

function ProductScreen(props) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaPhotos, setMediaPhotos] = useState(null);
  const [tempCartSize, setTempCartSize] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const { token, currentUser, cart, tempCart } = props;
  const name = props.route.params?.nama;
  const navigation = useNavigation();

  useEffect(() => {
    if (props.route.params?.id === null) {
      console.log("productId is null");
      navigation.goBack();
      return;
    }
  }, []);

  useEffect(() => {
    const check = props.productItems.find(
      ({ id }) => id === props.route.params?.id,
    );

    if (check === undefined) {
      console.log("productItem is not found");
      setLoading(true);
      setProduct(null);
      props.showProduct(props.route.params.id);
    } else {
      setProduct(check);
      checkAsyncProductMediaKitData(name ? name : check?.nama);
      setLoading(false);
    }
  }, [props.route.params?.id, props.productItems]);

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
    //console.log("redux tempCart", newNum, tempCart);
  }, [tempCart]);

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
        null,
      );
    }
  }, [cart]);

  const checkAsyncProductMediaKitData = async (name) => {
    const storagePhotos = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_PHOTOS_KEY,
    );
    if (!(storagePhotos === undefined || storagePhotos === null)) {
      setMediaPhotos(storagePhotos[name]);
    }
    setLoading(false);
  };

  const openPhotosSegment = () => {
    navigation.navigate("PhotosSegment", {
      isLast: false,
      sharingAvailability: true,
      title: name,
      photos: mediaPhotos,
    });
  };

  const loadCart = () => {
    /*setCartLoading(true);
    props.alterKeranjang(token, tempCart);*/
    openCheckout(
      navigation,
      false,
      token,
      currentUser,
      cart?.jumlah_produk,
      null,
    );
  };

  return (
    <CenteredView style={styles.container}>
      {product === null || loading ? (
        <EmptySpinner />
      ) : (
        <ScrollView style={styles.scrollView}>
          <ProductSlider id={product?.id} title={name} />
          <TabClose
            onPress={() => navigation.goBack()}
            width={50 * globalUIRatio}
            iconSize={25 * globalUIRatio}
            style={styles.buttonClose}
          />
          <View style={styles.containerInfo}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.text}
            >
              {name ? name : product?.nama ? product?.nama : ""}
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.textPrice}
            >
              Rp {product?.harga_currency}
            </Text>

            <View style={styles.containerTitle}>
              {product?.tag_produk === undefined ||
              product?.tag_produk === null ||
              product?.tag_produk?.length === undefined ||
              product?.tag_produk?.length < 1 ? null : (
                <View style={styles.containerCategory}>
                  {product?.tag_produk.map(({ nama }, index) => (
                    <View key={nama} style={[styles.containerTag, {
                      marginEnd: index >= product?.tag_produk?.length - 1 ? 0 : 8 * globalUIRatio,
                    }]}>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        style={[
                          styles.textTag,
                          {
                            marginEnd:
                              index >= product?.tag_produk?.length - 1
                                ? 0
                                : 8 * globalUIRatio,
                          },
                        ]}
                      >
                        {nama}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              {token === null ||
              currentUser === null ||
              currentUser?.id === undefined ||
              currentUser?.isActive === undefined ||
              currentUser?.isActive === null ||
              !currentUser?.isActive ? null : (
                <CartOld produk_id={product?.id} />
              )}
            </View>

            {mediaPhotos === null ||
            mediaPhotos?.length === undefined ||
            mediaPhotos?.length < 1 ? null : (
              <Button
                inverted
                text="Foto Promosi"
                icon="image-multiple"
                onPress={() => openPhotosSegment()}
                bordered
                borderColor={colors.daclen_black}
                fontSize={12 * globalUIRatio}
                iconSize={12 * globalUIRatio}
                style={{
                  width: 150 * globalUIRatio,
                  height: 40 * globalUIRatio,
                  marginVertical: 10 * globalUIRatio,
                  paddingHorizontal: 20 * globalUIRatio,
                  borderRadius: 20 * globalUIRatio,
                }}
              />
            )}

            <ProductDesc
              deskripsi={product?.deskripsi}
              dimensi={product?.dimensi}
              berat={product?.berat}
            />
          </View>
        </ScrollView>
      )}

      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.isActive === undefined ||
      currentUser?.isActive === null ||
      !currentUser?.isActive ||
      currentUser?.level === "spv" ||
      currentUser?.status_member === "supervisor" ||
      product === null ||
      ((cart?.jumlah_produk === undefined ||
        cart?.jumlah_produk === null ||
        cart?.jumlah_produk < 1) &&
        tempCartSize < 1) ? null : (
        <TouchableOpacity
          style={styles.containerCheckout}
          onPress={() => loadCart()}
        >
          {cartLoading ? (
            <ActivityIndicator
              size={40 * globalUIRatio}
              color={colors.white}
              style={styles.spinner}
            />
          ) : (
            <MaterialCommunityIcons
              name="cart"
              size={40 * globalUIRatio}
              color={colors.white}
            />
          )}

          <View style={styles.containerNumber}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.textNumber}>
              {tempCartSize > 0 ? tempCartSize : cart?.jumlah_produk}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </CenteredView>
  );
}

/*
containercheckout background
{
              backgroundColor:
                tempCartSize < 1 ||
                cart === null ||
                cart?.jumlah_produk === undefined ||
                cart?.jumlah_produk === null ||
                tempCartSize === parseInt(cart?.jumlah_produk)
                  ? colors.daclen_grey_placeholder
                  : colors.daclen_black,
            },
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  containerSpinner: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
    paddingBottom: staticDimensions.pageBottomPadding / 2,
  },
  containerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerInfo: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  containerCategory: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginEnd: 8 * globalUIRatio,
  },
  containerNumber: {
    position: "absolute",
    end: 10 * globalUIRatio,
    top: 10 * globalUIRatio,
    elevation: 12,
    padding: 2 * globalUIRatio,
    backgroundColor: colors.daclen_danger,
    width: 20 * globalUIRatio,
    height: 20 * globalUIRatio,
    borderRadius: 10 * globalUIRatio,
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    flex: 1 / 3,
  },
  containerCheckout: {
    position: "absolute",
    end: staticDimensions.marginHorizontal,
    bottom: 40 * globalUIRatio,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 80 * globalUIRatio,
    height: 80 * globalUIRatio,
    borderRadius: 40 * globalUIRatio,
    backgroundColor: colors.daclen_black,
  },
  containerTag: {
    height: 30 * globalUIRatio,
    paddingHorizontal: 16 * globalUIRatio,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.daclen_grey_light,
    borderRadius: 6 * globalUIRatio,
  },
  buttonClose: {
    backgroundColor: "transparent",
    position: "absolute",
    top: staticDimensions.marginHorizontal,
    start: staticDimensions.marginHorizontal,
    zIndex: 100,
  },
  text: {
    fontFamily: "Poppins-Light",
    fontSize: 24 * globalUIRatio,
    color: colors.daclen_black,
  },
  textPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18 * globalUIRatio,
    marginVertical: 10 * globalUIRatio,
    color: colors.daclen_black,
  },
  textCategory: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: colors.white,
    paddingEnd: 20,
  },
  textTag: {
    fontSize: 12 * globalUIRatio,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    color: colors.daclen_black,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginBottom: 20,
    color: colors.daclen_gray,
  },
  textNumber: {
    fontSize: 11 * globalUIRatio,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  productItems: store.productState.productItems,
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  cart: store.userState.cart,
  tempCart: store.userState.tempCart,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      showProduct,
      alterKeranjang,
      clearKeranjang,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(ProductScreen);
