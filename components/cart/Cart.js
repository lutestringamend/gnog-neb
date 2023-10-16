import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  postKeranjang,
  deleteKeranjang,
  modifyTempCart,
  addToTempCart,
} from "../../axios/cart";
import { colors } from "../../styles/base";
import { MAXIMUM_ITEM_PER_PRODUCT } from "../../redux/constants";
import { sentryLog } from "../../sentry";
const defaultItemSize = {
  number: 0,
  text: "0",
};

function Cart(props) {
  const {
    cart,
    tempCart,
    token,
    currentUser,
    produk_id,
    iconSize,
    textSize,
    cartError,
    isShop,
    navigation,
  } = props;

  const [loading, setLoading] = useState(false);
  const [itemSize, setItemSize] = useState(defaultItemSize);

  useEffect(() => {
    try {
      if (
        tempCart === null ||
        tempCart?.length === undefined ||
        tempCart?.length < 1
      ) {
        if (
          cart === null ||
          cart?.produk === undefined ||
          cart?.produk?.length === undefined ||
          cart?.produk?.length < 1
        ) {
          setItemSize(defaultItemSize);
        } else {
          const item = cart?.produk.find(({ id }) => id === produk_id);
          if (
            !(item === undefined || item === null || item?.jumlah === undefined)
          ) {
            setItemSize({
              number: parseInt(item?.jumlah),
              text: item?.jumlah.toString(),
            });
          }
        }
      } else {
        const item = tempCart.find(({ id }) => id === produk_id);
        if (
          !(item === undefined || item === null || item?.jumlah === undefined)
        ) {
          setItemSize({
            number: parseInt(item?.jumlah),
            text: item?.jumlah.toString(),
          });
        }
        if (loading) {
          setLoading(false);
        }
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setItemSize(defaultItemSize);
    }
  }, [cart, tempCart]);

  useEffect(() => {
    if (loading) {
      console.log("cartError", cart);
      setLoading(false);
    }
    /*else {
      props.clearCartError();
    }*/
  }, [cartError]);

  useEffect(() => {
    if (loading) {
      props.modifyTempCart(produk_id, itemSize.number);
    }
  }, [itemSize.number]);

  const modifyCart = (isAdd) => {
    if (loading) {
      console.log("still loading");
    } else {
      //console.log("modifyCart " + produk_id + " isAdd " + isAdd.toString());
      if (isAdd) {
        if (itemSize.number <= MAXIMUM_ITEM_PER_PRODUCT) {
          setLoading(true);
          if (
            tempCart === null ||
            tempCart?.length === undefined ||
            tempCart?.length < 1
          ) {
            props.addToTempCart(produk_id);
          } else {
            props.modifyTempCart(produk_id, itemSize.number + 1);
          }
          //props.postKeranjang(token, produk_id, 1);
        }
      } else {
        if (itemSize.number > 0) {
          setLoading(true);
          props.modifyTempCart(produk_id, itemSize.number - 1);
          //props.deleteKeranjang(token, produk_id, itemSize);
        }
      }
    }
  };

  const changeItemSize = () => {
    console.log("onEndEditing");
    if (!loading) {
      try {
        if (
          itemSize.text === undefined ||
          itemSize.text === null ||
          itemSize.text === "" ||
          parseInt(itemSize.text) > MAXIMUM_ITEM_PER_PRODUCT
        ) {
          setItemSize({
            ...itemSize,
            text: itemSize.number.toString(),
          });
        } else {
          setLoading(true);
          setItemSize({
            number: parseInt(itemSize.text),
            text: itemSize.text,
          });
        }
      } catch (e) {
        console.error(e);
        setItemSize({
          ...itemSize,
          text: itemSize.number.toString(),
        });
        setLoading(false);
      }
    }
  };

  const onChangeText = (text) => {
    setItemSize({
      ...itemSize,
      text,
    });
  };

  function onShopButtonPress() {
    if (
      currentUser?.level === "spv" ||
      currentUser?.status_member === "supervisor"
    ) {
      return;
    }
    if (token === null && !(navigation === undefined || navigation === null)) {
      navigation.navigate("Login");
    } else if (
      isShop &&
      (currentUser?.isActive === undefined ||
        currentUser?.isActive === null ||
        !currentUser?.isActive)
    ) {
      navigation.navigate("ProfileTab", { screen: "Main" });
    } else {
      //modifyCart(true);
      if (
        tempCart === null ||
        tempCart?.length === undefined ||
        tempCart?.length < 1
      ) {
        props.addToTempCart(produk_id);
        return;
      }
      const item = tempCart.find(({ id }) => id === produk_id);
      if (item === undefined || item === null) {
        props.addToTempCart(produk_id);
      } else {
        props.modifyTempCart(produk_id, 1);
      }
    }
  }

  if (isShop && itemSize.number < 1 && itemSize.text === "0") {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onShopButtonPress()}
        disabled={
          (token === null &&
            (navigation === undefined || navigation === null)) ||
          currentUser?.level === "spv" ||
          currentUser?.status_member === "supervisor"
        }
      >
        {currentUser?.level === "spv" ||
        currentUser?.status_member === "supervisor" ? null : loading ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_gray}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <Text allowFontScaling={false} style={styles.textButton}>
            {token === null
              ? `Login/Register`
              : currentUser?.isActive
              ? `Masukkan Keranjang`
              : currentUser?.status === null
              ? "Bergabung"
              : "Verifikasi No HP"}
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
      <TouchableOpacity
        style={[
          styles.cartIcon,
          {
            height: textSize ? textSize + 20 : 32,
            borderTopStartRadius: 4,
            borderBottomStartRadius: 4,
          },
        ]}
        onPress={() => modifyCart(false)}
      >
        <MaterialCommunityIcons
          name="minus"
          size={iconSize ? iconSize : 16}
          disabled={loading}
          color={colors.daclen_gray}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.containerNumber,
          {
            width: textSize ? textSize + 24 : 40,
            height: textSize ? textSize + 20 : 32,
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
          <TextInput
            style={[
              styles.textCart,
              {
                fontFamily: "Poppins-SemiBold",
                fontSize: textSize ? textSize : 14,
              },
            ]}
            inputMode="decimal"
            value={itemSize.text}
            maxLength={2}
            multiline={false}
            onChangeText={(text) => onChangeText(text)}
            onEndEditing={() => changeItemSize()}
            editable={!(loading || Platform.OS === "web")}
          />
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.cartIcon,
          {
            height: textSize ? textSize + 20 : 32,
            borderTopEndRadius: 4,
            borderBottomEndRadius: 4,
          },
        ]}
        onPress={() => modifyCart(true)}
      >
        <MaterialCommunityIcons
          name="plus"
          size={iconSize ? iconSize : 16}
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
  },
  cartIcon: {
    backgroundColor: colors.daclen_light,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerNumber: {
    backgroundColor: colors.daclen_light,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.daclen_gray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  textCart: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-Bold",
    color: colors.daclen_black,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    width: 30,
  },
  textButton: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_light,
    textAlign: "right",
    textAlignVertical: "center",
    alignSelf: "center",
    marginHorizontal: 10,
    marginBottom: 6,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  cart: store.userState.cart,
  cartError: store.userState.cartError,
  tempCart: store.userState.tempCart,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      postKeranjang,
      deleteKeranjang,
      modifyTempCart,
      addToTempCart,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Cart);
