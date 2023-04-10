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
import * as Sentry from "sentry-expo";

import { MIDTRANS_CLIENT_KEY, webcheckout } from "../../axios/constants";
import { useNavigation } from "@react-navigation/native";
import MainHeader from "../main/MainHeader";
import { colors, dimensions } from "../../styles/base";
import { ErrorView } from "../webview/WebviewChild";

import { WebView } from "react-native-webview";
import { snapHTML } from "./snap";
import { TouchableOpacity } from "react-native-gesture-handler";


function MainScreen(props) {
  const navigation = useNavigation();
  const id = props?.checkoutId;

  const backNavigation = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader
        title="Pembayaran Midtrans"
        icon="arrow-left"
        onBackPress={() => backNavigation()}
      />
      <View style={styles.container}>
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
          content={
            htmlContent !== null && htmlContent !== undefined ? (
              <WebView
                style={styles.container}
                originWhitelist={["*"]}
                source={{ html: htmlContent }}
              />
            ) : null
          }
        />
      );
    } else if (snap_url !== null && snap_url !== undefined) {
      const [opened, setOpened] = useState(false);
      const [linkText, setLinkText] = useState(null);

      useEffect(() => {
        setLinkText(`Tekan untuk membayar menggunakan Midtrans di link berikut ini\n\n${snap_url}`);
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
          content={
            <TouchableOpacity onPress={() => openSnapUrl()}>
              <Text style={styles.textUrl}>
                {linkText}
              </Text>
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

    /*const [snap, setSnap] = useState(null);

    useEffect(() => {
      initSnap();
    }, []);

    useEffect(() => {
      const backAction = () => {
        Alert.alert(
          "Pembayaran",
          "Apakah Anda telah menyelesaikan pembayaran?",
          [
            {
              text: "Belum",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Sudah",
              onPress: () => navigation.navigate("HistoryCheckout"),
            },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, []);

    function initSnap() {
      const snapScript = document.createElement("script");

      snapScript.src = "https://app.midtrans.com/snap/snap.js";
      snapScript.type = "text/javascript";
      snapScript.onload = () => {
        if ("snap" in window) {
          const { snap } = window;
          setSnap(snap);
          console.log(snap);
        }
      };
      snapScript.dataset.clientKey = MIDTRANS_CLIENT_KEY;
      document.head.appendChild(snapScript);
    }

    async function handlePay() {
      snap.pay(token);
    }

    return (
      <MainScreen
        checkoutId={checkoutId}
        content={
          snap && (
            <Image
              source={require("./midtrans.png")}
              onLoad={handlePay}
              alt="Sedang membuka Midtrans..."
              style={styles.image}
            />
          )
        }
      />
    );*/
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }

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
    width: dimensions.fullWidth,
    flex: 1,
    backgroundColor: colors.daclen_light,
  },
  text: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.daclen_gray,
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
