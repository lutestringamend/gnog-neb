import React from "react";
import { SafeAreaView, View } from "react-native";
import { colors, dimensions } from "../../styles/base";
import HeaderBar from "../Header/HeaderBar";

const CenteredView = (props) => {
  const { backgroundColor, title, style } = props;

  return (
    <SafeAreaView
      style={{
        backgroundColor: backgroundColor
          ? backgroundColor
          : colors.daclen_black,
        width: dimensions.fullWidth,
        flex: 1,
      }}
    >
      {title ? (
        <HeaderBar
          title={title}
          style={{
            width: dimensions.fullWidthAdjusted,
            marginHorizontal:
              (dimensions.fullWidth - dimensions.fullWidthAdjusted) / 2,
          }}
        />
      ) : null}
      <View
        style={[
          style ? style : null,
          {
            width: dimensions.fullWidthAdjusted,
            flex: 1,
            marginHorizontal:
              (dimensions.fullWidth - dimensions.fullWidthAdjusted) / 2,
          },
        ]}
      >
        {props.children}
      </View>
    </SafeAreaView>
  );
};

export default CenteredView;
