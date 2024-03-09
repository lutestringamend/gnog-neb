import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";
import { dimensions, staticDimensions } from "../../styles/base";
import { checkNumberEmpty } from "../../axios/cart";

const ratio = dimensions.fullWidthAdjusted / 430;

const PointHistoryItem = (props) => {
  const { poin, checkout_id, total_poin, hpv } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.container}>
      <View style={styles.containerLeft}>
        <View style={styles.containerHeader}>
          <View style={styles.containerIcon}>
            <MaterialCommunityIcons
              name={
                poin > 0
                  ? checkout_id === null
                    ? "account-plus"
                    : "cart"
                  : poin < 0
                    ? "transfer"
                    : ""
              }
              size={20 * ratio}
              color={colors.daclen_grey_icon}
            />
          </View>

          <View
            style={[
              styles.containerDescVertical,
              { flex: 1, marginHorizontal: 10 * ratio },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[
                styles.textPrice,
                {
                  color:
                    parseInt(poin) < 0
                      ? colors.daclen_danger
                      : colors.daclen_green,
                },
              ]}
            >
              {parseInt(poin) > 0 ? `+${poin}` : poin}
            </Text>
            <Text allowFontScaling={false} style={styles.textStatus}>
              Poin
            </Text>
          </View>
        </View>
        <Text allowFontScaling={false} style={styles.textType}>
          {poin > 0
            ? checkout_id === null
              ? "Poin Masuk • Rekrutmen"
              : "Poin Masuk • Transaksi"
            : poin < 0
              ? "Poin Keluar • Penukaran Poin"
              : ""}
        </Text>
      </View>

      <View style={styles.containerRight}>
        <View style={styles.containerStats}>
          <View style={styles.containerDescVertical}>
            <Text allowFontScaling={false} style={styles.textLight}>
              Total HPV
            </Text>
            <Text allowFontScaling={false} style={styles.textBalance}>
              {checkNumberEmpty(hpv)}
            </Text>
          </View>

          <View style={styles.containerDescVertical}>
            <Text allowFontScaling={false} style={styles.textLight}>
              Total poin
            </Text>
            <Text allowFontScaling={false} style={styles.textBalance}>
              {checkNumberEmpty(total_poin)}
            </Text>
          </View>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24 * ratio}
          color={colors.black}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    maxHeight: 120 * ratio,
    borderRadius: 12 * ratio,
    elevation: 4,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10 * ratio,
  },
  containerLeft: {
    backgroundColor: "transparent",
    padding: 10 * ratio,
    justifyContent: "space-between",
    height: "100%",
    flex: 3,
    borderEndWidth: 1,
    borderEndColor: colors.daclen_grey_light,
  },
  containerRight: {
    backgroundColor: "transparent",
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10 * ratio,
    height: "100%",
  },
  containerHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerStats: {
    backgroundColor: "transparent",
    marginHorizontal: 10 * ratio,
    justifyContent: "space-between",
  },
  containerIcon: {
    backgroundColor: colors.daclen_grey_light,
    width: 40 * ratio,
    height: 40 * ratio,
    borderRadius: 20 * ratio,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDescVertical: {
    backgroundColor: "transparent",
  },
  icon: {
    alignSelf: "center",
  },
  textPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18 * ratio,
  },
  textStatus: {
    fontFamily: "Poppins",
    fontSize: 11 * ratio,
    marginTop: 4 * ratio,
    color: colors.daclen_grey_placeholder,
  },
  textType: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.black,
  },
  textLight: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.daclen_grey_placeholder,
  },
  textBalance: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * ratio,
    color: colors.black,
  },
});

export default memo(PointHistoryItem);
