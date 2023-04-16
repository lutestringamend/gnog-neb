import React from "react";
import { Platform, SafeAreaView } from "react-native";
import * as Sentry from "sentry-expo";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import { Provider } from "react-redux";
import rootReducer from "./redux/reducers";

/*import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk));*/

import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity,
} from "react-native-global-props";

import { SENTRY_DSN } from "./sentry/constants";

import MainScreen from "./components/Main";
import SplashScreen from "./components/Splash";
import HistoryCheckoutScreen from "./components/history/Checkout";
import CheckoutItemScreen from "./components/history/CheckoutItem";
import DeliveryItemScreen from "./components/history/DeliveryItem";
import BlogScreen from "./components/blog/Blog";
import ProductScreen from "./components/main/Product";

import CheckoutScreen from "./components/main/Checkout";
import VerifyPhone from "./components/auth/VerifyPhone";
import OTPScreen from "./components/auth/OTPScreen";

import OpenMidtrans from "./components/checkout/OpenMidtrans";
import WebviewScreen from "./components/webview/Webview";
import FAQScreen from "./components/profile/FAQ";
import AboutScreen from "./components/profile/About";
import PDFViewer from "./components/pdfviewer/PDFViewer";
import LoginScreen from "./components/auth/Login";
import FillAddressScreen from "./components/address/FillAddress";
import EditProfileScreen from "./components/profile/EditProfile";
import CameraView from "./components/media/CameraView";
import ImageViewer from "./components/imageviewer/ImageViewer";
import MediaKitFiles from "./components/dashboard/MediaKitFiles";
import DeleteAccountScreen from "./components/auth/DeleteAccount";
import UserRoots from "./components/dashboard/UserRoots";
import VideoPlayer from "./components/videoplayer/VideoPlayer";

import { appname } from "./axios/constants";
import { colors, staticDimensions } from "./styles/base";

const Stack = createStackNavigator();

export default function App() {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true,
  });

  try {
    setCustomView(customViewProps);
    setCustomTextInput(customTextInputProps);
    setCustomText(customTextProps);
    setCustomImage(customImageProps);
    setCustomTouchableOpacity(customTouchableOpacityProps);

    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("white");
      NavigationBar.setButtonStyleAsync("dark");
    }

    const defaultOptions = {
      headerTitleStyle: {
        color: "white",
      },
      headerStyle: {
        backgroundColor: colors.daclen_black,
      },
      headerTintColor: "white",
      title: appname,
    };

    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: staticDimensions.statusBarPadding,
        }}
      >
        <StatusBar
          backgroundColor={colors.daclen_black}
          translucent={true}
          style="light"
        />
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Main"
              screenOptions={{
                headerBackTitleVisible: false,
              }}
            >
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="HistoryCheckout"
                component={HistoryCheckoutScreen}
                options={{ ...defaultOptions, title: "Riwayat Checkout" }}
              />
              <Stack.Screen
                name="Product"
                component={ProductScreen}
                options={defaultOptions}
              />
              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ ...defaultOptions, title: "Keranjang Belanja" }}
              />
              <Stack.Screen
                name="VerifyPhone"
                component={VerifyPhone}
                options={{
                  ...defaultOptions,
                  title: "Verifikasi Nomor Handphone",
                }}
              />
              <Stack.Screen
                name="OTPScreen"
                component={OTPScreen}
                options={{ ...defaultOptions, title: "Isi OTP dari Whatsapp" }}
              />
              <Stack.Screen
                name="Address"
                component={FillAddressScreen}
                options={{ ...defaultOptions, title: "Lengkapi Alamat" }}
              />
              <Stack.Screen
                name="OpenMidtrans"
                component={OpenMidtrans}
                options={{
                  ...defaultOptions,
                  title: "Pembayaran",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CheckoutItem"
                component={CheckoutItemScreen}
                options={{ ...defaultOptions, title: "Info Checkout" }}
              />
              <Stack.Screen
                name="DeliveryItem"
                component={DeliveryItemScreen}
                options={{ ...defaultOptions, title: "Info Pengiriman" }}
              />
              <Stack.Screen
                name="Blog"
                component={BlogScreen}
                options={{ ...defaultOptions, title: "Blog" }}
              />
              <Stack.Screen
                name="Webview"
                component={WebviewScreen}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="FAQ"
                component={FAQScreen}
                options={{
                  ...defaultOptions,
                  title: "Frequently Asked Questions",
                }}
              />
              <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{
                  ...defaultOptions,
                  title: "Tentang Daclen",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="PDFViewer"
                component={PDFViewer}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="ImageViewer"
                component={ImageViewer}
                options={{ ...defaultOptions, title: "Foto Produk" }}
              />
              <Stack.Screen
                name="CameraView"
                component={CameraView}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ ...defaultOptions, title: "Atur Profil" }}
              />
              <Stack.Screen
                name="DeleteAccount"
                component={DeleteAccountScreen}
                options={{ ...defaultOptions, title: "Hapus Akun Daclen" }}
              />
              <Stack.Screen
                name="MediaKitFiles"
                component={MediaKitFiles}
                options={{ ...defaultOptions, title: "Materi Promosi" }}
              />
              <Stack.Screen
                name="UserRootsScreen"
                component={UserRoots}
                options={{ ...defaultOptions, title: "User Roots" }}
              />
              <Stack.Screen
                name="VideoPlayerScreen"
                component={VideoPlayer}
                options={{ ...defaultOptions, headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    );
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }

    return <SplashScreen errorText={error.message} />;
  }
}

const customViewProps = {
  style: {
    backgroundColor: "white",
  },
};

const customTextInputProps = {
  underlineColorAndroid: "rgba(0,0,0,0)",
  style: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    color: colors.daclen_gray,
  },
};

const customTextProps = {
  style: {
    fontFamily: Platform.OS === "ios" ? "HelveticaNeue" : "Helvetica",
    color: colors.daclen_black,
    letterSpacing: 0.25,
  },
};

const customImageProps = {
  resizeMode: "cover",
};

const customTouchableOpacityProps = {
  hitSlop: { top: 15, right: 15, left: 15, bottom: 15 },
};
