import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";

import {
  colors,
  dimensions,
  globalUIRatio,
  staticDimensions,
} from "../../styles/base";
import {
  capitalizeFirstLetter,
  checkNumberEmpty,
  formatPrice,
} from "../../axios/cart";
import Button from "../Button/Button";

export default function CartAction(props) {
  const [color, setColor] = useState(colors.daclen_black);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props?.isCart) {
      switch (props?.buttonText) {
        case "ditolak":
          setColor(colors.daclen_danger);
          break;
        case "diterima":
          setColor(colors.daclen_success);
          break;
        default:
          setColor(colors.daclen_blue_link);
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
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.textCheckoutDetail}
        >
          Total
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.textPrice}
        >
          {checkNumberEmpty(props?.totalPrice) > 0
            ? formatPrice(props?.totalPrice)
            : "-"}
        </Text>
      </View>
      <Button
        onPress={() => onButtonPressed()}
        disabled={props?.buttonDisabled}
        loading={loading && props?.enableProcessing}
        backgroundColor={color}
        fontSize={14 * globalUIRatio}
        text={
          props?.buttonText === null
            ? "Bayar Pesanan"
            : capitalizeFirstLetter(props?.buttonText)
        }
        style={{
          minWidth: 160 * globalUIRatio,
          borderRadius: 24 * globalUIRatio,
        }}
      />
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
    height: 80 * globalUIRatio,
    backgroundColor: colors.daclen_grey_bottom_bar,
    paddingHorizontal: staticDimensions.marginHorizontal,
    paddingVertical: 16 * globalUIRatio,
  },
  containerCheckoutDetails: {
    backgroundColor: "transparent",
    justifyContent: "space-between",
    flex: 1,
  },
  textCheckoutDetail: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12 * globalUIRatio,
    color: colors.black,
  },
  textPrice: {
    fontSize: 18 * globalUIRatio,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
});
