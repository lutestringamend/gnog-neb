import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import { colors } from "../../styles/base";
import {
  vwmark2templateheight,
  vwmark2templatewidth,
  vwmarktextnamecharlimit,
  vwmark2textnamefontsize,
  vwmark2textnamestart,
  vwmark2textnametop,
  vwmarktextphonecharlimit,
  vwmark2textphonefontsize,
  vwmark2textphonestart,
  vwmark2textphonetop,
  vwmark2texturlfontsize,
  vwmark2texturltop,
  vwmark2texturlstart,
} from "../mediakit/constants";

function VWatermarkModel2(props) {
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
        source={require("../../assets/vwmark2.png")}
        style={[
          styles.background,
          {
            width: vwmark2templatewidth * ratio,
            height: vwmark2templateheight * ratio,
          },
        ]}
        resizeMode="stretch"
        onLoadEnd={() => onLoadEnd()}
      />
      {watermarkData === undefined ||
      watermarkData === null ||
      watermarkData?.url === undefined ||
      watermarkData?.url === null ||
      watermarkData?.url === "" ||
      watermarkData?.url?.length === undefined ||
      watermarkData?.url?.length < 1 ? null : (
        <Text allowFontScaling={false} minimumFontScale={1} maxFontSizeMultiplier={1}
          style={[
            styles.textName,
            {
              width: vwmark2templatewidth * ratio,
              fontSize: vwmark2texturlfontsize * ratio,
              top: vwmark2texturltop * ratio,
              start: vwmark2texturlstart * ratio,
            },
          ]}
        >
          {watermarkData?.url}
        </Text>
      )}

      {watermarkData === undefined ||
      watermarkData === null ||
      watermarkData?.name === undefined ||
      watermarkData?.name === null ||
      watermarkData?.name === "" ||
      watermarkData?.name?.length === undefined ||
      watermarkData?.name?.length < 1 ? null : (
        <Text allowFontScaling={false} minimumFontScale={1} maxFontSizeMultiplier={1}
          style={[
            styles.textPhone,
            {
              width: vwmark2templatewidth * ratio,
              fontSize: vwmark2textnamefontsize * ratio,
              top: vwmark2textnametop * ratio,
              start: vwmark2textnamestart * ratio,
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
              width: vwmark2templatewidth * ratio,
              fontSize: vwmark2textphonefontsize * ratio,
              top: vwmark2textphonetop * ratio,
              start: vwmark2textphonestart * ratio,
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
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
    zIndex: 20,
  },
  textPhone: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "transparent",
    color: colors.white,
    fontFamily: "Poppins",
  },
});

export default VWatermarkModel2
