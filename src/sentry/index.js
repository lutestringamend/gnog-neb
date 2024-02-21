import { Platform, ToastAndroid } from "react-native";
import * as Sentry from "sentry-expo";

export function sentryLog(e) {
  let errorJSON = null;
  let status = null;

  try {
    errorJSON = e.toJSON();
    status =
      errorJSON === undefined ||
      errorJSON === null ||
      errorJSON?.status === undefined
        ? null
        : errorJSON?.status;
  } catch (err) {

  }
  
  if (Platform.OS === "web") {
    Sentry.Browser.captureException(e);
    console.log("error status", status);
  } else {
    Sentry.Native.captureException(e);
    if (status === null || status === 400 || status === 401 || status === 500) {
      return;
    }
    if (Platform.OS === "android") {
      ToastAndroid.show(`${e.toString()}`, ToastAndroid.SHORT);
    }
  }
}
