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
  Linking,
  Platform,
  ToastAndroid,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getLaporanPoin, clearAuthError } from "../../axios/user";
import { colors, staticDimensions } from "../../styles/base";
import Separator from "../profile/Separator";
import { ErrorView } from "../webview/WebviewChild";
import { weblaporanpoin, webpenukaranpoin } from "../../axios/constants";
import { getPenukaranPoinDates } from "../../axios/user/points";
import { convertDateISOStringtoDisplayDate } from "../../axios/profile";

const ExchangeButton = ({ navigation, disabled }) => {
  function openExchange() {
    Linking.openURL(webpenukaranpoin);
    //navigation.navigate("PointWithdrawal");
  }
  return (
    <View style={styles.containerButton}>
      <TouchableOpacity
        onPress={() => openExchange()}
        style={[
          styles.exchangeButton,
          {
            backgroundColor: disabled
              ? colors.daclen_gray
              : colors.daclen_yellow_new,
          },
        ]}
        disabled={disabled}
      >
        <MaterialCommunityIcons
          name="swap-vertical-circle"
          size={14}
          color={colors.daclen_black}
          style={{ alignSelf: "center" }}
        />
        <Text allowFontScaling={false} style={styles.textExchangeButton}>
          Tukar Poin
        </Text>
      </TouchableOpacity>
    </View>
  );
};

function PointReport(props) {
  const { token, currentUser, points, checkouts, hpv, authError } = props;
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState([]);
  const [error, setError] = useState(null);
  const [exchangeStatus, setExchangeStatus] = useState({
    disabled: true,
    message: "",
  });
  const navigation = useNavigation();

  useEffect(() => {
    props.clearAuthError();
  }, []);

  useEffect(() => {
    if (token !== null) {
      penukaranPoinCheckAsync();
    }
    refreshPage();
  }, [token, points]);

  useEffect(() => {
    if (authError === null) {
      if (error !== null) {
        setError(null);
      }
      return;
    }
    setError(authError);
    if (loading && points === null) {
      setLoading(false);
    }
  }, [authError]);

  useEffect(() => {
    if (error === null) {
      return;
    } else if (Platform.OS === "android") {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  }, [error]);

  useEffect(() => {
    if (hpv?.data?.children?.length !== undefined) {
      const data = [
        ...new Set(
          hpv?.data?.children
            .map(({ id, name }) => ({
              id,
              name,
            }))
            .flat(1),
        ),
      ];
      setReferralData(data);
      console.log("referralData", data);
    }
  }, [hpv]);

  const penukaranPoinCheckAsync = async () => {
    try {
      let result = await getPenukaranPoinDates(token);
      let starting = new Date(result?.result?.tanggal_dari);
      let ending = new Date(result?.result?.tanggal_sampai);
      let today = new Date().getTime();

      console.log(ending.getTime() - today, today - starting.getTime());
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

      console.log("penukaranPoinCheckAsync", result);
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setExchangeStatus({ disabled: true, message: "" });
    }
  };

  function refreshPage() {
    if (points === null && token !== null && currentUser?.id !== undefined) {
      penukaranPoinCheckAsync();
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

  function onOpenExternalLink() {
    Linking.openURL(weblaporanpoin);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.daclen_light}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.textHeader}>
          Laporan Poin
        </Text>
        <ExchangeButton
          navigation={navigation}
          disabled={
            token === null || currentUser === null || exchangeStatus?.disabled
          }
        />
      </View>
      {exchangeStatus?.message ? (
        <View style={styles.containerInfo}>
          <MaterialCommunityIcons
            name="progress-clock"
            size={18}
            color={colors.daclen_light}
          />
          <Text style={styles.textInfo}>{exchangeStatus?.message}</Text>
        </View>
      ) : null}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_gray}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : error ? (
        <ErrorView
          error={`Mohon membuka website Daclen untuk membaca Laporan Poin${
            error ? `\n${error}` : ""
          }`}
          onOpenExternalLink={() => onOpenExternalLink()}
        />
      ) : token === null || currentUser?.id === undefined ? (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text allowFontScaling={false} style={styles.textUid}>
            Anda harus Login / Register untuk mengecek riwayat pengumpulan poin
          </Text>
        </TouchableOpacity>
      ) : (
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
            <Text allowFontScaling={false} style={styles.textUid}>
              Anda belum memiliki riwayat pengumpulan poin
            </Text>
          ) : (
            <FlashList
              estimatedItemSize={10}
              numColumns={1}
              horizontal={false}
              data={points?.data}
              contentContainerStyle={{
                paddingBottom: staticDimensions.pageBottomPadding,
              }}
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
                      <Text allowFontScaling={false} style={styles.textTitle}>
                        {item?.user_id === currentUser?.id
                          ? currentUser?.name
                          : item?.user_id}
                      </Text>

                      {item?.terakhir_diubah === null ? null : (
                        <Text allowFontScaling={false} style={styles.textDate}>
                          {moment(item?.terakhir_diubah).format("DD MMMM YYYY")}
                        </Text>
                      )}

                      {referralData?.length === undefined ||
                      referralData?.length < 1 ||
                      item?.refferal_user_id === undefined ||
                      item?.refferal_user_id === null ? null : (
                        <Text
                          allowFontScaling={false}
                          style={styles.textReferral}
                        >
                          {`Poin Didapatkan dari Referral\nReferral: ${
                            referralData.find(
                              ({ id }) => id === item?.refferal_user_id,
                            )?.name
                              ? `\nReferral: ${
                                  referralData.find(
                                    ({ id }) => id === item?.refferal_user_id,
                                  )?.name
                                }`
                              : ""
                          }`}
                        </Text>
                      )}
                      {item?.checkout_id === undefined ||
                      item?.checkout_id === null ? null : (
                        <TouchableOpacity
                          onPress={() => openItem(item?.checkout_id)}
                          disabled={loading}
                        >
                          <Text
                            allowFontScaling={false}
                            style={styles.textCheckout}
                          >{`Poin Didapatkan dari Checkout\nBuka Checkout`}</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.containerDescHorizontal}>
                      <View style={styles.containerPoints}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.textPoint,
                            { fontFamily: "Poppins", fontSize: 12 },
                          ]}
                        >
                          Poin
                        </Text>
                        <Text allowFontScaling={false} style={styles.textPoint}>
                          {item?.poin ? item?.poin : "0"}
                        </Text>
                      </View>
                      <View style={styles.containerPoints}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.textTotalPoint,
                            { fontFamily: "Poppins", fontSize: 12 },
                          ]}
                        >
                          Total
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.textTotalPoint}
                        >
                          {item?.total_poin ? item?.total_poin : "0"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Separator thickness={2} style={{ marginTop: 10 }} />
                </View>
              )}
            />
          )}
        </ScrollView>
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
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_black,
    elevation: 4,
    borderBottomWidth: 1,
    borderColor: colors.daclen_light,
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
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_gray,
  },
  containerFlatlist: {
    flex: 1,
  },
  containerButton: {
    backgroundColor: "transparent",
    alignSelf: "center",
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
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: colors.daclen_black,
    marginTop: 10,
  },
  textInfo: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginStart: 6,
    flex: 1,
    color: colors.daclen_light,
  },
  textDate: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_gray,
    marginTop: 2,
  },
  textReferral: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_black,
    marginTop: 6,
  },
  textCheckout: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_blue,
    marginTop: 6,
  },
  textPoint: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: colors.daclen_orange,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginHorizontal: 20,
    color: colors.daclen_light,
    alignSelf: "center",
    flex: 1,
  },
  textTotalPoint: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: colors.daclen_green,
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
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  exchangeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textExchangeButton: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginStart: 6,
    color: colors.daclen_black,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  checkouts: store.historyState.checkouts,
  points: store.userState.points,
  hpv: store.userState.hpv,
  authError: store.userState.authError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getLaporanPoin,
      clearAuthError,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(PointReport);
