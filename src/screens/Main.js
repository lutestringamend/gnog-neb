import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  AppState,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

import SplashScreen from "./Splash";
import TabNavigator from "../bottomnav/TabNavigator";
import { getProductData } from "../../axios/product";
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
  getDeviceInfo,
} from "../../axios/user";
import {
  clearMediaKitData,
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
  updateReduxMediaKitPhotos,
  setWatermarkDatafromCurrentUser,
} from "../../axios/mediakit";
import {
  clearReduxNotifications,
  pushNewReduxNotification,
  overhaulReduxNotifications,
} from "../../axios/notifications";
import {
  createLocalWelcomeNotification,
  initializeAndroidNotificationChannels,
  openScreenFromNotification,
  receiveNotificationAccordingly,
} from "../../components/notifications";
import {
  convertDateISOStringtoMiliseconds,
  updateReduxRegDateInMs,
} from "../../axios/profile";
import {
  getObjectAsync,
  getTokenAsync,
  setObjectAsync,
} from "../../components/asyncstorage";
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
  ASYNC_WELCOME_NOTIFICATION_KEY,
} from "../../components/asyncstorage/constants";
import { clearCartError } from "../../axios/cart";
import { sentryLog } from "../../sentry";
//import Top from "./Top";
import { colors } from "../../styles/base";
import { fetchRajaOngkir } from "../../axios/address";
import { requestLocationForegroundPermission } from "../../components/address";
import { devhttp, mainhttp } from "../../axios/constants";
import { updateReduxUserMainModal } from "../utils/user";
import ModalView from "../components/modal/ModalView";
import LoginScreen from "./auth/LoginScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: Platform.OS === "android" ? false : true,
  }),
});

function Main(props) {
  const appState = useRef(AppState.currentState);
  const {
    token,
    currentUser,
    mainModal,
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
  const [welcomeCheck, setWelcomeCheck] = useState(false);
  const [userCheck, setUserCheck] = useState(false);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const navigationRef = useNavigation();
  const timeoutHandle = useRef();

  useEffect(() => {
    if (
      !(
        props.route.params?.openScreen === undefined ||
        props.route.params?.openScreen === null
      )
    ) {
      navigationRef.navigate(props.route.params?.openScreen);
    }
    console.log("Main route params", props.route.params);
  }, [props.route.params]);

  try {
    useEffect(() => {
      props.clearReduxNotifications();
      if (Platform.OS == "web") {
        setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, "WEB_DEV_TOKEN");
        return;
      } else {
        setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, null);
      }

      try {
        console.log("firebase auth settings", auth().settings);
        //auth().settings.appVerificationDisabledForTesting = false;

        const requestUserPermission = async () => {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          try {
            if (Platform.OS === "android" && getDeviceInfo().versionSdk > 32) {
              const extraStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              );
            }
          } catch (err) {
            console.log(err);
            sentryLog(err);
          }

          if (enabled) {
            if (Platform.OS === "android") {
              await initializeAndroidNotificationChannels();
            } else if (Platform.OS === "ios") {
              await messaging().registerDeviceForRemoteMessages();
            }
            console.log("Authorization status:", authStatus);
          } else if (Platform.OS === "android") {
            ToastAndroid.show(
              "Notification not authorized on this device",
              ToastAndroid.LONG,
            );
          }
        };

        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then((token) => {
              console.log("fcm token", token);
              setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, token);
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
                remoteMessage.notification,
              );
            }
          });

        messaging().onNotificationOpenedApp(async (remoteMessage) => {
          receiveNotificationAccordingly(props, remoteMessage, currentUser?.id);
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification,
          );
          //navigation.navigate(remoteMessage.data.type);
        });

        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          receiveNotificationAccordingly(props, remoteMessage, currentUser?.id);
          console.log("Message handled in the background!", remoteMessage);
        });

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          receiveNotificationAccordingly(props, remoteMessage, currentUser?.id);
          console.log("FCM message", remoteMessage);
          /*if (Platform.OS === "android") {
            ToastAndroid.show(`FCM MESSAGE\n${JSON.stringify(remoteMessage)}`, ToastAndroid.LONG);
          };*/
        });

        return unsubscribe;
      } catch (e) {
        console.error(e);
        addError(e.toString());
        setObjectAsync(ASYNC_DEVICE_TOKEN_KEY, "ERROR_DEV_TOKEN");
        /*if (Platform.OS === "android") {
          ToastAndroid.show(e.toString(), ToastAndroid.LONG);
        }*/
      }
    }, []);

    useEffect(() => {
      if (token !== null && userCheck) {
        setUserCheck(false);
      }
    }, [token]);

    useEffect(() => {
      if (lastNotificationResponse) {
        try {
          console.log(
            "lastNotificationResponse data",
            lastNotificationResponse?.notification?.request?.content?.data,
          );
          openScreenFromNotification(
            navigationRef,
            lastNotificationResponse?.notification?.request?.content?.data
              ?.on_mobile_open,
            lastNotificationResponse?.notification?.request?.content?.data
              ?.title,
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
        if (props.products?.length < 11 && mainhttp !== devhttp) {
          props.getProductData(null, 0, 2);
        } else {
          setObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY, props.products);
        }
        //console.log("redux products", props.products);
      }
    }, [props.products]);

    useEffect(() => {
      if (productError === undefined || productError === null) {
        return;
      }
      addError(`Mengalami gangguan koneksi`);
    }, [productError]);

    /*useEffect(() => {
      if (props.maxIndex > 0) {
        console.log("redux products maxIndex", props.maxIndex);
      }
    }, [props.maxIndex]);*/

    useEffect(() => {
      if (token === undefined || token === null || token === "") {
        checkUserData();
        if (welcomeCheck) {
          setWelcomeCheck(false);
        }
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
        if (recruitmentTimer !== null) {
          setRecruitmentTimer(null);
          clearTimeout(timeoutHandle.current);
        }
        return;
      }

      if (!welcomeCheck) {
        checkWelcomeNotif();
        setWelcomeCheck(true);
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
          handleAppStateChange,
        );
        return () => theAppState.remove();
      } catch (e) {
        console.error(e);
      }
    }, [currentUser, profileLock]);

    useEffect(() => {
      if (
        currentUser?.batas_rekrut === undefined ||
        currentUser?.batas_rekrut === null
      ) {
        clearTimeout(timeoutHandle.current);
        props.updateReduxRegDateInMs(null);
      } else {
        let newRegDateInMs = currentUser?.batas_rekrut
          ? convertDateISOStringtoMiliseconds(currentUser?.batas_rekrut)
          : null;
        props.updateReduxRegDateInMs(newRegDateInMs);
      }
    }, [currentUser?.batas_rekrut]);

    useEffect(() => {
      if (!(regDateInMs === null || regDateInMs <= 0)) {
        checkProfileLockTimeout();
      }
      console.log("redux regDateInMs", regDateInMs);
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
      //console.log("Main redux PIN", profilePIN);
    }, [profilePIN]);

    /*useEffect(() => {
      console.log("redux user profilePicture", props?.profilePicture);
    }, [props?.profilePicture]);*/

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

    /*
    DEV
    useEffect(() => {
      if (mediaKitPhotos === undefined || mediaKitPhotos === null) {
        checkAsyncMediaKitPhotos();
      }
    }, [mediaKitPhotos]);

    const checkAsyncMediaKitPhotos = async () => {
      const storagePhotos = await getObjectAsync(
        ASYNC_MEDIA_WATERMARK_PHOTOS_KEY
      );
      if (!(storagePhotos === undefined || storagePhotos === null)) {
        props.updateReduxMediaKitPhotos(storagePhotos);
      }
    };*/

    const checkAsyncStorageNotifications = async () => {
      const storageNotifications = await getObjectAsync(
        ASYNC_NOTIFICATIONS_KEY,
      );
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
      setUserCheck(true);
      const storageToken = await readStorageToken();
      const storageCurrentUser = await readStorageCurrentUser();
      const key = await deriveUserKey(storageToken);
      const deviceToken = await getObjectAsync(ASYNC_DEVICE_TOKEN_KEY);
      //console.log("deviceToken", deviceToken);
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
          props.setNewToken(null, null, null, null);
          props.clearUserData();
          props.clearMediaKitData();
          props.clearReduxNotifications();
        } else {
          props.setNewToken(storageToken, storageCurrentUser, key, deviceToken);
          //props.login(storageCurrentUser?.name, key, false);
        }
      } catch (e) {
        console.error(e);
        userLogout();
        props.setNewToken(null, null, null, null);
        props.clearUserData();
        props.clearMediaKitData();
        props.clearReduxNotifications();
      }
      setUserCheck(false);
    };

    const checkWelcomeNotif = async () => {
      const welcomeNotification = await getObjectAsync(
        ASYNC_WELCOME_NOTIFICATION_KEY,
      );
      if (
        welcomeNotification === undefined ||
        welcomeNotification === null ||
        !welcomeNotification
      ) {
        createLocalWelcomeNotification(currentUser?.name);
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
          ASYNC_USER_CURRENTUSER_KEY,
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
        addError(e.toString());
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
        clearTimeout(timeoutHandle.current);
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
      //console.log("checkProfileLockTimeout called");
      if (
        token === null ||
        currentUser === null ||
        regDateInMs === null ||
        regDateInMs <= 0
      ) {
        clearTimeout(timeoutHandle.current);
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

        if (regDateInMs - time > 0) {
          setRecruitmentTimer(regDateInMs - time);
        } else {
          setRecruitmentTimer(0);
        }
        timeoutHandle.current = setTimeout(checkProfileLockTimeout, 500);
      } catch (err) {
        console.error(err);
        props.updateReduxProfileLockStatus(false);
        clearTimeout(timeoutHandle.current);
      }
    };

    const checkRajaOngkirProvinsi = async () => {
      const storageProvinsi = await getObjectAsync(
        ASYNC_RAJAONGKIR_PROVINSI_KEY,
      );
      if (storageProvinsi === undefined || storageProvinsi === null) {
        fetchRajaOngkir(token, "provinsi");
      }
    };

    const checkStorageAddressId = async () => {
      const storageAddressId = await getObjectAsync(
        ASYNC_USER_PROFILE_ADDRESS_ID_KEY,
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

    const addError = (text) => {
      setError((error) => `${error ? error + "\n" : ""}${text}`);
    };

    if (
      error !== null ||
      props.products === null ||
      props.products?.length === undefined ||
      props.products?.length < 1 ||
      userCheck
    ) {
      return <SplashScreen loading={true} errorText={error} />;
    } else if (token === null) {
      return <LoginScreen />;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <TabNavigator
            isLogin={true}
            isActive={
              currentUser
                ? currentUser?.isActive
                  ? currentUser?.isActive
                  : false
                : false
            }
            recruitmentTimer={recruitmentTimer}
          />
          {mainModal === null || !mainModal?.visible ? null : (
            <ModalView {...mainModal} />
          )}
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
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  mainModal: store.userState.mainModal,
  notificationsArray: store.notificationsState.notificationsArray,
  profileLock: store.userState.profileLock,
  profilePicture: store.userState.profilePicture,
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
  mediaKitPhotos: store.mediaKitState.photos,
  watermarkData: store.mediaKitState.watermarkData,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getProductData,
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
      updateReduxMediaKitPhotos,
      clearCartError,
      updateReduxProfileLockStatus,
      updateReduxProfilePIN,
      updateReduxUserAddressId,
      updateReduxUserAddresses,
      updateReduxUserMainModal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
