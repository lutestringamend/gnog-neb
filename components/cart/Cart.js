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

import { postKeranjang, deleteKeranjang, clearCartError } from "../../axios/cart";
import { colors } from "../../styles/base";

import { MAXIMUM_ITEM_PER_PRODUCT } from "../../redux/constants";

function Cart(props) {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [itemSize, setItemSize] = useState(0);
  const { cart, token, produk_id, iconSize, textSize, cartError } = props;

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
    } else {
      props.clearCartError();
    }
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

  if (token === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => modifyCart(false)}>
        <MaterialCommunityIcons
          name="minus"
          size={iconSize ? iconSize : 18}
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
          <Text style={[styles.textCart, { fontSize: textSize ? textSize : 18 }]}>
          {itemSize}
          </Text>
        )}
      </View>
      
      <TouchableOpacity onPress={() => modifyCart(true)}>
        <MaterialCommunityIcons
          name="plus"
          size={iconSize ? iconSize : 18}
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
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
  },
  cartIcon: {
    borderWidth: 0.5,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    alignSelf: "center",
    padding: 6,
  },
  containerNumber: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: colors.daclen_gray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  textCart: {
    fontWeight: "bold",
    color: colors.daclen_graydark,
    textAlign: "center",
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
      clearCartError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Cart);
