import * as Location from "expo-location";
import { sentryLog } from "../../sentry";

import { googleAPIdevkey } from "../../axios/constants";
import {
  locationnull,
  locationpermissionnotgranted,
  locationundefined,
} from "./constants";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_RAJAONGKIR_KOTA_KEY, ASYNC_RAJAONGKIR_PROVINSI_KEY } from "../asyncstorage/constants";
import { fetchRajaOngkir } from "../../axios/address";

export const processLocalesIntoAddressData = async (
  props,
  token,
  latitude,
  longitude,
  provinsi,
  kota,
  addressText,
  regionText,
  postalCode
) => {
  let result = {
    alamat: `${addressText ? addressText : ""}`,
    kode_pos: postalCode ? postalCode.toString() : "",
    provinsi_id: "",
    kota_id: "",
    kecamatan_id: "",
    lat: latitude ? latitude.toString() : "",
    long: longitude ? longitude.toString() : "",
    provinsi_name: "",
    kota_name: "",
    kecamatan_name: "",
  };

  try {
    if (props === undefined || props === null || provinsi === undefined || provinsi === null || provinsi === "") {
      return result;
    }

    let storageProvinsi = await getObjectAsync(ASYNC_RAJAONGKIR_PROVINSI_KEY);
    if (storageProvinsi === undefined || storageProvinsi === null || storageProvinsi?.length === undefined) {
      storageProvinsi = await fetchRajaOngkir(token, "provinsi");
      if (storageProvinsi === undefined || storageProvinsi === null || storageProvinsi?.length === undefined) {
        return result;
      }
    }

    let searchProvinsiName = convertProvinsiNametoRajaOngkirName(provinsi);
    const provinsiFind = storageProvinsi.find(({ name }) => name.toLowerCase() === searchProvinsiName);
    if (provinsiFind === undefined || provinsiFind === null || provinsiFind?.id === undefined) {
      return result;
    }
    result["provinsi_id"] = provinsiFind?.id;
    result["provinsi_name"] = provinsiFind?.name;
    props.updateReduxRajaOngkirWithKey("kota", null);
    props.updateReduxRajaOngkirWithKey("kecamatan", null);

    let storageKota = await getObjectAsync(ASYNC_RAJAONGKIR_KOTA_KEY);
    let kotaArray = [];
    if (storageKota === undefined || storageKota === null || storageKota?.length === undefined) {
      kotaArray = await fetchRajaOngkir(
        token,
        "kota",
        "provinsi_id",
        provinsiFind?.id
      );
    } else {
      let searchStorageKota = storageKota.find(({ provinsi_id }) => provinsi_id === provinsiFind?.id.toString());
      console.log("storageKota", storageKota, provinsiFind?.id, searchStorageKota);
      if (searchStorageKota === undefined || searchStorageKota === null || searchStorageKota?.data === undefined) {
        kotaArray = await fetchRajaOngkir(
          token,
          "kota",
          "provinsi_id",
          provinsiFind?.id
        );
      } else {
        kotaArray = searchStorageKota?.data;
      }
    }

    if (kotaArray === undefined || kotaArray === null || kotaArray?.length === undefined) {
      return result;
    }
    props.updateReduxRajaOngkirWithKey("kota", kotaArray);
    let searchKotaName = convertKotaNametoRajaOngkirName(kota);
    const kotaFind = kotaArray.find(({ name }) => name.toLowerCase() === searchKotaName);
    if (kotaFind === undefined || kotaFind === null || kotaFind?.id === undefined) {
      return result;
    }
    result["kota_id"] = kotaFind?.id;
    result["kota_name"] = kotaFind?.name;

  } catch (e) {
    console.error(e);
  }
  return result;
};

export const convertProvinsiNametoRajaOngkirName = (provinsi) => {
  let searchProvinsiName = provinsi.toLowerCase();
  if (searchProvinsiName === "daerah khusus ibukota jakarta") {
    searchProvinsiName = "dki jakarta";
  } else if (searchProvinsiName === "daerah istimewa yogyakarta") {
    searchProvinsiName = "di yogyakarta";
  } else if (searchProvinsiName === "east nusa tenggara") {
    searchProvinsiName = "nusa tenggara timur (ntt)";
  } else if (searchProvinsiName === "west nusa tenggara") {
    searchProvinsiName = "nusa tenggara barat (ntb)";
  } else if (searchProvinsiName === "aceh") {
    searchProvinsiName = "nanggroe aceh darussalam (nad)";
  } else if (searchProvinsiName === "west java") {
    searchProvinsiName = "jawa barat";
  } else if (searchProvinsiName === "central java") {
    searchProvinsiName = "jawa tengah";
  } else if (searchProvinsiName === "east java") {
    searchProvinsiName = "jawa timur";
  }
  return searchProvinsiName;
}

export const convertKotaNametoRajaOngkirName = (kota) => {
  let searchKotaName = kota.toLowerCase();
  if (searchKotaName === "bandung city") {
    searchKotaName = "kota bandung";
  }
  return searchKotaName;
}

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
      accuracy: accuracy ? accuracy : Location.Accuracy.BestForNavigation,
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

export const getAddressText = (locales) => {
  if (
    locales === null ||
    locales?.length === undefined ||
    locales?.length < 1
  ) {
    return null;
  }
  let text = locales[0]?.name;

  if (locales?.length > 1 && (text === null || text.includes("+"))) {
    for (let i = 1; i < locales?.length; i++) {
      if (
        !(
          locales[i]?.name === undefined ||
          locales[i]?.name === null ||
          locales[i]?.name.includes("+")
        )
      ) {
        return locales[i]?.name;
      }
    }
  }

  return text;
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
};