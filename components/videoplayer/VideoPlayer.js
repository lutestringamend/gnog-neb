import React from "react";
import { Linking, SafeAreaView, StyleSheet } from "react-native";
import { ErrorView } from "../webview/WebviewChild";
import { webfotowatermark } from "../../axios/constants";
import MainHeader from "../main/MainHeader";
import { useNavigation } from "@react-navigation/native";

export default function VideoPlayer() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader
        title="Video Watermark"
        icon="arrow-left"
        onBackPress={() => navigation.goBack()}
      />
      <ErrorView onOpenExternalLink={() => Linking.openURL(webfotowatermark)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
});

