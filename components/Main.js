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

import SplashScreen from "./Splash";
import TabNavigator from "./bottomnav/TabNavigator";
import { getProductData, clearData } from "../axios/product";
import {
  setNewToken,
  getCurrentUser,
  clearUserData,
  disableForceLogout,
  updateReduxProfileLockStatus,
  updateReduxProfilePIN,
} from "../axios/user";
import {
  clearMediaKitData,
  updateReduxMediaKitWatermarkData,
  updateReduxMediaKitPhotosUri,
} from "../axios/mediakit";
import { getObjectAsync, getTokenAsync } from "./asyncstorage";
import {
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
  ASYNC_PRODUCTS_ARRAY_KEY,
  ASYNC_USER_CURRENTUSER_KEY,
  ASYNC_USER_PROFILE_PIN_KEY,
} from "./asyncstorage/constants";
import { clearCartError } from "../axios/cart";
import { sentryLog } from "../sentry";
import Top from "./Top";
import { colors } from "../styles/base";
import { webreferral } from "../axios/constants";

function Main(props) {
  try {
    const [error, setError] = useState(null);
    const appState = useRef(AppState.currentState);
    const {
      token,
      currentUser,
      profileLock,
      profileLockTimeout,
      profilePIN,
      watermarkData,
    } = props;

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

    /*useEffect(() => {
      if (props.maxIndex > 0) {
        console.log("redux products maxIndex", props.maxIndex);
      }
    }, [props.maxIndex]);*/

    useEffect(() => {
      if (
        token === undefined ||
        token === null ||
        token === "" ||
        currentUser === undefined ||
        currentUser === null
      ) {
        checkUserData();
        return;
      }
      //console.log("redux token", token);
      console.log("redux currentuser", currentUser);
      if (watermarkData === null) {
        checkWatermarkData();
      } else {
        console.log("Main redux WatermarkData", watermarkData);
      }
      if (!profileLock) {
        const theAppState = AppState.addEventListener(
          "change",
          handleAppStateChange
        );
        return () => theAppState.remove();
      }
    }, [token, currentUser, profileLock]);

    useEffect(() => {
      if (profilePIN === null) {
        checkAsyncPIN();
      }
      console.log("Main redux PIN", profilePIN);
    }, [profilePIN]);

    useEffect(() => {
      //console.log("Main profileLock", profileLock);
      if (
        profileLock ||
        profileLockTimeout === null ||
        profileLockTimeout <= 0
      ) {
        return;
      }
      checkProfileLockTimeout();
    }, [profileLock, profileLockTimeout]);

    useEffect(() => {

    }, [watermarkData]);

    const checkUserData = async () => {
      const storageToken = await readStorageToken();
      const storageCurrentUser = await readStorageCurrentUser();
      if (
        storageToken === undefined ||
        storageToken === null ||
        storageCurrentUser === undefined ||
        storageCurrentUser === null
      ) {
        props.setNewToken(null, null);
        props.clearUserData();
        props.clearMediaKitData();
      } else {
        props.setNewToken(storageToken, storageCurrentUser);
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
      try {
        let time = new Date().getTime();
        if (time >= profileLockTimeout) {
          props.updateReduxProfileLockStatus(true);
        } else {
          setTimeout(checkProfileLockTimeout, 1000);
        }
      } catch (err) {
        console.error(err);
        props.updateReduxProfileLockStatus(false);
      }
    };

    const checkWatermarkData = async () => {
      let newData = await getObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY);
      if (!(newData === undefined || newData === null)) {
        props.updateReduxMediaKitWatermarkData(newData);
      } else if (currentUser !== null) {
        props.updateReduxMediaKitWatermarkData({
          name: currentUser?.name ? currentUser?.name : "",
          phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
          url: currentUser?.name
            ? `https://${webreferral}${currentUser?.name}`
            : "",
        });
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
          <TabNavigator token={token} currentUser={currentUser} />
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
          <Top token={token} currentUser={currentUser} />
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
  profileLock: store.userState.profileLock,
  profileLockTimeout: store.userState.profileLockTimeout,
  profilePIN: store.userState.profilePIN,
  products: store.productState.products,
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
      setNewToken,
      disableForceLogout,
      clearMediaKitData,
      updateReduxMediaKitWatermarkData,
      updateReduxMediaKitPhotosUri,
      clearCartError,
      updateReduxProfileLockStatus,
      updateReduxProfilePIN,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
