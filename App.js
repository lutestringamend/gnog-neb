import React, { useCallback } from "react";
import { Platform, SafeAreaView, StyleSheet, Text } from "react-native";
import * as Sentry from "sentry-expo";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";

import { Provider } from "react-redux";
import rootReducer from "./src/redux/reducers";

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

import Splash from "./components/Splash";
import { Screens } from "./src/Navigation";

import { appname } from "./axios/constants";
import { colors, staticDimensions } from "./styles/base";
import { sentryLog } from "./sentry";
import { defaultpoppins } from "./src/styles/fonts";


SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  try {
    const theme = useTheme();
    theme.colors.primary = colors.daclen_bg;
    theme.colors.primaryContainer = colors.daclen_black;
    theme.colors.secondaryContainer = "transparent";

    const [fontsLoaded] = useFonts(defaultpoppins);

    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
      return null;
    }

    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    Text.defaultProps.maxFontSizeMultiplier = 0;
    Text.defaultProps.fontFamily = "Poppins";

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
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
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
             {Screens.map((prop, index) => {
              return (
                <Stack.Screen
                  name={prop.name}
                  component={prop.screen}
                  key={index}
                  options={prop.options}
                />
              );
            })}
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    );
  } catch (error) {
    console.error(error);
    sentryLog(error);
    return <Splash errorText={error.message} />;
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
    backgroundColor: colors.white,
  },
};

const customTextInputProps = {
  underlineColorAndroid: "rgba(0,0,0,0)",
  style: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    fontFamily: "Poppins",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    color: colors.daclen_gray,
  },
};

const customTextProps = {
  style: {
    fontFamily: "Poppins",
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
