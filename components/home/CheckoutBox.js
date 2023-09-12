import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { clearKeranjang } from "../../axios/cart";
import { colors } from "../../styles/base";
import { openCheckout } from "../main/CheckoutScreen";

function CheckoutBox(props) {
  const [displayAddress, setDisplayAddress] = useState(null);
  const [erasing, setErasing] = useState(false);
  const { cart, token, currentAddress, currentUser } = props;
  const navigation = useNavigation();

  useEffect(() => {
    if (
      erasing &&
      cart?.jumlah_produk !== undefined &&
      cart.jumlah_produk > 0
    ) {
      setErasing(false);
    }
    console.log("redux cart", cart);
  }, [cart]);

  useEffect(() => {
    if (
      currentAddress?.alamat === null ||
      currentAddress?.alamat === undefined
    ) {
      setDisplayAddress(null);
    } else {
      if (currentAddress?.alamat?.length > 32) {
        setDisplayAddress(currentAddress?.alamat.substring(0, 28) + "...");
      } else {
        setDisplayAddress(currentAddress?.alamat);
      }
    }
  }, [currentAddress]);

  /*const openCheckout = () => {
    if (token && cart?.jumlah_produk > 0) {
      navigation.navigate("Checkout");
    }
  };*/

  if (
    !token ||
    cart?.jumlah_produk === 0 ||
    cart?.jumlah_produk === undefined ||
    cart?.jumlah_produk === null
  ) {
    return null;
  }

  function proceedClear() {
    setErasing(true);
    props.clearKeranjang(token);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => proceedClear()}
        style={styles.closeIcon}
        disabled={erasing}
      >
        <MaterialCommunityIcons
          name="close-circle"
          size={36}
          color={erasing ? colors.daclen_graydark : colors.daclen_light}
          style={{ backgroundColor: "transparent" }}
        />
      </TouchableOpacity>

      <Text style={styles.textHeader}>Ringkasan</Text>
      <View style={[styles.containerHorizontal, { marginTop: 16 }]}>
        <MaterialCommunityIcons
          name="shopping"
          size={20}
          color={colors.daclen_orange}
        />
        <Text style={styles.textCartSize}>
          {cart?.jumlah_produk.toString()} item di keranjang
        </Text>
      </View>
      <View style={styles.verticalLine} />
      <TouchableOpacity onPress={() => navigation.navigate("Address")}>
        <View style={[styles.containerHorizontal, { marginBottom: 16 }]}>
          <MaterialCommunityIcons
            name="home"
            size={20}
            color={colors.daclen_orange}
          />
          <Text style={styles.textAddress}>
            {displayAddress
              ? displayAddress
              : "Alamat Pengiriman belum dipilih"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          openCheckout(
            navigation,
            false,
            token,
            currentUser,
            cart?.jumlah_produk,
            null
          )
        }
        style={styles.button}
      >
        <Text style={styles.textButton}>Lanjut ke Pembelian</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    start: 12,
    end: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: colors.daclen_gray,
    backgroundColor: colors.daclen_black,
    borderWidth: 1,
    borderRadius: 5,
  },
  containerCheckout: {
    flex: 1,
    marginVertical: 16,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  verticalLine: {
    marginStart: 9,
    width: 1,
    height: 14,
    backgroundColor: colors.daclen_light,
  },
  closeIcon: {
    position: "absolute",
    end: 12,
    top: 10,
    zIndex: 2,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  textHeader: {
    color: colors.daclen_light,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  textCartSize: {
    color: colors.daclen_light,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    marginStart: 10,
    paddingVertical: 2,
    flex: 1,
  },
  textAddress: {
    color: colors.daclen_light,
    fontFamily: "Poppins", fontSize: 12,
    marginStart: 10,
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  cart: store.userState.cart,
  currentAddress: store.userState.currentAddress,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearKeranjang,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(CheckoutBox);
