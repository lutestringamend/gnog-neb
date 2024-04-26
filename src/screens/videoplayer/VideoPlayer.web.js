import React from "react";
import { Linking, StyleSheet } from "react-native";

import { ErrorView } from "../../components/webview/WebviewChild";
import { webvideowatermark } from "../../axios/constants";
import CenteredView from "../../components/view/CenteredView";
import { colors } from "../../styles/base";

export default function VideoPlayer() {

  return (
    <CenteredView title="Video Watermark" style={styles.container}>
      <ErrorView onOpenExternalLink={() => Linking.openURL(webvideowatermark)} />
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
});