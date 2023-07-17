import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { clearUserData, getCurrentUser } from "../../axios/user";
import { clearKeranjang, storeCheckout } from "../../axios/cart";
import { callMasterkurir, getKurirData } from "../../axios/courier";
import { clearHistoryData } from "../../axios/history";

import CartItem from "../cart/CartItem";
import CartDetails from "../cart/CartDetails";
import CartAction from "../cart/CartAction";
import Separator from "../profile/Separator";
import { colors, dimensions, staticDimensions } from "../../styles/base";

function Checkout(props) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [displayAddress, setDisplayAddress] = useState(null);
  const [addressComplete, setAddressComplete] = useState(false);
  const [allowCheckout, setAllowCheckout] = useState(false);
  const [afterCheckout, setAfterCheckout] = useState(false);
  const [courierLoading, setCourierLoading] = useState(false);

  const [courierChoices, setCourierChoices] = useState([]);
  const [courierSlug, setCourierSlug] = useState(null);
  const [courier, setCourier] = useState(null);
  const [courierService, setCourierService] = useState(null);
  const [courierServices, setCourierServices] = useState([]);
  const [packaging, setPackaging] = useState(null);

  const [points, setPoints] = useState(0);
  const [weight, setWeight] = useState(0);
  const [weightVolume, setWeightVolume] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutJson, setCheckoutJson] = useState(null);

  const { currentUser, token, currentAddress, masterkurir, checkout } = props;
  const navigation = useNavigation();

  useEffect(() => {
    if (
      props.products.length !== products.length &&
      props.products.length > 0
    ) {
      setProducts(props.products);
      props.callMasterkurir(token);
    } else {
      backHome();
    }

    if (token === null || currentUser === null) {
      backHome();
    }

    console.log({
      products: props.products,
      token,
      currentUser,
      checkout,
    });
  }, [props.products, token, currentUser]);

  useEffect(() => {
    if (props.cart === null || props.cart?.jumlah_produk < 1) {
      console.log("empty cart");
      setAllowCheckout(false);
      setCheckoutJson({});
      setCart([]);
      setTotalPrice(0);
      setPoints(0);
      setWeight(0);
      setWeightVolume(0);
      backHome();
    } else {
      console.log(props.cart);
      setCart(props.cart?.produk);
      setTotalPrice(props.cart?.subtotal + deliveryFee);

      try {
        let newPoints = 0;
        let newWeight = 0;
        let newWeightVolume = 0;
        let retrieveDeliveryData = false;

        for (let i = 0; i < props.cart.produk?.length; i++) {
          const quantity = props.cart.produk[i]?.jumlah;
          newWeight += quantity * parseInt(props.cart.produk[i]?.berat);
          newWeightVolume += quantity * props.cart.produk[i]?.berat_dari_volume;
          newPoints += quantity * props.cart.produk[i]?.poin;
        }

        if (newWeight !== weight || newWeightvolume !== weightVolume)
          retrieveDeliveryData = true;

        setPoints(newPoints);
        setWeight(newWeight);
        setWeightVolume(newWeightVolume);

        if (retrieveDeliveryData) {
          console.log("retrieving delivery data again");
          retrieveDeliveryServices();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [props.cart]);

  useEffect(() => {
    if (currentAddress === null || currentAddress === undefined) {
      setAddressComplete(false);
      setDisplayAddress(null);
    } else {
      if (
        currentAddress?.alamat === "" ||
        currentAddress?.provinsi?.id === "" ||
        currentAddress?.kota?.id === "" ||
        currentAddress?.kecamatan?.id === ""
      ) {
        setDisplayAddress(null);
        setAddressComplete(false);
      } else {
        let text = "";
        if (currentAddress?.nama_depan !== null)
          text += currentAddress?.nama_depan;
        if (currentAddress?.nama_belakang !== null) {
          text += ` ${currentAddress?.nama_belakang} | `;
        } else {
          text += " | ";
        }
        if (currentAddress?.nomor_telp !== null)
          text += `${currentAddress?.nomor_telp} | `;
        if (currentAddress?.email !== null)
          text += `${currentAddress?.email} | `;
        if (currentAddress?.alamat !== null) text += currentAddress?.alamat;

        setDisplayAddress(text);
        setAddressComplete(true);
      }
    }

    console.log(currentAddress);
  }, [currentAddress]);

  useEffect(() => {
    setCourier(null);
    setCourierSlug(null);
    setCourierService(null);
    setCourierServices([]);
    setDeliveryFee(0);

    if (masterkurir === undefined || masterkurir.length < 1) {
      setCourierChoices([]);
    } else {
      let newCourierChoices = [];
      for (let i = 0; i < masterkurir.length; i++) {
        if (
          masterkurir[i] !== null &&
          masterkurir[i]?.isDipakai &&
          masterkurir[i]?.nama !== "Custom" &&
          masterkurir[i]?.slug !== "custom"
        ) {
          let label = masterkurir[i]?.nama;
          try {
            label = masterkurir[i].nama.split(" ")[0];
          } catch (e) {
            console.error(e);
          }

          newCourierChoices.push({
            id: masterkurir[i].id.toString(),
            label,
            value: masterkurir[i].slug,
          });
        }
      }
      setCourierChoices(newCourierChoices);
      console.log("newCourierChoices", newCourierChoices);
    }
  }, [masterkurir]);

  useEffect(() => {
    if (courierSlug === null) return;
    const theCourier = masterkurir.find(({ slug }) => slug === courierSlug);
    setCourier(theCourier);
    retrieveDeliveryServices();
  }, [courierSlug]);

  useEffect(() => {
    console.log(props.couriers);
    setCourierService(null);
    setCourierLoading(false);
    setDeliveryFee(0);
    if (
      props.couriers === undefined ||
      props.couriers === null ||
      props.couriers.length < 1
    ) {
      setCourierServices([]);
    } else {
      try {
        let newCourierServices = [];
        for (let i = 0; i < props.couriers.length; i++) {
          newCourierServices.push({
            id: i.toString(),
            label: `${props.couriers[i].service} (${props.couriers[i].cost[0].etd} hari) -- Rp ${props.couriers[i].cost[0].value}`,
            value: i.toString(),
          });
        }
        setCourierServices(newCourierServices);
        console.log("newCourierServices", newCourierServices);
      } catch (e) {
        console.log(e);
      }
    }
  }, [props.couriers]);

  useEffect(() => {
    if (courierService !== null) {
      console.log(courierService);
      try {
        const newDeliveryFee = courierService.cost[0].biaya;
        setDeliveryFee(newDeliveryFee);
        setTotalPrice(props.cart.subtotal + newDeliveryFee);
      } catch (e) {
        console.log(e);
      }
    }
  }, [courierService]);

  useEffect(() => {
    if (deliveryFee > 0) {
      setTotalPrice(props.cart.subtotal + deliveryFee);
    } else {
      setTotalPrice(props.cart.subtotal);
    }
  }, [deliveryFee]);

  useEffect(() => {
    setAllowCheckout(false);
    setCheckoutJson(null);
    console.log({ addressComplete, totalPrice, courierService, deliveryFee });
    if (addressComplete && totalPrice > 0 && packaging !== null && courierService !== null) {
      createCheckoutJson();
    }
  }, [addressComplete, totalPrice, courierService, packaging]);

  useEffect(() => {
    if (checkout !== null) {
      if (afterCheckout) {
        if (checkout.snap_token) {
          const snapToken = checkout?.snap_token;
          const snap_url = checkout?.snap_url;
          //console.log("open MidtransSnap " + snapToken);
          props.clearHistoryData();
          navigation.navigate("OpenMidtrans", { snapToken, snap_url });
        } else {
          setAllowCheckout(true);
        }
        setAfterCheckout(false);
      }
    }
  }, [checkout]);

  const backHome = () => {
    console.log("backHome");
    navigation.navigate("Main");
  };

  const openAddress = () => {
    navigation.navigate("Address", { isCheckout: true });
  };

  const retrieveDeliveryServices = () => {
    const courierMap = {
      slug: courierSlug,
      provinsi: currentAddress.provinsi,
      kota: currentAddress.kota,
      berat: weight > props.cart.berat ? weight : props.cart.berat,
      berat_dari_volume:
        weightVolume > props.cart.berat_dari_volume
          ? Math.ceil(weightVolume)
          : Math.ceil(props.cart.berat_dari_volume),
    };
    console.log(courierMap);
    props.getKurirData(token, courierMap);
  };

  const createCheckoutJson = () => {
    let detail_checkout = { ...currentAddress };
    delete detail_checkout["alamat_short"];
    try {
      const newCheckout = {
        checkout: {
          keranjang_id: props.cart.id,
          kurir: {
            slug: courierSlug,
            nama: courier.nama,
            gratis_ongkir: courierService.cost[0].potongan_biaya,
            data: courierService,
          },
          total: totalPrice,
          metode_pembayaran: "transfer_bank",
          tipe_kemasan: packaging,
        },
        detail_checkout,
        user: {
          saldo: currentUser.komisi_user.total.toString(),
        },
      };
      console.log("createCheckoutJson", newCheckout);
      setCheckoutJson(newCheckout);
      setAllowCheckout(true);
    } catch (e) {
      console.log(e);
      setCheckoutJson(null);
      setAllowCheckout(false);
    }
  };

  const proceedCheckout = () => {
    if (token && checkoutJson !== null) {
      setAllowCheckout(false);
      //setDisplayAddress(true);
      setAfterCheckout(true);
      props.storeCheckout(token, checkoutJson);
    }
  };

  /*const formatPostTimestamp = (date) => {
    return date.toDateString() + " " + date.toLocaleTimeString();
  };
*/

  function onPressRadioButtonCourier(radioButtonsArray) {
    try {
      const chosenCourier = radioButtonsArray.find(
        ({ selected }) => selected === true
      );
      setCourierLoading(true);
      setCourierSlug(chosenCourier?.value);
    } catch (e) {
      console.log(e);
    }
  }

  function onPressRadioButtonService(radioButtonsArray) {
    try {
      const chosenService = radioButtonsArray.find(
        ({ selected }) => selected === true
      );
      setCourierService(props.couriers[parseInt(chosenService?.value)]);
    } catch (e) {
      console.log(e);
    }
  }

  function onPressRadioButtonPackaging(radioButtonsArray) {
    try {
      const chosenPackaging = radioButtonsArray.find(
        ({ selected }) => selected === true
      );
      setPackaging(chosenPackaging?.value);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => openAddress()}>
          <View style={styles.containerHeader}>
            <MaterialCommunityIcons
              name="map"
              size={18}
              color={colors.daclen_blue}
            />
            <View style={styles.containerTitle}>
              <Text style={styles.textAddressHeader}>Alamat Pengiriman</Text>
              <Text
                style={[
                  styles.textAddressDetail,
                  !addressComplete && { color: colors.daclen_danger },
                ]}
              >
                {addressComplete
                  ? displayAddress
                  : "Alamat Pengiriman belum lengkap"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Separator thickness={10} />

        {props.cart === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          <View
            style={[
              styles.container,
              { paddingBottom: staticDimensions.pageBottomPadding },
            ]}
          >
            <View style={styles.containerFlatlist}>
              {cart === undefined ||
              cart === null ||
              cart?.length === undefined ||
              cart?.length < 1 ? (
                <Text style={styles.textUid}>Tidak ada Checkout</Text>
              ) : (
                <FlashList
                  estimatedItemSize={10}
                  numColumns={1}
                  horizontal={false}
                  data={cart}
                  renderItem={({ item }) => (
                    <CartItem item={item} isCart={true} />
                  )}
                />
              )}
            </View>
            <Separator thickness={5} />

            <CartDetails
              isCart={true}
              subtotal={props.cart?.subtotal_currency}
              berat={
                weight > 0
                  ? (weight / 1000).toFixed(2).toString()
                  : props.cart?.berat_formated
              }
              courierChoices={courierChoices}
              courierServices={courierServices}
              packaging={packaging}
              onPressRadioButtonCourier={onPressRadioButtonCourier}
              onPressRadioButtonService={onPressRadioButtonService}
              onPressRadioButtonPackaging={onPressRadioButtonPackaging}
              courierSlug={courierSlug}
              courierService={courierService}
              courierLoading={courierLoading}
              cashback={props.cart?.cashback}
              addressComplete={addressComplete}
            />

            <Separator thickness={10} />
            <Text style={styles.textUid}>
              Data personal Anda akan digunakan untuk proses pemesanan dalam
              membantu kenyamanan Anda melalui aplikasi ini, dan keperluan lain
              yang dijelaskan dalam syarat dan ketentuan kami.
            </Text>
          </View>
        )}
      </ScrollView>

      {totalPrice > 0 && (
        <CartAction
          isCart={true}
          totalPrice={totalPrice}
          buttonAction={() => proceedCheckout()}
          buttonText={null}
          buttonDisabled={!allowCheckout}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  containerHeader: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
  },
  containerTitle: {
    flex: 1,
    marginStart: 10,
  },
  containerFlatlist: {
    justifyContent: "flex-start",
  },
  containerAddress: {
    flex: 1,
  },
  textAddressHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_blue,
    marginBottom: 6,
  },
  textAddressDetail: {
    fontSize: 12,
    color: colors.daclen_black,
  },
  textUid: {
    fontSize: 12,
    marginVertical: 20,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  products: store.productState.products,
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  cart: store.userState.cart,
  currentAddress: store.userState.currentAddress,
  masterkurir: store.userState.masterkurir,
  couriers: store.userState.couriers,
  checkout: store.userState.checkout,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearUserData,
      getCurrentUser,
      clearKeranjang,
      storeCheckout,
      callMasterkurir,
      getKurirData,
      clearHistoryData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Checkout);
