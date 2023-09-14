import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import { colors } from "../../styles/base";
import {
  vwmarktemplateheight,
  vwmarktemplatewidth,
  vwmarktextnamecharlimit,
  vwmarktextnamefontsize,
  vwmarktextnamestart,
  vwmarktextnametop,
  vwmarktextphonecharlimit,
  vwmarktextphonefontsize,
  vwmarktextphonestart,
  vwmarktextphonetop,
} from "../mediakit/constants";

function VWatermarkModel(props) {
  const { watermarkData, ratio, style } = props;

  if (
    watermarkData === undefined ||
    watermarkData === null ||
    ratio === undefined ||
    ratio === null
  ) {
    return null;
  }

  function onLoadEnd() {
    if (props?.onLoadEnd === undefined || props?.onLoadEnd === null) {
      return;
    }
    props?.onLoadEnd();
  }

  return (
    <View
      style={[styles.container, style ? style : null]}
    >
      <Image
        source={require("../../assets/vwmark.png")}
        style={[
          styles.background,
          {
            width: vwmarktemplatewidth * ratio,
            height: vwmarktemplateheight * ratio,
          },
        ]}
        resizeMode="stretch"
        onLoadEnd={() => onLoadEnd()}
      />
      {watermarkData === undefined ||
      watermarkData === null ||
      watermarkData?.name === undefined ||
      watermarkData?.name === null ||
      watermarkData?.name === "" ||
      watermarkData?.name?.length === undefined ||
      watermarkData?.name?.length < 1 ? null : (
        <Text allowFontScaling={false} minimumFontScale={1} maxFontSizeMultiplier={1}
          style={[
            styles.textName,
            {
              width: vwmarktemplatewidth * ratio,
              fontSize: vwmarktextnamefontsize * ratio,
              top: vwmarktextnametop * ratio,
              start: vwmarktextnamestart * ratio,
            },
          ]}
        >
          {watermarkData?.name?.length > vwmarktextnamecharlimit
            ? watermarkData?.name.substring(0, vwmarktextnamecharlimit)
            : watermarkData?.name}
        </Text>
      )}

      {watermarkData === undefined ||
      watermarkData === null ||
      watermarkData?.phone === undefined ||
      watermarkData?.phone === null ||
      watermarkData?.phone === "" ||
      watermarkData?.phone?.length === undefined ||
      watermarkData?.phone?.length < 1 ? null : (
        <Text allowFontScaling={false} minimumFontScale={1} maxFontSizeMultiplier={1}
          style={[
            styles.textPhone,
            {
              width: vwmarktemplatewidth * ratio,
              fontSize: vwmarktextphonefontsize * ratio,
              top: vwmarktextphonetop * ratio,
              start: vwmarktextphonestart * ratio,
            },
          ]}
        >
          {watermarkData?.phone?.length > vwmarktextphonecharlimit
            ? watermarkData?.phone.substring(0, vwmarktextphonecharlimit)
            : watermarkData?.phone}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  background: {
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 0,
  },
  textName: {
    position: "absolute",
    backgroundColor: "transparent",
    color: colors.daclen_black,
    fontFamily: "Poppins-SemiBold",
    zIndex: 20,
  },
  textPhone: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "transparent",
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
  },
});

export default VWatermarkModel
