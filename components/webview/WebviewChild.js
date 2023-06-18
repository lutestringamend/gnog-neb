import React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RenderHTML from "react-native-render-html";
//import { WebView } from "react-native-webview";

import { colors, staticDimensions, dimensions } from "../../styles/base";
import MainHeader from "../main/MainHeader";
import { sentryLog } from "../../sentry";

export function ErrorView(props) {
  return (
    <View style={styles.containerVertical}>
      <Text style={styles.textError}>{props?.error}</Text>
      {props?.onOpenExternalLink && (
        <TouchableOpacity onPress={props?.onOpenExternalLink} style={styles.button}>
          <MaterialCommunityIcons name="web" size={16} color="white" />
          <Text style={styles.textButton}>Buka di Browser</Text>
        </TouchableOpacity>
      )}
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
              contentWidth={dimensions.fullWidth - staticDimensions.webviewWidthMargin}
              source={{ html: props?.content }}
              enableExperimentalMarginCollapsing={true}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error(error);
    sentryLog(error);
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
    width: "100%",
    backgroundColor: "white",
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  scrollView: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: "white",
  },
  containerHTML: {
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  webview: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginStart: 4,
    backgroundColor: "transparent",
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 20,
    color: colors.daclen_danger,
    textAlign: "center",
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
