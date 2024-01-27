import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
//import Pdf from "react-native-pdf";
import { colors, dimensions } from "../../styles/base";
//import WebView from "react-native-webview";
import { mainhttp } from "../../axios/constants";

function ErrorScreen({ title, message, uri }) {
  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={title} icon="arrow-left" />
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

const PDFViewer = (props) => {
  const title = props.route.params?.title
    ? props.route.params?.title
    : "Daclen";
  const uri = props.route.params?.uri ? props.route.params?.uri : null;

  useEffect(() => {
    if (props.route.params?.title) {
      props.navigation.setOptions({
        title,
        headerShown: true,
      });
    }
  }, [props.route.params]);

  try {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorScreen
        title={title}
        message="Baca PDF di website Daclen"
        uri={uri}
      />
      </SafeAreaView>
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

export default PDFViewer;
