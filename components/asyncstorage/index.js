import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "sentry-expo";
import { ASYNC_USER_TOKEN_KEY } from "./constants";

export const checkStorageKeys = async () => {
  const keys = await AsyncStorage.getAllKeys();
  return keys;
}

export const clearStorage = async () => {
  await AsyncStorage.clear();
  const keys = await checkStorageKeys();
  console.log("asyncstorage cleared, remaining keys", keys);
}

export const setTokenAsync = async (token) => {
  //console.log("setTokenAsync");
  try {
    if (
      token === "" ||
      token === "null" ||
      token === null ||
      token === undefined
    ) {
      await AsyncStorage.setItem(ASYNC_USER_TOKEN_KEY, null);
      await AsyncStorage.removeItem(ASYNC_USER_TOKEN_KEY);
      console.log(`asyncstorage ${ASYNC_USER_TOKEN_KEY} set to null and removed`);
    } else {
      await AsyncStorage.setItem(ASYNC_USER_TOKEN_KEY, token);
      console.log(`asyncstorage ${ASYNC_USER_TOKEN_KEY} saved`, token);
    }
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }
  }
};

export const getTokenAsync = async () => {
  //console.log("getTokenAsync");
  try {
    const token = await AsyncStorage.getItem(ASYNC_USER_TOKEN_KEY);
    if (
      token !== null &&
      token !== undefined &&
      token !== "" &&
      token !== "null"
    ) {
      console.log(`asyncstorage ${ASYNC_USER_TOKEN_KEY} read`, token);
      return token;
    }
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }
  }
  console.log(`asyncstorage ${ASYNC_USER_TOKEN_KEY} is null`);
  return null;
};

export const setObjectAsync = async (key, object) => {
  //console.log(`setObjectAsync ${key}`);
  try {
    if (object === null || object === undefined) {
      await AsyncStorage.setItem(key, null);
      await AsyncStorage.removeItem(key);
      console.log(`asyncstorage ${key} set to null and removed`);
    } else {
      const jsonValue = JSON.stringify(object);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`asyncstorage ${key} saved`);
    }
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }
  }
};

export const getObjectAsync = async (key) => {
  //console.log(`getObjectAsync ${key}`);
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (
      jsonValue !== null &&
      jsonValue !== undefined &&
      jsonValue !== "" &&
      jsonValue !== "null"
    ) {
      console.log(`asyncstorage ${key} read`);
      return JSON.parse(jsonValue);
    }
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }
  }
  console.log(`asyncstorage ${key} is null`);
  return null;
};
