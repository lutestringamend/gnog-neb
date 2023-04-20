import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
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
} from "../../axios/history";

import { colors, dimensions } from "../../styles/base";
import Separator from "../profile/Separator";

function Checkout(props) {
  const { token, checkouts, checkout } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (checkouts === null && token !== null) {
      props.getCheckouts(token);
      setLoading(true);
    } else {
      setLoading(false);
    }
    //console.log({ checkouts, token });
  }, [token, checkouts]);

  useEffect(() => {
    if (checkout === null) {
      props.clearUserCheckoutData();
      console.log("checkout is null");
    }
  }, [checkout]);

  function openItem(id) {
    if (!loading) {
      /*setLoading(true);
      props.getCheckoutItem(id);*/
      navigation.navigate("CheckoutItem", { id });
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (loading) {
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
      {token ? (
        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => props.clearHistoryData()}
            />
          }
        >
          {checkouts?.length < 1 ? (
            <Text style={styles.textUid}>
              Anda belum memiliki riwayat Checkout
            </Text>
          ) : (
            <FlatList
              numColumns={1}
              horizontal={false}
              data={checkouts}
              style={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <View style={{ width: "100%" }}>
                  <View style={styles.containerItem}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={colors.daclen_black}
                      style={styles.icon}
                      onPress={() => openItem(item?.id)}
                    />

                    <View style={styles.containerDescVertical}>
                      <TouchableOpacity onPress={() => openItem(item?.id)}>
                        <Text style={styles.textTitle}>{item?.invoice}</Text>
                      </TouchableOpacity>
                      <View style={styles.containerDescHorizontal}>
                        <Text style={styles.textDate}>{item?.created_at}</Text>
                        <Text style={styles.textPrice}>
                          Rp {item?.total_currency}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => openItem(item?.id)}
                      disabled={loading}
                      style={[
                        styles.button,
                        item?.status === "ditolak"
                          ? { backgroundColor: colors.daclen_danger }
                          : item?.status === "diverifikasi" && {
                              backgroundColor: colors.daclen_green,
                            },
                      ]}
                    >
                      <Text style={styles.textButton}>
                        {item?.status === null
                          ? "Bayar Pesanan"
                          : capitalizeFirstLetter(item?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Separator thickness={2} style={{ marginTop: 10 }} />
                </View>
              )}
            />
          )}
        </ScrollView>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textUid}>
            Anda harus Login / Register untuk mengecek riwayat Checkout
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

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
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_black,
    marginVertical: 10,
  },
  textDate: {
    fontSize: 12,
    color: colors.daclen_gray,
  },
  textPrice: {
    fontWeight: "bold",
    fontSize: 12,
    color: colors.daclen_orange,
    marginStart: 10,
  },
  textUid: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
    color: colors.daclen_gray,
    marginHorizontal: 10,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
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
      getCheckouts,
      getCheckoutItem,
      postPembayaran,
      clearUserCheckoutData,
      clearHistoryData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Checkout);
