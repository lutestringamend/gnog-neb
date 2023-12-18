import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Pdf from "react-native-pdf";
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
  const title = props.route.params?.title ? props.route.params?.title : "Daclen";
  const uri = props.route.params?.uri ? props.route.params?.uri : null;
  const content = props.route.params?.content
    ? props.route.params?.content
    : null;
  props.navigation.setOptions({
    title,
    headerShown: true,
  });
  const PdfResource = { uri, cache: true };

  try {
    return (
      <SafeAreaView style={styles.container}>
        <Pdf 
          trustAllCerts={false}
          source={PdfResource}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
          }}
        />
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return <ErrorScreen title={title} message="Baca PDF di website Daclen" uri={mainhttp} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  pdf: {
    flex: 1,
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
  }
});

export default PDFViewer;
