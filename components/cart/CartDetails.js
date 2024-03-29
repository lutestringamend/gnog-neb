import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import RadioGroup from "react-native-radio-buttons-group";

import Separator from "../../src/components/Separator";
import { colors } from "../../styles/base";
//import { defaultPackagingOptions } from "./constants";
import { checkoutdefaultsendername } from "../main/constants";
import { calculateSaldoAvailable, formatPrice } from "../../axios/cart";

export default function CartDetails(props) {
  const { saldo, allowSaldo, saldoCut } = props;
  const [useSaldo, setUseSaldo] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (
      saldo === undefined ||
      saldo === null ||
      saldo?.used === undefined ||
      saldo?.used === null
    ) {
      return;
    }
    setUseSaldo(saldo?.used > 0);
  }, [saldo]);

  function openAddress() {
    navigation.navigate("PickAddress", { isCheckout: true });
  }

  const setSaldo = (value) => {
    if (props?.setSaldo === undefined || props?.setSaldo === null) {
      return;
    }
    if (value) {
      props?.setSaldo({
        ...saldo,
        used:
          saldo?.available < props?.totalPrice
            ? saldo?.available
            : props?.totalPrice,
      });
    } else {
      props?.setSaldo({
        ...saldo,
        used: 0,
      });
    }
  };

  const originalDeliveryFee = props?.isCart
    ? props?.courierService?.cost[0]?.value.toString()
    : props?.priceOriginal;
  const discountedDeliveryFee = props?.isCart
    ? props?.courierService?.cost[0]?.biaya.toString()
    : props?.priceDiscount;

  function changeSenderName() {
    if (props?.setSenderName === undefined || props?.setSenderName === null) {
      return;
    }
    props?.setSenderName();
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerEntry}>
        <Text allowFontScaling={false} style={styles.textEntryHeader}>
          Subtotal
        </Text>
        <Text
          allowFontScaling={false}
          style={styles.textEntry}
        >{`Rp ${props?.subtotal}`}</Text>
      </View>
      <View style={styles.containerEntry}>
        <Text allowFontScaling={false} style={styles.textEntryHeader}>
          Berat
        </Text>
        <Text allowFontScaling={false} style={styles.textEntry}>
          {props?.berat}
          {" kg"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => changeSenderName()}
        disabled={
          props?.setSenderName === undefined || props?.setSenderName === null
        }
        style={styles.containerEntry}
      >
        <Text allowFontScaling={false} style={styles.textEntryHeader}>
          Nama Pengirim
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.textEntry, { color: colors.daclen_blue }]}
        >
          {props?.senderName ? props?.senderName : checkoutdefaultsendername}
        </Text>

        {props?.isCart ? (
          <MaterialCommunityIcons
            name="pencil"
            size={14}
            color={colors.daclen_blue}
            style={{ alignSelf: "center" }}
          />
        ) : null}
      </TouchableOpacity>

      <View style={styles.containerEntry}>
        <Text allowFontScaling={false} style={styles.textEntryHeader}>
          Pengemasan
        </Text>
        <Text allowFontScaling={false} style={styles.textEntry}>
          Box
        </Text>
      </View>

      {props?.isCart &&
        (props?.addressComplete ? (
          <View style={styles.containerRadio}>
            <Text allowFontScaling={false} style={styles.textEntryHeader}>
              Pengiriman
            </Text>
            {props?.courierChoices?.length > 0 && (
              <View style={styles.containerRadioGroup}>
                <RadioGroup
                  radioButtons={props?.courierChoices}
                  onPress={props?.onPressRadioButtonCourier}
                  layout="row"
                />
                {props?.courierLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.daclen_orange}
                    style={{ alignSelf: "flex-end", marginVertical: 20 }}
                  />
                ) : props?.courierServices?.length > 0 ? (
                  <RadioGroup
                    radioButtons={props?.courierServices}
                    onPress={props?.onPressRadioButtonService}
                    containerStyle={{ marginTop: 6 }}
                  />
                ) : (
                  props?.courierSlug !== "" &&
                  props?.courierSlug !== null && (
                    <Text
                      allowFontScaling={false}
                      style={[styles.textEntry, { marginHorizontal: 0 }]}
                    >
                      Tidak ada pengiriman tersedia dari kurir ini
                    </Text>
                  )
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.containerRadio}>
            <Text allowFontScaling={false} style={styles.textIncompleteAddress}>
              Anda harus mengisi alamat pengiriman dahulu
            </Text>
            <TouchableOpacity
              onPress={() => openAddress()}
              style={styles.button}
            >
              <Text allowFontScaling={false} style={styles.textButton}>
                Pilih Alamat
              </Text>
            </TouchableOpacity>
          </View>
        ))}

      {(!props?.isCart || props?.courierService) && (
        <View style={[styles.containerRadio, { flexDirection: "row" }]}>
          <Text allowFontScaling={false} style={styles.textEntryHeader}>
            Biaya Pengiriman
          </Text>
          <View style={styles.containerRadioGroup}>
            <Text
              allowFontScaling={false}
              style={[styles.textEntry, styles.textStrikethrough]}
            >
              {originalDeliveryFee > 0
                ? `${formatPrice(originalDeliveryFee)}`
                : "GRATIS"}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.textEntry,
                styles.textDiscount,
                { fontFamily: "Poppins-Bold", color: colors.daclen_green },
              ]}
            >
              {discountedDeliveryFee > 0
                ? formatPrice(discountedDeliveryFee)
                : "GRATIS"}
            </Text>
          </View>
        </View>
      )}

      {props?.isCart ?
      props?.totalPrice === undefined ||
      props?.totalPrice === null ||
      props?.totalPrice <= 0 ||
      saldo === null ||
      saldo?.available === undefined ||
      saldo?.available === null ? null : (
        <View style={styles.containerHorizontal}>
          <MaterialCommunityIcons
            name="cash-refund"
            size={32}
            color={allowSaldo ? colors.daclen_blue : colors.daclen_gray}
            style={{ alignSelf: "center" }}
          />
          <View style={styles.containerSaldo}>
            <Text
              allowFontScaling={false}
              style={[
                styles.textSaldoHeader,
                { color: allowSaldo ? colors.daclen_blue : colors.daclen_gray },
              ]}
            >
              {allowSaldo
                ? `Gunakan Saldo Daclen (${
                    saldo?.available <= 0
                      ? "Rp 0"
                      : formatPrice(
                          saldo?.available < props?.totalPrice
                            ? saldo?.available
                            : props?.totalPrice,
                        )
                  })`
                : "Penarikan Saldo masih diproses"}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.textSaldo,
                { color: allowSaldo ? colors.daclen_blue : colors.daclen_gray },
              ]}
            >
              {allowSaldo
                ? saldo?.available <= 0
                  ? "Saldo Anda kosong"
                  : `Saldo tersisa ${
                      useSaldo
                        ? calculateSaldoAvailable(
                            saldo?.available,
                            props?.totalPrice,
                          ) > 0
                          ? formatPrice(
                              calculateSaldoAvailable(
                                saldo?.available,
                                props?.totalPrice,
                              ),
                            )
                          : "Rp 0"
                        : formatPrice(saldo?.available)
                    } `
                : "Checkout dengan Saldo tidak bisa digunakan"}
            </Text>
          </View>
          <Switch
            style={styles.switch}
            onValueChange={(value) => setSaldo(value)}
            disabled={
              saldo?.available <= 0 ||
              props?.setSaldo === undefined ||
              props?.setSaldo === null ||
              !allowSaldo
            }
            value={useSaldo}
            ios_backgroundColor={colors.daclen_lightgrey}
            trackColor={{
              true: colors.daclen_lightgrey,
              false: colors.daclen_lightgrey,
            }}
            thumbColor={colors.daclen_light}
          />
        </View>
      ) : saldoCut === undefined || saldoCut === null || saldoCut === 0 ? null : (
        <View style={[styles.containerEntry, { marginBottom: 24 }]}>
        <Text allowFontScaling={false} style={[styles.textEntryHeader, { color: colors.daclen_red }]}>
          Pembayaran dengan Saldo
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.textEntry, { color: colors.daclen_red }]}
        >{`- ${formatPrice(saldoCut)}`}</Text>
      </View>
      )
      }

      <Separator thickness={1} />

      {props?.cashback === undefined ||
      props?.cashback === null ||
      props?.cashback <= 0 ? null : (
        <View style={[styles.containerEntry, { marginVertical: 20 }]}>
          <Text
            allowFontScaling={false}
            style={[styles.textEntryHeader, styles.textCashback]}
          >
            Komisi Penjualan
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.textEntry, styles.textCashback]}
          >
            {props?.cashback}
          </Text>
        </View>
      )}
    </View>
  );
}

/*
          <View style={styles.containerRadioGroup}>
            <RadioGroup
              radioButtons={defaultPackagingOptions}
              onPress={props?.onPressRadioButtonPackaging}
              layout="row"
            />
          </View>
*/

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: colors.white,
  },
  containerRadio: {
    marginVertical: 12,
    marginHorizontal: 10,
  },
  containerRadioGroup: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  containerEntry: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  containerSaldo: {
    backgroundColor: "transparent",
    marginStart: 10,
    flex: 1,
  },
  switch: {
    backgroundColor: "transparent",
    marginStart: 10,
    alignSelf: "center",
  },
  textEntryHeader: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 14,
    color: colors.daclen_graydark,
    marginHorizontal: 10,
  },
  textStrikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontFamily: "Poppins",
    color: colors.daclen_gray,
  },
  textEntry: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    marginHorizontal: 10,
    color: colors.daclen_graydark,
    alignSelf: "flex-end",
  },
  textCashback: {
    color: colors.daclen_orange,
  },
  textDiscount: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: colors.daclen_red,
  },
  textIncompleteAddress: {
    fontSize: 14,
    color: colors.daclen_danger,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  textSaldoHeader: {
    backgroundColor: "transparent",
    color: colors.daclen_black,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
  textSaldo: {
    backgroundColor: "transparent",
    color: colors.daclen_blue,
    fontFamily: "Poppins",
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginVertical: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
});
