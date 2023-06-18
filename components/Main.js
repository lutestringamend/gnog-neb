import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SplashScreen from "./Splash";
import TabNavigator from "./bottomnav/TabNavigator";
import { getProductData, clearData } from "../axios/product";
import {
  setNewToken,
  getCurrentUser,
  clearUserData,
  userLogout,
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

function Main(props) {
  try {
    const [isLogin, setLogin] = useState(false);
    const [loadingUserData, setLoadingUserData] = useState(false);
    const [frozen, setFrozen] = useState(false);
    const { token, currentUser } = props;

    useEffect(() => {
      const readStorageProducts = async () => {
        const storageProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
        props.getProductData(storageProducts, 0);
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
      const readStorageToken = async () => {
        const storageToken = await getTokenAsync();
        if (
          storageToken === undefined ||
          storageToken === null ||
          storageToken === ""
        ) {
          console.log("storageToken null", storageToken);
          setLoadingUserData(false);
          setLogin(false);
        } else {
          //setLogin(null);
          readStorageCurrentUser(storageToken);
        }
      };

      const readStorageCurrentUser = async (token) => {
        if (token === null || token === undefined || token === "") {
          props.clearUserData();
          props.clearMediaKitData();
          setLogin(false);
        } else {
          try {
            const storageCurrentUser = await getObjectAsync(
              ASYNC_USER_CURRENTUSER_KEY
            );
            props.setNewToken(token, storageCurrentUser);
            const storageWatermarkVideos = await getObjectAsync(
              ASYNC_MEDIA_WATERMARK_VIDEOS_KEY
            );
            props.overwriteWatermarkVideos(storageWatermarkVideos);
          } catch (e) {
            console.error(e);
            sentryLog(e);
          }
        }
        setLoadingUserData(false);
      };

      if (frozen) {
        if (
          (token === null || token === "") &&
          (currentUser === null || currentUser?.id === undefined)
        ) {
          props.disableForceLogout();
        }
      } else {
        //console.log({token: props.token, currentUser: props.currentUser});

        if ((token === null || token === "") && !loadingUserData && !frozen) {
          setLoadingUserData(true);
          readStorageToken();
        } else if (currentUser === null || currentUser?.id === undefined) {
          if (loadingUserData && !frozen) {
            //setLogin(null);
          } else {
            setLogin(false);
          }
        } else {
          setLogin(true);
        }
      }
    }, [token, currentUser]);

    useEffect(() => {
      const uponForceLogout = async () => {
        await userLogout();
        props.setNewToken(null, null);
        props.clearUserData(true);
        props.clearMediaKitData();
        setLoadingUserData(false);
        setLogin(false);
      };

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
      loadingUserData ||
      props.products === null ||
      props.products?.length === undefined ||
      props.products?.length < 1
    ) {
      return <SplashScreen />;
    } else {
      return (
        <TabNavigator login={isLogin} token={token} currentUser={currentUser} />
      );
    }
  } catch (error) {
    sentryLog(error);
    return <SplashScreen errorText={error.toString()} />;
  }
}

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  forceLogout: store.userState.forceLogout,
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
