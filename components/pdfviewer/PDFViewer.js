import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from "react-native";
import * as Sentry from "sentry-expo";
import { colors, dimensions } from "../../styles/base";

import MainHeader from "../main/MainHeader";
import { ErrorView } from "../webview/WebviewChild";


let Pdf = require("react-native-render-html").default;

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

export default function PDFViewer(props) {
  let uri = props.route.params?.webKey;
  let title = props.route.params?.text;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log({uri, title });
  }, []);

  if (Platform.OS === "web") {
    return (
      <ErrorScreen
        title={props.route.params?.text}
        message="Buka tab baru di Browser untuk membuka file PDF"
        uri={uri}
      />
    );
  } else {
    try {
      Pdf = require("react-native-pdf").default;

      return (
        <SafeAreaView style={styles.container}>
          <MainHeader title={title ? title : "Daclen"} icon="arrow-left" />

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={{ alignSelf: "center", marginVertical: 20 }}
            />
          ) : null}

          <Pdf
            source={{ uri, cache: true }}
            contentWidth={dimensions.webviewWidth}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log({ numberOfPages, filePath });
              setLoading(false);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log({ page, numberOfPages });
            }}
            onError={(error) => {
              console.error(error);
              setLoading(false);
            }}
            onPressLink={(uri) => {
              console.log({ uri });
            }}
            style={styles.pdf}
          />
        </SafeAreaView>
      );
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") {
        Sentry.Browser.captureException(error);
      } else {
        Sentry.Native.captureException(error);
      }
      return (
        <ErrorScreen
          title={props.route.params?.text}
          message={error?.message}
          uri={uri}
        />
      );
    }
  }
}

/*
<ScrollView style={styles.webContainer}>
            <WebView
              javaScriptEnabled={true}
              style={{ flex: 1 }}
              originWhitelist={["*"]}
              source={{ uri }}
            />
          </ScrollView>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.fullWidth,
    backgroundColor: "white",
  },
  webContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 20,
    backgroundColor: "white",
  },
  pdf: {
    flex: 1,
  },
});
