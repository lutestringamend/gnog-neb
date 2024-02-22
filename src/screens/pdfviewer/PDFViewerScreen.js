import React from "react";
import { SafeAreaView, StyleSheet, Linking } from "react-native";
//import Pdf from "react-native-pdf";
import { colors, dimensions } from "../../styles/base";
//import WebView from "react-native-webview";
import { mainhttp } from "../../axios/constants";
import CenteredView from "../../components/view/CenteredView";
import { ErrorView } from "../../components/webview/WebviewChild";

function ErrorScreen({ message, uri }) {
  return (
    <SafeAreaView style={styles.container}>
      <ErrorView
        error={message}
        onOpenExternalLink={() => openExternalLink(uri)}
      />
    </SafeAreaView>
  );
}

function openExternalLink(uri) {
  if (uri !== null && uri !== undefined) {
    Linking.openURL(uri);
  }
}

const PDFViewerScreen = (props) => {
  const title = props.route.params?.title
    ? props.route.params?.title
    : "Daclen";
  const uri = props.route.params?.uri ? props.route.params?.uri : null;

  try {
    return (
      <CenteredView title={title} style={styles.container}>
        <ErrorScreen
        title={title}
        message="Baca PDF di website Daclen"
        uri={uri}
      />
      </CenteredView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <ErrorScreen
        title={title}
        message="Baca PDF di website Daclen"
        uri={mainhttp}
      />
    );
  }
};
/*
{uri ? (
          <Pdf
            trustAllCerts={false}
            source={{ uri, cache: true }}
            style={styles.pdf}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log("onLoadComplete", numberOfPages, filePath);
            }}
          />
        ) : null}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  pdf: {
    flex: 1,
    width: dimensions.fullWidth,
  },
});

export default PDFViewerScreen;
