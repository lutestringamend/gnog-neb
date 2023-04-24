import React from "react";
import { Text, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { updateWatermarkLayout } from ".";
import { watermarkStyle } from "./constants";

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
  let generalStyle = {
    ...watermarkStyle,
    textAlign: text_align ? text_align : watermarkStyle.textAlign,
    top: getLayout ? 0 : text_y ? text_y * ratio : watermarkStyle.top * ratio,
    start: getLayout ? 0 : text_x ? text_x * ratio : watermarkStyle.start * ratio,
    paddingVertical: paddingVertical
      ? paddingVertical * ratio
      : watermarkStyle.paddingVertical * ratio,
    paddingHorizontal: paddingHorizontal
      ? paddingHorizontal * ratio
      : watermarkStyle.paddingHorizontal * ratio,
    borderRadius: borderRadius
      ? borderRadius * ratio
      : watermarkStyle.borderRadius * ratio,
    backgroundColor: backgroundColor
      ? backgroundColor
      : watermarkStyle.backgroundColor,
    color: color ? color : watermarkStyle.color,
    fontSize: fontSize
      ? Math.round(fontSize * ratio)
      : Math.round(watermarkStyle.fontSize * ratio),
  };

  function sendToParent(e) {
    if (getLayout) {
      //console.log("watermarkmodel layout", e);
      props.updateWatermarkLayout(e);
    }
  }

  return (
    <Text
      onLayout={(e) => sendToParent(e.nativeEvent.layout)}
      style={[
        { position: "absolute", fontWeight: "bold" },
        generalStyle,
        style ? style : null,
      ]}
    >
      {`${watermarkData?.name}\n${watermarkData?.phone}\n${watermarkData?.url}`}
    </Text>
  );
}

const mapStateToProps = (store) => ({
  watermarkLayout: store.mediaState.watermarkLayout,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ updateWatermarkLayout }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(WatermarkModel);
