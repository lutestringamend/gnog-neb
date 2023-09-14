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
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getDeliveryItem,
  getStatusPengiriman,
  clearDeliveryStatus,
} from "../../axios/history";

import DeliveryManifest from "./DeliveryManifest";
import { colors, dimensions } from "../../styles/base";

function DeliveryItem(props) {
  const { delivery, token, deliveryStatus } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (
      props.route.params?.id !== null &&
      props.route.params?.id !== undefined 
    ) {
      props.getDeliveryItem(props.route.params?.id);
    }
  }, [props.route.params?.id]);

  useEffect(() => {
    if (delivery === null || loading) {
      console.log("delivery is null");
      setLoading(false);
    } else {
      refreshPage();
    }
  }, [delivery]);

  useEffect(() => {
    if (deliveryStatus === null) {
      if (loading) {
        console.log("loading deliveryStatus");
      } else {
        console.log("deliveryStatus is null");
      }
    } else {
      setLoading(false);
      console.log("deliveryStatus updated");
      console.log(deliveryStatus);
    }
  }, [deliveryStatus]);

  function refreshPage() {
    props.clearDeliveryStatus();
    console.log(delivery);
    setLoading(true);
    props.getStatusPengiriman(token, delivery?.id);
  }

  function openCheckoutItem(id) {
    if (!loading) {
      navigation.navigate("CheckoutItem", { id });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refreshPage()}
          />
        }
      >
        {delivery === null || deliveryStatus === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          <View style={styles.container}>
            <View style={styles.containerHeader}>
              <View style={styles.containerDescHorizontal}>
                <View style={styles.containerDescVertical}>
                  <Text allowFontScaling={false} style={styles.textTitle}>Nomor Resi</Text>
                  <Text allowFontScaling={false} styles={styles.textInvoice}>
                    {delivery?.nomor_resi}
                  </Text>
                </View>
                <View style={styles.containerDescVertical}>
                  <Text allowFontScaling={false} style={styles.textTitle}>Info Penerima</Text>
                  <Text allowFontScaling={false} styles={styles.textEntry}>
                    {deliveryStatus.summary?.receiver_name}
                  </Text>
                </View>
              </View>
              <View style={styles.containerDescHorizontal}>
                <View style={styles.containerDescVertical}>
                  <Text allowFontScaling={false} style={styles.textTitle}>Kurir Pengiriman</Text>
                  <Text allowFontScaling={false} styles={styles.textInvoice}>
                    {delivery?.nama_kurir}
                  </Text>
                </View>
                <View style={styles.containerDescVertical}>
                  <Text allowFontScaling={false} style={styles.textTitle}>Alamat Pengiriman</Text>
                  <Text allowFontScaling={false} styles={styles.textEntry}>
                    {deliveryStatus.summary?.destination}
                  </Text>
                </View>
              </View>
              <View style={styles.containerDescHorizontal}>
                <View style={styles.containerDescVertical}>
                  <Text allowFontScaling={false} style={styles.textTitle}>Status</Text>
                  <Text allowFontScaling={false} styles={styles.textInvoice}>
                    {deliveryStatus?.delivery_status?.status}
                  </Text>
                  <Text allowFontScaling={false} styles={styles.textEntry}>
                    {deliveryStatus?.delivery_status?.pod_receiver}
                  </Text>
                  <Text allowFontScaling={false} styles={styles.textEntry}>
                    {deliveryStatus?.delivery_status?.pod_date}{" "}
                    {deliveryStatus?.delivery_status?.pod_time}
                  </Text>
                </View>

                <View style={styles.containerDescVertical}>
                  {delivery?.checkout_id && (
                    <TouchableOpacity
                      onPress={() => openCheckoutItem(delivery?.checkout_id)}
                      style={styles.button}
                    >
                      <Text allowFontScaling={false} style={styles.textButton}>Info Checkout</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.containerFlatlist}>
              {deliveryStatus.manifest?.length > 0 && (
                <FlatList
                  numColumns={1}
                  horizontal={false}
                  data={deliveryStatus?.manifest.reverse()}
                  renderItem={({ item }) => (
                    <DeliveryManifest
                      item={item}
                      waybill_date={deliveryStatus?.details?.waybill_date}
                      waybill_time={deliveryStatus?.details?.waybill_time}
                    />
                  )}
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  containerHeader: {
    padding: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },
  containerDescVertical: {
    flex: 1,
    marginHorizontal: 10,
  },
  containerDescHorizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  containerFlatlist: {
    justifyContent: "flex-start",
    borderTopWidth: 2,
    borderTopColor: colors.daclen_green,
  },
  textTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_blue,
  },
  textInvoice: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    color: colors.daclen_black,
    marginBottom: 4,
  },
  textEntry: {
    fontFamily: "Poppins", 
    fontSize: 10,
    color: colors.daclen_gray,
  },
  textUid: {
    fontFamily: "Poppins", fontSize: 12,
    marginVertical: 20,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  button: {
    marginEnd: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  delivery: store.historyState.delivery,
  deliveryStatus: store.historyState.deliveryStatus,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getDeliveryItem,
      getStatusPengiriman,
      clearDeliveryStatus,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(DeliveryItem);
