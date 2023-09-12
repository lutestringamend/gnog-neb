import React from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { colors, staticDimensions } from "../../styles/base";

const VideoLogs = (prop) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingBottom: staticDimensions.pageBottomPadding }}
      >
        <Text
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
    </SafeAreaView>
  );
};

export default VideoLogs;
