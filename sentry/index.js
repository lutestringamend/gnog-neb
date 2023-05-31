import { Platform } from "react-native";
import * as Sentry from "sentry-expo";

export function sentryLog(e) {
  let status = e.toJSON()?.status;
  console.log("error status", status);
  if (Platform.OS === "web") {
    Sentry.Browser.captureException(e);
  } else {
    Sentry.Native.captureException(e);
    if (status === 400 || status === 401 || status === 500) {
      return;
    } 
    if (Platform.OS === "android") {
      ToastAndroid.show(`${e.toString()}`, ToastAndroid.LONG);
    }
  }
}
