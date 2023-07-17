import React, { useState, useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";

import { webcheckout } from "../../axios/constants";
import { useNavigation } from "@react-navigation/native";
import MainHeader from "../main/MainHeader";
import { colors, dimensions } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";

import { WebView } from "react-native-webview";
import { snapHTML } from "./snap";
import { TouchableOpacity } from "react-native-gesture-handler";
import { sentryLog } from "../../sentry";

function MainScreen(props) {
  const navigation = useNavigation();
  const id = props?.checkoutId;

  const backNavigation = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader
        title="Pembayaran Midtrans"
        icon="arrow-left"
        onBackPress={() => backNavigation()}
      />
      <View style={styles.container}>
        {props?.error ? (
          <Text style={styles.textError}>{props?.error}</Text>
        ) : null}
        {props?.content === null || props?.content === undefined ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          props?.content
        )}
      </View>
    </SafeAreaView>
  );
}

export default function OpenMidtrans(props) {
  try {
    const [htmlContent, setHtmlContent] = useState(null);
    const [error, setError] = useState(null);
    let token = props.route.params?.snapToken;
    let checkoutId = props.route.params?.checkoutId;
    let snap_url = props.route.params?.snap_url;

    useEffect(() => {
      console.log({ token, checkoutId });
      if (token !== null && token !== undefined) {
        setHtmlContent(null);
        let newContent = snapHTML.replace("#SNAP_TOKEN#", token);
        setHtmlContent(newContent);
      }
    }, [token]);

    /*useEffect(() => {
      console.log({ htmlContent });
    }, [htmlContent]);*/

    //DEV TEMP
    function trackNavigation(e) {
      console.log("onNavigationStateChange", e);
      setError(`onNavigationStateChange\n${JSON.stringify(e)}`);
    }

    if (token === null || token === undefined) {
      return (
        <MainScreen
          checkoutId={checkoutId}
          content={<Text style={styles.text}>Tidak ada snap token!</Text>}
        />
      );
    } else if (Platform.OS !== "web") {
      return (
        <MainScreen
          checkoutId={checkoutId}
          error={error}
          content={
            htmlContent !== null && htmlContent !== undefined ? (
              <WebView
                style={styles.container}
                originWhitelist={["*"]}
                source={{ html: htmlContent }}
                onNavigationStateChange={(e) => trackNavigation(e)}
              />
            ) : null
          }
        />
      );
    } else if (snap_url !== null && snap_url !== undefined) {
      const [opened, setOpened] = useState(false);
      const [linkText, setLinkText] = useState(null);

      useEffect(() => {
        setLinkText(
          `Tekan untuk membayar menggunakan Midtrans di link berikut ini\n\n${snap_url}`
        );
        if (!opened) {
          openSnapUrl();
          setOpened(true);
        }
      }, [snap_url]);

      function openSnapUrl() {
        Linking.openURL(snap_url);
      }

      return (
        <MainScreen
          checkoutId={checkoutId}
          error={error}
          content={
            <TouchableOpacity onPress={() => openSnapUrl()}>
              <Text style={styles.textUrl}>{linkText}</Text>
            </TouchableOpacity>
          }
        />
      );
    } else {
      return (
        <MainScreen
          backNavigation={() => backNavigation()}
          content={
            <ErrorView
              error="Tidak ada snap url"
              onOpenExternalLink={() => backNavigation()}
            />
          }
        />
      );
    }
  } catch (error) {
    sentryLog(error);
    return (
      <MainScreen
        backNavigation={() => backNavigation()}
        content={
          <ErrorView
            error={error.message}
            onOpenExternalLink={() => Linking.openURL(webcheckout)}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textError: {
    position: "absolute",
    top: 0,
    start: 0,
    width: "100%",
    zIndex: 4,
    elevation: 2,
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textUrl: {
    color: colors.daclen_blue,
    textAlign: "center",
    fontSize: 12,
    marginVertical: 20,
    marginHorizontal: 10,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: colors.daclen_lightgrey,
    borderColor: colors.daclen_blue,
    borderWidth: 1,
    borderRadius: 5,
  },
  image: {
    alignSelf: "center",
    width: 200,
    height: 33,
    margin: 32,
  },
});
