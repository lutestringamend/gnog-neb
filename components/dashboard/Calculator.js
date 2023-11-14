import React, { createFactory, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";

import { colors, dimensions } from "../../styles/base";
import TextInputLabel from "../textinputs/TextInputLabel";
import { formatPrice } from "../../axios/cart";
import { createFixedMonthlyProjections } from ".";

const tableWidth = dimensions.fullWidth - 24;

const defaultInputs = {
  numResellerPerMonth: "3",
  salesPerMonth: "2000000",
  periodLength: "1",
  numMonths: "12",
  salesCommission: "0.1",
  ppn: "0.11",
};

const Calculator = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [errors, setErrors] = useState({
    numResellerPerMonth: "",
    salesPerMonth: "",
    periodLength: "",
    numMonths: "",
  });
  const [projection, setProjection] = useState(null);
  const [eligible, setEligible] = useState(true);

  useEffect(() => {
    let allowed = true;
    let newErrors = { ...errors };
    if (isNaN(inputs.numResellerPerMonth) || inputs.numResellerPerMonth < 1) {
      newErrors = { ...newErrors, numResellerPerMonth: "Minimal 1 Reseller" };
      allowed = false;
    } else {
      newErrors = { ...newErrors, numResellerPerMonth: null };
    }
    if (isNaN(inputs.salesPerMonth) || inputs.salesPerMonth < 0) {
      setErrors({
        ...errors,
        salesPerMonth: "Tidak boleh lebih kecil dari Rp 0",
      });
      allowed = false;
    } else {
      newErrors = { ...newErrors, salesPerMonth: null };
    }
    if (isNaN(inputs.periodLength) || inputs.periodLength < 1) {
      newErrors = { ...newErrors, periodLength: "Periode minimal 1 bulan" };
      allowed = false;
    } else {
      newErrors = { ...newErrors, periodLength: null };
    }
    if (
      isNaN(inputs.numMonths) ||
      inputs.numMonths < 1 ||
      inputs.numMonths > 60
    ) {
      newErrors = {
        ...newErrors,
        numMonths: "Minimal 1 bulan, maksimal 60 bulan",
      };
      allowed = false;
    } else {
      newErrors = { ...newErrors, numMonths: null };
    }
    setErrors(newErrors);
    setEligible(allowed);
  }, [inputs]);

  const makeProjections = () => {
    let result = createFixedMonthlyProjections(
      parseInt(inputs?.numResellerPerMonth),
      parseInt(inputs?.periodLength),
      parseInt(inputs?.salesPerMonth),
      parseInt(inputs?.numMonths)
    );
    console.log(result);
    setProjection(result);
  };

  const showPoints = (item) => {
    if (!(item === undefined || item === null)) {
      let text = `PPN: ${formatPrice(item?.ppn)}\nPenjualan: ${formatPrice(item?.sales)}\nKomisi Penjualan: ${formatPrice(item?.salesCommission)}\nBV: ${item?.bv}\nPV: ${item?.pv}\nHPV: ${item?.hpv}\nRPV ${item?.pv}`;
      if (Platform.OS === "android") {
        ToastAndroid.show(text, ToastAndroid.LONG);
      } else {
        console.log("showPoints", text);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
      >
        <TextInputLabel
          label="Rekrutmen Reseller per Bulan"
          compulsory
          value={inputs?.numResellerPerMonth}
          inputMode="decimal"
          error={errors?.numResellerPerMonth}
          onChangeText={(numResellerPerMonth) =>
            setInputs({ ...inputs, numResellerPerMonth })
          }
        />
        <TextInputLabel
          label="Total Penjualan per Bulan"
          compulsory
          value={inputs?.salesPerMonth}
          inputMode="decimal"
          error={errors?.salesPerMonth}
          onChangeText={(salesPerMonth) =>
            setInputs({ ...inputs, salesPerMonth })
          }
        />
        <TextInputLabel
          label="Jumlah Bulan"
          compulsory
          value={inputs?.numMonths}
          inputMode="decimal"
          error={errors?.numMonths}
          onChangeText={(numMonths) => setInputs({ ...inputs, numMonths })}
        />

        <TouchableOpacity
          onPress={() => makeProjections()}
          style={[
            styles.button,
            {
              backgroundColor: eligible
                ? colors.daclen_yellow_new
                : colors.daclen_gray,
            },
          ]}
          disabled={!eligible}
        >
          <Text allowFontScaling={false} style={styles.textButton}>
            Hitung
          </Text>
        </TouchableOpacity>

        {projection === null ||
        projection?.length === undefined ||
        projection?.length < 1 ? null : (
          <View style={styles.containerTable}>
            <Text allowFontScaling={false} style={styles.textTableHeader}>
              Pertumbuhan Seller dan Penjualan / Bulan
            </Text>
            <View style={styles.containerSpec}>
              <Text
                allowFontScaling={false}
                style={[styles.textSpecHeader, { width: 0.2 * tableWidth }]}
              >
                Bulan
              </Text>
              
              <Text
                allowFontScaling={false}
                style={[styles.textSpecHeader, { width: 0.4 * tableWidth }]}
              >
                {`Saldo`}
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.textSpecHeader, { width: 0.4 * tableWidth }]}
              >
                {`Saldo\nAkumulasi`}
              </Text>
            </View>

            {projection.map((item, index) => (
              <TouchableOpacity
                onPress={() => showPoints(item)}
                key={index}
                style={[styles.containerSpec, { backgroundColor: (index + 1) % 12 === 0 ? colors.daclen_lightgrey : "transparent", borderEndWidth: (index + 1) % 12 === 0 ? 1 : 0}]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.textSpec, { width: 0.2 * tableWidth }]}
                >
                  {item?.month}
                </Text>
                
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textSpec,
                    {
                      width: 0.4 * tableWidth,
                      fontSize: item?.balance > 1000000000 ? 10 : 12,
                    },
                  ]}
                >
                  {formatPrice(item?.balance)}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textSpec,
                    {
                      width: 0.4 * tableWidth,
                      fontSize: item?.balance > 1000000000 ? 10 : 12,
                      fontFamily: (index + 1) % 12 === 0 ? "Poppins-Bold" : "Poppins",
                    },
                  ]}
                >
                  {formatPrice(item?.balanceAccumulation)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/*

<Text
                allowFontScaling={false}
                style={[styles.textSpecHeader, { width: 0.2 * tableWidth }]}
              >
                {`Total Seller`}
              </Text>

<Text
                  allowFontScaling={false}
                  style={[styles.textSpec, { 
                    width: 0.2 * tableWidth, 
                  }]}
                >
                  {item?.numResellers > 10000000 ? "> 10 juta" : item?.numResellers}
                </Text>

        <TextInputLabel
          label="Jumlah Bulan dalam 1 Periode Rekrutmen"
          compulsory
          value={inputs?.periodLength}
          inputMode="decimal"
          error={errors?.periodLength}
          onChangeText={(periodLength) =>
            setInputs({ ...inputs, periodLength })
          }
        />
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  containerScroll: {
    backgroundColor: "transparent",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  containerTable: {
    alignSelf: "center",
    borderRadius: 2,
    width: tableWidth,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerSpec: {
    width: tableWidth,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: colors.daclen_gray,
    borderTopWidth: 1,
  },
  textTableHeader: {
    width: "100%",
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize: 12,
    padding: 10,
    fontFamily: "Poppins-SemiBold",
  },
  textSpecHeader: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 40,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    borderStartWidth: 1,
    backgroundColor: "transparent",
    textAlign: "center",
    textAlignVertical: "center",
    borderColor: colors.daclen_gray,
    color: colors.daclen_graydark,
  },
  textSpec: {
    padding: 8,
    fontSize: 12,
    fontFamily: "Poppins",
    borderStartWidth: 1,
    backgroundColor: "transparent",
    textAlign: "center",
    textAlignVertical: "center",
    borderColor: colors.daclen_gray,
    color: colors.daclen_black,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: colors.daclen_black,
  },
});

export default Calculator;
