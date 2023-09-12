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
  Linking,
} from "react-native";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { colors, staticDimensions } from "../../styles/base";
import { checkNumberEmpty } from "../../axios";
import { withdrawalexplanation } from "./constants";
import { websaldo } from "../../axios/constants";
import { storePenarikanSaldo } from "../../axios/user";
import { openWhatsapp } from "../whatsapp/Whatsapp";
import {
  adminWA,
  adminWAbankdetailstemplate,
  contactadminicon,
} from "../profile/constants";

const Withdrawal = (props) => {
  const [amount, setAmount] = useState("");
  const [misc, setMisc] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token, currentUser } = props;
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
    const result = await storePenarikanSaldo(token, amount);
    console.log("storePenarikanSaldo result", result);
    if (result === undefined || result === null || result?.data === undefined) {
      setSuccess(false);
      setError(
        result?.error
          ? result?.error
          : "Gagal mengajukan permintaan menarik saldo."
      );
    } else {
      setSuccess(true);
      setError(
        "Berhasil mengajukan penarikan penarikan saldo. Mohon menunggu konfirmasi dari Admin."
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text
          style={[
            styles.textError,
            success && { backgroundColor: colors.daclen_green },
          ]}
        >
          {error}
        </Text>
      ) : null}
      <ScrollView style={styles.container}>
        <Text style={styles.textCompulsory}>
          Masukkan jumlah untuk ditarik*
        </Text>
        <View style={styles.containerTextHorizontal}>
          <Text style={styles.textCurrency}>Rp</Text>
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
          style={[
            styles.textRemaining,
            {
              color: error && !success ? colors.daclen_red : colors.daclen_blue,
            },
          ]}
        >{`Rp ${
          currentUser?.komisi_user
            ? currentUser?.komisi_user?.total_currency
              ? currentUser?.komisi_user?.total_currency
              : "0"
            : "0"
        } tersedia`}</Text>

        <Text style={styles.text}>Catatan (opsional)</Text>
        <TextInput
          value={misc}
          style={[styles.textInput, { height: 60, textAlignVertical: "top" }]}
          inputMode="decimal"
          onChangeText={(misc) => setMisc(misc)}
        />

        <Text style={styles.textCompulsory}>Penarikan ke</Text>

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
            <Text style={styles.textButton}>Lengkapi Keterangan Rekening</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.containerItem}>
            <Text style={styles.textBankName}>
              {currentUser?.detail_user?.bank?.nama}
            </Text>
            <Text style={[styles.textEntry, { fontFamily: "Poppins-Bold" }]}>
              {currentUser?.detail_user?.nomor_rekening}
            </Text>
            <Text style={styles.textEntry}>
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
              <Text style={styles.textEdit}>
                Perubahan Keterangan Rekening
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.textCompulsory}>
          Syarat dan Ketentuan Penarikan Saldo
        </Text>
        <Text style={styles.textExplanation}>{withdrawalexplanation}</Text>
        <TouchableOpacity
          onPress={() => submit()}
          style={[
            styles.button,
            {
              backgroundColor:
                loading ||
                amount === "" ||
                error !== null ||
                parseInt(amount) <= 0 ||
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
            error !== null ||
            parseInt(amount) <= 0 ||
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
            <Text style={styles.textButton}>Kirim Permintaan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
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
    fontFamily: "Poppins", fontSize: 14,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "white",
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
    fontFamily: "Poppins", fontSize: 14,
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
    fontFamily: "Poppins", fontSize: 12,
    marginHorizontal: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Withdrawal);
