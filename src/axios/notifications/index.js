import { Platform, ToastAndroid } from "react-native";
import { FCM_SERVER_KEY } from "../constants";
import { CLEAR_NOTIFICATIONS_DATA, NOTIFICATIONS_ARRAY_OVERHAUL_CHANGE, NOTIFICATIONS_NEW_STATE_CHANGE } from "../../redux/constants";


export function clearReduxNotifications() {
  return (dispatch) => {
    console.log("clearReduxNotifications");
    dispatch({ type: CLEAR_NOTIFICATIONS_DATA });
  };
}

export function overhaulReduxNotifications(data) {
  return (dispatch) => {
    console.log("overhaulReduxNotifications", data);
    dispatch({ type: NOTIFICATIONS_ARRAY_OVERHAUL_CHANGE, data });
  };
}

export function pushNewReduxNotification(data) {
  return (dispatch) => {
    console.log("pushNewReduxNotification", data);
    dispatch({ type: NOTIFICATIONS_NEW_STATE_CHANGE, data });
  };
}

/*export const firebaseConfig = {
  apiKey: "AIzaSyD4J1szfo1K8gcDCKlRU20trA9BdoyyJAk",
  authDomain: "https://homeclinic-23a57.firebaseapp.com",
  databaseURL: "",
  projectId: "homeclinic-23a57",
  storageBucket: "",
  messagingSenderId: "798684017057",
  appId: "1:798684017057:android:0bba160827239c439adbe0",
  measurementId: "",
};

export const initializeFCM = async (deviceToken) => {
  try {
    console.log("fetching https://fcm.googleapis.com/fcm/send");
    await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: deviceToken,
        priority: "normal",
        data: {
          experienceId: "@jasonlimanjaya/homeclinic",
          scopeKey: "@jasonlimanjaya/homeclinic",
          title: "FCM NOTIF TRIAL",
          message: "Halo Dunia Akhirat",
        },
      }),
    })
      .then((result) => {
        console.log("FCM result", result);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            `FCM result ${JSON.stringify(result)}`,
            ToastAndroid.LONG
          );
        }
      })
      .catch((error) => {
        console.error(error);
        if (Platform.OS === "android") {
          ToastAndroid.show(`FCM error ${error.toString()}`, ToastAndroid.LONG);
        }
      });
  } catch (e) {
    console.error(e);
  }
};*/

   /*
   EXPO NOTIFICATIONS SETUP


    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      getNewDeviceToken();
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        //setNotification(notification);
        if (Platform.OS === "android") {
          ToastAndroid.show(JSON.stringify(notification), ToastAndroid.LONG);
        } else {
          console.log(notification);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (Platform.OS === "android") {
          ToastAndroid.show(JSON.stringify(response), ToastAndroid.LONG);
        } else {
          console.log(response);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };*/
 
