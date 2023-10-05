import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  AppState,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Notifications from "expo-notifications";

import SplashScreen from "./Splash";
import TabNavigator from "./bottomnav/TabNavigator";
import { getProductData, clearData } from "../axios/product";
import {
  login,
  setNewToken,
  getCurrentUser,
  clearUserData,
  disableForceLogout,
  updateReduxProfileLockStatus,
  updateReduxProfilePIN,
  updateReduxUserAddressId,
  updateReduxUserAddresses,
  deriveUserKey,
  userLogout,
} from "../axios/user";
import {
  clearMediaKitData,
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
  setWatermarkDatafromCurrentUser,
} from "../axios/mediakit";
import {
  clearReduxNotifications,
  pushNewReduxNotification,
  overhaulReduxNotifications,
} from "../axios/notifications";
import {
  NotifTrial,
  initializeAndroidNotificationChannels,
  openScreenFromNotification,
  receiveNotificationAccordingly,
} from "./notifications";
import {
  convertDateISOStringtoMiliseconds,
  updateReduxRegDateInMs,
} from "../axios/profile";
import { getObjectAsync, getTokenAsync, setObjectAsync } from "./asyncstorage";
import {
  ASYNC_DEVICE_TOKEN_KEY,
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_NOTIFICATIONS_KEY,
  ASYNC_PRODUCTS_ARRAY_KEY,
  ASYNC_RAJAONGKIR_PROVINSI_KEY,
  ASYNC_USER_ADDRESSES_KEY,
  ASYNC_USER_CURRENTUSER_KEY,
  ASYNC_USER_PROFILE_ADDRESS_ID_KEY,
  ASYNC_USER_PROFILE_PIN_KEY,
} from "./asyncstorage/constants";
import { clearCartError } from "../axios/cart";
import { sentryLog } from "../sentry";
import Top from "./Top";
import { colors } from "../styles/base";
import {
  TEMP_DEV_DEVICE_TOKEN,
} from "../axios/constants";
import { fetchRajaOngkir } from "../axios/address";
import { requestLocationForegroundPermission } from "./address";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function Main(props) {
  const appState = useRef(AppState.currentState);
  const {
    token,
    currentUser,
    notificationsArray,
    productError,
    profileLock,
    profileLockTimeout,
    profilePIN,
    regDateInMs,
    watermarkData,
    addressId,
    addresses,
  } = props;

  const [error, setError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [recruitmentTimer, setRecruitmentTimer] = useState(null);
  const [deviceToken, setDeviceToken] = useState(null);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  try {
    useEffect(() => {
      props.clearReduxNotifications();
      if (Platform.OS == "web") {
        setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, "WEB_DEV_TOKEN");
        setDeviceToken("WEB_DEV_TOKEN");
        return;
      } else if (Platform.OS == "ios") {
        setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, "DEV_IOS_TOKEN");
        setDeviceToken("DEV_IOS_TOKEN");
        return;
      }
  
      try {
        console.log("firebase auth settings", auth().settings);
        //auth().settings.appVerificationDisabledForTesting = false;
  
        const requestUserPermission = async () => {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
          if (enabled) {
            if (Platform.OS === "android") {
              await initializeAndroidNotificationChannels();
            }
            console.log("Authorization status:", authStatus);
          }
        };
  
        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then((token) => {
              console.log("fcm token", token);
              setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, token);
              setDeviceToken(token);
            });
        } else {
          addError("FAIL TO GET FCM TOKEN");
          return;
        }
  
        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log(
                "Notification caused app to open from quit state:",
                remoteMessage.notification
              );
            }
          });
  
        messaging().onNotificationOpenedApp(async (remoteMessage) => {
          receiveNotificationAccordingly(
            props,
            remoteMessage,
            isAdmin,
            currentUser?.id
          );
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
          //navigation.navigate(remoteMessage.data.type);
        });
  
        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          receiveNotificationAccordingly(
            props,
            remoteMessage,
            isAdmin,
            currentUser?.id
          );
          console.log("Message handled in the background!", remoteMessage);
        });
  
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          receiveNotificationAccordingly(
            props,
            remoteMessage,
            isAdmin,
            currentUser?.id
          );
          console.log("FCM message", remoteMessage);
          /*if (Platform.OS === "android") {
            ToastAndroid.show(`FCM MESSAGE\n${JSON.stringify(remoteMessage)}`, ToastAndroid.LONG);
          };*/
        });
  
        return unsubscribe;
      } catch (e) {
        console.error(e);
        addError(e.toString());
        setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, "EXPO_GO_DEV_TOKEN");
        setDeviceToken("EXPO_GO_DEV_TOKEN");
        /*if (Platform.OS === "android") {
          ToastAndroid.show(e.toString(), ToastAndroid.LONG);
        }*/
      }
    }, []);

    useEffect(() => {
      if (lastNotificationResponse) {
        try {
          console.log(
            "lastNotificationResponse",
            lastNotificationResponse?.notification?.request?.content?.data
          );
          openScreenFromNotification(
            navigationRef.current,
            lastNotificationResponse?.notification?.request?.content?.data
          );
        } catch (e) {
          console.error(e);
          sentryLog(e);
        }
      }
    }, [lastNotificationResponse]);
  
    useEffect(() => {
      if (
        notificationsArray === undefined ||
        notificationsArray === null ||
        notificationsArray?.length === undefined ||
        notificationsArray?.length === undefined
      ) {
        checkAsyncStorageNotifications();
        return;
      } else if (notificationsArray?.length > 0) {
        setObjectAsync(ASYNC_NOTIFICATIONS_KEY, notificationsArray);
        //console.log("ChildApp redux notifications", notificationsArray);
      }
    }, [notificationsArray]);

    useEffect(() => {
      const readStorageProducts = async () => {
        const storageProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
        if (storageProducts === undefined || storageProducts === null) {
          props.getProductData(null, 0);
        } else {
          props.getProductData(storageProducts, 0);
        }
      };

      if (
        props.products === null ||
        props.products?.length === undefined ||
        props.products?.length < 1
      ) {
        readStorageProducts();
      } else {
        props.clearCartError();
        //console.log("redux products", props.products);
      }
    }, [props.products]);

    useEffect(() => {
      if (productError === undefined || productError === null) {
        return;
      }
      setError(`Mengalami gangguan koneksi`);
    }, [productError]);

    /*useEffect(() => {
      if (props.maxIndex > 0) {
        console.log("redux products maxIndex", props.maxIndex);
      }
    }, [props.maxIndex]);*/

    useEffect(() => {
      if (token === undefined || token === null || token === "") {
        checkUserData();
        return;
      }
      checkRajaOngkirProvinsi();
    }, [token]);

    useEffect(() => {
      if (
        currentUser === undefined ||
        currentUser === null ||
        currentUser?.name === undefined
      ) {
        return;
      }

      if (
        !(
          currentUser?.batas_rekrut === undefined ||
          currentUser?.batas_rekrut === null ||
          currentUser?.target_rekrutmen === undefined ||
          currentUser?.target_rekrutmen === null
        )
      ) {
        let newRegDateInMs = currentUser?.batas_rekrut
          ? convertDateISOStringtoMiliseconds(currentUser?.batas_rekrut)
          : null;
        props.updateReduxRegDateInMs(newRegDateInMs);
      }

      console.log("redux currentUser", currentUser);
      if (watermarkData === null) {
        checkWatermarkData();
      } else {
        console.log("Main redux WatermarkData", watermarkData);
      }

      try {
        const theAppState = AppState.addEventListener(
          "change",
          handleAppStateChange
        );
        return () => theAppState.remove();
      } catch (e) {
        console.error(e);
      }
    }, [currentUser, profileLock]);

    useEffect(() => {
      if (regDateInMs === null || regDateInMs <= 0) {
        return;
      }
      //console.log("redux regDateInMs", regDateInMs);
      checkProfileLockTimeout();
    }, [regDateInMs]);

    useEffect(() => {
      if (locationPermission === null) {
        checkLocationPermission();
      }
    }, [locationPermission]);

    useEffect(() => {
      if (profilePIN === null) {
        checkAsyncPIN();
      }
      console.log("Main redux PIN", profilePIN);
    }, [profilePIN]);

    useEffect(() => {
      if (addressId === null) {
        checkStorageAddressId();
      }
    }, [addressId]);

    useEffect(() => {
      if (addresses === null) {
        loadStorageAddresses();
      }
    }, [addresses]);

    const checkAsyncStorageNotifications = async () => {
      const storageNotifications = await getObjectAsync(ASYNC_NOTIFICATIONS_KEY);
      if (
        storageNotifications === undefined ||
        storageNotifications === null ||
        storageNotifications?.length === undefined ||
        storageNotifications?.length < 1
      ) {
        props.overhaulReduxNotifications([]);
      } else {
        props.overhaulReduxNotifications(storageNotifications);
      }
    };

    const checkUserData = async () => {
      const storageToken = await readStorageToken();
      const storageCurrentUser = await readStorageCurrentUser();
      const key = await deriveUserKey(storageToken);
      try {
        if (
          storageToken === undefined ||
          storageToken === null ||
          key === null ||
          storageCurrentUser === undefined ||
          storageCurrentUser === null ||
          storageCurrentUser?.name === undefined ||
          storageCurrentUser?.name === null
        ) {
          props.setNewToken(null, null, null, TEMP_DEV_DEVICE_TOKEN);
          props.clearUserData();
          props.clearMediaKitData();
        } else {
          props.setNewToken(storageToken, storageCurrentUser, key, TEMP_DEV_DEVICE_TOKEN);
          //props.login(storageCurrentUser?.name, key, false);
        }
      } catch (e) {
        console.error(e);
        userLogout();
        props.setNewToken(null, null, null, TEMP_DEV_DEVICE_TOKEN);
        props.clearUserData();
        props.clearMediaKitData();
      }
    };

    const readStorageToken = async () => {
      const storageToken = await getTokenAsync();
      if (
        storageToken === undefined ||
        storageToken === null ||
        storageToken === ""
      ) {
        console.log("storageToken null", storageToken);
        return null;
      }
      return storageToken;
    };

    const readStorageCurrentUser = async () => {
      try {
        const storageCurrentUser = await getObjectAsync(
          ASYNC_USER_CURRENTUSER_KEY
        );
        if (
          storageCurrentUser === undefined ||
          storageCurrentUser === null ||
          storageCurrentUser === ""
        ) {
          console.log("storageCurrentUser null", storageCurrentUser);
          return null;
        }
        return storageCurrentUser;
      } catch (e) {
        sentryLog(e);
        setError(e.toString());
        return null;
      }
    };

    const checkLocationPermission = async () => {
      let result = await requestLocationForegroundPermission();
      setLocationPermission(result);
    };

    const handleAppStateChange = async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkProfileLockTimeout();
      }
      appState.current = nextAppState;
    };

    const checkAsyncPIN = async () => {
      let asyncPIN = await getObjectAsync(ASYNC_USER_PROFILE_PIN_KEY);
      if (!(asyncPIN === undefined || asyncPIN === null || asyncPIN === "")) {
        props.updateReduxProfilePIN(asyncPIN);
      }
    };

    const checkProfileLockTimeout = async () => {
      //console.log("checkProfileLockTimeout");
      if (
        token === null ||
        currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.id === null ||
        currentUser?.name === undefined ||
        currentUser?.name === null
      ) {
        return;
      }
      try {
        let time = new Date().getTime();
        if (
          !(
            profileLock ||
            profileLockTimeout === null ||
            profileLockTimeout <= 0
          ) &&
          time >= profileLockTimeout
        ) {
          props.updateReduxProfileLockStatus(true);
        }

        if (regDateInMs === null || regDateInMs <= 0) {
          return;
        }
        if (regDateInMs - time > 0) {
          setRecruitmentTimer(regDateInMs - time);
          setTimeout(checkProfileLockTimeout, 1000);
        } else {
          setRecruitmentTimer(0);
        }
      } catch (err) {
        console.error(err);
        props.updateReduxProfileLockStatus(false);
      }
    };

    const checkRajaOngkirProvinsi = async () => {
      const storageProvinsi = await getObjectAsync(
        ASYNC_RAJAONGKIR_PROVINSI_KEY
      );
      if (storageProvinsi === undefined || storageProvinsi === null) {
        fetchRajaOngkir(token, "provinsi");
      }
    };

    const checkStorageAddressId = async () => {
      const storageAddressId = await getObjectAsync(
        ASYNC_USER_PROFILE_ADDRESS_ID_KEY
      );
      if (
        storageAddressId === undefined ||
        storageAddressId === null ||
        storageAddressId === ""
      ) {
        props.updateReduxUserAddressId("default");
      } else {
        props.updateReduxUserAddressId(storageAddressId);
      }
    };

    const loadStorageAddresses = async () => {
      const storageAddresses = await getObjectAsync(ASYNC_USER_ADDRESSES_KEY);
      if (
        storageAddresses === null ||
        storageAddresses?.length === undefined ||
        storageAddresses?.length < 1
      ) {
        props.updateReduxUserAddresses([]);
      } else {
        props.updateReduxUserAddresses(storageAddresses);
      }
    };

    const checkWatermarkData = async () => {
      if (currentUser === undefined || currentUser === null) {
        let newData = await getObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY);
        if (!(newData === undefined || newData === null)) {
          props.updateReduxMediaKitWatermarkData(newData);
        }
      } else {
        let newData = setWatermarkDatafromCurrentUser(currentUser, false);
        props.updateReduxMediaKitWatermarkData(newData);
        setObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY, newData);
      }
    };

    if (
      error !== null ||
      props.products === null ||
      props.products?.length === undefined ||
      props.products?.length < 1
    ) {
      return <SplashScreen loading={true} errorText={error} />;
    } else if (Platform.OS === "web") {
      return (
        <SafeAreaView style={styles.container}>
          <TabNavigator
            token={token}
            currentUser={currentUser}
            recruitmentTimer={recruitmentTimer}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <ImageBackground
            source={require("../assets/profilbg.png")}
            style={styles.background}
            resizeMode="cover"
          />
          <Top
            token={token}
            currentUser={currentUser}
            recruitmentTimer={recruitmentTimer}
          />
        </SafeAreaView>
      );
    }
  } catch (e) {
    sentryLog(e);
    return <SplashScreen errorText={e.toString()} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_bg,
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  notificationsArray: store.notificationsState.notificationsArray,
  profileLock: store.userState.profileLock,
  addressId: store.userState.addressId,
  addresses: store.userState.addresses,
  regDateInMs: store.userState.regDateInMs,
  profileLockTimeout: store.userState.profileLockTimeout,
  profilePIN: store.userState.profilePIN,
  products: store.productState.products,
  productError: store.productState.productError,
  maxIndex: store.productState.maxIndex,
  loginToken: store.userState.loginToken,
  registerToken: store.userState.registerToken,
  watermarkData: store.mediaKitState.watermarkData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getProductData,
      clearData,
      getCurrentUser,
      clearUserData,
      clearReduxNotifications,
      pushNewReduxNotification,
      overhaulReduxNotifications,
      updateReduxRegDateInMs,
      login,
      setNewToken,
      disableForceLogout,
      clearMediaKitData,
      updateReduxMediaKitWatermarkData,
      updateReduxMediaKitPhotosUri,
      clearCartError,
      updateReduxProfileLockStatus,
      updateReduxProfilePIN,
      updateReduxUserAddressId,
      updateReduxUserAddresses,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
