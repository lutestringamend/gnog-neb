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
} from "../../../axios/user";
import { colors, staticDimensions } from "../../../styles/base";
import { ErrorView } from "../../webview/WebviewChild";
import HistoryTabItem from "../../history/HistoryTabItem";
import { websaldo } from "../../../axios/constants";
import {
  saldohistoryicon,
  saldohistorytab,
  withdrawalhistoryicon,
  withdrawalhistorytab,
} from "../constants";
import { sentryLog } from "../../../sentry";
import { getObjectAsync, setObjectAsync } from "../../asyncstorage";
import {
  ASYNC_USER_RIWAYAT_PENARIKAN,
  ASYNC_USER_RIWAYAT_SALDO,
} from "../../asyncstorage/constants";
import SaldoHistoryItem from "./SaldoHistoryItem";
import SaldoWithdrawalItem from "./SaldoWithdrawalItem";

const WithdrawalButton = () => {
  const navigation = useNavigation();
  function openWithdrawal() {
    navigation.navigate("Withdrawal");
    //onOpenExternalLink();
  }
  return (
    <View style={styles.containerButton}>
      <TouchableOpacity onPress={() => openWithdrawal()} style={styles.button}>
        <MaterialCommunityIcons
          name="cash-refund"
          size={18}
          color={colors.daclen_light}
        />
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
  const [allowWithdraw, setAllowWithdraw] = useState(null);
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
        let allWithdrawalsDone = true;
        try {
          if (
            !(riwayatSaldo?.length === undefined || riwayatSaldo?.length < 1)
          ) {
            for (let s of riwayatSaldo) {
              if (s?.status.toLowerCase() === "diproses") {
                allWithdrawalsDone = false;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
        setAllowWithdraw(allWithdrawalsDone);

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

    function refreshPage() {
      if (activeTab === withdrawalhistorytab) {
        refreshRiwayatPenarikanPage();
      } else if (activeTab === saldohistorytab) {
        refreshSaldoPage();
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
        {activeTab === withdrawalhistorytab && allowWithdraw !== null ? (
          allowWithdraw ? (
            <WithdrawalButton />
          ) : (
            <View
              style={[styles.button, { backgroundColor: colors.daclen_gray }]}
            >
              <MaterialCommunityIcons
                name="progress-clock"
                size={18}
                color={colors.daclen_light}
              />
              <Text style={[styles.textButton, { fontSize: 12, flex: 1 }]}>
                Tidak bisa menarik saldo selama masih ada penarikan yang diproses
              </Text>
            </View>
          )
        ) : null}

        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refreshPage()}
            />
          }
        >
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
          ) : activeTab === withdrawalhistorytab ? (
            riwayatSaldo?.length === undefined || riwayatSaldo?.length < 1 ? (
              <Text allowFontScaling={false} style={styles.textUid}>
                Anda belum memiliki Riwayat Penarikan Saldo.
              </Text>
            ) : (
              <FlashList
                estimatedItemSize={10}
                numColumns={1}
                horizontal={false}
                data={riwayatSaldo}
                contentContainerStyle={{
                  paddingBottom: staticDimensions.pageBottomPadding,
                }}
                renderItem={({ item }) => <SaldoWithdrawalItem item={item} />}
              />
            )
          ) : activeTab === saldohistorytab ? (
            saldo?.length === undefined || saldo?.length < 1 ? (
              <Text allowFontScaling={false} style={styles.textUid}>
                Anda belum memiliki Riwayat Saldo.
              </Text>
            ) : (
              <FlashList
                estimatedItemSize={15}
                numColumns={1}
                horizontal={false}
                data={saldo}
                contentContainerStyle={{
                  paddingBottom: staticDimensions.pageBottomPadding,
                }}
                renderItem={({ item }) => <SaldoHistoryItem item={item} />}
              />
            )
          ) : null}
        </ScrollView>
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
  containerButton: {
    width: "100%",
    backgroundColor: colors.daclen_light,
  },
  containerFlatlist: {
    flex: 1,
    backgroundColor: "transparent",
  },
  containerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    margin: 10,
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
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginStart: 10,
    color: colors.daclen_light,
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
