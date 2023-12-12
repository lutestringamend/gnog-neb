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
  setNewToken,
  getCurrentUser,
  getLaporanSaldo,
  getRiwayatPenarikanSaldo,
  updateReduxUserSaldo,
  updateReduxUserRiwayatSaldo,
  clearAuthError,
  deriveUserKey,
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
import { setObjectAsync } from "../../asyncstorage";
import {
  ASYNC_USER_RIWAYAT_PENARIKAN,
  ASYNC_USER_RIWAYAT_SALDO,
} from "../../asyncstorage/constants";
import SaldoHistoryItem from "./SaldoHistoryItem";
import SaldoWithdrawalItem from "./SaldoWithdrawalItem";

const WithdrawalButton = ({ disabled }) => {
  const navigation = useNavigation();
  function openWithdrawal() {
    navigation.navigate("Withdrawal");
    //onOpenExternalLink();
  }
  return (
    <View style={styles.containerButton}>
      <TouchableOpacity
        onPress={() => openWithdrawal()}
        style={[
          styles.button,
          {
            backgroundColor: disabled
              ? colors.daclen_gray
              : colors.daclen_yellow_new,
          },
        ]}
        disabled={disabled}
      >
        <MaterialCommunityIcons
          name="cash-refund"
          size={14}
          color={colors.daclen_black}
          style={{ alignSelf: "center" }}
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
      if (token === undefined || token === null || currentUser === undefined || currentUser === null) {
        return;
      }
      refreshPage();
    }, [token, currentUser, activeTab, saldo, riwayatSaldo]);

    useEffect(() => {
      if (authError === null) {
        if (error !== null) {
          setError(null);
        }
        return;
      }
      setError(authError);
      props.updateReduxUserRiwayatSaldo([]);
      props.updateReduxUserSaldo([]);
      //checkAsyncStorageSaldo();
    }, [authError]);

    /*const checkAsyncStorageSaldo = async () => {
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
    };*/

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
        console.log("redux riwayatSaldo", riwayatSaldo?.length);
      }
    }

    function refreshSaldoPage() {
      /*if (saldo === null) {
        
      } else {
        setLoading(false);
        setObjectAsync(ASYNC_USER_RIWAYAT_SALDO, saldo);
        console.log("redux saldo", saldo);
      }*/

      if (loading) {
        if (saldo !== null) {
          setLoading(false);
        }
      } else {
        if (token !== null && currentUser?.id !== undefined) {
          props.getLaporanSaldo(currentUser?.id, token);
          setLoading(true);
        }
      }
    }

    function refreshPage() {
      if (activeTab === withdrawalhistorytab) {
        refreshRiwayatPenarikanPage();
      } else if (activeTab === saldohistorytab) {
        refreshSaldoPage();
        if (saldo !== null) {
          setObjectAsync(ASYNC_USER_RIWAYAT_SALDO, saldo);
          console.log("redux saldo", saldo);
        }
      }
    }

    function manualRefresh() {
      if (loading) {
        return;
      }
      setLoading(true);
      if (activeTab === withdrawalhistorytab) {
        props.getRiwayatPenarikanSaldo(currentUser?.id, token);
      } else if (activeTab === saldohistorytab) {
        props.getLaporanSaldo(currentUser?.id, token);
      }
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
            Saldo
          </Text>
          <WithdrawalButton disabled={!allowWithdraw} />
          <TouchableOpacity
            style={styles.containerIcon}
            onPress={() => manualRefresh()}
          >
            {loading ? (
              <ActivityIndicator
                size={24}
                color={colors.daclen_light}
                style={styles.icon}
              />
            ) : (
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color={colors.daclen_light}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>
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
          allowWithdraw ? null : (
            <View
              style={[
                styles.button,
                { backgroundColor: colors.daclen_gray, borderRadius: 0 },
              ]}
            >
              <MaterialCommunityIcons
                name="progress-clock"
                size={18}
                color={colors.daclen_light}
              />
              <Text
                style={[
                  styles.textButton,
                  { fontSize: 12, flex: 1, color: colors.daclen_light },
                ]}
              >
                Tidak bisa menarik saldo selama masih ada penarikan yang
                diproses
              </Text>
            </View>
          )
        ) : null}

        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => manualRefresh()}
            />
          }
        >
          {error ? (
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
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 10,
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
  containerIcon: {
    backgroundColor: "transparent",
    alignSelf: "center",
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
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginHorizontal: 20,
    color: colors.daclen_light,
    alignSelf: "center",
    flex: 1,
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
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textButton: {
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
  saldo: store.userState.saldo,
  riwayatSaldo: store.userState.riwayatSaldo,
  authError: store.userState.authError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      setNewToken,
      getCurrentUser,
      getLaporanSaldo,
      getRiwayatPenarikanSaldo,
      updateReduxUserSaldo,
      updateReduxUserRiwayatSaldo,
      clearAuthError,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(SaldoReport);
