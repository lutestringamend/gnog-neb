import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { postKeranjang, deleteKeranjang } from "../../axios/cart";
import { colors } from "../../styles/base";

import { MAXIMUM_ITEM_PER_PRODUCT } from "../../redux/constants";

function Cart(props) {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [itemSize, setItemSize] = useState(0);
  const {
    cart,
    token,
    produk_id,
    iconSize,
    textSize,
    cartError,
    isShop,
    navigation,
  } = props;

  useEffect(() => {
    setLoading(true);
    if (cart !== null) {
      setItem(cart?.produk.find(({ id }) => id === produk_id));
    } else {
      setItem(null);
    }
    setLoading(false);
  }, [cart]);

  useEffect(() => {
    if (item !== undefined && item !== null) {
      setItemSize(item?.jumlah);
    } else {
      setItemSize(0);
    }
    //setLoading(false);
  }, [item]);

  useEffect(() => {
    if (loading) {
      console.log("cartError", cart);
      setLoading(false);
    }
    /*else {
      props.clearCartError();
    }*/
  }, [cartError]);

  const modifyCart = (isAdd) => {
    if (loading) {
      console.log("still loading");
    } else {
      console.log("modifyCart " + produk_id + " isAdd " + isAdd.toString());
      if (isAdd) {
        if (itemSize <= MAXIMUM_ITEM_PER_PRODUCT) {
          setLoading(true);
          props.postKeranjang(token, produk_id, 1);
        }
      } else {
        if (item !== undefined && itemSize > 0) {
          setLoading(true);
          props.deleteKeranjang(token, produk_id, itemSize);
        }
      }
    }
  };

  function onShopButtonPress() {
    if (token === null && !(navigation === undefined || navigation === null)) {
      navigation.navigate("Login");
    } else {
      modifyCart(true);
    }
  }

  if (isShop && itemSize < 1) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onShopButtonPress()}
        disabled={
          token === null && (navigation === undefined || navigation === null)
        }
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_gray}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <Text style={styles.textButton}>
            {token === null
              ? `Login\nuntuk Belanja`
              : `Tambahkan\nke Keranjang`}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  if (token === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => modifyCart(false)}>
        <MaterialCommunityIcons
          name="minus"
          size={iconSize ? iconSize : 16}
          style={styles.cartIcon}
          disabled={loading}
          color={colors.daclen_gray}
        />
      </TouchableOpacity>

      <View style={styles.containerNumber}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_gray}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <Text
            style={[styles.textCart, { fontSize: textSize ? textSize : 16 }]}
          >
            {itemSize}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => modifyCart(true)}>
        <MaterialCommunityIcons
          name="plus"
          size={iconSize ? iconSize : 16}
          style={styles.cartIcon}
          disabled={loading}
          color={colors.daclen_gray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
  },
  cartIcon: {
    backgroundColor: "transparent",
    alignSelf: "center",
    padding: 6,
    borderWidth: 0.5,
    borderColor: colors.daclen_gray,
    borderRadius: 6,
  },
  containerNumber: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.daclen_graydark,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 6,
  },
  textCart: {
    backgroundColor: "transparent",
    fontWeight: "bold",
    color: colors.daclen_graydark,
    textAlign: "center",
  },
  textButton: {
    fontSize: 14,
    color: colors.daclen_black,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  cart: store.userState.cart,
  cartError: store.userState.cartError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      postKeranjang,
      deleteKeranjang,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Cart);
