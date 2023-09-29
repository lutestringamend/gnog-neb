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
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getLaporanSaldo,
  getRiwayatPenarikanSaldo,
  updateReduxUserSaldo,
  updateReduxUserRiwayatSaldo,
  clearAuthError,
} from "../../axios/user";
import { colors, staticDimensions } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";
import HistoryTabItem from "../history/HistoryTabItem";
import Separator from "../profile/Separator";
import { websaldo } from "../../axios/constants";
import { formatPrice } from "../../axios/cart";
import {
  saldohistoryicon,
  saldohistorytab,
  withdrawalhistoryicon,
  withdrawalhistorytab,
} from "./constants";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  ASYNC_USER_RIWAYAT_PENARIKAN,
  ASYNC_USER_RIWAYAT_SALDO,
} from "../asyncstorage/constants";

const WithdrawalButton = () => {
  const navigation = useNavigation();
  function openWithdrawal() {
    navigation.navigate("Withdrawal");
    //onOpenExternalLink();
  }
  return (
    <View style={styles.containerButton}>
      <TouchableOpacity onPress={() => openWithdrawal()} style={styles.button}>
        <MaterialCommunityIcons name="cash-refund" size={18} color="white" />
        <Text allowFontScaling={false} style={styles.textButton}>
          Tarik Saldo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const SaldoReport = (props) => {
  const { token, currentUser, saldo, authError, riwayatSaldo } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(withdrawalhistorytab);
  const navigation = useNavigation();

  function onOpenExternalLink() {
    Linking.openURL(websaldo);
  }

  try {
    useEffect(() => {
      try {
        props.clearAuthError();
      } catch (e) {
        console.error(e);
      }
    }, []);

    useEffect(() => {
      if (activeTab === withdrawalhistorytab) {
        refreshRiwayatPenarikanPage();
      } else if (activeTab === saldohistorytab) {
        refreshSaldoPage();
      }
    }, [activeTab, saldo, riwayatSaldo]);

    useEffect(() => {
      if (authError === null) {
        if (error !== null) {
          setError(null);
        }
        return;
      }
      setError(authError);
      checkAsyncStorageSaldo();
    }, [authError]);

    const checkAsyncStorageSaldo = async () => {
      if (activeTab === withdrawalhistorytab && riwayatSaldo === null) {
        const asyncPenarikan = await getObjectAsync(
          ASYNC_USER_RIWAYAT_PENARIKAN
        );
        if (
          asyncPenarikan === undefined ||
          asyncPenarikan === null ||
          asyncPenarikan?.length === undefined ||
          asyncPenarikan?.length < 1
        ) {
          props.updateReduxUserRiwayatSaldo([]);
        } else {
          props.updateReduxUserRiwayatSaldo(asyncPenarikan);
        }
      } else if (activeTab === saldohistorytab && saldo === null) {
        const asyncSaldo = await getObjectAsync(ASYNC_USER_RIWAYAT_SALDO);
        if (
          asyncSaldo === undefined ||
          asyncSaldo === null ||
          asyncSaldo?.length === undefined ||
          asyncSaldo?.length < 1
        ) {
          props.updateReduxUserSaldo([]);
        } else {
          props.updateReduxUserSaldo(asyncSaldo);
        }
      }
      if (loading) {
        setLoading(false);
      }
    };

    function refreshRiwayatPenarikanPage() {
      if (riwayatSaldo === null) {
        if (!loading && token !== null && currentUser?.id !== undefined) {
          props.getRiwayatPenarikanSaldo(currentUser?.id, token);
          setLoading(true);
        }
      } else {
        setLoading(false);
        setObjectAsync(ASYNC_USER_RIWAYAT_PENARIKAN, riwayatSaldo);
        console.log("redux riwayatSaldo", riwayatSaldo);
      }
    }

    function refreshSaldoPage() {
      if (saldo === null) {
        if (!loading && token !== null && currentUser?.id !== undefined) {
          props.getLaporanSaldo(currentUser?.id, token);
          setLoading(true);
        }
      } else {
        setLoading(false);
        setObjectAsync(ASYNC_USER_RIWAYAT_SALDO, saldo);
        console.log("redux saldo", saldo);
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tabView}>
          <HistoryTabItem
            activeTab={activeTab}
            name={withdrawalhistorytab}
            icon={withdrawalhistoryicon}
            onPress={() => setActiveTab(withdrawalhistorytab)}
            disabled={loading}
          />

          <HistoryTabItem
            activeTab={activeTab}
            name={saldohistorytab}
            icon={saldohistoryicon}
            onPress={() => setActiveTab(saldohistorytab)}
            disabled={loading}
          />
        </View>
        {activeTab === withdrawalhistorytab ? <WithdrawalButton /> : null}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : error ? (
          <ErrorView
            error={`Mohon membuka website Daclen untuk membaca Laporan Saldo${
              error ? `\n${error}` : ""
            }`}
            onOpenExternalLink={() => onOpenExternalLink()}
          />
        ) : token === null || currentUser?.id === undefined ? (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text allowFontScaling={false} style={styles.textUid}>
              Anda harus Login / Register untuk mengecek riwayat saldo
            </Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            style={styles.containerFlatlist}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refreshSaldoPage()}
              />
            }
          >
            {activeTab === withdrawalhistorytab &&
            (riwayatSaldo?.length === undefined || riwayatSaldo?.length < 1) ? (
              <Text allowFontScaling={false} style={styles.textUid}>
                Anda belum memiliki Riwayat Penarikan Saldo.
              </Text>
            ) : activeTab === saldohistorytab &&
              (saldo?.length === undefined || saldo?.length) < 1 ? (
              <Text allowFontScaling={false} style={styles.textUid}>
                Anda belum memiliki Riwayat Saldo.
              </Text>
            ) : (
              <FlashList
                estimatedItemSize={15}
                numColumns={1}
                horizontal={false}
                data={activeTab === withdrawalhistorytab ? riwayatSaldo : saldo}
                contentContainerStyle={{
                  paddingBottom: staticDimensions.pageBottomPadding,
                }}
                renderItem={({ item }) => (
                  <View style={styles.containerSaldo}>
                    {item?.status ? (
                      <View style={styles.containerHeader}>
                        <MaterialCommunityIcons
                          name={
                            item?.saldo > 0
                              ? "cash-plus"
                              : item?.saldo < 0
                              ? "cash-minus"
                              : "cash"
                          }
                          size={24}
                          color={
                            item?.saldo > 0
                              ? colors.daclen_green
                              : item?.saldo < 0
                              ? colors.daclen_danger
                              : colors.daclen_black
                          }
                          style={styles.icon}
                        />
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.textTitle,
                            {
                              color:
                                item?.saldo > 0
                                  ? colors.daclen_green
                                  : item?.saldo < 0
                                  ? colors.daclen_danger
                                  : colors.daclen_black,
                            },
                          ]}
                        >
                          {item?.status}
                        </Text>
                        <Text allowFontScaling={false} style={styles.textDate}>
                          {moment(
                            item?.tanggal_dibuat
                              ? item?.tanggal_dibuat
                              : item?.tanggal_diubah
                              ? item?.tanggal_diubah
                              : item?.tanggal_penarikan
                          ).format("DD MMMM YYYY")}
                        </Text>
                      </View>
                    ) : null}
                    <View style={styles.containerDescVertical}>
                      {item?.saldo === undefined ||
                      item?.saldo === null ||
                      item?.saldo === 0 ? null : (
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.textPoint,
                            {
                              color:
                                item?.saldo < 0
                                  ? colors.daclen_red
                                  : colors.daclen_green,
                            },
                          ]}
                        >
                          {formatPrice(Math.abs(item?.saldo))}
                        </Text>
                      )}

                      {item?.keterangan || item?.nomor_invoice ? (
                        <Text
                          allowFontScaling={false}
                          style={styles.textReferral}
                        >{`${item?.keterangan ? `${item?.keterangan}\n` : ""}${
                          item?.nomor_invoice
                            ? `Nomor Invoice ${item?.nomor_invoice}`
                            : ""
                        }`}</Text>
                      ) : null}

                      {item?.total_saldo === undefined ||
                      item?.total_saldo === null ? null : (
                        <Text
                          allowFontScaling={false}
                          style={styles.textTotalPoint}
                        >
                          {`Saldo Total: ${
                            item?.total_saldo <= 0
                              ? "Rp 0"
                              : formatPrice(item?.total_saldo)
                          }`}
                        </Text>
                      )}
                    </View>
                    <Separator thickness={2} style={{ marginTop: 20 }} />
                  </View>
                )}
              />
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          error={`Mohon membuka website Daclen untuk membaca Laporan Saldo\n${e.toString()}`}
          onOpenExternalLink={() => onOpenExternalLink()}
        />
        {token === null || currentUser === null ? null : <WithdrawalButton />}
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  tabView: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  containerSaldo: {
    backgroundColor: "transparent",
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
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  containerPoints: {
    marginHorizontal: 10,
  },
  containerButton: {
    width: "100%",
    backgroundColor: colors.daclen_light,
  },
  containerFlatlist: {
    flex: 1,
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    margin: 10,
  },
  icon: {
    alignSelf: "center",
  },
  textTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.daclen_black,
    marginStart: 10,
    flex: 1,
  },
  textDate: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
    marginStart: 6,
    alignSelf: "center",
  },
  textReferral: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
    marginTop: 4,
  },
  textCheckout: {
    fontFamily: "Poppins",
    fontSize: 14,

    color: colors.daclen_blue,
    marginTop: 2,
  },
  textPoint: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    color: colors.daclen_orange,
  },
  textTotalPoint: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_blue,
    marginTop: 6,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginStart: 10,
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  saldo: store.userState.saldo,
  riwayatSaldo: store.userState.riwayatSaldo,
  authError: store.userState.authError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getLaporanSaldo,
      getRiwayatPenarikanSaldo,
      updateReduxUserSaldo,
      updateReduxUserRiwayatSaldo,
      clearAuthError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(SaldoReport);
