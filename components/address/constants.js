import {
    defaultlatitude,
    defaultlatitudedelta,
    defaultlongitude,
    defaultlongitudedelta,
  } from "../../axios/constants";
  
  export const defaultRegion = {
    latitude: defaultlatitude,
    longitude: defaultlongitude,
    latitudeDelta: defaultlatitudedelta,
    longitudeDelta: defaultlongitudedelta,
  };

export const selectprovinsi = "Pilih Provinsi";
export const selectkota = "Pilih Kota / Kabupaten";
export const selectkecamatan = "Pilih Kecamatan";
export const mapplacesplaceholder = "Lokasi di Indonesia";

export const locationpermissionnotgranted = "Layanan GPS tidak diizinkan";
export const locationnull = "Lokasi tidak terdeteksi";
export const locationstillfinding = "Mencari lokasi...";
export const locationlocaleundefined = "Layanan GPS aktif";
export const locationundefined = "Layanan GPS tidak aktif";
export const locationunselected = "Belum dipilih";
export const locationgpsheader = "Posisi GPS";