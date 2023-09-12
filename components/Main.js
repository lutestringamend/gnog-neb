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
} from "../axios/mediakit";
import { getObjectAsync, getTokenAsync } from "./asyncstorage";
import {
  ASYNC_MEDIA_WATERMARK_DATA_KEY,
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
  personalwebsiteurlshort,
  temprecruitmentdeadline,
} from "../axios/constants";
import { fetchRajaOngkir } from "../axios/address";
import { requestLocationForegroundPermission } from "./address";

function Main(props) {
  const [error, setError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [recruitmentTimer, setRecruitmentTimer] = useState(null);
  const appState = useRef(AppState.currentState);
  const {
    token,
    currentUser,
    profileLock,
    profileLockTimeout,
    profilePIN,
    watermarkData,
    addressId,
    addresses,
  } = props;

  try {
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
        console.log("redux products", props.products);
      }
    }, [props.products]);

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

      checkProfileLockTimeout();
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
          props.setNewToken(null, null);
          props.clearUserData();
          props.clearMediaKitData();
        } else {
          props.setNewToken(storageToken, storageCurrentUser, key);
          //props.login(storageCurrentUser?.name, key, false);
        }
      } catch (e) {
        console.error(e);
        userLogout();
        props.setNewToken(null, null);
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

        if (temprecruitmentdeadline - time > 0) {
          setRecruitmentTimer(temprecruitmentdeadline - time);
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
      let newData = await getObjectAsync(ASYNC_MEDIA_WATERMARK_DATA_KEY);
      if (!(newData === undefined || newData === null)) {
        props.updateReduxMediaKitWatermarkData(newData);
      } else if (currentUser !== null) {
        props.updateReduxMediaKitWatermarkData({
          name:
            currentUser?.detail_user === undefined ||
            currentUser?.detail_user?.nama_lengkap === undefined ||
            currentUser?.detail_user?.nama_lengkap === null ||
            currentUser?.detail_user?.nama_lengkap === ""
              ? currentUser?.name
                ? currentUser?.name
                : ""
              : currentUser?.detail_user?.nama_lengkap,
          phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
          url: currentUser?.name
            ? `${personalwebsiteurlshort}${currentUser?.name}`
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
    } else if (Platform.OS === "windows") {
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
  profileLock: store.userState.profileLock,
  addressId: store.userState.addressId,
  addresses: store.userState.addresses,
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
