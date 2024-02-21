import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_USER_TOKEN_KEY } from "./constants";
import { sentryLog } from "../../sentry";

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
      //await AsyncStorage.setItem(ASYNC_USER_TOKEN_KEY, null);
      await AsyncStorage.removeItem(ASYNC_USER_TOKEN_KEY);
      console.log(`storage token set to null`);
    } else {
      await AsyncStorage.setItem(ASYNC_USER_TOKEN_KEY, token);
      console.log(`storage token updated`);
    }
  } catch (error) {
    console.error(error);
    sentryLog(error);
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
      console.log(`storage token read`);
      return token;
    }
  } catch (error) {
    console.error(error);
    sentryLog(error);
  }
  console.log(`storage token null`);
  return null;
};

export const setObjectAsync = async (key, object) => {
  //console.log(`setObjectAsync ${key}`);
  try {
    if (object === undefined || object === null) {
      //await AsyncStorage.setItem(key, null);
      await AsyncStorage.removeItem(key);
      console.log(`asyncstorage ${key} set to null and removed`);
    } else {
      const jsonValue = JSON.stringify(object);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`asyncstorage ${key} saved`);
    }
  } catch (error) {
    console.error(error);
    sentryLog(error);
  }
};

export const getObjectAsync = async (key) => {
  //console.log(`getObjectAsync ${key}`);
  try {
    let jsonValue = await AsyncStorage.getItem(key);
    if (
      jsonValue !== null &&
      jsonValue !== undefined &&
      jsonValue !== "" &&
      jsonValue !== "null"
    ) {
      console.log(`asyncstorage ${key} read`);
      if (typeof jsonValue === "string" || jsonValue instanceof String) {
        return JSON.parse(jsonValue);
      } else {
        return jsonValue;
      }
    }
  } catch (error) {
    console.error(error);
    sentryLog(error);
  }
  console.log(`asyncstorage ${key} is null`);
  return null;
};
