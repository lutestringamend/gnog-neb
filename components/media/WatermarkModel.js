import React from "react";
import { View, Text } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { updateWatermarkLayout } from ".";
import { watermarkStyle } from "./constants";
import { styles } from "react-native-image-slider-banner/src/style";

function WatermarkModel(props) {
  const {
    watermarkData,
    style,
    ratio,
    text_x,
    text_y,
    text_align,
    paddingVertical,
    paddingHorizontal,
    borderRadius,
    backgroundColor,
    color,
    fontSize,
    getLayout,
  } = props;
  /*
      start: getLayout
      ? 0
      : text_x
      ? text_x * ratio
      : watermarkStyle.start * ratio,
          paddingHorizontal: getLayout
      ? paddingHorizontal * ratio
      : watermarkStyle.paddingHorizontal * ratio,
          backgroundColor: backgroundColor
      ? backgroundColor
      : watermarkStyle.backgroundColor,
  */
  const generalStyle = {
    ...watermarkStyle,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: backgroundColor
      ? backgroundColor
      : watermarkStyle.backgroundColor,
    top: getLayout ? 0 : text_y ? text_y * ratio : watermarkStyle.top * ratio,
    start: 0,
    width: "100%",
    paddingVertical: getLayout
      ? paddingVertical * ratio
      : watermarkStyle.paddingVertical * ratio,
    justifyContent: "center",
    borderRadius: borderRadius
      ? borderRadius * ratio
      : watermarkStyle.borderRadius * ratio,
  };
  const textStyle = {
    flex: 1,
    width: "50%",
    backgroundColor: "transparent",
    color: color ? color : watermarkStyle.color,
    fontSize: fontSize
      ? Math.round(fontSize * ratio)
      : Math.round(watermarkStyle.fontSize * ratio),
    textAlign: text_align ? text_align : watermarkStyle.textAlign,
    textAlignVertical: "center",
    fontWeight: "bold",
  };

  function sendToParent(e) {
    if (getLayout) {
      //console.log("watermarkmodel layout", e);
      props.updateWatermarkLayout(e);
    }
  }

  return (
    <View
      style={[generalStyle, style ? style : null]}
      onLayout={(e) => sendToParent(e.nativeEvent.layout)}
    >
      <Text
        style={[textStyle, { marginEnd: watermarkStyle.textHorizontalMargin * ratio }]}
      >{`${watermarkData?.name}`}</Text>
      <Text
        style={[textStyle, { marginStart: watermarkStyle.textHorizontalMargin * ratio }]}
      >{`${watermarkData?.phone}`}</Text>
    </View>
  );
}

const mapStateToProps = (store) => ({
  watermarkLayout: store.mediaState.watermarkLayout,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ updateWatermarkLayout }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(WatermarkModel);
