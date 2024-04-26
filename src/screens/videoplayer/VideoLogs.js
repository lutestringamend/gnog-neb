import React from "react";
import { ScrollView, Text } from "react-native";
import { colors, staticDimensions } from "../../styles/base";
import CenteredView from "../../components/view/CenteredView";

const VideoLogs = (prop) => {
  return (
    <CenteredView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingBottom: staticDimensions.pageBottomPadding }}
      >
        <Text allowFontScaling={false}
          style={{
            fontFamily: "Poppins", fontSize: 10,
            width: "95%",
            color: colors.daclen_gray,
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          {prop.route.params?.text}
        </Text>
      </ScrollView>
    </CenteredView>
  );
};

export default VideoLogs;
