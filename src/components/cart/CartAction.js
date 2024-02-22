import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { colors, dimensions } from "../../styles/base";
import { capitalizeFirstLetter, formatPrice } from "../../axios/cart";

export default function CartAction(props) {
  const [color, setColor] = useState(colors.daclen_orange);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props?.isCart) {
      switch (props?.buttonText) {
        case "ditolak":
          setColor(colors.daclen_red);
          break;
        case "diterima":
          setColor(colors.daclen_green);
          break;
        default:
          setColor(colors.daclen_blue);
          break;
      }
    }
  }, [props?.buttonText]);

  useEffect(() => {
    if (props?.isCart) {
      if (props?.buttonDisabled) {
        setColor(colors.daclen_gray);
      } else {
        setColor(colors.daclen_orange);
      }
    } else {
      if (loading && !props?.buttonDisabled) {
        setLoading(false);
      }
    }
    console.log("CartAction buttonDisabled: " + props?.buttonDisabled);
  }, [props?.buttonDisabled]);

  function onButtonPressed() {
    if (!loading && props.enableProcessing) {
      setLoading(true);
      return;
    }
    props?.buttonAction();
  }

  return (
    <View style={styles.containerCheckout}>
      <View style={styles.containerCheckoutDetails}>
        <Text allowFontScaling={false} style={[styles.textCheckoutDetail, { color }]}>Total</Text>
        <Text allowFontScaling={false} style={[styles.textCheckoutDetail, styles.textPrice, { color }]}>
          {formatPrice(props?.totalPrice)}
        </Text>
      </View>
      <View style={styles.containerCheckoutAction}>
        <TouchableOpacity
          onPress={() => onButtonPressed()}
          disabled={props?.buttonDisabled}
          style={[styles.button, { backgroundColor: props?.buttonDisabled ? colors.daclen_gray : color }]}
        >
          {loading && props?.enableProcessing ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_light}
              style={{ alignSelf: "center", elevation: 2 }}
            />
          ) : (
            <Text allowFontScaling={false} style={styles.textButton}>
              {props?.buttonText === null
                ? "Bayar Pesanan"
                : capitalizeFirstLetter(props?.buttonText)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCheckout: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    start: 0,
    width: dimensions.fullWidthAdjusted,
    backgroundColor: colors.daclen_light,
    borderTopWidth: 2,
    borderColor: colors.daclen_blue,
    paddingHorizontal: 10,
  },
  containerCheckoutDetails: {
    justifyContent: "center",
    flex: 1,
    paddingVertical: 14,
  },
  containerCheckoutAction: {
    justifyContent: "center",
  },
  textCheckoutDetail: {
    fontFamily: "Poppins", fontSize: 14,
    color: colors.daclen_orange,
    marginHorizontal: 10,
  },
  textPrice: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  button: {
    minWidth: 120,
    alignSelf: "flex-end",
    marginEnd: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
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
