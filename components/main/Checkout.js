import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { clearUserData, getCurrentUser, getRiwayatPenarikanSaldo } from "../../axios/user";
import {
  clearKeranjang,
  formatPrice,
  storeCheckout,
  overhaulReduxCart,
  overhaulReduxTempCart,
  processPhoneNumberforCheckout,
} from "../../axios/cart";
import { callMasterkurir, getKurirData } from "../../axios/courier";
import { clearHistoryData } from "../../axios/history";

import CartItem from "../cart/CartItem";
import CartDetails from "../cart/CartDetails";
import CartAction from "../cart/CartAction";
import Separator from "../profile/Separator";
import { colors, staticDimensions } from "../../styles/base";
import {
  checkoutdefaultsendername,
  checkoutdefaultsendernameoption,
  checkoutdisclaimer,
  checkoutsubtotalcommissionpercentage,
} from "./constants";
import BSPopup from "../bottomsheets/BSPopup";
import CheckoutSenderName from "./CheckoutSenderName";
import { sentryLog } from "../../sentry";
import { ASYNC_HISTORY_CHECKOUT_KEY } from "../asyncstorage/constants";
import { setObjectAsync } from "../asyncstorage";

const defaultSaldo = {
  used: 0,
  available: 0,
};

function Checkout(props) {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  const [customAddress, setCustomAddress] = useState(null);
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
  //const [packaging, setPackaging] = useState(null);
  const packaging = "Box";

  const [senderNameChoices, setSenderNameChoices] = useState([
    checkoutdefaultsendernameoption,
  ]);
  const [senderName, setSenderName] = useState({
    final: checkoutdefaultsendername,
    temp: checkoutdefaultsendername,
  });

  const [points, setPoints] = useState(0);
  const [weight, setWeight] = useState(0);
  const [weightVolume, setWeightVolume] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [saldo, setSaldo] = useState(defaultSaldo);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutJson, setCheckoutJson] = useState(null);
  const [allowSaldo, setAllowSaldo] = useState(false);

  const {
    currentUser,
    token,
    currentAddress,
    masterkurir,
    checkout,
    checkoutError,
    addresses,
    addressId,
    riwayatSaldo,
  } = props;
  const rbDisclaimer = useRef();
  const rbSenderName = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    if (
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.isActive === undefined ||
      currentUser?.isActive === null ||
      !currentUser?.isActive
    ) {
      backHome();
      return;
    }

    if (
      currentUser?.komisi_user === undefined ||
      currentUser?.komisi_user === null ||
      currentUser?.komisi_user?.total === undefined ||
      currentUser?.komisi_user?.total === null
    ) {
      setSaldo(defaultSaldo);
    } else {
      setSaldo({
        available: parseInt(currentUser?.komisi_user?.total),
        used: 0,
      });
    }
    props.getRiwayatPenarikanSaldo(currentUser?.id, token);
    props.callMasterkurir(token);
    let newSenderNameChoices = [checkoutdefaultsendernameoption];
    if (!(currentUser?.name === undefined || currentUser?.name === null)) {
      newSenderNameChoices.unshift({
        id: 1,
        label: currentUser?.name,
        value: currentUser?.name,
      });
    }
    if (
      !(
        currentUser?.detail_user === undefined ||
        currentUser?.detail_user === null ||
        currentUser?.detail_user?.nama_lengkap === undefined ||
        currentUser?.detail_user?.nama_lengkap === null
      )
    ) {
      newSenderNameChoices.unshift({
        id: 2,
        label: currentUser?.detail_user?.nama_lengkap,
        value: currentUser?.detail_user?.nama_lengkap,
      });
    }
    setSenderNameChoices(newSenderNameChoices);
    console.log("redux checkout", checkout);
  }, [currentUser]);

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
      console.log("redux cart", props.cart);
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

        console.log("weight weightVolume", newWeight, newWeightVolume);
        setPoints(newPoints);
        setWeight(newWeight);
        //setWeight(newWeightVolume);
        setWeightVolume(newWeightVolume);

        if (retrieveDeliveryData) {
          console.log("retrieving delivery data again");
          clearOutDelivery();
          if (
            addressId === null ||
            addressId === "" ||
            addressId === "default"
          ) {
            retrieveDeliveryServices(
              currentAddress?.provinsi,
              currentAddress?.kota
            );
          } else {
            retrieveDeliveryServices(
              customAddress?.provinsi,
              customAddress?.kota
            );
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [props.cart]);

  useEffect(() => {
    console.log("addressId", addressId);
    if (
      addressId === null ||
      addressId === "" ||
      addressId === "default" ||
      addresses?.length === undefined ||
      addresses?.length < 1
    ) {
      console.log("addresses", addresses);
      clearOutDelivery();
      retrieveDeliveryServices(currentAddress?.provinsi, currentAddress?.kota);
      setDefaultAddress();
    } else {
      checkCustomAddress();
      console.log("addressId", addressId);
    }
  }, [addressId, addresses]);

  useEffect(() => {
    if (
      (addressId === null || addressId === "" || addressId === "default") &&
      !(currentAddress?.provinsi == null || currentAddress?.kota === null)
    ) {
      clearOutDelivery();
      retrieveDeliveryServices(currentAddress?.provinsi, currentAddress?.kota);
    }
  }, [currentAddress]);

  useEffect(() => {
    if (customAddress === null) {
      return;
    }
    if (!(addressId === null || addressId === "" || addressId === "default")) {
      clearOutDelivery();
      retrieveDeliveryServices(customAddress?.provinsi, customAddress?.kota);
    }
    setDisplayAddress(
      `${customAddress?.nama_depan} ${
        customAddress?.nama_belakang ? customAddress?.nama_belakang : ""
      } | ${customAddress?.nomor_telp}\n${customAddress?.alamat}${
        customAddress?.provinsi?.name
          ? `, ${customAddress?.provinsi?.name}`
          : ""
      }${customAddress?.kota?.name ? `, ${customAddress?.kota?.name}` : ""}${
        customAddress?.kecamatan?.name
          ? `, ${customAddress?.kecamatan?.name}`
          : ""
      }  ${customAddress?.kode_pos}`
    );
    setAddressComplete(true);
    console.log("customAddress", customAddress);
  }, [customAddress]);

  useEffect(() => {
    clearOutDelivery();

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
    console.log("theCourier", theCourier);
    setCourier(theCourier);
    if (addressId === null || addressId === "" || addressId === "default") {
      retrieveDeliveryServices(currentAddress?.provinsi, currentAddress?.kota);
    } else {
      retrieveDeliveryServices(customAddress?.provinsi, customAddress?.kota);
    }
  }, [courierSlug]);

  useEffect(() => {
    console.log("redux couriers", props.couriers, props.couriers?.cost);
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
            label: `${props.couriers[i].service}${
              props.couriers[i].cost[0].etd
                ? ` (${props.couriers[i].cost[0].etd} hari)`
                : ""
            } -- ${formatPrice(props.couriers[i].cost[0].value)}`,
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
        const newDeliveryFee =
          parseInt(courierService.cost[0].biaya) < 0
            ? 0
            : parseInt(courierService.cost[0].biaya);
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
    if (
      addressComplete &&
      totalPrice > 0 &&
      packaging !== null &&
      courierService !== null
    ) {
      createCheckoutJson();
    }
  }, [addressComplete, totalPrice, courierService, packaging]);

  useEffect(() => {
    try {
      if (!(riwayatSaldo === null || riwayatSaldo?.length === undefined || riwayatSaldo?.length < 1)) {
        let allWithdrawalsDone = true;
        for (let s of riwayatSaldo) {
          if (s?.status.toLowerCase() === "diproses") {
            allWithdrawalsDone = false;
          }
        }
        setAllowSaldo(allWithdrawalsDone);
        console.log("redux riwayatSaldo", riwayatSaldo?.length, allWithdrawalsDone);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setAllowSaldo(false);
  }, [riwayatSaldo]);

  useEffect(() => {
    if (checkout !== null) {
      if (afterCheckout) {
        if (checkout?.snap_token) {
          proceedMidtrans(checkout?.snap_token, checkout?.snap_url);
        } else {
          setError("Gagal membuka Midtrans. Mohon hubungi Daclen Care.");
          setAllowCheckout(true);
        }
        setAfterCheckout(false);
      }
    }
  }, [checkout]);

  useEffect(() => {
    if (checkoutError === null) {
      return;
    }
    if (afterCheckout) {
      try {
        setError(checkoutError?.response?.data?.message);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            checkoutError?.response?.data?.message,
            ToastAndroid.LONG
          );
        } else {
          console.log(
            "redux checkoutError",
            checkoutError,
            checkoutError?.response?.data?.message
          );
        }
      } catch (e) {
        console.error(e);
        setError(checkoutError.toString());
      }
      //setError("Checkout tidak berhasil. Mohon menghubungi Daclen Care.");
      setAfterCheckout(false);
      setAllowCheckout(true);
    }
  }, [checkoutError]);

  useEffect(() => {
    console.log("saldo", saldo);
    if (checkoutJson === null) {
      return;
    }
    setCheckoutJson({
      ...checkoutJson,
      user: {
        saldo: (saldo.available - saldo.used).toString(),
      },
    });
  }, [saldo]);

  useEffect(() => {
    if (checkoutJson === null) {
      return;
    }
    console.log("checkoutJson", checkoutJson);
  }, [checkoutJson]);

  const openCheckoutErrorDetails = () => {
    try {
      if (checkoutError !== null) {
        setError(checkoutError?.response?.data?.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const proceedMidtrans = async (snapToken, snap_url) => {
    props.overhaulReduxTempCart([]);
    props.overhaulReduxCart(null);
    props.clearHistoryData();
    navigation.navigate("OpenMidtrans", { snapToken, snap_url });
  };

  const setDefaultAddress = () => {
    if (
      currentAddress === null ||
      currentAddress === undefined ||
      currentAddress?.alamat === "" ||
      currentAddress?.provinsi?.id === "" ||
      currentAddress?.kota?.id === "" ||
      currentAddress?.kecamatan?.id === ""
    ) {
      setAddressComplete(false);
      setDisplayAddress(null);
      return;
    }
    setCustomAddress(null);
    setDisplayAddress(
      `${currentAddress?.nama_depan} ${
        currentAddress?.nama_belakang ? currentAddress?.nama_belakang : ""
      } | ${currentAddress?.nomor_telp}\n${currentAddress?.alamat}${
        currentAddress?.provinsi?.name
          ? `, ${currentAddress?.provinsi?.name}`
          : ""
      }${currentAddress?.kota?.name ? `, ${currentAddress?.kota?.name}` : ""}${
        currentAddress?.kecamatan?.name
          ? `, ${currentAddress?.kecamatan?.name}`
          : ""
      } ${currentAddress?.kode_pos}`
    );
    setAddressComplete(true);
    console.log("currentAddress set", currentAddress);
  };

  const checkCustomAddress = () => {
    try {
      for (let otherAddress of addresses) {
        if (otherAddress?.id === addressId) {
          let provinsi = {
            id: otherAddress?.provinsi_id,
            name: otherAddress?.provinsi_name,
          };
          let kota = {
            provinsi_id: otherAddress?.provinsi_id,
            id: otherAddress?.kota_id,
            name: otherAddress?.kota_name,
          };
          let newAddress = {
            ...otherAddress,
            alamat_lain: true,
            desa: "",
            email: currentUser?.email
              ? currentUser?.email
              : currentAddress?.email
              ? currentAddress?.email
              : "",
            provinsi,
            kota,
            kecamatan: {
              kota_id: otherAddress?.kota_id,
              id: otherAddress?.kecamatan_id,
              name: otherAddress?.kecamatan_name,
            },
            lat: null,
            long: null,
          };
          delete newAddress["id"];
          delete newAddress["nama_lengkap"];
          delete newAddress["provinsi_id"];
          delete newAddress["provinsi_name"];
          delete newAddress["kota_id"];
          delete newAddress["kecamatan_id"];
          delete newAddress["kota_name"];
          delete newAddress["kecamatan_name"];
          setCustomAddress(newAddress);
        }
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setDefaultAddress();
    }
  };

  const clearOutDelivery = () => {
    console.log("clearOutDelivery");
    /*setCourier(null);
    setCourierSlug(null);*/
    setCourierService(null);
    setCourierServices([]);
    setDeliveryFee(0);
    setError(null);
  };

  const backHome = () => {
    console.log("backHome");
    navigation.navigate("Main");
  };

  const openAddress = () => {
    navigation.navigate("PickAddress", { isCheckout: true });
  };

  const retrieveDeliveryServices = (provinsi, kota) => {
    /*let provinsi, kota;
    if (addressId === null || addressId === "" || addressId === "default" || customAddress === null) {
      provinsi = currentAddress?.provinsi;
      kota = currentAddress?.kota;
    } else {
      provinsi = customAddress?.provinsi;
      kota = customAddress?.kota;
    }*/
    if (
      provinsi === undefined ||
      kota === undefined ||
      provinsi === null ||
      kota === null ||
      courierSlug === null
    ) {
      return;
    }
    if (!courierLoading) {
      setCourierLoading(true);
    }
    try {
      const courierMap = {
        slug: courierSlug,
        provinsi,
        kota,
        berat:
          props.cart?.berat && weight === props.cart?.berat
            ? props.cart?.berat
            : weight,
        berat_dari_volume:
          props.cart?.berat_dari_volume &&
          weightVolume === props.cart?.berat_dari_volume
            ? props.cart.berat_dari_volume
            : weightVolume,
      };
      console.log("new courierMap", courierMap);
      props.getKurirData(token, courierMap);
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  const createCheckoutJson = () => {
    try {
      let detail_checkout =
        addressId === "" || addressId === "default" || customAddress === null
          ? currentAddress
          : customAddress;
      if (detail_checkout?.user_id !== undefined) {
        delete detail_checkout["user_id"];
      }

      //console.log("createCheckoutJson courier", courier);
      const newCheckout = {
        checkout: {
          keranjang_id: props.cart.id,
          kurir: {
            slug: courierSlug,
            nama: courier?.nama,
            gratis_ongkir: courierService.cost[0].potongan_biaya,
            data: courierService,
          },
          total: totalPrice,
          metode_pembayaran: "transfer_bank",
          tipe_kemasan: packaging,
        },
        detail_checkout: {
          ...detail_checkout,
          nama_penerima: senderName.final
            ? senderName.final
            : "Daclen Official",
          nomor_telp: detail_checkout?.nomor_telp ? processPhoneNumberforCheckout(detail_checkout?.nomor_telp) : "",
        },
        user: {
          saldo: (saldo.available - saldo.used).toString(),
        },
      };
      //console.log("createCheckoutJson", newCheckout);
      setCheckoutJson(newCheckout);
      setAllowCheckout(true);
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setCheckoutJson(null);
      setAllowCheckout(false);
    }
  };

  const proceedCheckout = async () => {
    rbDisclaimer.current.close();
    if (token === null || checkoutJson === null) {
      return;
    }
    try {
      setAfterCheckout(true);
      props.storeCheckout(token, checkoutJson);
      await setObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY, null);
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setError(e.toString());
      setAfterCheckout(false);
    }
  };

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
    /*try {
      const chosenPackaging = radioButtonsArray.find(
        ({ selected }) => selected === true
      );
      setPackaging(chosenPackaging?.value);
    } catch (e) {
      console.log(e);
    }*/
    return;
  }

  function onPressRadioButtonSenderName(radioButtonsArray) {
    try {
      const chosenName = radioButtonsArray.find(
        ({ selected }) => selected === true
      );
      setSenderName({ final: chosenName?.value, temp: chosenName?.value });
    } catch (e) {
      console.log(e);
    }
  }

  function changeSenderName() {
    setSenderName((senderName) => ({
      ...senderName,
      final: senderName.temp,
    }));
    rbSenderName.current.close();
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <TouchableOpacity onPress={() => openCheckoutErrorDetails}>
          <Text allowFontScaling={false} style={styles.textError}>
            {error}
          </Text>
        </TouchableOpacity>
      ) : null}
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          onPress={() => openAddress()}
          style={styles.containerHeader}
        >
          <MaterialCommunityIcons
            name="map-plus"
            size={20}
            color={colors.daclen_blue}
          />
          <View style={styles.containerTitle}>
            <Text allowFontScaling={false} style={styles.textAddressHeader}>
              Pilih Alamat Pengiriman
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.textAddressDetail,
                !addressComplete && { color: colors.daclen_danger },
              ]}
            >
              {addressComplete
                ? displayAddress
                : "Alamat Pengiriman belum dipilih"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={colors.daclen_blue}
            style={styles.arrowAddress}
          />
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
                <Text allowFontScaling={false} style={styles.textUid}>
                  Tidak ada Checkout
                </Text>
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
                props.cart?.berat_fix
                  ? (props.cart?.berat_fix / 1000).toFixed(2).toString()
                  : ((weight + weightVolume) / 1000).toFixed(2).toString()
              }
              senderName={senderName.final}
              setSenderName={() => rbSenderName.current.open()}
              courierChoices={courierChoices}
              courierServices={courierServices}
              packaging={packaging}
              onPressRadioButtonCourier={onPressRadioButtonCourier}
              onPressRadioButtonService={onPressRadioButtonService}
              onPressRadioButtonPackaging={onPressRadioButtonPackaging}
              courierSlug={courierSlug}
              courierService={courierService}
              courierLoading={courierLoading}
              cashback={
                props.cart?.subtotal
                  ? formatPrice(
                      (checkoutsubtotalcommissionpercentage *
                        props.cart?.subtotal) /
                        100
                    )
                  : 0
              }
              addressComplete={addressComplete}
              saldo={saldo}
              setSaldo={setSaldo}
              allowSaldo={allowSaldo}
              totalPrice={totalPrice}
            />

            <Separator thickness={10} />
            <Text allowFontScaling={false} style={styles.textUid}>
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
          totalPrice={totalPrice - saldo.used}
          buttonAction={() => rbDisclaimer.current.open()}
          buttonText={null}
          buttonDisabled={!allowCheckout || afterCheckout}
          enableProcessing={false}
        />
      )}

      {afterCheckout ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" color={colors.daclen_orange} />
        </View>
      ) : null}

      <RBSheet
        ref={rbSenderName}
        openDuration={250}
        height={240}
        onClose={() =>
          setSenderName((senderName) => ({
            ...senderName,
            temp: senderName.final,
          }))
        }
      >
        <BSPopup
          title="Ganti Nama Pengirim"
          content={
            <CheckoutSenderName
              senderNameChoices={senderNameChoices}
              onPressRadioButtonSenderName={onPressRadioButtonSenderName}
            />
          }
          closeThis={() => rbSenderName.current.close()}
          onPress={null}
        />
      </RBSheet>
      <RBSheet ref={rbDisclaimer} openDuration={250} height={420}>
        <BSPopup
          title="Konfirmasi Checkout"
          content={
            <Text allowFontScaling={false} style={styles.textDisclaimer}>
              {checkoutdisclaimer}
            </Text>
          }
          buttonPositive="Setuju"
          buttonPositiveColor={colors.daclen_orange}
          buttonNegative="Tutup"
          buttonNegativeColor={colors.daclen_gray}
          closeThis={() => rbDisclaimer.current.close()}
          onPress={() => proceedCheckout()}
        />
      </RBSheet>
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
  containerLoading: {
    width: "100%",
    height: "100%",
    zIndex: 10,
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: colors.daclen_light,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_blue,
    marginBottom: 6,
  },
  textAddressDetail: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginVertical: 20,
    color: colors.daclen_gray,
    marginHorizontal: 20,
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
  textDisclaimer: {
    backgroundColor: "transparent",
    color: colors.daclen_gray,
    textAlignVertical: "center",
    marginTop: 20,
    marginHorizontal: 24,
    fontFamily: "Poppins",
    fontSize: 12,
  },
  arrowAddress: {
    marginStart: 10,
    alignSelf: "center",
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
  checkoutError: store.userState.checkoutError,
  riwayatSaldo: store.userState.riwayatSaldo,
  addresses: store.userState.addresses,
  addressId: store.userState.addressId,
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
      overhaulReduxCart,
      overhaulReduxTempCart,
      getRiwayatPenarikanSaldo,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Checkout);
