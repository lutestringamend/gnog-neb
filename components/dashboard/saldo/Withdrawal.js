import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../../styles/base";
import { checkNumberEmpty } from "../../../axios";
import { withdrawalexplanation } from "../constants";
import {
  SALDO_ADMIN_FEE,
  SALDO_WITHDRAWAL_MINIMUM,
} from "../../../axios/constants";
import { storePenarikanSaldo, updateReduxUserRiwayatSaldo } from "../../../axios/user";
import { openWhatsapp } from "../../whatsapp/Whatsapp";
import {
  adminWA,
  adminWAbankdetailstemplate,
  contactadminicon,
} from "../../profile/constants";
import { formatPrice } from "../../../axios/cart";
import { setObjectAsync } from "../../asyncstorage";
import { ASYNC_USER_RIWAYAT_PENARIKAN } from "../../asyncstorage/constants";

const Withdrawal = (props) => {
  const [amount, setAmount] = useState("");
  const [misc, setMisc] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token, currentUser, riwayatSaldo } = props;
  const navigation = useNavigation();

  useEffect(() => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.detail_user === undefined ||
      currentUser?.komisi_user === undefined ||
      currentUser?.komisi_user?.total === undefined
    ) {
      navigation.goBack();
    }
  }, [token, currentUser]);

  useEffect(() => {
    if (isNaN(amount)) {
      setError("Masukkan nominal yang benar.");
    } else if (
      checkNumberEmpty(amount) >
      checkNumberEmpty(currentUser?.komisi_user?.total)
    ) {
      setError("Nominal melebihi saldo yang Anda miliki.");
    } else {
      setError(null);
    }
  }, [amount]);

  useEffect(() => {
    if (loading && riwayatSaldo === null) {
      setLoading(true);
      setSuccess(true);
      setError(
        "Permintaan penarikan sudah tercatat di Riwayat Penarikan."
      );
    }
  }, [riwayatSaldo]);

  function editBankDetails() {
    /*navigation.navigate("EditProfile", {
        exitRightAway: true,
    });*/
    let template = adminWAbankdetailstemplate.replace("#I", currentUser?.name);
    console.log("openDaclenCare", template);
    openWhatsapp(adminWA, template);
  }

  const submit = async () => {
    /*Linking.openURL(websaldo);
    navigation.goBack();*/
    setLoading(true);
    const result = await storePenarikanSaldo(token, amount, currentUser?.id);
    console.log("storePenarikanSaldo result", result);
    if (
      result === undefined ||
      result === null ||
      result?.data === undefined ||
      result?.data === null
    ) {
      setSuccess(false);
      setError(
        `Gagal mengajukan permintaan menarik saldo.${
          result?.error ? `\n${result?.error}` : ""
        }`
      );
    } else {
      setObjectAsync(ASYNC_USER_RIWAYAT_PENARIKAN, null);
      props.updateReduxUserRiwayatSaldo(null);
      setSuccess(true);
      setError(
        "Permintaan penarikan saldo telah diterima."
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text
          allowFontScaling={false}
          style={[
            styles.textError,
            success && { backgroundColor: colors.daclen_green },
          ]}
        >
          {error}
        </Text>
      ) : null}
      <ScrollView style={styles.container}>
        <Text allowFontScaling={false} style={styles.textCompulsory}>
          Masukkan Jumlah Penarikan yang Diinginkan
        </Text>
        <Text allowFontScaling={false} style={[styles.text, { marginTop: 2 }]}>
          {`(Minimal Penarikan ${formatPrice(
            SALDO_WITHDRAWAL_MINIMUM
          )}, Biaya Admin ${formatPrice(SALDO_ADMIN_FEE)})`}
        </Text>
        <View style={styles.containerTextHorizontal}>
          <Text allowFontScaling={false} style={styles.textCurrency}>
            Rp
          </Text>
          <TextInput
            value={amount}
            placeholder="0"
            style={[
              styles.textInput,
              {
                marginTop: 0,
                marginStart: 6,
                alignSelf: "center",
                flex: 1,
              },
            ]}
            inputMode="numeric"
            onChangeText={(amount) => setAmount(amount)}
          />
        </View>

        <Text
          allowFontScaling={false}
          style={[
            styles.textRemaining,
            {
              color: error && !success ? colors.daclen_red : colors.daclen_blue,
            },
          ]}
        >{`${
          currentUser?.komisi_user
            ? currentUser?.komisi_user?.total
              ? formatPrice(currentUser?.komisi_user?.total)
              : "Rp 0"
            : "Rp 0"
        } tersedia${
          parseInt(amount) >= SALDO_WITHDRAWAL_MINIMUM &&
          parseInt(amount) <= checkNumberEmpty(currentUser?.komisi_user?.total)
            ? `\nJumlah yang Akan Diterima: ${formatPrice(
                parseInt(amount) - SALDO_ADMIN_FEE
              )}`
            : ""
        }`}</Text>

        <Text allowFontScaling={false} style={styles.text}>
          Catatan (opsional)
        </Text>
        <TextInput
          value={misc}
          style={[styles.textInput, { height: 60, textAlignVertical: "top" }]}
          inputMode="decimal"
          onChangeText={(misc) => setMisc(misc)}
        />

        <Text allowFontScaling={false} style={styles.textCompulsory}>
          Penarikan ke
        </Text>

        {currentUser?.detail_user === undefined ||
        currentUser?.detail_user?.nomor_rekening === undefined ||
        currentUser?.detail_user?.nomor_rekening === null ||
        currentUser?.detail_user?.nomor_rekening === "" ||
        currentUser?.detail_user?.bank === undefined ||
        currentUser?.detail_user?.bank?.nama === undefined ||
        currentUser?.detail_user?.bank?.nama === null ||
        currentUser?.detail_user?.bank?.nama === "" ? (
          <TouchableOpacity
            onPress={() => editBankDetails()}
            style={[
              styles.button,
              { backgroundColor: colors.daclen_blue, marginTop: 4 },
            ]}
          >
            <Text allowFontScaling={false} style={styles.textButton}>
              Lengkapi Keterangan Rekening
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.containerItem}>
            <Text allowFontScaling={false} style={styles.textBankName}>
              {currentUser?.detail_user?.bank?.nama}
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.textEntry, { fontFamily: "Poppins-Bold" }]}
            >
              {currentUser?.detail_user?.nomor_rekening}
            </Text>
            <Text allowFontScaling={false} style={styles.textEntry}>
              {currentUser?.detail_user?.cabang_bank}
            </Text>
            <TouchableOpacity
              onPress={() => editBankDetails()}
              style={styles.containerHorizontal}
            >
              <MaterialCommunityIcons
                name={contactadminicon}
                size={16}
                color={colors.daclen_green_dark}
              />
              <Text allowFontScaling={false} style={styles.textEdit}>
                Perubahan Keterangan Rekening
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text allowFontScaling={false} style={styles.textCompulsory}>
          Syarat dan Ketentuan Penarikan Saldo
        </Text>
        <Text allowFontScaling={false} style={styles.textExplanation}>
          {withdrawalexplanation}
        </Text>
        <View style={styles.containerBottom} />
      </ScrollView>
      {currentUser?.detail_user === undefined ||
      currentUser?.detail_user?.nomor_rekening === undefined ||
      currentUser?.detail_user?.nomor_rekening === null ||
      currentUser?.detail_user?.nomor_rekening === "" ||
      currentUser?.detail_user?.bank === undefined ||
      currentUser?.detail_user?.bank?.nama === undefined ||
      currentUser?.detail_user?.bank?.nama === null ||
      currentUser?.detail_user?.bank?.nama === "" ? null : (
        <TouchableOpacity
          onPress={() => submit()}
          style={[
            styles.button,
            {
              backgroundColor:
                loading ||
                amount === "" ||
                parseInt(amount) < SALDO_WITHDRAWAL_MINIMUM ||
                checkNumberEmpty(amount) >
                  checkNumberEmpty(currentUser?.komisi_user?.total)
                  ? colors.daclen_gray
                  : colors.daclen_orange,
              marginTop: 32,
              marginBottom: staticDimensions.pageBottomPadding / 2,
            },
          ]}
          disabled={
            loading ||
            amount === "" ||
            parseInt(amount) < SALDO_WITHDRAWAL_MINIMUM ||
            checkNumberEmpty(amount) >
              checkNumberEmpty(currentUser?.komisi_user?.total)
          }
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_light}
              style={{ alignSelf: "center" }}
            />
          ) : (
            <Text allowFontScaling={false} style={styles.textButton}>
              Kirim Permintaan
            </Text>
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
    height: "100%",
  },
  containerItem: {
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: colors.daclen_offgreen,
    padding: 12,
    borderRadius: 6,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  containerTextHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  containerBottom: {
    backgroundColor: "transparent",
    height: staticDimensions.pageBottomPadding / 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 4,
    backgroundColor: colors.daclen_orange,
    position: "absolute",
    bottom: 0,
    start: 20,
    end: 20,
    zIndex: 4,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 20,
    marginTop: 24,
  },
  textCurrency: {
    color: colors.daclen_orange,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    alignSelf: "center",
    marginStart: 20,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 20,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginHorizontal: 20,
    fontFamily: "Poppins",
    fontSize: 14,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textBankName: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.daclen_blue,
    marginBottom: 4,
  },
  textEdit: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: colors.daclen_green_dark,
    marginStart: 4,
  },
  textEntry: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: colors.daclen_black,
    marginBottom: 2,
  },
  textRemaining: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginHorizontal: 20,
    marginTop: 4,
  },
  textExplanation: {
    color: colors.daclen_gray,
    fontFamily: "Poppins",
    fontSize: 12,
    marginHorizontal: 20,
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
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Withdrawal);
