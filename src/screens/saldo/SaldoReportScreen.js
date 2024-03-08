import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
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
import { colors, staticDimensions } from "../../styles/base";
import HistoryTabItem from "../../../components/history/HistoryTabItem";
import {
  saldohistoryicon,
  saldohistorytab,
  withdrawalhistoryicon,
  withdrawalhistorytab,
} from "../../../components/dashboard/constants";
import { sentryLog } from "../../../sentry";
import { setObjectAsync } from "../../../components/asyncstorage";
import {
  ASYNC_USER_RIWAYAT_PENARIKAN,
  ASYNC_USER_RIWAYAT_SALDO,
} from "../../../components/asyncstorage/constants";
import SaldoWithdrawalItem from "../../components/saldo/SaldoWithdrawalItem";
import CenteredView from "../../components/view/CenteredView";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import EmptySpinner from "../../components/empty/EmptySpinner";
import SaldoDayContainer from "../../components/saldo/SaldoDayContainer";
import { organizeListByTanggalDibuat } from "../../utils/saldo";


const SaldoReportScreen = (props) => {
  const { token, currentUser, saldo, authError, riwayatSaldo } = props;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowWithdraw, setAllowWithdraw] = useState(null);
  const [activeTab, setActiveTab] = useState(saldohistorytab);
  const [organizedList, setOrganizedList] = useState([]);
  

  try {
    useEffect(() => {
      try {
        props.clearAuthError();
      } catch (e) {
        console.error(e);
      }
    }, []);

    useEffect(() => {
      if (
        token === undefined ||
        token === null ||
        currentUser === undefined ||
        currentUser === null
      ) {
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

    useEffect(() => {
      if (saldo === null) {
        return;
      }
      let organized = organizeListByTanggalDibuat(saldo, true);
      //console.log("organized", organized);
      setOrganizedList(organized);
    }, [saldo]);

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
          console.log("redux saldo", saldo?.length);
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

    const openSaldoDetails = (e) => {
      console.log(e);
    }

    return (
      <CenteredView style={styles.container} title="Riwayat Saldo">
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
          style={styles.container}
          contentContainerStyle={styles.containerScroll}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => manualRefresh()}
            />
          }
        >
          {error ? (
            <EmptyPlaceholder
              title="Riwayat Saldo"
              text="Mohon membuka website Daclen untuk melihat riwayat saldo."
            />
          ) : token === null || currentUser?.id === undefined ? (
            <EmptySpinner />
          ) : activeTab === withdrawalhistorytab ? (
            riwayatSaldo === null ? (
              <EmptySpinner />
            ) : riwayatSaldo?.length < 1 ? (
              <EmptyPlaceholder
                title="Riwayat Saldo"
                text="Riwayat penarikan saldo Anda kosong."
              />
            ) : (
              riwayatSaldo.map((item, index) => (
                <SaldoWithdrawalItem key={index} {...item} />
              ))
            )
          ) : activeTab === saldohistorytab ? (
            saldo === null ? (
              <EmptySpinner />
            ) : saldo?.length < 1 || organizedList?.length < 1 ? (
              <EmptyPlaceholder
                title="Riwayat Saldo"
                text="Riwayat saldo anda kosong."
              />
            ) : (
              organizedList.map((item, index) => (
                <SaldoDayContainer key={index}
                header={item?.date}
                isLast={index >= organizedList?.length - 1}
                list={item?.itemList}
                onPress={(e) => openSaldoDetails(e)}  />
              ))
            )
          ) : null}
        </ScrollView>
      </CenteredView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <SafeAreaView style={styles.container}>
        <EmptyPlaceholder
          title="Riwayat Saldo"
          text="Mohon membuka website Daclen untuk melihat riwayat saldo."
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.daclen_grey_light,
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
  containerScroll: {
    flex: 1,
    backgroundColor: "transparent",
    paddingBottom: 100,
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

export default connect(mapStateToProps, mapDispatchProps)(SaldoReportScreen);
