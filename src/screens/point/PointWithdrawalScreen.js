import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import {
  getPenukaranPoin,
  getPenukaranPoinDates,
  getPenukaranPoinIndexProduk,
  getPenukaranPoinKeranjang,
  postPenukaranPoinKeranjang,
  postPenukaranPoinStore,
} from "../../../axios/user/points";
import { colors, dimensions, staticDimensions } from "../../../styles/base";
import PointExchangeItem from "../../../components/dashboard/point/PointExchangeItem";
import { convertDateISOStringtoDisplayDate } from "../../../axios/profile";
import { checkNumberEmpty } from "../../../axios/cart";
import CenteredView from "../../components/view/CenteredView";

const defaultStatus = {
  disabled: true,
  message: "",
};

const PointCartItem = {
  id: null,
  user_id: null,
  produk: [],
  subtotal: 0,
  jumlah_produk: 0,
};

const PointWithdrawalScreen = (props) => {
  const { token, currentUser } = props;
  const [loading, setLoading] = useState(true);
  const [storing, setStoring] = useState(false);
  const [error, setError] = useState(null);
  const [exchangeStatus, setExchangeStatus] = useState(defaultStatus);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(PointCartItem);
  const [itemLoading, setItemLoading] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    /*if (token === null && currentUser?.name !== "user2") {
      setExchangeStatus(defaultStatus);
      return;
    }*/
    penukaranPoinCheckAsync();
  }, []);

  useEffect(() => {
    if (token === null) {
      setExchangeStatus(defaultStatus);
      return;
    }
    getPenukaranPoin(token);
    checkCart();
  }, [token]);

  useEffect(() => {
    if (!exchangeStatus?.disabled) {
      fetchPoinProductsAsync();
    }
  }, [exchangeStatus?.disabled]);

  useEffect(() => {
    if (products?.length === undefined || products?.length < 1) {
      setItemLoading(null);
      return;
    }
    let newItems = [];
    for (let r of products) {
      newItems.push({
        id: r?.id,
        loading: false,
      });
    }
    setItemLoading(newItems);
  }, [products]);

  const checkCart = async () => {
    const result = await getPenukaranPoinKeranjang(token);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      setError(
        result?.error ? result?.error : "Tidak bisa mendapatkan keranjang",
      );
    } else {
      setCart(result?.result);
    }
  };

  const fetchPoinProductsAsync = async () => {
    try {
      let result = await getPenukaranPoinIndexProduk(token);
      console.log("getPenukaranPoinIndexProduk", result?.result?.length);
      if (
        !(
          result?.result === undefined ||
          result?.result?.length === undefined ||
          result?.result?.length < 1
        )
      ) {
        setProducts(result?.result);
        if (loading) {
          setLoading(false);
        }
        return;
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
    setProducts([]);
    if (loading) {
      setLoading(false);
    }
  };

  const penukaranPoinCheckAsync = async () => {
    try {
      let result = await getPenukaranPoinDates();
      let starting = new Date(result?.result?.tanggal_dari);
      let ending = new Date(result?.result?.tanggal_sampai);
      let today = new Date().getTime();

      //console.log(ending.getTime() - today, today - starting.getTime());
      if (today <= ending.getTime() && today >= starting.getTime()) {
        setExchangeStatus({ disabled: false, message: "" });
      } else {
        setExchangeStatus({
          disabled: true,
          message: `Penukaran poin akan berlaku dari tanggal\n${convertDateISOStringtoDisplayDate(
            starting,
            true,
          )} hingga ${convertDateISOStringtoDisplayDate(ending, true)}`,
        });
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setExchangeStatus(defaultStatus);
    }
  };

  const setItemLoadingStatus = (id, loading) => {
    if (itemLoading?.length === undefined || itemLoading?.length < 1) {
      return;
    }
    let newItems = [];
    for (let i of itemLoading) {
      if (i?.id === id) {
        newItems.push({
          id,
          loading,
        });
      } else {
        newItems.push(i);
      }
    }
    setItemLoading(newItems);
  };

  const addToCart = async (id) => {
    setItemLoadingStatus(id, true);
    const result = await postPenukaranPoinKeranjang(token, [id]);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      setError(
        result?.error ? result?.error : "Tidak bisa menambahkan ke keranjang",
      );
    } else {
      setCart(result?.result);
      checkCart();
    }
    setItemLoadingStatus(id, false);
  };

  const storePenukaranPoin = async () => {
    if (cart?.id === null) {
      return;
    }

    setStoring(true);
    try {
      const result = await postPenukaranPoinStore(token, cart?.id);
      if (
        result === undefined ||
        result === null ||
        result?.result === undefined ||
        result?.result === null ||
        result?.result?.session === undefined ||
        result?.result?.session !== "success"
      ) {
        setError(result?.error ? result?.error : "Tidak bisa menukarkan poin");
      } else {
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
    setStoring(false);
  };

  const refresh = () => {
    penukaranPoinCheckAsync();
    fetchPoinProductsAsync();
    getPenukaranPoin(token);
  };

  return (
    <CenteredView title="Tukar Poin" style={styles.container}>
      {exchangeStatus?.message ? (
        <View style={styles.containerInfo}>
          <MaterialCommunityIcons
            name="progress-clock"
            size={18}
            color={colors.daclen_light}
          />
          <Text style={[styles.textInfo, { textAlign: "center", flex: 1 }]}>
            {exchangeStatus?.message}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.containerInfo,
            {
              backgroundColor: colors.daclen_black,
            },
          ]}
        >
          <Text style={[styles.textInfo, { flex: 1, marginStart: 0 }]}>
            {`Total Poin Anda: ${
              currentUser?.poin_user
                ? currentUser?.poin_user?.total
                  ? currentUser?.poin_user?.total
                  : "-"
                : "-"
            } Poin`}
          </Text>
          <TouchableOpacity
            disabled={
              exchangeStatus?.disabled ||
              checkNumberEmpty(cart?.subtotal) >
                checkNumberEmpty(currentUser?.poin_user?.total)
            }
            style={[
              styles.containerButton,
              {
                backgroundColor: exchangeStatus?.disabled
                  ? colors.daclen_gray
                  : checkNumberEmpty(cart?.subtotal) >
                      checkNumberEmpty(currentUser?.poin_user?.total)
                    ? colors.daclen_danger
                    : colors.daclen_yellow_new,
              },
            ]}
            onPress={() => storePenukaranPoin()}
          >
            {storing ? (
              <ActivityIndicator size="small" color={colors.daclen_black} />
            ) : (
              <MaterialCommunityIcons
                name="cart"
                size={18}
                color={colors.daclen_black}
              />
            )}

            <Text
              style={[
                styles.textInfo,
                {
                  fontFamily: "Poppins",
                  color: colors.daclen_black,
                },
              ]}
            >
              {`Total ${cart?.subtotal ? cart?.subtotal : "0"} Poin`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? (
        <Text allowFontScaling={false} style={styles.textError}>
          {error}
        </Text>
      ) : null}

      {exchangeStatus?.disabled || loading ? (
        exchangeStatus?.disabled ? null : (
          <ScrollView
            style={styles.containerScroll}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refresh()}
              />
            }
          >
            <View style={styles.containerSpinner}>
              <ActivityIndicator size="large" color={colors.daclen_gray} />
            </View>
          </ScrollView>
        ) 
      ) : (
        <View style={styles.containerList}>
          <FlatList
            numColumns={2}
            horizontal={false}
            data={products}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refresh()}
              />
            }
            renderItem={({ item, index }) => (
              <PointExchangeItem
                index={index}
                {...item}
                loading={
                  itemLoading
                    ? itemLoading.find(({ id }) => item?.id === id)?.loading
                    : false
                }
                onPress={() => addToCart(item?.id)}
                disabled={exchangeStatus?.disabled}
              />
            )}
          />
        </View>
      )}
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerScroll: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_gray,
  },
  containerButton: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.daclen_yellow_new,
    flexDirection: "row",
    alignItems: "center",
  },
  containerList: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
  containerSpinner: {
    minHeight: dimensions.fullHeight - 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  textInfo: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    marginStart: 6,
    color: colors.daclen_light,
  },
  textError: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  points: store.userState.points,
});

/*const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
    },
    dispatch,
  );*/

export default connect(mapStateToProps, null)(PointWithdrawalScreen);
