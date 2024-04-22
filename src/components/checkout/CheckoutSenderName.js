import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, staticDimensions, globalUIRatio } from "../../styles/base";
import CheckoutCourierItem from "./CheckoutCourierItem";

//<Text allowFontScaling={false} style={styles.textCompulsory}>Kirim paket atas nama*</Text>

const CheckoutSenderName = (props) => {
  const { senderNameChoices, senderName } = props;
  function onPressRadioButtonSenderName(e) {
    if (
      props?.onPressRadioButtonSenderName === undefined ||
      props?.onPressRadioButtonSenderName === null
    ) {
      return;
    }
    props?.onPressRadioButtonSenderName(e);
  }

  return (
    <View style={styles.containerInfo}>
      {senderNameChoices === undefined ||
      senderNameChoices?.length === undefined ||
      senderNameChoices?.length < 1
        ? null
        : senderNameChoices.map((item, index) => (
            <CheckoutCourierItem
              key={index}
              selected={senderName === item?.value}
              onPress={() => onPressRadioButtonSenderName(item?.value)}
              text={item?.label}
              isLast={index >= senderNameChoices?.length - 1}
            />
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerRadio: {
    backgroundColor: "transparent",
    alignItems: "flex-start",
  },
  textCompulsory: {
    color: colors.daclen_black,
    fontSize: 14 * globalUIRatio,
    fontFamily: "Poppins",
  },
});

export default CheckoutSenderName;
