import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { checkNumberEmpty } from "../../axios";
import { withdrawalexplanation } from "../../constants/dashboard";
import {
  SALDO_ADMIN_FEE,
  SALDO_WITHDRAWAL_MINIMUM,
} from "../../axios/constants";
import {
  storePenarikanSaldo,
  updateReduxUserRiwayatSaldo,
} from "../../axios/user";
import { formatPrice } from "../../axios/cart";
import { setObjectAsync } from "../../../components/asyncstorage";
import { ASYNC_USER_RIWAYAT_PENARIKAN } from "../../../components/asyncstorage/constants";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";
import Separator from "../../components/Separator";
import Button from "../../components/Button/Button";

const WithdrawalConfirmationScreen = (props) => {
  const { token, currentUser, riwayatSaldo } = props;
  const navigation = useNavigation();
  const amount = props.route.params?.amount ? props.route.params?.amount : 0;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading && riwayatSaldo === null) {
      setLoading(true);
      setSuccess(true);
      setError("Permintaan penarikan sudah tercatat di Riwayat Penarikan.");
    }
  }, [riwayatSaldo]);

  const submit = async () => {
    /*Linking.openURL(websaldo);
    navigation.goBack();*/
    setLoading(true);
    const result = await storePenarikanSaldo(
      token,
      (parseInt(amount) + parseInt(SALDO_ADMIN_FEE)).toString(),
      currentUser?.id,
    );
    console.log("storePenarikanSaldo result", result);
    if (
      result === undefined ||
      result === null ||
      result?.data === undefined ||
      result?.data === null
    ) {
      setSuccess(false);
      setError(result?.error ? result?.error : "Gagal meminta penarikan saldo.");
    } else {
      setObjectAsync(ASYNC_USER_RIWAYAT_PENARIKAN, null);
      props.updateReduxUserRiwayatSaldo(null);
      setSuccess(true);
      setError("Permintaan penarikan saldo telah diterima.");
    }
    setLoading(false);
  };

  const closeAlert = () => {
    if (success) {
      navigation.navigate("Main");
    }
    setError(null);
  }

  return (
    <CenteredView title="Rincian Tarik Saldo" style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
      >
        <View style={styles.containerTopBox}>
          <View style={styles.containerHorizontal}>
            <MaterialCommunityIcons
              name="information"
              size={18}
              color={colors.daclen_grey_placeholder}
            />
            <Text
              allowFontScaling={false}
              style={[styles.textName, { marginStart: 8 }]}
            >
              Info Penarikan Saldo
            </Text>
          </View>

          <View
            style={[
              styles.containerHorizontal,
              { marginTop: staticDimensions.marginHorizontal },
            ]}
          >
            <View style={[styles.containerVertical, { flex: 1 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                Saldo sebelumnya
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.textName, { marginTop: 2 }]}
              >
                {currentUser?.komisi_user?.total
                  ? formatPrice(
                      checkNumberEmpty(currentUser?.komisi_user?.total),
                    )
                  : "Rp 0"}
              </Text>
            </View>
            <View style={[styles.containerVertical, { flex: 1 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                Saldo setelahnya
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.textName, { marginTop: 2 }]}
              >
                {formatPrice(
                  checkNumberEmpty(currentUser?.komisi_user?.total) -
                    SALDO_ADMIN_FEE -
                    amount,
                )}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.containerHorizontal,
              { marginTop: staticDimensions.marginHorizontal },
            ]}
          >
            <View style={[styles.containerVertical, { flex: 1 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                Jumlah diterima
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.textName, { marginTop: 2 }]}
              >
                {amount ? formatPrice(amount) : "Rp 0"}
              </Text>
            </View>
            <View style={[styles.containerVertical, { flex: 1 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                Biaya admin
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.textName, { marginTop: 2 }]}
              >
                {formatPrice(SALDO_ADMIN_FEE)}
              </Text>
            </View>
          </View>
        </View>

        {currentUser?.detail_user === undefined ||
        currentUser?.detail_user?.nomor_rekening === undefined ||
        currentUser?.detail_user?.nomor_rekening === null ||
        currentUser?.detail_user?.nomor_rekening === "" ||
        currentUser?.detail_user?.bank === undefined ||
        currentUser?.detail_user?.bank?.nama === undefined ||
        currentUser?.detail_user?.bank?.nama === null ||
        currentUser?.detail_user?.bank?.nama === "" ? null : (
          <View style={[styles.containerTopBox, { marginTop: 12 }]}>
            <View style={styles.containerHorizontal}>
              <MaterialCommunityIcons
                name="information"
                size={18}
                color={colors.daclen_grey_placeholder}
              />
              <Text
                allowFontScaling={false}
                style={[styles.textName, { marginStart: 8 }]}
              >
                Info Rekening Penerima
              </Text>
            </View>

            <View
              style={[
                styles.containerHorizontal,
                { marginTop: staticDimensions.marginHorizontal },
              ]}
            >
              <View style={[styles.containerVertical, { flex: 1 }]}>
                <Text allowFontScaling={false} style={styles.text}>
                  Bank
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.textName, { marginTop: 2 }]}
                >
                  {currentUser?.detail_user?.bank?.nama}
                </Text>
              </View>
              <View style={[styles.containerVertical, { flex: 1 }]}>
                <Text allowFontScaling={false} style={styles.text}>
                  Nomor rekening
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.textName, { marginTop: 2 }]}
                >
                  {currentUser?.detail_user?.nomor_rekening}
                </Text>
              </View>
            </View>
            <Separator
              thickness={1}
              style={{ marginVertical: 16 }}
              color={colors.daclen_grey_placeholder}
            />
            <Text allowFontScaling={false} style={styles.textHeader}>
              Syarat dan Ketentuan Penarikan Saldo
            </Text>

            <Text allowFontScaling={false} style={styles.textExplanation}>
              {withdrawalexplanation}
            </Text>
          </View>
        )}

        <Button
          onPress={() => submit()}
          style={styles.button}
          loading={loading}
          text="Tarik Saldo"
        />
      </ScrollView>
      <AlertBox text={error} success={success} onClose={() => closeAlert()} />
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  containerScroll: {
    backgroundColor: "transparent",
    minHeight: dimensions.fullHeight,
  },
  containerTopBox: {
    backgroundColor: colors.daclen_grey_light,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginTop: staticDimensions.marginHorizontal,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  button: {
    height: (50 * dimensions.fullWidthAdjusted) / 430,
    margin: staticDimensions.marginHorizontal,
  },
  textName: {
    color: colors.black,
    fontSize: 14 * dimensions.fullWidthAdjusted / 430,
    fontFamily: "Poppins-SemiBold",
  },
  textHeader: {
    color: colors.black,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
  text: {
    color: colors.black,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  textExplanation: {
    color: colors.black,
    fontSize: 11,
    fontFamily: "Poppins-Light",
    marginTop: 4,
    textAlign: "justify",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  riwayatSaldo: store.userState.riwayatSaldo,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserRiwayatSaldo,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(WithdrawalConfirmationScreen);
