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
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getDeliveries,
  clearDeliveryStatus,
  clearHistoryData,
} from "../../axios/history";

import { colors, dimensions } from "../../styles/base";
import Separator from "../profile/Separator";

function Delivery(props) {
  const { token, deliveries, delivery, deliveryStatus } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (deliveries === null && token !== null) {
      props.getDeliveries(token);
      setLoading(true);
    } else {
      setLoading(false);
    }
    //console.log({ deliveries, token });
  }, [token, deliveries]);

  useEffect(() => {
    if (delivery === null) {
      console.log("delivery is null");
      if (deliveryStatus !== null) props.clearDeliveryStatus();
    }
  }, [delivery, deliveryStatus]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function openItem(id) {
    if (!loading) {
      /*setLoading(true);
      props.getDeliveryItem(id);*/
      navigation.navigate("DeliveryItem", { id });
    }
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
          {deliveries === undefined || deliveries === null || deliveries?.length === undefined || deliveries?.length < 1 ? (
            <Text style={styles.textUid}>
              Anda belum memiliki riwayat Pengiriman
            </Text>
          ) : (
            <FlashList
              estimatedItemSize={10}
              numColumns={1}
              horizontal={false}
              data={deliveries}
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
          )}
        </ScrollView>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textUid}>
            Anda harus Login / Register untuk mengecek riwayat Pengiriman
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
  delivery: store.historyState.delivery,
  deliveries: store.historyState.deliveries,
  deliveryStatus: store.historyState.deliveryStatus,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getDeliveries,
      clearDeliveryStatus,
      clearHistoryData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Delivery);
