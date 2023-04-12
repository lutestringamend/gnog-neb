import React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import * as Sentry from "sentry-expo";

import RenderHTML from "react-native-render-html";
//import { WebView } from "react-native-webview";

import { colors, dimensions } from "../../styles/base";
import MainHeader from "../main/MainHeader";

export function ErrorView(props) {
  return (
    <View>
      {props?.onOpenExternalLink && (
        <TouchableOpacity onPress={props?.onOpenExternalLink}>
          <Text style={styles.textLink}>Buka di Browser</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.textError}>{props?.error}</Text>
    </View>
  );
}

function WebviewChild(props) {
  try {

    function openExternalLink() {
      if (props?.url !== null && props?.url !== undefined) {
        Linking.openURL(props?.url);
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        {props?.title && <MainHeader title={props?.title} icon="arrow-left" />}
        {props?.url !== undefined && props?.url !== null && (
          <TouchableOpacity onPress={() => openExternalLink()}>
            <Text style={styles.textDaclen}>
              Selengkapnya di Website Daclen
            </Text>
          </TouchableOpacity>
        )}
        <ScrollView style={styles.scrollView}>
          { props?.content === "" ||
            props?.content === null ||
            props?.content === undefined ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={{ alignSelf: "center", marginVertical: 20 }}
            />
          ) : (
            <RenderHTML
              style={styles.containerHTML}
              contentWidth={dimensions.webviewWidth}
              source={{ html: props?.content }}
              enableExperimentalMarginCollapsing={true}
            />
          )}
        </ScrollView>
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
      <SafeAreaView style={styles.container}>
        {props?.title && <MainHeader title={props?.title} icon="arrow-left" />}
        <ErrorView error={error.message} />
      </SafeAreaView>
    );
  }
}

/*

error ? (
            <ErrorView
              error={error}
              onOpenExternalLink={() => openExternalLink()}
            />
          ) : 
          
 ) : props?.isMediaKit ? (
            <WebView
                originWhitelist={["*"]}
                style={styles.webview}
                source={{ html: props?.content }}
                onError={(e) => setError(e)}
                javaScriptEnabled
              />
              */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.fullWidth,
    backgroundColor: "white",
  },
  scrollView: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: "white",
  },
  containerHTML: {
    backgroundColor: "white",
    paddingBottom: dimensions.pageBottomPadding,
  },
  webview: {
    flex: 1,
    backgroundColor: "white",
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 20,
    color: colors.daclen_danger,
    textAlign: "center",
  },
  textLink: {
    color: colors.daclen_lightgrey,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: colors.daclen_blue,
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  textDaclen: {
    color: colors.daclen_light,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
  },
});

export default WebviewChild;
