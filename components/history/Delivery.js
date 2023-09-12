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
//import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  getDeliveries,
  clearDeliveryStatus,
  clearHistoryData,
  updateReduxHistoryDeliveries,
  updateReduxHistoryDeliveriesPageNumber,
} from "../../axios/history";

import { colors } from "../../styles/base";
import Separator from "../profile/Separator";
import { ASYNC_HISTORY_DELIVERY_KEY } from "../asyncstorage/constants";
import { capitalizeFirstLetter } from "../../axios/cart";

function Delivery(props) {
  const { token, deliveries, delivery, deliveryStatus, deliveryPageNumber } =
    props;
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [onEndReachedCalledDuringMomentum, setEndReachedCalledDuringMomentum] =
    useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (deliveries === null) {
      checkAsyncStorageHistory();
    } else {
      if (deliveryPageNumber < 2) {
        setObjectAsync(ASYNC_HISTORY_DELIVERY_KEY, deliveries);
      }
      setLoading(false);
    }
    if (paginationLoading) {
      setPaginationLoading(false);
    }
    console.log("redux deliveries", deliveries?.length);
  }, [deliveries]);

  useEffect(() => {
    if (deliveryPageNumber >= 999) {
      setPaginationLoading(false);
      setLoading(false);
    } else if (deliveryPageNumber > 1) {
      props.getDeliveries(token, deliveryPageNumber);
    }
    console.log("deliveryPageNumber", deliveryPageNumber);
  }, [deliveryPageNumber]);

  useEffect(() => {
    if (delivery === null) {
      console.log("delivery is null");
      if (deliveryStatus !== null) props.clearDeliveryStatus();
    }
  }, [delivery, deliveryStatus]);

  const checkAsyncStorageHistory = async () => {
    setLoading(true);
    const storageHistory = await getObjectAsync(ASYNC_HISTORY_DELIVERY_KEY);
    if (
      storageHistory === undefined ||
      storageHistory === null ||
      storageHistory?.length === undefined ||
      storageHistory?.length < 1
    ) {
      refreshScreen();
    } else {
      props.updateReduxHistoryDeliveries(storageHistory);
    }
  };

  const refreshScreen = () => {
    props.getDeliveries(token, 1);
    props.updateReduxHistoryDeliveriesPageNumber(1);
  };

  function onEndReached() {
    if (
      !onEndReachedCalledDuringMomentum &&
      deliveryPageNumber < 999 &&
      !paginationLoading
    ) {
      console.log("onEndReached");
      setEndReachedCalledDuringMomentum(true);
      props.updateReduxHistoryDeliveriesPageNumber(deliveryPageNumber + 1);
      //loadData(false);
    }
  }

  function openItem(id) {
    if (!loading) {
      /*setLoading(true);
      props.getDeliveryItem(id);*/
      navigation.navigate("DeliveryItem", { id });
    }
  }

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
          deliveries === undefined ||
          deliveries === null ||
          deliveries?.length === undefined ||
          deliveries?.length < 1 ? (
            <Text style={styles.textUid}>
              Anda belum memiliki riwayat Pengiriman
            </Text>
          ) : (
            <FlatList
              initialNumToRender={10}
              numColumns={1}
              horizontal={false}
              data={deliveries}
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
              renderItem={({ item }) => (
                <View style={{ width: "100%" }}>
                  <View style={styles.containerItem}>
                    <MaterialCommunityIcons
                      name="truck-delivery"
                      size={24}
                      color={colors.daclen_black}
                      style={styles.icon}
                      onPress={() => openItem(item?.id)}
                    />

                    <View style={styles.containerDescVertical}>
                      <TouchableOpacity onPress={() => openItem(item?.id)}>
                        <Text style={styles.textTitle}>{item?.nomor_resi}</Text>
                      </TouchableOpacity>
                      <View style={styles.containerDescHorizontal}>
                        <Text style={styles.textDate}>
                          {item?.tgl_pengiriman}
                        </Text>
                        <Text style={styles.textPrice}>{item?.nama_kurir}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => openItem(item?.id)}
                      disabled={loading}
                      style={[
                        styles.button,
                        item?.status === "dikirim" && {
                          backgroundColor: colors.daclen_green,
                        },
                      ]}
                    >
                      <Text style={styles.textButton}>
                        {item?.status === null
                          ? "Detil"
                          : capitalizeFirstLetter(item?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Separator thickness={2} style={{ marginTop: 10 }} />
                </View>
              )}
            />
          )
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.textUid}>
              Anda harus Login / Register untuk mengecek riwayat Pengiriman
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
    fontFamily: "Poppins", fontSize: 10,
    color: colors.daclen_gray,
  },
  textPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    color: colors.daclen_orange,
    marginStart: 10,
  },
  textUid: {
    fontFamily: "Poppins", fontSize: 16,
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
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  delivery: store.historyState.delivery,
  deliveries: store.historyState.deliveries,
  deliveryStatus: store.historyState.deliveryStatus,
  deliveryPageNumber: store.historyState.deliveryPageNumber,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getDeliveries,
      clearDeliveryStatus,
      clearHistoryData,
      updateReduxHistoryDeliveries,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Delivery);
