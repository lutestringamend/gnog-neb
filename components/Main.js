import React, { useEffect, useState } from "react";
import {
  Platform,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
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
} from "../axios/user";
import { clearMediaKitData } from "../axios/mediakit";
import { getObjectAsync, getTokenAsync } from "./asyncstorage";
import { overwriteWatermarkVideos } from "./media";
import {
  ASYNC_MEDIA_WATERMARK_VIDEOS_KEY,
  ASYNC_PRODUCTS_ARRAY_KEY,
  ASYNC_USER_CURRENTUSER_KEY,
} from "./asyncstorage/constants";
import { clearCartError } from "../axios/cart";
import { sentryLog } from "../sentry";
import Top from "./Top";
import { colors } from "../styles/base";

function Main(props) {
  try {
    //const [isLogin, setLogin] = useState(false);
    //const [loadingUserData, setLoadingUserData] = useState(false);
    const [error, setError] = useState(null);
    //const [frozen, setFrozen] = useState(false);
    const { token, currentUser } = props;

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

    useEffect(() => {
      if (props.maxIndex > 0) {
        console.log("redux products maxIndex", props.maxIndex);
      }
    }, [props.maxIndex]);

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
      console.log("redux token", token);
      console.log("redux currentuser", currentUser);
    }, [token, currentUser]);

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
        const storageWatermarkVideos = await getObjectAsync(
          ASYNC_MEDIA_WATERMARK_VIDEOS_KEY
        );
        props.overwriteWatermarkVideos(storageWatermarkVideos);
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
          <Top token={token} currentUser={currentUser} />
        </SafeAreaView>
      );
    }
  } catch (e) {
    sentryLog(e);
    return <SplashScreen errorText={e.toString()} />;
  }
}

/*
          {Platform.OS === "web" ? (
            <TabNavigator token={token} currentUser={currentUser} />
          ) : (
            <Top token={token} currentUser={currentUser} />
          )}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
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
  products: store.productState.products,
  maxIndex: store.productState.maxIndex,
  loginToken: store.userState.loginToken,
  registerToken: store.userState.registerToken,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getProductData,
      clearData,
      getCurrentUser,
      clearUserData,
      setNewToken,
      overwriteWatermarkVideos,
      disableForceLogout,
      clearMediaKitData,
      clearCartError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
