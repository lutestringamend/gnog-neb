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

const Withdrawal = (props) => {
  const [amount, setAmount] = useState("");
  const [misc, setMisc] = useState("");
  const [error, setError] = useState(null);
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
    navigation.navigate("EditProfile", {
        exitRightAway: true,
    });
  }

  function submit() {
    Linking.openURL(websaldo);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.textCompulsory}>
          Masukkan jumlah untuk ditarik*
        </Text>
        <TextInput
          value={amount}
          placeholder="0"
          style={styles.textInput}
          inputMode="numeric"
          onChangeText={(amount) => setAmount(amount)}
        />
        <Text
          style={[
            styles.textRemaining,
            { color: error ? colors.daclen_red : colors.daclen_blue },
          ]}
        >{`Rp ${
          currentUser?.komisi_user
            ? currentUser?.komisi_user?.total_currency
              ? currentUser?.komisi_user?.total_currency
              : "0"
            : "0"
        } tersedia${error ? `\n${error}` : ""}`}</Text>

        <Text style={styles.text}>Catatan (opsional)</Text>
        <TextInput
          value={misc}
          style={[styles.textInput, { height: 60, textAlignVertical: "top" }]}
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
            <Text style={[styles.textEntry, { fontWeight: "bold" }]}>
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
                name="credit-card-edit"
                size={16}
                color={colors.daclen_blue}
              />
              <Text style={styles.textEdit}>Ganti Keterangan Rekening</Text>
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
    fontWeight: "bold",
    color: "white",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 24,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
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
    fontSize: 14,
  },
  textBankName: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_green,
    marginBottom: 4,
  },
  textEdit: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_blue,
    marginStart: 4,
  },
  textEntry: {
    fontSize: 14,
    color: colors.daclen_black,
    marginBottom: 2,
  },
  textRemaining: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 4,
  },
  textExplanation: {
    color: colors.daclen_gray,
    fontSize: 12,
    marginHorizontal: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Withdrawal);
