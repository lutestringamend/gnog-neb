import React from "react";
import { Platform, SafeAreaView, StyleSheet } from "react-native";
import * as Sentry from "sentry-expo";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
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
import History from "./components/history/History";
import Dashboard from "./components/dashboard/Dashboard";
import HistoryCheckoutScreen from "./components/history/Checkout";
import CheckoutItemScreen from "./components/history/CheckoutItem";
import DeliveryItemScreen from "./components/history/DeliveryItem";
import BlogFeedScreen from "./components/blog/BlogFeed";
import BlogScreen from "./components/blog/Blog";
import ProductScreen from "./components/main/Product";

import CheckoutScreen from "./components/main/Checkout";
import VerifyPhone from "./components/auth/VerifyPhone";
import OTPScreen from "./components/auth/OTPScreen";

import OpenMidtrans from "./components/checkout/OpenMidtrans";
import Withdrawal from "./components/dashboard/Withdrawal";
import WebviewScreen from "./components/webview/Webview";
import FAQScreen from "./components/profile/FAQ";
import AboutScreen from "./components/profile/About";
import PDFViewer from "./components/pdfviewer/PDFViewer";
import LoginScreen from "./components/auth/Login";

import PickAddress from "./components/address/PickAddress";
import FillAddressScreen from "./components/address/FillAddress";
import LocationPin from "./components/address/LocationPin";

import EditProfileScreen from "./components/profile/EditProfile";
import CameraView from "./components/media/CameraView";
import ImageViewer from "./components/imageviewer/ImageViewer";
import MultipleImageView from "./components/imageviewer/MultipleImageView";
import MediaKitFiles from "./components/mediakit/MediaKitFiles";
import PhotosSegment from "./components/mediakit/PhotosSegment";
import QRScreen from "./components/qrscreen/QRScreen";
import VideoPlayer from "./components/videoplayer/VideoPlayer";
import VideoLogs from "./components/videoplayer/VideoLogs";

import Profile from "./components/profile/Profile";
import DeleteAccountScreen from "./components/auth/DeleteAccount";
import PointReportScreen from "./components/dashboard/PointReport";
import CreatePIN from "./components/profile/CreatePIN";
import UserRoots from "./components/dashboard/UserRoots";
import BonusRoot from "./components/dashboard/BonusRoot";
import SaldoReport from "./components/dashboard/SaldoReport";
import WmarkTestScreen from "./components/media/WmarkTestScreen";

import { appname } from "./axios/constants";
import { colors, staticDimensions } from "./styles/base";
import { sentryLog } from "./sentry";

const Stack = createStackNavigator();

export default function App() {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true,
  });

  try {
    const theme = useTheme();
    theme.colors.primary = colors.daclen_bg;
    theme.colors.primaryContainer = colors.daclen_black;
    theme.colors.secondaryContainer = "transparent";

    setCustomView(customViewProps);
    setCustomTextInput(customTextInputProps);
    setCustomText(customTextProps);
    setCustomImage(customImageProps);
    setCustomTouchableOpacity(customTouchableOpacityProps);

    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(colors.daclen_bg);
      NavigationBar.setButtonStyleAsync("light");
    }

    const defaultOptions = {
      headerTitleStyle: {
        color: colors.daclen_light,
      },
      headerStyle: {
        backgroundColor: colors.daclen_bg,
      },
      headerTintColor: colors.daclen_light,
      title: appname,
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
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
                name="Dashboard"
                component={Dashboard}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="History"
                component={History}
                options={{ ...defaultOptions, title: "Riwayat Transaksi" }}
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
                name="LocationPin"
                component={LocationPin}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="PickAddress"
                component={PickAddress}
                options={{ ...defaultOptions, title: "Pilih Alamat" }}
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
                name="Withdrawal"
                component={Withdrawal}
                options={{ ...defaultOptions, title: "Penarikan Saldo" }}
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
                name="BlogFeed"
                component={BlogFeedScreen}
                options={{ ...defaultOptions, headerShown: false }}
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
                name="MultipleImageView"
                component={MultipleImageView}
                options={{ ...defaultOptions, title: "Download All" }}
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
                name="Profile"
                component={Profile}
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
                name="CreatePIN"
                component={CreatePIN}
                options={{ ...defaultOptions, title: "Buat PIN Baru" }}
              />
              <Stack.Screen
                name="MediaKitFiles"
                component={MediaKitFiles}
                options={{ ...defaultOptions, title: "Materi Promosi" }}
              />
              <Stack.Screen
                name="PhotosSegment"
                component={PhotosSegment}
                options={{ ...defaultOptions, title: "Foto Promosi" }}
              />
              <Stack.Screen
                name="PointReportScreen"
                component={PointReportScreen}
                options={{ ...defaultOptions, title: "Laporan Poin User" }}
              />
              <Stack.Screen
                name="UserRootsScreen"
                component={UserRoots}
                options={{ ...defaultOptions, title: "User Roots" }}
              />
              <Stack.Screen
                name="BonusRootScreen"
                component={BonusRoot}
                options={{ ...defaultOptions, title: "Syarat Bonus Root" }}
              />
              <Stack.Screen
                name="SaldoReportScreen"
                component={SaldoReport}
                options={{ ...defaultOptions, title: "Laporan Saldo" }}
              />
              <Stack.Screen
                name="QRScreen"
                component={QRScreen}
                options={{ ...defaultOptions, title: "QR Code" }}
              />
              <Stack.Screen
                name="VideoPlayerScreen"
                component={VideoPlayer}
                options={{ ...defaultOptions, headerShown: false }}
              />
              <Stack.Screen
                name="VideoLogsScreen"
                component={VideoLogs}
                options={{ ...defaultOptions, title: "Logs" }}
              />
              <Stack.Screen
                name="WmarkTestScreen"
                component={WmarkTestScreen}
                options={{ ...defaultOptions, title: "Test" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    );
  } catch (error) {
    console.error(error);
    sentryLog(error);
    return <SplashScreen errorText={error.message} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_bg,
    paddingTop: staticDimensions.statusBarPadding,
  },
});

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
