import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import Separator from "../Separator";
import {
  colors,
  dimensions,
  globalUIRatio,
  staticDimensions,
} from "../../styles/base";
//import { defaultPackagingOptions } from "./constants";
import { checkoutdefaultsendername } from "../../../components/main/constants";
import { calculateSaldoAvailable, formatPrice } from "../../../axios/cart";
import Button from "../Button/Button";

export default function CartDetails(props) {
  const { saldo, allowSaldo, saldoCut, isCart } = props;
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

  const originalDeliveryFee = isCart
    ? props?.courierService?.cost[0]?.value.toString()
    : props?.priceOriginal;
  const discountedDeliveryFee = isCart
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
          style={[styles.textEntry, { color: colors.daclen_blue_link }]}
        >
          {props?.senderName ? props?.senderName : checkoutdefaultsendername}
        </Text>

        {isCart ? (
          <MaterialCommunityIcons
            name="pencil"
            size={10 * globalUIRatio}
            color={colors.daclen_blue_link}
            style={{ alignSelf: "center", marginStart: 4 * globalUIRatio }}
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

      {isCart &&
        (props?.addressComplete ? (
          <View style={styles.containerEntry}>
            <Text allowFontScaling={false} style={styles.textEntryHeader}>
              Pengiriman
            </Text>
            <TouchableOpacity style={styles.containerHorizontal}>
              <Text allowFontScaling={false} style={styles.textEntry}>
                {props?.courierService
                  ? `${props?.courierService?.label}`
                  : "Pilih Pengiriman"}
              </Text>
              {props?.courierChoices?.length > 0 && (
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={15 * globalUIRatio}
                  color={colors.daclen_black}
                  style={{
                    alignSelf: "center",
                    marginStart: 4 * globalUIRatio,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.containerEntry}>
            <Text allowFontScaling={false} style={styles.textIncompleteAddress}>
              Anda harus mengisi alamat pengiriman dahulu
            </Text>
            <Button
              onPress={() => openAddress()}
              style={styles.button}
              text="Pilih Alamat"
            />
          </View>
        ))}

      {(!isCart || props?.courierService) && (
        <View style={styles.containerEntry}>
          <Text allowFontScaling={false} style={styles.textEntryHeader}>
            Biaya Pengiriman
          </Text>
          <View style={styles.containerVertical}>
            {originalDeliveryFee > 0 ? (
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[styles.textEntry, styles.textStrikethrough]}
              >
                {formatPrice(originalDeliveryFee)}
              </Text>
            ) : null}

            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.textEntry}
            >
              {discountedDeliveryFee > 0
                ? formatPrice(discountedDeliveryFee)
                : "GRATIS"}
            </Text>
          </View>
        </View>
      )}

      {props?.cashback === undefined ||
      props?.cashback === null ||
      props?.cashback <= 0 ? null : (
        <View style={styles.containerEntry}>
          <Text allowFontScaling={false} style={styles.textEntryHeader}>
            Komisi Penjualan
          </Text>
          <Text allowFontScaling={false} style={styles.textEntry}>
            {props?.cashback}
          </Text>
        </View>
      )}

      <Separator
        color={colors.daclen_grey_placeholder}
        thickness={0.5}
        style={{ marginTop: 12 * globalUIRatio }}
      />

      {isCart ? (
        props?.totalPrice === undefined ||
        props?.totalPrice === null ||
        props?.totalPrice <= 0 ||
        saldo === null ||
        saldo?.available === undefined ||
        saldo?.available === null ? null : (
          <View
            style={[
              styles.containerVertical,
              { marginVertical: 20 * globalUIRatio },
            ]}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.textEntry, { fontSize: 14 * globalUIRatio }]}
            >
              Gunakan Saldo Daclen
            </Text>
            <View style={styles.containerSaldo}>
              <View style={styles.containerSaldoIcon}>
                <MaterialCommunityIcons
                  name="wallet"
                  size={20 * globalUIRatio}
                  color={allowSaldo ? colors.black : colors.daclen_grey_light}
                  style={{ alignSelf: "center" }}
                />
              </View>

              <View
                style={[
                  styles.containerVertical,
                  {
                    justifyContent: "space-between",
                    flex: 1,
                  },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={[
                    styles.textUid,
                    {
                      color: allowSaldo
                        ? colors.black
                        : colors.daclen_grey_light,
                    },
                  ]}
                >
                  Saldo Daclen
                </Text>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={[
                    styles.textEntry,
                    {
                      color: allowSaldo
                        ? colors.black
                        : colors.daclen_grey_light,
                      fontSize: 14 * globalUIRatio,
                    },
                  ]}
                >
                  {allowSaldo
                    ? `${
                        saldo?.available <= 0
                          ? "Rp 0"
                          : formatPrice(
                              saldo?.available < props?.totalPrice
                                ? saldo?.available
                                : props?.totalPrice,
                            )
                      }`
                    : "Penarikan Saldo masih diproses"}
                </Text>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={[
                    styles.textUid,
                    {
                      color: allowSaldo
                        ? colors.black
                        : colors.daclen_grey_light,
                    },
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
                trackColor={{
                  false: "transparent",
                  true: "transparent",
                }}
                activeThumbColor={colors.black}
                thumbColor={colors.daclen_grey_placeholder}
                value={saldo?.used > 0}
                ios_backgroundColor={
                  Platform.OS === "ios" ? "transparent" : "transparent"
                }
                onValueChange={(value) => setSaldo(value)}
                disabled={
                  saldo?.available <= 0 ||
                  props?.setSaldo === undefined ||
                  props?.setSaldo === null ||
                  !allowSaldo
                }
                style={styles.switch}
              />
            </View>
          </View>
        )
      ) : saldoCut === undefined ||
        saldoCut === null ||
        saldoCut === 0 ? null : (
        <View style={[styles.containerEntry, { marginBottom: 24 }]}>
          <Text allowFontScaling={false} style={styles.textEntryHeader}>
            Pembayaran dengan Saldo
          </Text>
          <Text
            allowFontScaling={false}
            style={styles.textEntry}
          >{`- ${formatPrice(saldoCut)}`}</Text>
        </View>
      )}
      {isCart ? (
        <View style={styles.containerVertical}>
          <Separator color={colors.daclen_grey_placeholder} thickness={0.5} />
          <Text
            allowFontScaling={false}
            style={[styles.textEntry, { marginTop: 12 * globalUIRatio }]}
          >
            Note:
          </Text>
          <Text allowFontScaling={false} style={styles.textUid}>
            Data personal Anda akan digunakan untuk proses pemesanan dalam
            membantu kenyamanan Anda melalui aplikasi ini, dan keperluan lain
            yang dijelaskan dalam syarat dan ketentuan kami.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    marginVertical: 12 * globalUIRatio,
    backgroundColor: colors.daclen_grey_light,
    borderRadius: 12 * globalUIRatio,
    padding: 20 * globalUIRatio,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerEntry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8 * globalUIRatio,
  },
  containerSaldo: {
    backgroundColor: colors.daclen_grey_container,
    marginTop: 8 * globalUIRatio,
    borderRadius: 12 * globalUIRatio,
    padding: 12 * globalUIRatio,
    flexDirection: "row",
    alignItems: "center",
  },
  containerSaldoIcon: {
    backgroundColor: colors.white,
    width: 50 * globalUIRatio,
    height: 50 * globalUIRatio,
    marginEnd: 12 * globalUIRatio,
    borderRadius: 25 * globalUIRatio,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    backgroundColor: "transparent",
    marginStart: 12 * globalUIRatio,
    alignSelf: "flex-start",
    width: 40 * globalUIRatio,
    height: 20 * globalUIRatio,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 20 * globalUIRatio,
  },
  textEntryHeader: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 12 * globalUIRatio,
    color: colors.black,
  },
  textStrikethrough: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: colors.daclen_grey_placeholder,
  },
  textEntry: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12 * globalUIRatio,
    color: colors.black,
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
  textUid: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * globalUIRatio,
    marginTop: 4 * globalUIRatio,
    color: colors.daclen_black,
  },
  button: {
    marginVertical: 10 * globalUIRatio,
  },
});
