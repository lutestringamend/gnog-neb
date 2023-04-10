import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Sentry from "sentry-expo";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SplashScreen from "./Splash";
import TabNavigator from "./bottomnav/TabNavigator";
import { getProductData, clearData } from "../axios/product";
import { setNewToken, getCurrentUser, clearUserData, userLogout, disableForceLogout } from "../axios/user";
import { getObjectAsync, getTokenAsync } from "./asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY, ASYNC_USER_CURRENTUSER_KEY } from "./asyncstorage/constants";


function Main(props) {
  try {
    const [isLogin, setLogin] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(false);
    const [frozen, setFrozen] = useState(false);

    useEffect(() => {
      const readStorageProducts = async () => {
        const storageProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
        props.getProductData(storageProducts);
      }

      if (
        props.products === null ||
        props.products?.length === undefined ||
        props.products?.length < 1
      ) {
        readStorageProducts();
      } 
    }, [props.products]);

    useEffect(() => {
      const readStorageToken = async () => {
        const storageToken = await getTokenAsync();
        if (storageToken === null || storageToken === undefined) {
          console.log("all tokens null");
          setLoadingUserData(false);
          setLogin(false);
        } else {
          setLogin(null);
          readStorageCurrentUser(storageToken);
        }
      };

      const readStorageCurrentUser = async (token) => {
        if (token === null || token === undefined || token === "" || token === "null") {
          props.clearUserData();
          setLogin(false);
        } else {
          const storageCurrentUser = await getObjectAsync(ASYNC_USER_CURRENTUSER_KEY);
          props.setNewToken(token, storageCurrentUser);
        }
        setLoadingUserData(false);
      }

      if (frozen) {
        if (props.token === null && props.currentUser === null) {
          props.disableForceLogout();
        }
      } else {
        //console.log({token: props.token, currentUser: props.currentUser});

        if ((props.token === null || props.token === "") && !loadingUserData && !frozen) {
           setLoadingUserData(true);
           readStorageToken();
         } else if (
           props.currentUser === null ||
           props.currentUser?.id === undefined ||
           props.currentUser?.id === null
         ) {
           if (loadingUserData && !frozen) {
             setLogin(null);
           } else {
             setLogin(false);
           }
         } else {
           setLogin(true);
         }
      }

    }, [props.token, props.currentUser]);

    useEffect(() => {
      const uponForceLogout = async () => {
        await userLogout();
        props.clearUserData(true);
        setLoadingUserData(false);
        setLogin(false);
      }

      /*const restoreProductData = async () => {
        console.log("restoreProductData");
        await setObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY, props.products);
        setFrozen(false);
      }*/

      //console.log({forceLogout: props.forceLogout, frozen});

      if (props.forceLogout) {
        if (frozen) {
          uponForceLogout();
        } else {
          setFrozen(true);
        } 
      } else {
        if (frozen) {
          setFrozen(false);
        }
      }
    }, [props.forceLogout, frozen]);

    if (
      isLogin === null ||
      loadingUserData || 
      props.products === null ||
      props.products?.length === undefined ||
      props.products?.length < 1 
    ) {
      return <SplashScreen />;
    } else {
      return <TabNavigator login={isLogin} />;
    }
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }

    return <SplashScreen errorText={error.message} />;
  }
}

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  forceLogout: store.userState.forceLogout,
  products: store.productState.products,
  loginToken: store.userState.loginToken,
  registerToken: store.userState.registerToken,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { getProductData, clearData, getCurrentUser, clearUserData, setNewToken, disableForceLogout },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
