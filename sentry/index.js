import { Platform, ToastAndroid } from "react-native";
import * as Sentry from "sentry-expo";

export function sentryLog(e) {
  if (Platform.OS === "web") {
    Sentry.Browser.captureException(e);
  } else {
    Sentry.Native.captureException(e);
    if (Platform.OS === "android") {
      ToastAndroid.show(`${e.toString()}`, ToastAndroid.LONG);
    }
  }
}
