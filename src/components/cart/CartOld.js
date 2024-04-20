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

import { colors, globalUIRatio } from "../../styles/base";
import { postKeranjang, deleteKeranjang } from "../../axios/cart";
import { MAXIMUM_ITEM_PER_PRODUCT } from "../../redux/constants";


function CartOld(props) {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [itemSize, setItemSize] = useState(0);
  const {
    cart,
    token,
    currentUser,
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
        if (itemSize < MAXIMUM_ITEM_PER_PRODUCT) {
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
    } else if (isShop && (currentUser?.isActive === undefined || currentUser?.isActive === null || !currentUser?.isActive)) {
      if (props?.goDashboard === undefined || props?.goDashboard === null) {
        return;
      }
      props?.goDashboard();
    } else {
      modifyCart(true);
    }
  }

  if (isShop && itemSize < 1) {
    return null;
    /*return (
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
          <Text allowFontScaling={false} style={styles.textButton}>
            {token === null
              ? `Login/Register\nAkun`
              : currentUser?.isActive
              ? `Tambahkan\nke Keranjang`
              : `Bergabung\nSekarang`}
          </Text>
        )}
      </TouchableOpacity>
    );*/
  }

  if (token === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.cartIcon,
          {
            height: iconSize ? iconSize : 30 * globalUIRatio,
          },
        ]}
        disabled={loading || itemSize <= 0}
        onPress={() => modifyCart(false)}
      >
        <MaterialCommunityIcons
          name="minus-circle-outline"
          size={iconSize ? iconSize : 30 * globalUIRatio}
          color={itemSize <= 0 ? colors.daclen_grey_placeholder : colors.daclen_black}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.containerNumber,
          {
            width: iconSize ? 30 * iconSize / 25 : 35 * globalUIRatio,
            height: iconSize ? iconSize : 30 * globalUIRatio,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_gray}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <Text allowFontScaling={false}
            style={[styles.textCart, { fontFamily: "Poppins", fontSize: textSize ? textSize : 16 * globalUIRatio }]}
          >
            {itemSize}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.cartIcon,
          {
            height: iconSize ? iconSize : 30 * globalUIRatio,
          },
        ]}
        disabled={loading || itemSize >= MAXIMUM_ITEM_PER_PRODUCT}
        onPress={() => modifyCart(true)}
      >
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={iconSize ? iconSize : 30 * globalUIRatio}
          color={itemSize >= MAXIMUM_ITEM_PER_PRODUCT ? colors.daclen_grey_placeholder : colors.daclen_black}
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
  },
  cartIcon: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerNumber: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8 * globalUIRatio,
    borderColor: colors.daclen_grey_placeholder,
    borderBottomWidth: 1,
  },
  textCart: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-Bold",
    color: colors.daclen_black,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    fontFamily: "Poppins", 
  }
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
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

export default connect(mapStateToProps, mapDispatchProps)(CartOld);