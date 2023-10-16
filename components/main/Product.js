import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";
import { getObjectAsync } from "../asyncstorage";

import { showProduct } from "../../axios/product";
import Cart from "../cart/Cart";
import ProductSlider from "./ProductSlider";
import ProductDesc from "./ProductDesc";
/*import ProductModal from "../modal/ProductModal";
import useModal from "../../hook/useModal";
import BSPopup from "../bottomsheets/BSPopup";
import BSProductBenefit from "../bottomsheets/BSProductBenefit";*/
import { openCheckout } from "./CheckoutScreen";
import { colors, staticDimensions } from "../../styles/base";
import { ASYNC_MEDIA_WATERMARK_PHOTOS_KEY } from "../asyncstorage/constants";
import { checkNumberEmpty, alterKeranjang } from "../../axios/cart";

function Product(props) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaPhotos, setMediaPhotos] = useState(null);
  const [tempCartSize, setTempCartSize] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  //const rbSheet = useRef();
  const { token, currentUser, cart, tempCart } = props;
  const name = props.route.params?.nama;
  const navigation = useNavigation();

  useEffect(() => {
    if (props.route.params?.id === null) {
      console.log("productId is null");
      navigation.goBack();
      return;
    }

    props.navigation.setOptions({
      title: name,
      headerShown: true,
    });
  }, []);

  useEffect(() => {
    const check = props.productItems.find(
      ({ id }) => id === props.route.params?.id
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
        null
      );
    }
  }, [cart]);

  const checkAsyncProductMediaKitData = async (name) => {
    const storagePhotos = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_PHOTOS_KEY
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
    setCartLoading(true);
    props.alterKeranjang(token, tempCart);
  };

  return (
    <SafeAreaView style={styles.container}>
      {product === null || loading ? (
        <View style={styles.containerSpinner}>
          <ActivityIndicator
            size="large"
            color={colors.daclen_gray}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <ProductSlider id={product?.id} title={name} />
          <View style={styles.containerInfo}>
            <Text allowFontScaling={false} style={styles.text}>
              {name ? name : product?.nama ? product?.nama : ""}
            </Text>
            <View style={styles.containerTitle}>
              <Text allowFontScaling={false} style={styles.textPrice}>
                Rp {product?.harga_currency}
              </Text>
              {token === null ||
              currentUser === null ||
              currentUser?.id === undefined ||
              currentUser?.isActive === undefined ||
              currentUser?.isActive === null ||
              !currentUser?.isActive ? null : (
                <Cart produk_id={product?.id} />
              )}
            </View>

            {product?.tag_produk === undefined ||
            product?.tag_produk === null ||
            product?.tag_produk?.length === undefined ||
            product?.tag_produk?.length < 1 ? null : (
              <View style={styles.containerCategory}>
                <Text allowFontScaling={false} style={styles.textCategory}>
                  Kategori
                </Text>
                {product?.tag_produk.map(({ nama }) => (
                  <Text
                    allowFontScaling={false}
                    key={nama}
                    style={styles.textTag}
                  >
                    {nama}
                  </Text>
                ))}
              </View>
            )}

            {mediaPhotos === null ||
            mediaPhotos?.length === undefined ||
            mediaPhotos?.length < 1 ? null : (
              <TouchableOpacity onPress={() => openPhotosSegment()}>
                <View style={styles.containerBenefit}>
                  <MaterialCommunityIcons
                    name="image-multiple"
                    size={20}
                    color="white"
                  />
                  <Text allowFontScaling={false} style={styles.textBenefit}>
                    Foto Promosi
                  </Text>
                </View>
              </TouchableOpacity>
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
          style={[
            styles.containerCheckout,
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
          onPress={() => loadCart()}
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
              size={32}
              color={colors.daclen_light}
            />
          )}

          <View style={styles.containerNumber}>
            <Text allowFontScaling={false} style={styles.textNumber}>
              {tempCartSize > 0 ? tempCartSize : cart?.jumlah_produk}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

/*
            {product?.poin_produk !== null && (
              <TouchableOpacity onPress={() => rbSheet.current.open()}>
                <View style={styles.containerBenefit}>
                  <MaterialCommunityIcons
                    name="hand-coin"
                    size={20}
                    color="white"
                  />
                  <Text allowFontScaling={false} style={styles.textBenefit}>Keuntungan</Text>
                </View>
              </TouchableOpacity>
            )}

            <RBSheet ref={rbSheet} openDuration={250} height={300}>
        <BSPopup
          title="Keuntungan"
          content={
            <BSProductBenefit
              poin={product?.poin_produk?.poin}
              komisi={product?.poin_produk?.komisi}
              harga_value={product?.harga}
            />
          }
          buttonNegative={null}
          closeThis={() => rbSheet.current.close()}
          onPress={null}
        />
      </RBSheet>
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
    paddingBottom: staticDimensions.pageBottomPadding,
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
  },
  containerBenefit: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.daclen_orange,
    marginVertical: 14,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  containerNumber: {
    position: "absolute",
    end: 10,
    top: 10,
    elevation: 12,
    padding: 2,
    backgroundColor: colors.daclen_orange,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  containerImage: {
    flex: 1 / 3,
  },
  containerCheckout: {
    position: "absolute",
    end: 12,
    bottom: 40,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.daclen_green,
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  text: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: colors.daclen_black,
    marginVertical: 10,
  },
  textPrice: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 16,
    marginBottom: 10,
    color: colors.daclen_orange,
    fontFamily: "Poppins-SemiBold",
  },
  textCategory: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: colors.daclen_gray,
    paddingEnd: 20,
  },
  textTag: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    backgroundColor: colors.daclen_green,
    color: colors.daclen_light,
    borderRadius: 2,
    marginVertical: 2,
    marginEnd: 4,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginBottom: 20,
    color: colors.daclen_gray,
  },
  textNumber: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    textAlign: "center",
  },
  textBenefit: {
    color: colors.white,
    fontSize: 14,
    marginStart: 10,
    fontFamily: "Poppins-SemiBold",
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Product);
