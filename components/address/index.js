import * as Location from "expo-location";
import { sentryLog } from "../../sentry";

import { googleAPIdevkey } from "../../axios/constants";
import {
    locationnull,
    locationpermissionnotgranted,
    locationundefined,
  } from "./constants";

export const requestLocationForegroundPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("foregroundLocation status", status);
      return status === "granted";
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  
  export const initializeLocation = async (accuracy) => {
    let locationPermission = await requestLocationForegroundPermission();
    if (!locationPermission) {
      return { location: null, locationError: locationpermissionnotgranted };
    }
  
    try {
      Location.setGoogleApiKey(googleAPIdevkey);
      let location = await Location.getCurrentPositionAsync({
        accuracy: accuracy ? accuracy : Location.Accuracy.High,
        distanceInterval: 20,
        mayShowUserSettingsDialog: true,
        timeInterval: 30000,
      });
      //startGeofencing();
      return { location, locationError: null };
    } catch (e) {
      console.error(e);
      //sentryLog(e);
      return { location: null, locationError: locationundefined };
    }
  };
  
  export const getLocales = async (location) => {
    try {
      Location.setGoogleApiKey(googleAPIdevkey);
      let result = await Location.reverseGeocodeAsync(location, {
        useGoogleMaps: true,
      });
      return result;
    } catch (e) {
      console.error(e);
      //sentryLog(e);
      return null;
    }
  };

export const checkIfCoordIsStringThenParse = (coord) => {
    try {
      if (typeof coord === "string") {
        return parseFloat(coord);
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
    }
    return coord;
  }