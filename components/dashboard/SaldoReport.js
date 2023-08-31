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

import { getLaporanSaldo, clearAuthError } from "../../axios/user";
import { colors, staticDimensions } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";
import Separator from "../profile/Separator";
import { websaldo } from "../../axios/constants";
import { formatPrice } from "../../axios/cart";

const SaldoReport = (props) => {
  const { token, currentUser, saldo, authError } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      props.clearAuthError();
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refreshPage();
  }, [token, saldo]);

  useEffect(() => {
    if (authError === null) {
      if (error !== null) {
        setError(null);
      }
      return;
    }
    setError(authError);
    if (loading && saldo === null) {
      setLoading(false);
    }
  }, [authError]);

  function refreshPage() {
    if (saldo === null && token !== null && currentUser?.id !== undefined) {
      props.getLaporanSaldo(currentUser?.id, token);
      setLoading(true);
    } else {
      setLoading(false);
      console.log("redux saldo", saldo);
    }
  }

  function openWithdrawal() {
    //navigation.navigate("Withdrawal");
    onOpenExternalLink();
  }

  function onOpenExternalLink() {
    Linking.openURL(websaldo);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={() => openWithdrawal()}
          style={styles.button}
        >
          <MaterialCommunityIcons name="cash-refund" size={18} color="white" />
          <Text style={styles.textButton}>Tarik Saldo</Text>
        </TouchableOpacity>
      </View>
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
          <Text style={styles.textUid}>
            Anda harus Login / Register untuk mengecek riwayat saldo
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
          {saldo?.data?.length === undefined || saldo?.data?.length < 1 ? (
            <Text style={styles.textUid}>
              Anda belum memiliki riwayat saldo
            </Text>
          ) : (
            <FlashList
              estimatedItemSize={15}
              numColumns={1}
              horizontal={false}
              data={saldo?.data?.reverse()}
              contentContainerStyle={{
                paddingBottom: staticDimensions.pageBottomPadding,
              }}
              renderItem={({ item }) => (
                <View style={styles.containerSaldo}>
                  {item?.nomor_invoice ? (
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
                            : colors.daclen_gray
                        }
                        style={styles.icon}
                      />
                      <Text
                        style={[
                          styles.textTitle,
                          {
                            color:
                              item?.saldo > 0
                                ? colors.daclen_green
                                : item?.saldo < 0
                                ? colors.daclen_danger
                                : colors.daclen_gray,
                          },
                        ]}
                      >
                        {`Invoice No ${item?.nomor_invoice}`}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.containerDescVertical}>
                    <Text style={styles.textDate}>
                      {moment(
                        item?.tanggal_dibuat
                          ? item?.tanggal_dibuat
                          : item?.tanggal_diubah
                          ? item?.tanggal_diubah
                          : item?.tanggal_penarikan
                      ).format("DD MMMM YYYY")}
                    </Text>
                    {item?.saldo === undefined ||
                    item?.saldo === null ||
                    item?.saldo === 0 ? null : (
                      <Text
                        style={[
                          styles.textPoint,
                          {
                            fontSize: 14,
                            color:
                              item?.saldo < 0
                                ? colors.daclen_red
                                : colors.daclen_green,
                          },
                        ]}
                      >
                        {`${
                          item?.saldo >= 0
                            ? "Komisi Penjualan"
                            : "Saldo Ditarik"
                        }: ${formatPrice(Math.abs(item?.saldo))}`}
                      </Text>
                    )}

                    {item?.total_saldo === undefined ||
                    item?.total_saldo === null ? null : (
                      <Text style={styles.textTotalPoint}>
                        {`Total Komisi Saat Ini: ${item?.total_saldo <= 0 ? "Rp 0" : formatPrice(
                          item?.total_saldo
                        )}`}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
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
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_black,
    marginStart: 10,
  },
  textDate: {
    fontSize: 12,
    color: colors.daclen_gray,
    marginBottom: 4,
  },
  textReferral: {
    fontSize: 14,
    color: colors.daclen_black,
    marginTop: 6,
  },
  textCheckout: {
    fontSize: 14,
    fontStyle: "bold",
    color: colors.daclen_blue,
    marginTop: 2,
  },
  textPoint: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.daclen_orange,
    marginBottom: 4,
  },
  textTotalPoint: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.daclen_blue,
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
    fontWeight: "bold",
    marginStart: 10,
    color: "white",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  saldo: store.userState.saldo,
  authError: store.userState.authError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getLaporanSaldo,
      clearAuthError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(SaldoReport);
