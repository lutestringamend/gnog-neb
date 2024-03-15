import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
//import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { checkNumberEmpty } from "../../axios";
import { withdrawalexplanation } from "../../constants/dashboard";
import {
  SALDO_ADMIN_FEE,
  SALDO_WITHDRAWAL_MINIMUM,
} from "../../axios/constants";
import { openWhatsapp } from "../../../components/whatsapp/Whatsapp";
import {
  adminWA,
  adminWAbankdetailstemplate,
} from "../../../components/profile/constants";
import { formatPrice } from "../../axios/cart";
import CenteredView from "../../components/view/CenteredView";
import Separator from "../../components/Separator";
import TextInputLabel from "../../components/textinputs/TextInputLabel";
import Button from "../../components/Button/Button";

const WithdrawalScreen = (props) => {
  const [amount, setAmount] = useState("");
  const [misc, setMisc] = useState("");
  const [amountError, setAmountError] = useState(null);

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
    if (amount === "") {
      setAmountError(null);
      return;
    }
    if (isNaN(amount)) {
      setAmountError("Masukkan nominal yang benar.");
    } else if (parseInt(amount) < SALDO_WITHDRAWAL_MINIMUM) {
      setAmountError(
        `Minimal penarikan ${formatPrice(SALDO_WITHDRAWAL_MINIMUM)}`,
      );
    } else if (
      parseInt(amount) + SALDO_ADMIN_FEE >
      checkNumberEmpty(currentUser?.komisi_user?.total)
    ) {
      setAmountError(
        `Di luar batas maksimal penarikan ${formatPrice(
          checkNumberEmpty(currentUser?.komisi_user?.total) - SALDO_ADMIN_FEE,
        )}`,
      );
    } else {
      setAmountError(null);
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

  const submit = () => {
    /*Linking.openURL(websaldo);
    navigation.goBack();*/
    navigation.navigate("WithdrawalConfirmation", {
      amount: parseInt(amount),
    });
  };

  return (
    <CenteredView title="Tarik Saldo" style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
      >
        <View style={styles.containerGrey}>
          <View style={styles.containerTopBox}>
            {currentUser?.komisi_user ? (
              <View style={styles.containerHorizontal}>
                <Text allowFontScaling={false} style={styles.text}>
                  Total saldo
                </Text>
                <Text allowFontScaling={false} style={styles.textCurrency}>
                  {currentUser?.komisi_user?.total
                    ? formatPrice(
                        checkNumberEmpty(currentUser?.komisi_user?.total),
                      )
                    : "Rp 0"}
                </Text>
              </View>
            ) : null}

            <View style={[styles.containerHorizontal, { marginTop: 10 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                Jumlah penarikan
              </Text>
              <Text allowFontScaling={false} style={styles.text}>
                - {amount ? formatPrice(parseInt(amount)) : "Rp 0"}
              </Text>
            </View>
            <View style={[styles.containerHorizontal, { marginTop: 4 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                Biaya admin
              </Text>
              <Text allowFontScaling={false} style={styles.text}>
                - {formatPrice(SALDO_ADMIN_FEE)}
              </Text>
            </View>

            <Separator
              thickness={1}
              color={colors.daclen_grey_placeholder}
              style={{ marginTop: 10 }}
            />

            {currentUser?.komisi_user ? (
              <View style={[styles.containerHorizontal, { marginTop: 10 }]}>
                <Text allowFontScaling={false} style={styles.text}>
                  Total setelah penarikan
                </Text>
                <Text allowFontScaling={false} style={styles.textCurrency}>
                  {checkNumberEmpty(amount) >=
                  checkNumberEmpty(currentUser?.komisi_user?.total) -
                    SALDO_ADMIN_FEE
                    ? "Rp 0"
                    : formatPrice(
                        checkNumberEmpty(currentUser?.komisi_user?.total) -
                          SALDO_ADMIN_FEE -
                          checkNumberEmpty(amount),
                      )}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <TextInputLabel
          label="Jumlah penarikan"
          placeholder="Minimal 50000"
          value={amount}
          error={amountError}
          onChangeText={(amount) => setAmount(amount)}
          inputMode="numeric"
          containerStyle={styles.textInput}
        />

        <TextInputLabel
          label="Catatan"
          placeholder="Tuliskan catatan"
          value={misc}
          onChangeText={(misc) => setMisc(misc)}
          containerStyle={styles.textInput}
          textContainerStyle={{ height: 100 }}
          style={{ height: 96, paddingVertical: 10, textAlignVertical: "top" }}
        />

        <Separator
          thickness={1}
          style={{ margin: staticDimensions.marginHorizontal }}
          color={colors.daclen_grey_placeholder}
        />

        {currentUser?.detail_user === undefined ||
        currentUser?.detail_user?.nomor_rekening === undefined ||
        currentUser?.detail_user?.nomor_rekening === null ||
        currentUser?.detail_user?.nomor_rekening === "" ||
        currentUser?.detail_user?.bank === undefined ||
        currentUser?.detail_user?.bank?.nama === undefined ||
        currentUser?.detail_user?.bank?.nama === null ||
        currentUser?.detail_user?.bank?.nama === "" ? null : (
          <View style={styles.containerVertical}>
            <View style={styles.containerHorizontal}>
              <Text allowFontScaling={false} style={styles.text}>
                <Text style={{ width: 150 }}>Bank</Text>
                {":"}
              </Text>
              <Text allowFontScaling={false} style={styles.textName}>
                {currentUser?.detail_user?.bank?.nama}
              </Text>
            </View>

            <View style={[styles.containerHorizontal, { marginTop: 4 }]}>
              <Text allowFontScaling={false} style={styles.text}>
                <Text style={{ width: 150 }}>Nomor Rekening</Text>
                {":"}
              </Text>
              <Text allowFontScaling={false} style={styles.textName}>
                {currentUser?.detail_user?.nomor_rekening}
              </Text>
            </View>
          </View>
        )}

        <Text
          allowFontScaling={false}
          style={[
            styles.textName,
            {
              marginTop: 16,
              marginHorizontal: staticDimensions.marginHorizontal,
            },
          ]}
        >
          Syarat dan Ketentuan Penarikan Saldo
        </Text>
        <Text allowFontScaling={false} style={styles.textExplanation}>
          {withdrawalexplanation}
        </Text>

        {currentUser?.detail_user === undefined ||
        currentUser?.detail_user?.nomor_rekening === undefined ||
        currentUser?.detail_user?.nomor_rekening === null ||
        currentUser?.detail_user?.nomor_rekening === "" ||
        currentUser?.detail_user?.bank === undefined ||
        currentUser?.detail_user?.bank?.nama === undefined ||
        currentUser?.detail_user?.bank?.nama === null ||
        currentUser?.detail_user?.bank?.nama === "" ? (
          <Button
            onPress={() => editBankDetails()}
            style={styles.button}
            text="Lengkapi Keterangan Rekening"
          />
        ) : (
          <Button
            onPress={() => submit()}
            style={styles.button}
            disabled={
              amount === "" ||
              parseInt(amount) < SALDO_WITHDRAWAL_MINIMUM ||
              parseInt(amount) + SALDO_ADMIN_FEE >
                checkNumberEmpty(currentUser?.komisi_user?.total)
            }
            text="Konfirmasi"
          />
        )}
      </ScrollView>
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
    paddingBottom: 100,
  },
  containerGrey: {
    backgroundColor: colors.daclen_grey_light,
    padding: staticDimensions.marginHorizontal,
  },
  containerTopBox: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerVertical: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  button: {
    height: (50 * dimensions.fullWidthAdjusted) / 430,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  textName: {
    color: colors.black,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  textCurrency: {
    color: colors.black,
    fontSize: 18,
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
    marginHorizontal: staticDimensions.marginHorizontal,
    textAlign: "justify",
    marginBottom: staticDimensions.marginHorizontal,
  },
  textInput: {
    marginHorizontal: staticDimensions.marginHorizontal,
    marginTop: 16,
    marginBottom: 0,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  riwayatSaldo: store.userState.riwayatSaldo,
});

/*const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserRiwayatSaldo,
    },
    dispatch,
  );*.*/

export default connect(mapStateToProps, null)(WithdrawalScreen);
