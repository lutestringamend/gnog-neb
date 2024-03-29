import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import TextInputLabel from "../../components/textinputs/TextInputLabel";
import { checkNumberEmpty, formatPrice } from "../../axios/cart";
import { createFixedMonthlyProjections, createVueFixedMonthlyProjections } from "../../utils/dashboard";
import {
  LEVEL_LABELS,
  MAX_MEMBERS_RECRUITED,
  MAX_MONTHLY_SALES,
  MIN_MONTHLY_SALES,
  SIMULATOR_DISCLAIMER,
} from "../../constants/dashboard";
import CenteredView from "../../components/view/CenteredView";
import Button from "../../components/Button/Button";

const tableWidth = dimensions.fullWidth - 24;

const defaultInputs = {
  numResellerPerMonth: "3",
  salesPerMonth: MIN_MONTHLY_SALES.toString(),
  periodLength: "1",
  numMonths: "12",
  salesCommission: "0.1",
  ppn: "0.11",
};

const CalculatorScreen = () => {
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
    if (
      isNaN(inputs.numResellerPerMonth) ||
      inputs.numResellerPerMonth < 1 ||
      inputs.numResellerPerMonth > MAX_MEMBERS_RECRUITED
    ) {
      newErrors = {
        ...newErrors,
        numResellerPerMonth: `Minimal 1 Reseller, maksimal ${MAX_MEMBERS_RECRUITED} Reseller`,
      };
      allowed = false;
    } else {
      newErrors = { ...newErrors, numResellerPerMonth: null };
    }
    if (
      inputs.salesPerMonth === null ||
      inputs.salesPerMonth === "" ||
      isNaN(inputs.salesPerMonth) ||
      parseInt(inputs.salesPerMonth) < MIN_MONTHLY_SALES ||
      parseInt(inputs.salesPerMonth) > MAX_MONTHLY_SALES
    ) {
      newErrors = {
        ...newErrors,
        salesPerMonth: `Tidak boleh lebih kecil dari ${formatPrice(
          MIN_MONTHLY_SALES
        )} dan lebih besar dari ${formatPrice(MAX_MONTHLY_SALES)}`,
      };
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

  const makeProjectionsVUE = () => {
    let result = createVueFixedMonthlyProjections(
      parseInt(inputs?.numResellerPerMonth),
      parseInt(inputs?.periodLength),
      parseInt(inputs?.salesPerMonth),
      parseInt(inputs?.numMonths)
    );
    console.log(result);
    setProjection(result);
  };

  const changeSales = (e) => {
    try {
      if (!(isNaN(e) || parseInt(e))) {
        setInputs({
          ...inputs,
          salesPerMonth: e,
          salesPerMonthDisplay: formatPrice(e),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showPoints = (item) => {
    if (!(item === undefined || item === null)) {
      let text = `PPN: ${formatPrice(item?.ppn)}\nPenjualan: ${formatPrice(
        item?.sales
      )}\nKomisi Penjualan: ${formatPrice(item?.salesCommission)}\nBV: ${
        item?.bv
      }\nPV: ${item?.pv}\nHPV: ${item?.hpv}\nRPV ${item?.pv}`;
      if (Platform.OS === "android") {
        ToastAndroid.show(text, ToastAndroid.LONG);
      } else {
        console.log("showPoints", text);
      }
    }
  };

  return (
    <CenteredView title="Simulasi Saldo" style={styles.container}>
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
          notes={
            checkNumberEmpty(inputs?.salesPerMonth) >= MIN_MONTHLY_SALES
              ? formatPrice(inputs?.salesPerMonth)
              : null
          }
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

        <Button
           onPress={() => makeProjections()}
           style={styles.button}
           disabled={!eligible}
           text="Simulasi"
        />

        {projection === null ||
        projection?.length === undefined ||
        projection?.length < 1 ? null : (
          <Text style={styles.textDisclaimer}>{SIMULATOR_DISCLAIMER}</Text>
        )}

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
                style={[styles.textSpecHeader, { width: 0.1 * tableWidth }]}
              >
                Bln
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.textSpecHeader, { width: 0.1 * tableWidth }]}
              >
                Lvl
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
                style={[
                  styles.containerSpec,
                  {
                    backgroundColor:
                      (index + 1) % 12 === 0
                        ? colors.daclen_lightgrey
                        : "transparent",
                    borderEndWidth: (index + 1) % 12 === 0 ? 1 : 0,
                  },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.textSpec, { width: 0.1 * tableWidth }]}
                >
                  {item?.bulan}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.textSpec, { width: 0.1 * tableWidth }]}
                >
                  {
                    item?.levelName
                  }
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
                  {formatPrice(item?.saldo)}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textSpec,
                    {
                      width: 0.4 * tableWidth,
                      fontSize: item?.balance > 1000000000 ? 10 : 12,
                      fontFamily:
                        (index + 1) % 12 === 0 ? "Poppins-Bold" : "Poppins",
                    },
                  ]}
                >
                  {formatPrice(item?.saldo_akumulasi)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </CenteredView>
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
    paddingHorizontal: staticDimensions.marginHorizontal,
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
    textAlignVertical: "center",
    borderColor: colors.daclen_gray,
    color: colors.daclen_graydark,
  },
  textSpec: {
    padding: 8,
    fontSize: 12,
    fontFamily: "Poppins",
    height: "100%",
    borderStartWidth: 1,
    backgroundColor: "transparent",
    textAlignVertical: "center",
    borderColor: colors.daclen_gray,
    color: colors.daclen_black,
  },
  textDisclaimer: {
    color: colors.daclen_light,
    textAlignVertical: "center",
    fontSize: 14,
    marginVertical: 20,
    width: tableWidth,
    fontFamily: "Poppins-SemiBold",
    padding: 12,
    backgroundColor: colors.daclen_black,
    borderRadius: 8,
  },
  button: {
    marginVertical: 20,
  },
});

export default CalculatorScreen;
