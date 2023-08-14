import React, { useState } from "react";
import { View, Text } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { updateWatermarkLayout } from ".";
import { watermarkStyle } from "./constants";

function WatermarkModel(props) {
  const {
    watermarkData,
    style,
    ratio,
    height,
    text_align,
    paddingVertical,
    borderRadius,
    backgroundColor,
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

      getLayout ? 0 : 

          
  */
  const trueFontSize = fontSize
    ? fontSize < 48
      ? Math.ceil(fontSize * ratio * 3)
      : Math.ceil(fontSize * 3)
    : Math.ceil(watermarkStyle.fontSize * ratio);
  const generalStyle = {
    ...watermarkStyle,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: backgroundColor
      ? backgroundColor
      : watermarkStyle.backgroundColor,

    top: height ? height : watermarkStyle.top * ratio,
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
    color: watermarkStyle.color,
    fontSize: trueFontSize,
    height: "100%",
    textAlign: text_align ? text_align : watermarkStyle.textAlign,
    textAlignVertical: "center",
    fontWeight: "bold",
  };
  const [layoutDone, setLayoutDone] = useState(false);

  function sendToParent(e) {
    if (getLayout && !layoutDone) {
      //console.log("watermarkmodel layout", e);
      setLayoutDone(true);
      props.updateWatermarkLayout(e);
    }
  }

  return (
    <View
      style={[generalStyle, style ? style : null]}
      onLayout={(e) => sendToParent(e.nativeEvent.layout)}
    >
      <Text
        style={[
          textStyle,
          { marginEnd: watermarkStyle.textHorizontalMargin * ratio },
        ]}
      >{`${watermarkData?.name ? watermarkData?.name : ""}`}</Text>
      <Text
        style={[
          textStyle,
          { marginStart: watermarkStyle.textHorizontalMargin * ratio },
        ]}
      >{`${watermarkData?.phone ? watermarkData?.phone : ""}`}</Text>
    </View>
  );
}

const mapStateToProps = (store) => ({
  watermarkLayout: store.mediaState.watermarkLayout,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ updateWatermarkLayout }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(WatermarkModel);
