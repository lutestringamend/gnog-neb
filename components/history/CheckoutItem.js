import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import CartItem from "../cart/CartItem";
import CartDetails from "../cart/CartDetails";
import CartAction from "../cart/CartAction";
import Separator from "../profile/Separator";
import { colors } from "../../styles/base";

import {
  getCheckoutItem,
  postPembayaran,
  clearUserCheckoutData,
  confirmCheckout,
} from "../../axios/history";
import { formatPrice, printCheckoutInvoice } from "../../axios/cart";
import { checkoutsubtotalcommissionpercentage } from "../main/constants";
import { createInvoicePDF } from "../../axios/pdf";

function CheckoutItem(props) {
  const { checkout, token, userCheckout } = props;
  const [snapToken, setSnapToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSnap, setLoadingSnap] = useState(null);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (
      props.route.params?.id !== null &&
      props.route.params?.id !== undefined
    ) {
      props.getCheckoutItem(props.route.params?.id);
    }
  }, [props.route.params?.id]);

  useEffect(() => {
    if (checkout === null && !refreshing) {
      props.clearUserCheckoutData();
      console.log("checkout is null");
    } else {
      console.log("checkout", checkout);
      if (
        checkout?.status === null ||
        checkout?.status.toLowerCase() === "tertunda"
      ) {
        props.postPembayaran(token, checkout?.id);
      }
    }
  }, [checkout]);

  useEffect(() => {
    if (refreshing) {
      if (
        props.route.params?.id !== null &&
        props.route.params?.id !== undefined
      ) {
        props.getCheckoutItem(props.route.params?.id);
      }
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    if (userCheckout?.snap_token === null || checkout === null) {
      console.log("userCheckout is null", userCheckout);
      setSnapToken(null);
    } else {
      console.log("userCheckout updated", userCheckout);
      setSnapToken(userCheckout?.snap_token);
    }
  }, [userCheckout]);

  const openMidtrans = () => {
    setLoadingSnap(true);
    if (checkout?.status === "diverifikasi") {
      proceedConfirmCheckout();
    } else if (snapToken !== null) {
      try {
        console.log("open snap " + snapToken);
        navigation.navigate("OpenMidtrans", {
          snapToken,
          snap_url: userCheckout?.snap_url,
          checkoutId: checkout?.id,
        });
      } catch (e) {
        console.log(e);
      }
      setLoadingSnap(false);
    }
  };

  const proceedConfirmCheckout = async () => {
    const response = await confirmCheckout(token, checkout?.id);
    console.log("confirmCheckout response", response);
    if (response === true) {
      navigation.goBack();
    }
    setLoadingSnap(false);
  };

  const downloadInvoice = async () => {
    const response = await printCheckoutInvoice(token, checkout?.id);
    if (response === null || response?.data === undefined || response?.data === null) {
      setError(response?.error ? response?.error : "Gagal mendapatkan invoice");
    } else {
      setError(null);
      const invoicing = await createInvoicePDF(response?.data, checkout?.invoice);
      if (invoicing === null || invoicing?.session === undefined || invoicing?.session === null || invoicing?.session !== "success") {
        setError(invoicing?.error ? invoicing?.error : "Gagal mencetak invoice");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text allowFontScaling={false} style={styles.textError}>
          {error}
        </Text>
      ) : null}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        {checkout === null ||
        checkout?.detail_checkout === undefined ||
        refreshing ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          <View style={styles.container}>
            <View style={styles.containerHeader}>
              <View style={styles.containerDescVertical}>
                <View style={styles.containerHorizontal}>
                  <View style={styles.containerInvoiceDetails}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.textTitle, { marginTop: 0 }]}
                    >
                      Nomor Invoice
                    </Text>
                    <Text allowFontScaling={false} styles={styles.textInvoice}>
                      {checkout?.invoice}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => downloadInvoice()}
                    style={styles.button}
                  >
                    <MaterialCommunityIcons
                      name="printer"
                      size={16}
                      color={colors.daclen_light}
                      style={styles.icon}
                    />
                    <Text style={styles.textButton}>Download Invoice</Text>
                  </TouchableOpacity>
                </View>

                <Text allowFontScaling={false} style={styles.textTitle}>
                  Info Penerima
                </Text>
                <Text allowFontScaling={false} styles={styles.textEntry}>
                  {`${checkout.detail_checkout?.nama_lengkap}\n${checkout.detail_checkout?.email}\n${checkout.detail_checkout?.nomor_telp}`}
                </Text>

                <Text allowFontScaling={false} style={styles.textTitle}>
                  Kurir Pengiriman
                </Text>
                <Text allowFontScaling={false} styles={styles.textEntry}>
                  {checkout.kurir?.nama}
                </Text>

                <Text allowFontScaling={false} style={styles.textTitle}>
                  Alamat Pengiriman
                </Text>
                <Text allowFontScaling={false} styles={styles.textEntry}>
                  {checkout.detail_checkout?.alamat_lengkap}
                </Text>
              </View>
            </View>
            <Separator thickness={5} />
            <View style={styles.containerFlatlist}>
              {checkout.keranjang?.produk?.length < 1 ? (
                <Text allowFontScaling={false} style={styles.textUid}>
                  Tidak ada Checkout
                </Text>
              ) : (
                <FlashList
                  estimatedItemSize={10}
                  numColumns={1}
                  horizontal={false}
                  data={checkout.keranjang?.produk}
                  renderItem={({ item }) => (
                    <CartItem item={item} isCart={false} />
                  )}
                />
              )}
            </View>
            <Separator thickness={5} />
            <CartDetails
              isCart={false}
              subtotal={checkout?.keranjang?.subtotal_currency}
              berat={checkout?.keranjang?.berat_formated}
              priceOriginal={checkout?.kurir?.harga.toString()}
              priceDiscount={(
                checkout?.kurir?.harga - checkout.kurir?.gratis_ongkir
              ).toString()}
              cashback={
                checkout?.keranjang?.subtotal
                  ? formatPrice(
                      (checkoutsubtotalcommissionpercentage *
                        checkout?.keranjang?.subtotal) /
                        100
                    )
                  : 0
              }
            />
          </View>
        )}
      </ScrollView>

      <CartAction
        isCart={false}
        totalPrice={checkout?.total}
        buttonAction={() => openMidtrans()}
        buttonText={
          checkout?.status === "diverifikasi"
            ? "Konfirmasi Diterima"
            : checkout?.status
        }
        buttonDisabled={
          (checkout?.status === null && snapToken === null) ||
          loadingSnap ||
          checkout?.status === "ditolak" ||
          checkout?.status === "diterima"
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  containerHeader: {
    padding: 10,
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  containerDescVertical: {
    flex: 1,
    marginHorizontal: 10,
  },
  containerDescHorizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerInvoiceDetails: {
    backgroundColor: "transparent",
    alignSelf: "center",
    flex: 1,
  },
  containerFlatlist: {
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
  },
  containerEntry: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_green,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    elevation: 2,
  },
  textButton: {
    alignSelf: "center",
    marginStart: 10,
    color: colors.daclen_light,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
  textTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_blue,
    marginTop: 12,
    marginBottom: 4,
  },
  textInvoice: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    color: colors.daclen_black,
    marginBottom: 4,
  },
  textEntry: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_gray,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginVertical: 20,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  icon: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  userCheckout: store.userState.checkout,
  checkout: store.historyState.checkout,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getCheckoutItem,
      postPembayaran,
      clearUserCheckoutData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(CheckoutItem);
