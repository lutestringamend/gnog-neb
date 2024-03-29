import { Button, Platform, Text, View, ToastAndroid } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";

import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  ASYNC_NOTIFICATIONS_KEY,
  ASYNC_USER_CURRENTUSER_KEY,
  ASYNC_USER_TOKEN_KEY,
  ASYNC_WELCOME_NOTIFICATION_KEY,
  EXPO_PUSH_TOKEN,
} from "../asyncstorage/constants";
import { colors } from "../../styles/base";
import { sentryLog } from "../../sentry";
import {
  NOTIFICATION_DEFAULT_CHANNEL_ID,
  defaultnotificationalert,
  defaultnotificationcolor,
  defaultnotificationtitle,
} from "./constants";

export const receiveNotificationAccordingly = async (
  props,
  remoteMessage,
  currentUserId,
) => {
  console.log("receiveNotificationAccordingly", remoteMessage);
  if (
    remoteMessage === undefined ||
    remoteMessage === null ||
    remoteMessage?.notification === undefined
  ) {
    return;
  }
  let displayAsNotif = true;
  try {
    const data = remoteMessage?.notification;
    //const { bookingStatus, feedId, objectId, userId, bookingName } = data;

    let channelId = NOTIFICATION_DEFAULT_CHANNEL_ID;

    if (!displayAsNotif) {
      return;
    }
    let timestamp = new Date().toISOString();
    let notifData = {
      ...data,
      timestamp,
    };
    let title = data
      ? data?.title
        ? data?.title
        : defaultnotificationtitle
      : defaultnotificationtitle;
    let body = data
      ? data?.body
        ? data?.body
        : defaultnotificationalert
      : defaultnotificationalert;
    props.pushNewReduxNotification(notifData);

    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        on_mobile_open: data
          ? data?.on_mobile_open
            ? data?.on_mobile_open
            : null
          : null,
        color: defaultnotificationcolor,
        categoryIdentifier: channelId,
        priority:
          channelId === NOTIFICATION_DEFAULT_CHANNEL_ID
            ? Notifications.AndroidNotificationPriority.HIGH
            : Notifications.AndroidNotificationPriority.DEFAULT,
        autoDismiss: true,
        sound: Platform.OS === "android" ? undefined : "d.wav",
        data,
      },
      trigger: null,
    });
  } catch (e) {
    console.error(e);
    sentryLog(e);
    if (Platform.OS === "android") {
      ToastAndroid.show(
        `${e.toString()}\nnew FCM messageId ${remoteMessage?.messageId}`,
        ToastAndroid.SHORT,
      );
    }
  }
};

export const createLocalWelcomeNotification = (name) => {
  const data = {
    title: `Selamat Datang, ${name ? name : "User"}`,
    body: `Miliki bisnis online terpercaya bersama Daclen!`,
    on_mobile_open: null,
    timestamp: new Date().toISOString(),
  };

  try {
    if (Platform.OS !== "web") {
      Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          on_mobile_open: data
            ? data?.on_mobile_open
              ? data?.on_mobile_open
              : null
            : null,
          color: defaultnotificationcolor,
          categoryIdentifier: NOTIFICATION_DEFAULT_CHANNEL_ID,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
          autoDismiss: true,
          sound: Platform.OS === "android" ? undefined : "d.wav",
          data,
        },
        trigger: null,
      });
    }
    setObjectAsync(ASYNC_NOTIFICATIONS_KEY, [data]);
    setObjectAsync(ASYNC_WELCOME_NOTIFICATION_KEY, true);
  } catch (e) {
    console.error(e);
    sentryLog(e);
  }
};

export const openScreenFromNotification = async (navigationRef, data, title) => {
  if (navigationRef === undefined || navigationRef === null) {
    return;
  }

  let screenByTitle = null;
  if (!(title === undefined || title === null)) {
    if (title.toLowerCase() === "info saldo") {
      screenByTitle = "SaldoReportScreen";
    }
  }
  console.log(data, title, screenByTitle);

  navigationRef.navigate("Main", {
    openScreen: screenByTitle ? screenByTitle : data ? data : null,
  });
};

export const initializeAndroidNotificationChannels = async () => {
  if (Platform.OS !== "android") {
    return;
  }
  await Notifications.setNotificationChannelAsync(
    NOTIFICATION_DEFAULT_CHANNEL_ID,
    {
      name: NOTIFICATION_DEFAULT_CHANNEL_ID,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.daclen_black,
    },
  );
  console.log("android notif channels set");
};

export const pushNewNotificationtoAsyncStorage = async (remoteMessage) => {
  try {
    const storageNotifications = await getObjectAsync(ASYNC_NOTIFICATIONS_KEY);
    let newArray = [];
    if (
      !(
        storageNotifications === undefined ||
        storageNotifications === null ||
        storageNotifications?.length === undefined ||
        storageNotifications?.length < 1
      )
    ) {
      newArray = storageNotifications;
    }
    newArray.unshift(remoteMessage);
    await setObjectAsync(ASYNC_NOTIFICATIONS_KEY, newArray);
  } catch (e) {
    console.error(e);
    sentryLog(e);
  }
};

/*export async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Home Clinic",
    body: "Test notif",
    data: { key: "HCHC" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}*/

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync(NOTIFICATION_DEFAULT_CHANNEL_ID, {
      name: NOTIFICATION_DEFAULT_CHANNEL_ID,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.daclen_black,
      sound: "d.wav",
    });
  }

  await setObjectAsync(EXPO_PUSH_TOKEN, token);
  await Clipboard.setStringAsync(token);
  return token;
}

/*
      <Text>Title: {notification && notification.request.content.title} </Text>
      <Text>Body: {notification && notification.request.content.body}</Text>
      <Text>
        Data:{" "}
        {notification && JSON.stringify(notification.request.content.data)}
      </Text>
      */
