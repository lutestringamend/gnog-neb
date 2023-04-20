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

import { getLaporanPoin } from "../../axios/user";

import { colors } from "../../styles/base";
import Separator from "../profile/Separator";

function PointReport(props) {
  const { token, currentUser, points, checkouts, hpv } = props;
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    refreshPage();
    //console.log("checkouts", checkouts);
  }, [token, points]);

  useEffect(() => {
    if (hpv?.data?.children?.length !== undefined) {
      const data = [
        ...new Set(
          hpv?.data?.children
            .map(({ id, name }) => ({
              id,
              name,
            }))
            .flat(1)
        ),
      ];
      setReferralData(data);
      console.log("referralData", data);
    }
  }, [hpv]);

  function refreshPage() {
    if (points === null && token !== null && currentUser?.id !== undefined) {
      props.getLaporanPoin(currentUser?.id, token);
      setLoading(true);
    } else {
      setLoading(false);
      console.log("points", points);
    }
  }

  function openItem(id) {
    if (!loading) {
      if (checkouts === null || checkouts?.length < 1) {
        navigation.navigate("HistoryCheckout", { id });
      } else {
        navigation.navigate("CheckoutItem", { id });
      }
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
      {token && currentUser?.id ? (
        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refreshPage()}
            />
          }
        >
          {points?.data?.length === undefined || points?.data?.length < 1 ? (
            <Text style={styles.textUid}>
              Anda belum memiliki riwayat pengumpulan poin
            </Text>
          ) : (
            <FlatList
              numColumns={1}
              horizontal={false}
              data={points?.data}
              style={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <View style={{ width: "100%" }}>
                  <View style={styles.containerItem}>
                    <MaterialCommunityIcons
                      name="hand-coin"
                      size={24}
                      color={colors.daclen_black}
                      style={styles.icon}
                    />

                    <View style={styles.containerDescVertical}>
                      <Text style={styles.textTitle}>
                        {item?.user_id === currentUser?.id
                          ? currentUser?.name
                          : item?.user_id}
                      </Text>
                      {referralData?.length === undefined ||
                      referralData?.length < 1 ||
                      item?.refferal_user_id === undefined ||
                      item?.refferal_user_id === null ? null : (
                        <Text style={styles.texttReferral}>
                          {"Referral: "}
                          {
                            referralData.find(
                              ({ id }) => id === item?.refferal_user_id
                            )?.name
                          }
                        </Text>
                      )}
                      {item?.checkout_id === undefined ||
                      item?.checkout_id === null ? null : (
                        <TouchableOpacity
                          onPress={() => openItem(item?.checkout_id)}
                          disabled={loading}
                        >
                          <Text style={styles.textCheckout}>Buka Checkout</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.containerDescHorizontal}>
                      <View style={styles.containerPoints}>
                        <Text style={[styles.textPoint, { fontSize: 12 }]}>
                          Poin
                        </Text>
                        <Text style={styles.textPoint}>
                          {item?.poin ? item?.poin : "0"}
                        </Text>
                      </View>
                      {item?.total_poin ? (
                        <View style={styles.containerPoints}>
                          <Text
                            style={[styles.textTotalPoint, { fontSize: 12 }]}
                          >
                            Total
                          </Text>
                          <Text style={styles.textTotalPoint}>
                            {item?.total_poin}
                          </Text>
                        </View>
                      ) : null}
                    </View>
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
            Anda harus Login / Register untuk mengecek riwayat pengumpulan poin
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
    alignSelf: "center",
  },
  containerPoints: {
    marginHorizontal: 10,
  },
  containerFlatlist: {
    flex: 1,
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  texttReferral: {
    fontSize: 12,
    fontStyle: "bold",
    color: colors.daclen_gray,
  },
  textCheckout: {
    fontSize: 14,
    fontStyle: "bold",
    color: colors.daclen_blue,
  },
  textPoint: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.daclen_orange,
  },
  textTotalPoint: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.daclen_green,
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
  currentUser: store.userState.currentUser,
  checkouts: store.historyState.checkouts,
  points: store.userState.points,
  hpv: store.userState.hpv,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getLaporanPoin,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(PointReport);
