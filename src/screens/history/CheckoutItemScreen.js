import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import CartItem from "../../components/cart/CartItem";
import CartDetails from "../../components/cart/CartDetails";
import CartAction from "../../components/cart/CartAction";
import Separator from "../../components/Separator";
import { colors } from "../../../styles/base";

import {
  getCheckoutItem,
  postPembayaran,
  clearUserCheckoutData,
  confirmCheckout,
} from "../../../axios/history";
import { formatPrice, printCheckoutInvoice } from "../../../axios/cart";
import { checkoutsubtotalcommissionpercentage } from "../../../components/main/constants";
import { createInvoicePDF } from "../../../axios/pdf";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";
import EmptySpinner from "../../components/empty/EmptySpinner";
import { staticDimensions } from "../../styles/base";

function CheckoutItem(props) {
  const { token, userCheckout, checkouts } = props;
  const [checkout, setCheckout] = useState(null);
  const [snapToken, setSnapToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSnap, setLoadingSnap] = useState(null);
  const [saldoCut, setSaldoCut] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    getCheckoutData();
    //console.log("checkoutItem params", props.route.params);
  }, [props.route.params]);

  useEffect(() => {
    if (checkout === null) {
      return;
    }

    //console.log("checkout", checkout?.pembayaran_dengan_saldo[0]?.komisi);
    if (
      checkout?.status === null ||
      checkout?.status.toLowerCase() === "tertunda"
    ) {
      props.postPembayaran(token, checkout?.id);
    }
    if (
      !(
        checkout?.pembayaran_dengan_saldo === undefined ||
        checkout?.pembayaran_dengan_saldo[0] === undefined ||
        checkout?.pembayaran_dengan_saldo[0]?.komisi === undefined ||
        checkout?.pembayaran_dengan_saldo[0]?.komisi === null
      )
    ) {
      setSaldoCut(Math.abs(checkout?.pembayaran_dengan_saldo[0]?.komisi));
      return;
    }
    setSaldoCut(0);
  }, [checkout]);

  useEffect(() => {
    if (refreshing) {
      getCheckoutData();
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    if (userCheckout?.snap_token === null || checkout === null) {
      console.log("userCheckout is", userCheckout);
      setSnapToken(null);
    } else {
      console.log("userCheckout updated", userCheckout);
      setSnapToken(userCheckout?.snap_token);
    }
  }, [userCheckout]);

  const getCheckoutData = () => {
    try {
      if (
        props.route.params?.id === undefined ||
        props.route.params?.id === null
      ) {
        props.clearUserCheckoutData();
        navigation.goBack();
      } else {
        if (
          !(
            checkouts === undefined ||
            checkouts === null ||
            checkouts?.length === undefined ||
            checkouts?.length < 1
          )
        ) {
          const find = checkouts.find(
            ({ id }) => id === props.route.params?.id,
          );
          setCheckout(find ? find : null);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setCheckout(null);
  };

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
    if (
      response === null ||
      response?.data === undefined ||
      response?.data === null
    ) {
      setSuccess(false);
      setError(response?.error ? response?.error : "Gagal mendapatkan invoice");
    } else {
      setError(null);
      const invoicing = await createInvoicePDF(
        response?.data,
        checkout?.invoice,
      );
      if (
        invoicing === null ||
        invoicing?.session === undefined ||
        invoicing?.session === null ||
        invoicing?.session !== "success"
      ) {
        setSuccess(false);
        setError(
          invoicing?.error ? invoicing?.error : "Gagal mencetak invoice",
        );
      } else {
        setSuccess(true);
        setError("Invoice siap untuk dibagikan");
      }
    }
  };

  return (
    <CenteredView title="Detil Checkout" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: staticDimensions.pageBottomPadding }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        {refreshing ? (
          <EmptySpinner />
        ) : checkout === null ||
          checkout?.detail_checkout === undefined ? null : (
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
                    <Text style={styles.textButton}>Download</Text>
                  </TouchableOpacity>
                </View>

                <Text allowFontScaling={false} style={styles.textTitle}>
                  Info Penerima
                </Text>
                <Text allowFontScaling={false} styles={styles.textEntry}>
                  {`${checkout?.detail_checkout?.nama_lengkap}\n${checkout?.detail_checkout?.email}\n${checkout?.detail_checkout?.nomor_telp}`}
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
                  {checkout?.detail_checkout?.alamat_lengkap}
                </Text>
              </View>
            </View>
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
                        100,
                    )
                  : 0
              }
              saldoCut={saldoCut}
            />
          </View>
        )}
      </ScrollView>

      <CartAction
        isCart={false}
        totalPrice={checkout?.total - saldoCut}
        buttonAction={() => openMidtrans()}
        buttonText={
          checkout?.status === "diverifikasi"
            ? "Konfirmasi Diterima"
            : checkout?.status
        }
        buttonDisabled={
          (snapToken === null && checkout?.status === null) ||
          loadingSnap ||
          checkout?.status === "ditolak" ||
          checkout?.status === "diterima" ||
          checkout?.status === "diproses"
        }
      />
      <AlertBox text={error} success={success} onClose={() => setError(null)} />
    </CenteredView>
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
  checkouts: store.historyState.checkouts,
  checkout: store.historyState.checkout,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getCheckoutItem,
      postPembayaran,
      clearUserCheckoutData,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(CheckoutItem);
