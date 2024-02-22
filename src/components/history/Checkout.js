import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
//import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getCheckouts,
  getCheckoutItem,
  postPembayaran,
  clearUserCheckoutData,
  clearHistoryData,
  updateReduxHistoryCheckouts,
  updateReduxHistoryCheckoutsPageNumber,
  cancelCheckout,
  confirmCheckout,
  deleteCheckout,
} from "../../../axios/history";
import { getObjectAsync, setObjectAsync } from "../../../components/asyncstorage";

import { colors } from "../../../styles/base";
import Separator from "../Separator";
import { ASYNC_HISTORY_CHECKOUT_KEY } from "../../../components/asyncstorage/constants";
import { capitalizeFirstLetter } from "../../../axios/cart";

function Checkout(props) {
  const { token, checkouts, checkout, checkoutPageNumber } = props;
  const [loading, setLoading] = useState(false);
  const [onEndReachedCalledDuringMomentum, setEndReachedCalledDuringMomentum] =
    useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (checkouts === null) {
      checkAsyncStorageHistory();
    } else {
      if (checkoutPageNumber < 2) {
        setObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY, checkouts);
      }
      setLoading(false);
    }
    if (paginationLoading) {
      setPaginationLoading(false);
    }
    console.log("redux checkouts", checkouts?.length);
  }, [checkouts]);

  useEffect(() => {
    if (checkoutPageNumber >= 999) {
      setPaginationLoading(false);
      setLoading(false);
    } else if (checkoutPageNumber > 1) {
      props.getCheckouts(token, checkoutPageNumber);
    }
    console.log("checkoutPageNumber", checkoutPageNumber);
  }, [checkoutPageNumber]);

  useEffect(() => {
    if (checkout === null) {
      props.clearUserCheckoutData();
      console.log("checkout is null");
    }
  }, [checkout]);

  const checkAsyncStorageHistory = async () => {
    setLoading(true);
    const storageHistory = await getObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY);
    if (
      storageHistory === undefined ||
      storageHistory === null ||
      storageHistory?.length === undefined ||
      storageHistory?.length < 1
    ) {
      refreshScreen();
    } else {
      props.updateReduxHistoryCheckouts(storageHistory);
    }
  };

  const refreshScreen = () => {
    props.getCheckouts(token, 1);
    props.updateReduxHistoryCheckoutsPageNumber(1);
  };

  function onEndReached() {
    if (
      !onEndReachedCalledDuringMomentum &&
      checkoutPageNumber < 999 &&
      !paginationLoading
    ) {
      console.log("onEndReached");
      setEndReachedCalledDuringMomentum(true);
      props.updateReduxHistoryCheckoutsPageNumber(checkoutPageNumber + 1);
      //loadData(false);
    }
  }

  function openItem(id) {
    if (!loading) {
      /*setLoading(true);
      props.getCheckoutItem(id);*/
      navigation.navigate("CheckoutItem", { id });
    }
  }

  const cancelItem = async (id, status) => {
    if (!loading) {
      /*setLoading(true);
      props.getCheckoutItem(id);*/
      console.log("cancelItem", id, status);
      try {
        if (status === "diverifikasi") {
          const response = await confirmCheckout(token, id);
          console.log("confirmCheckout response", response);
          if (response === true) {
            let newArray = [];
            for (let i = 0; i < checkouts?.length; i++) {
              if (checkouts[i]?.id === id) {
                let newCheckout = {
                  ...checkouts[i],
                  status: "diterima",
                };
                newArray.push(newCheckout);
              } else {
                newArray.push(checkouts[i]);
              }
            }
            props.updateReduxHistoryCheckouts(newArray);
          }
        } else if (status === null) {
          const response = await cancelCheckout(token, id);
          console.log("cancelCheckout response", response);
          if (response === true) {
            let newArray = [];
            for (let i = 0; i < checkouts?.length; i++) {
              if (checkouts[i]?.id === id) {
                let newCheckout = {
                  ...checkouts[i],
                  status: "ditolak",
                };
                newArray.push(newCheckout);
              } else {
                newArray.push(checkouts[i]);
              }
            }
            props.updateReduxHistoryCheckouts(newArray);
          }
        } else if (status === "ditolak") {
          const response = await deleteCheckout(token, id);
          console.log("deleteCheckout response", response);
          if (response === true) {
            let newArray = [];
            for (let i = 0; i < checkouts?.length; i++) {
              if (checkouts[i]?.id !== id) {
                newArray.push(checkouts[i]);
              }
            }
            props.updateReduxHistoryCheckouts(newArray);   
          }   
        }
      } catch (e) {
        console.error(e);
      }
      //console.log("deleteItem", id);
    }
  };

  /*const onRowDidOpen = (rowKey) => {
    console.log("onRowDidOpen", rowKey);
  };*/

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity onPress={() => openItem(data.item?.id)}>
        <Text allowFontScaling={false} style={styles.textHiddenButton}>
          Buka
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.backRightBtn,
          {
            backgroundColor:
              data?.item?.status === null
                ? colors.daclen_danger
                : data?.item?.status === "diverifikasi"
                ? colors.daclen_orange
                : data?.item?.status === "ditolak" 
                ? colors.daclen_reddishbrown
                : colors.daclen_gray,
          },
        ]}
        onPress={() => cancelItem(data.item?.id, data.item?.status)}
        disabled={
          data?.item?.status !== null &&
          data?.item?.status !== "ditolak" &&
          data?.item?.status !== "diverifikasi"
        }
      >
        <Text allowFontScaling={false} style={styles.textHiddenButton}>
          {data?.item?.status === null
            ? "Batalkan"
            : data?.item?.status === "diverifikasi"
            ? `Konfirmasi\nDiterima`
            : "Hapus"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading || token === null || token === "") {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerFlatlist}>
        {token ? (
          checkouts === undefined ||
          checkouts === null ||
          checkouts?.length === undefined ||
          checkouts?.length < 1 ? (
            <Text allowFontScaling={false} style={styles.textUid}>
              Anda belum memiliki riwayat Checkout
            </Text>
          ) : (
            <SwipeListView
              numColumns={1}
              horizontal={false}
              data={checkouts}
              contentContainerStyle={{ paddingBottom: 100 }}
              onMomentumScrollBegin={() =>
                setEndReachedCalledDuringMomentum(false)
              }
              onEndReachedThreshold={0.1}
              onEndReached={() => onEndReached()}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => refreshScreen()}
                />
              }
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={75}
              rightOpenValue={-120}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              renderItem={(data, rowMap) => (
                <View style={{ width: "100%", backgroundColor: colors.white }}>
                  <View style={styles.containerItem}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={colors.daclen_black}
                      style={styles.icon}
                      onPress={() => openItem(data.item?.id)}
                    />

                    <View style={styles.containerDescVertical}>
                      <TouchableOpacity onPress={() => openItem(data.item?.id)}>
                        <Text allowFontScaling={false} style={styles.textTitle}>
                          {data.item?.invoice}
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.containerDescHorizontal}>
                        <Text allowFontScaling={false} style={styles.textDate}>
                          {data.item?.created_at}
                        </Text>
                        <Text allowFontScaling={false} style={styles.textPrice}>
                          Rp {data.item?.total_currency}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => openItem(data.item?.id)}
                      disabled={loading}
                      style={[
                        styles.button,
                        {
                          backgroundColor:
                            data.item?.status === null
                              ? colors.daclen_blue
                              : data.item?.status === "ditolak"
                              ? colors.daclen_danger
                              : data.item?.status === "diverifikasi" ||
                                data.item?.status === "diterima"
                              ? colors.daclen_green
                              : colors.daclen_gray,
                        },
                      ]}
                    >
                      <Text allowFontScaling={false} style={styles.textButton}>
                        {data.item?.status === null
                          ? "Bayar Pesanan"
                          : capitalizeFirstLetter(data.item?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Separator thickness={0.5} style={{ marginTop: 10 }} />
                </View>
              )}
            />
          )
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text allowFontScaling={false} style={styles.textUid}>
              Anda harus Login / Register untuk mengecek riwayat Checkout
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {paginationLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={styles.activityControl}
        />
      ) : null}
    </SafeAreaView>
  );
}

/*

          <ScrollView style={styles.containerDescVertical}>
            <TouchableOpacity
              onPress={() =>
                props.updateReduxHistoryCheckoutsPageNumber(
                  checkoutPageNumber + 1
                )
              }
            >
              <Text allowFontScaling={false} style={styles.textUid}>Increment</Text>
            </TouchableOpacity>
            {checkouts.map(({ id, index }) => (
              <Text allowFontScaling={false} key={index} style={styles.textUid}>
                {`[${id.toString()}]`}
              </Text>
            ))}
          </ScrollView>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  containerDescVertical: {
    flex: 1,
    marginHorizontal: 10,
  },
  containerDescHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerFlatlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    margin: 5,
    alignSelf: "center",
  },
  textTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: colors.daclen_black,
    marginVertical: 10,
  },
  textDate: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_gray,
  },
  textPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: colors.daclen_orange,
    marginStart: 10,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
    color: colors.daclen_gray,
    marginHorizontal: 10,
  },
  textHiddenButton: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  button: {
    alignSelf: "flex-end",
    marginEnd: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  activityControl: {
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
    elevation: 10,
    zIndex: 20,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: colors.daclen_green,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 120,
    backgroundColor: colors.daclen_danger,
    right: 0,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  userCheckout: store.userState.checkout,
  checkouts: store.historyState.checkouts,
  checkout: store.historyState.checkout,
  checkoutPageNumber: store.historyState.checkoutPageNumber,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getCheckouts,
      getCheckoutItem,
      postPembayaran,
      clearUserCheckoutData,
      clearHistoryData,
      updateReduxHistoryCheckouts,
      updateReduxHistoryCheckoutsPageNumber,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Checkout);
