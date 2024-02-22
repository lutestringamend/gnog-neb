import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RenderHTML from "react-native-render-html";
//import { WebView } from "react-native-webview";

import { colors, staticDimensions, dimensions } from "../../../styles/base";
import { sentryLog } from "../../../sentry";
import CenteredView from "../view/CenteredView";
import EmptySpinner from "../empty/EmptySpinner";

export function ErrorView(props) {
  return (
    <View style={styles.containerVertical}>
      {props?.error ? (
        <Text allowFontScaling={false} style={styles.textError}>{props?.error}</Text>
      ) : null}
      {props?.onOpenExternalLink && (
        <TouchableOpacity
          onPress={props?.onOpenExternalLink}
          style={styles.button}
        >
          <MaterialCommunityIcons name="web" size={16} color="white" />
          <Text allowFontScaling={false} style={styles.textButton}>Buka di Browser</Text>
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
      <CenteredView title={props?.title} style={styles.container}>
        {props?.url !== undefined && props?.url !== null && (
          <TouchableOpacity onPress={() => openExternalLink()}>
            <Text allowFontScaling={false} style={styles.textDaclen}>
              Selengkapnya di Website Daclen
            </Text>
          </TouchableOpacity>
        )}
        <ScrollView style={styles.scrollView}>
          {props?.content === "" ||
          props?.content === null ||
          props?.content === undefined ? (
            <EmptySpinner />
          ) : (
            <RenderHTML
              style={styles.containerHTML}
              contentWidth={
                dimensions.fullWidth - staticDimensions.webviewWidthMargin
              }
              source={{ html: props?.content }}
              enableExperimentalMarginCollapsing={true}
            />
          )}
        </ScrollView>
      </CenteredView>
    );
  } catch (error) {
    console.error(error);
    sentryLog(error);
    return (
      <CenteredView title={props?.title} style={styles.container}>
        <ErrorView error={error.message} />
      </CenteredView>
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
    flex: 1,
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
    marginVertical: 20,
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    marginStart: 4,
    backgroundColor: "transparent",
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    padding: 20,
    color: colors.daclen_danger,
    textAlign: "center",
  },
  textDaclen: {
    color: colors.daclen_light,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
  },
});

export default WebviewChild;
