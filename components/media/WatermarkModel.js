import React from "react";
import { Text } from "react-native";
import { watermarkStyle } from "./constants";

const WatermarkModel = ({
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
}) => {
  let generalStyle = {
    ...watermarkStyle,
    textAlign: text_align ? text_align : watermarkStyle.textAlign,
    top: text_y ? text_y * ratio : watermarkStyle.top * ratio,
    start: text_x ? text_x * ratio : watermarkStyle.start * ratio,
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

  return (
    <Text
      style={[
        { position: "absolute", fontWeight: "bold" },
        generalStyle,
        style ? style : null,
      ]}
    >
      {`${watermarkData?.name}\n${watermarkData?.phone}\n${watermarkData?.url}`}
    </Text>
  );
};

export default WatermarkModel;
