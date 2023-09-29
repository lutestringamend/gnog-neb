import * as Location from "expo-location";
import { sentryLog } from "../../sentry";

import { googleAPIkey } from "../../axios/constants";
import {
  locationnull,
  locationpermissionnotgranted,
  locationundefined,
} from "./constants";
import { getObjectAsync } from "../asyncstorage";
import {
  ASYNC_RAJAONGKIR_KECAMATAN_KEY,
  ASYNC_RAJAONGKIR_KOTA_KEY,
  ASYNC_RAJAONGKIR_PROVINSI_KEY,
} from "../asyncstorage/constants";
import { fetchRajaOngkir } from "../../axios/address";

export const getKecamatanFromPlacesData = (data, detail) => {
  let result = {
    data: null,
    detail: null,
    dataAlamat: null,
    detailAlamat: null,
  };
  try {
    if (detail?.address_components?.length > 0) {
      let isFound = false;
      let detailAlamat = null;
      for (let ad of detail?.address_components) {
        if (ad?.long_name?.toLowerCase().includes("kecamatan")) {
          result["detail"] = ad?.long_name.substr(10, ad?.long_name?.length);
          isFound = true;
        } else if (!isFound) {
          detailAlamat = `${detailAlamat ? `${detailAlamat} ` : ""}${
            ad?.long_name
          }`;
        }
      }
      result["detailAlamat"] = detailAlamat;
    }
    if (data?.terms?.length > 3) {
      let dataAlamat = null;
      for (let i = 0; i < data?.terms?.length - 3; i++) {
        if (i === data?.terms?.length - 4) {
          result["data"] = data?.terms[i]?.value.toString();
        } else {
          dataAlamat = `${dataAlamat ? `${dataAlamat} ` : ""}${data?.terms[
            i
          ]?.value.toString()}`;
        }
      }
      result["dataAlamat"] = dataAlamat;
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const processLocalesIntoAddressData = async (
  props,
  token,
  latitude,
  longitude,
  provinsi,
  kota,
  addressText,
  regionText,
  postalCode,
  kecamatanData
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
    if (
      props === undefined ||
      props === null ||
      provinsi === undefined ||
      provinsi === null ||
      provinsi === ""
    ) {
      return result;
    }

    let storageProvinsi = await getObjectAsync(ASYNC_RAJAONGKIR_PROVINSI_KEY);
    if (
      storageProvinsi === undefined ||
      storageProvinsi === null ||
      storageProvinsi?.length === undefined
    ) {
      storageProvinsi = await fetchRajaOngkir(token, "provinsi");
      if (
        storageProvinsi === undefined ||
        storageProvinsi === null ||
        storageProvinsi?.length === undefined
      ) {
        return result;
      }
    }

    let searchProvinsiName = convertProvinsiNametoRajaOngkirName(provinsi);
    const provinsiFind = storageProvinsi.find(
      ({ name }) => name.toLowerCase() === searchProvinsiName
    );
    if (
      provinsiFind === undefined ||
      provinsiFind === null ||
      provinsiFind?.id === undefined
    ) {
      return result;
    }
    result["provinsi_id"] = provinsiFind?.id;
    result["provinsi_name"] = provinsiFind?.name;
    props.updateReduxRajaOngkirWithKey("kota", null);
    props.updateReduxRajaOngkirWithKey("kecamatan", null);

    let storageKota = await getObjectAsync(ASYNC_RAJAONGKIR_KOTA_KEY);
    let kotaArray = [];
    if (
      storageKota === undefined ||
      storageKota === null ||
      storageKota?.length === undefined
    ) {
      kotaArray = await fetchRajaOngkir(
        token,
        "kota",
        "provinsi_id",
        provinsiFind?.id
      );
    } else {
      let searchStorageKota = storageKota.find(
        ({ provinsi_id }) => provinsi_id === provinsiFind?.id.toString()
      );
      console.log(
        "storageKota",
        storageKota,
        provinsiFind?.id,
        searchStorageKota
      );
      if (
        searchStorageKota === undefined ||
        searchStorageKota === null ||
        searchStorageKota?.data === undefined
      ) {
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

    if (
      kotaArray === undefined ||
      kotaArray === null ||
      kotaArray?.length === undefined
    ) {
      return result;
    }
    props.updateReduxRajaOngkirWithKey("kota", kotaArray);
    let searchKotaName = convertKotaNametoRajaOngkirName(kota);
    const kotaFind = kotaArray.find(
      ({ name }) => name.toLowerCase() === searchKotaName
    );
    if (
      kotaFind === undefined ||
      kotaFind === null ||
      kotaFind?.id === undefined
    ) {
      return result;
    }
    result["kota_id"] = kotaFind?.id;
    result["kota_name"] = kotaFind?.name;

    console.log("processing kecamatanData", kecamatanData);
    if (
      kecamatanData === null ||
      kecamatanData?.data === undefined ||
      kecamatanData?.detail === undefined ||
      (kecamatanData?.data === null && kecamatanData?.data === null)
    ) {
      return result;
    }
    let searchKecamatanName = kecamatanData?.detail
      ? kecamatanData?.detail.toLowerCase()
      : kecamatanData?.data.toLowerCase();

    let storageKecamatan = await getObjectAsync(ASYNC_RAJAONGKIR_KECAMATAN_KEY);
    let kecamatanArray = [];
    if (
      storageKecamatan === undefined ||
      storageKecamatan === null ||
      storageKecamatan?.length === undefined
    ) {
      kecamatanArray = await fetchRajaOngkir(
        token,
        "kecamatan",
        "kota_id",
        kotaFind?.id
      );
    } else {
      let searchStorageKecamatan = storageKecamatan.find(
        ({ kota_id }) => kota_id === kotaFind?.id.toString()
      );
      console.log(
        "storageKecamatan",
        storageKecamatan,
        kotaFind?.id,
        searchStorageKecamatan
      );
      if (
        searchStorageKecamatan === undefined ||
        searchStorageKecamatan === null ||
        searchStorageKecamatan?.data === undefined
      ) {
        kecamatanArray = await fetchRajaOngkir(
          token,
          "kecamatan",
          "kota_id",
          kotaFind?.id
        );
      } else {
        kecamatanArray = searchStorageKecamatan?.data;
      }
    }

    if (
      kecamatanArray === undefined ||
      kecamatanArray === null ||
      kecamatanArray?.length === undefined
    ) {
      return result;
    }
    props.updateReduxRajaOngkirWithKey("kecamatan", kecamatanArray);
    const kecamatanFind = kecamatanArray.find(
      ({ name }) => name.toLowerCase() === searchKecamatanName
    );
    if (
      kecamatanFind === undefined ||
      kecamatanFind === null ||
      kecamatanFind?.id === undefined
    ) {
      return result;
    }
    result["kecamatan_id"] = kecamatanFind?.id;
    result["kecamatan_name"] = kecamatanFind?.name;

    if (
      kecamatanData?.dataAlamat === null &&
      kecamatanData?.detailAlamat === null
    ) {
      return result;
    }
    result["alamat"] = kecamatanData?.detailAlamat
      ? kecamatanData?.detailAlamat
      : kecamatanData?.dataAlamat
      ? kecamatanData?.dataAlamat
      : addressText;
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const convertProvinsiNametoRajaOngkirName = (provinsi) => {
  let searchProvinsiName = provinsi.toLowerCase();
  if (searchProvinsiName === "daerah khusus ibukota jakarta" || searchProvinsiName === "jakarta") {
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
};

export const convertKotaNametoRajaOngkirName = (kota) => {
  let searchKotaName = kota.toLowerCase();
  if (searchKotaName === "bandung city") {
    searchKotaName = "kota bandung";
  }
  return searchKotaName;
};

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
    Location.setGoogleApiKey(googleAPIkey);
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
    Location.setGoogleApiKey(googleAPIkey);
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
