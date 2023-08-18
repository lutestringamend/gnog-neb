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

function Product(props) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaPhotos, setMediaPhotos] = useState(null);
  //const rbSheet = useRef();
  const { token, currentUser } = props;
  const name = props.route.params?.nama;
  const navigation = useNavigation();

  useEffect(() => {
    if (props.route.params?.id === null) {
      console.log("productId is null");
      useNavigation().goBack();
      return;
    }

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
    props.navigation.setOptions({
      title: name,
      headerShown: true,
    });
  }, [name]);

  const checkAsyncProductMediaKitData = async (name) => {
    const storagePhotos = await getObjectAsync(ASYNC_MEDIA_WATERMARK_PHOTOS_KEY);
    if (!(storagePhotos === undefined || storagePhotos === null)) {
      setMediaPhotos(storagePhotos[name]);
    }
    setLoading(false);
  }

  const openPhotosSegment = () => {
    navigation.navigate("PhotosSegment", {
      isLast: false,
      sharingAvailability: true,
      title: name,
      photos: mediaPhotos,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {product === null || loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          <ProductSlider id={product?.id} title={name} />
          <View style={styles.containerInfo}>
            <Text style={styles.text}>{name}</Text>
            <View style={styles.containerTitle}>
              <Text style={styles.textPrice}>Rp {product?.harga_currency}</Text>
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
                <Text style={styles.textCategory}>Kategori</Text>
                {product?.tag_produk.map(({ nama }) => (
                  <Text key={nama} style={styles.textTag}>
                    {nama}
                  </Text>
                ))}
              </View>
            )}

          {mediaPhotos === null || mediaPhotos?.length === undefined || mediaPhotos?.length < 1 ? null : (   
              <TouchableOpacity onPress={() => openPhotosSegment()}>
                <View style={styles.containerBenefit}>
                  <MaterialCommunityIcons
                    name="image-multiple"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.textBenefit}>Foto-foto Promosi</Text>
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
      product === null ||
      props.cart === null ||
      props.cart?.jumlah_produk === undefined ||
      props.cart?.jumlah_produk === null ||
      props.cart?.jumlah_produk < 1 ? null : (
        <TouchableOpacity
          style={styles.containerCheckout}
          onPress={() =>
            openCheckout(
              props.navigation,
              false,
              token,
              currentUser,
              props.cart?.jumlah_produk,
              null
            )
          }
        >
          <MaterialCommunityIcons name="cart" size={32} color="white" />
          <View style={styles.containerNumber}>
            <Text style={styles.textNumber}>
              {props.cart?.jumlah_produk.toString()}
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
                  <Text style={styles.textBenefit}>Keuntungan</Text>
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
    padding: 20,
    backgroundColor: colors.daclen_green,
    borderRadius: 100,
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.daclen_black,
    marginVertical: 10,
  },
  textPrice: {
    flex: 1,
    fontSize: 20,
    marginBottom: 10,
    color: colors.daclen_orange,
    fontWeight: "bold",
  },
  textCategory: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_blue,
    paddingEnd: 20,
  },
  textTag: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: colors.daclen_blue,
    color: colors.daclen_light,
    borderRadius: 2,
    marginVertical: 2,
    marginEnd: 4,
  },
  textUid: {
    fontSize: 12,
    marginBottom: 20,
    color: colors.daclen_gray,
  },
  textNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  textBenefit: {
    color: "white",
    fontSize: 14,
    marginStart: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  productItems: store.productState.productItems,
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  cart: store.userState.cart,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      showProduct,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Product);
