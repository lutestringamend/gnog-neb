import React from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { colors, staticDimensions } from "../../styles/base";
import { lorem } from "./loremipsum";

const VideoLogs = (prop) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingBottom: staticDimensions.pageBottomPadding }}
      >
        <Text
          style={{
            fontSize: 10,
            textAlign: "center",
            color: colors.daclen_gray,
            marginVertical: 10,
            marginHorizontal: 10,
          }}
        >
          {prop.route.params?.text ? prop.route.params?.text : lorem}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoLogs;
