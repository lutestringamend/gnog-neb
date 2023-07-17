import {
  USER_STATE_CHANGE,
  USER_TOKEN_STATE_CHANGE,
  USER_CART_STATE_CHANGE,
  USER_CART_ITEM_STATE_CHANGE,
  USER_ADDRESS_STATE_CHANGE,
  USER_MASTERKURIR_STATE_CHANGE,
  USER_RAJAONGKIR_STATE_CHANGE,
  USER_COURIERS_STATE_CHANGE,
  USER_CHECKOUT_STATE_CHANGE,
  USER_ADDRESS_STATE_CLEAR,
  USER_AUTH_DATA_STATE_CHANGE,
  USER_AUTH_ERROR_STATE_CHANGE,
  USER_AUTH_DELETE_STATE_CHANGE,
  USER_LOGIN_TOKEN_STATE_CHANGE,
  USER_REGISTER_TOKEN_STATE_CHANGE,
  USER_UPDATE_STATE_CHANGE,
  USER_BANKS_STATE_CHANGE,
  USER_ADDRESS_UPDATE_STATE_CHANGE,
  USER_OTP_STATE_CHANGE,
  USER_OTP_VALIDATION_STATE_CHANGE,
  CLEAR_USER_DATA,
  DISABLE_FORCE_LOGOUT,
  ENABLE_FORCE_LOGOUT,
  USER_HPV_STATE_CHANGE,
  USER_POINTS_STATE_CHANGE,
  USER_SYARAT_ROOT_STATE_CHANGE,
  USER_CART_STATE_ERROR,
} from "../constants";

import { mainhttp } from "../../axios/constants";

export const initialState = {
  token: null,
  currentUser: null,
  hpv: null,
  points: null,
  syaratRoot: [],
  cart: null,
  cartError: null,
  currentAddress: null,
  masterkurir: [],
  couriers: [],
  rajaongkir: {
    provinsi: null,
    kota: null,
    kecamatan: null,
  },
  checkout: null,
  authData: {
    email: null,
    password: null,
    name: null,
    nomor_telp: null,
    referral: null,
  },
  authError: null,
  authDelete: null,
  loginToken: null,
  registerToken: null,
  userUpdate: null,
  addressUpdate: null,
  banks: [],
  phoneOTP: {
    session: "",
    message: "",
    timeout: null,
  },
  validationOTP: {
    session: "",
    message: "",
  },
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: {
          ...action.data,
          email: checkEmpty(action.data?.email),
          nomor_telp: checkEmpty(action.data?.nomor_telp),
          detail_user: {
            ...action.data?.detail_user,
            foto:
              action.data?.detail_user?.foto === mainhttp
                ? ""
                : checkEmpty(action.data?.detail_user?.foto),
            nama_lengkap: checkEmpty(action.data?.detail_user?.nama_lengkap),
            nama_depan: checkEmpty(action.data?.detail_user?.nama_depan),
            nama_belakang: checkEmpty(action.data?.detail_user?.nama_belakang),
            jenis_kelamin: checkEmpty(action.data?.detail_user?.jenis_kelamin),
            tanggal_lahir: checkEmpty(action.data?.detail_user?.tanggal_lahir),
            nomor_rekening: checkEmpty(
              action.data?.detail_user?.nomor_rekening
            ),
            cabang_bank: checkEmpty(action.data?.detail_user?.cabang_bank),
            bank: {
              ...action.data?.detail_user?.bank,
              id: checkEmpty(action.data?.detail_user?.bank?.id),
              nama: checkEmpty(action.data?.detail_user?.bank?.nama),
            },
          },
        },
      };
    case USER_TOKEN_STATE_CHANGE:
      return {
        ...state,
        token: action.token,
      };
    case USER_HPV_STATE_CHANGE:
      return {
        ...state,
        hpv: action.data,
      };
    case USER_POINTS_STATE_CHANGE:
      return {
        ...state,
        points: action.data,
      };
    case USER_SYARAT_ROOT_STATE_CHANGE:
      return {
        ...state,
        syaratRoot: action.data,
      };
    case USER_CART_STATE_CHANGE:
      return {
        ...state,
        cart: action.data,
      };
    case USER_CART_STATE_ERROR:
      return {
        ...state,
        cartError: action.data,
      };
    case USER_CART_ITEM_STATE_CHANGE:
      return {
        ...state,
        cart: {
          ...state.cart,
          jumlah_produk:
            state.cart.jumlah_produk > 0 ? state.cart.jumlah_produk - 1 : 0,
          produk: state.cart.produk.map((item) =>
            item.id === action.produk_id ? action.data : item
          ),
        },
      };
    case USER_ADDRESS_STATE_CHANGE:
      return {
        ...state,
        currentAddress: {
          nomor_telp: checkEmpty(action.data?.nomor_telp),
          email: checkEmpty(action.data?.email),
          alamat: checkEmpty(action.data?.detail_user?.alamat),
          alamat_short: checkEmpty(action.data?.detail_user?.alamat),
          nama_depan: checkEmpty(action.data?.detail_user?.nama_depan),
          nama_belakang: checkEmpty(action.data?.detail_user?.nama_belakang),
          desa: checkEmpty(action.data?.detail_user?.desa),
          kode_pos: checkEmpty(action.data?.detail_user?.kode_pos),
          catatan: checkEmpty(action.data?.detail_user?.catatan),
          alamat_lain: false,
          provinsi: action.data?.detail_user?.provinsi
            ? action.data?.detail_user?.provinsi
            : { id: "" },
          kota: action.data?.detail_user?.kota
            ? action.data?.detail_user?.kota
            : { id: "" },
          kecamatan: action.data?.detail_user?.kecamatan
            ? action.data?.detail_user?.kecamatan
            : { id: "" },
          lat: action.data?.detail_user?.lat,
          long: action.data?.detail_user?.long,
        },
      };
    case USER_MASTERKURIR_STATE_CHANGE:
      return {
        ...state,
        masterkurir: action.data,
      };
    case USER_RAJAONGKIR_STATE_CHANGE:
      return {
        ...state,
        rajaongkir: { ...state.rajaongkir, [action.key]: action.data },
      };
    case USER_COURIERS_STATE_CHANGE:
      return {
        ...state,
        couriers: action.data,
      };
    case USER_ADDRESS_STATE_CLEAR:
      return {
        ...state,
        currentAddress: null,
      };
    case USER_CHECKOUT_STATE_CHANGE:
      return {
        ...state,
        checkout: action.data,
        cart: action.clearCart ? null : state.cart,
      };
    case USER_AUTH_DATA_STATE_CHANGE:
      return {
        ...state,
        authData: action.data,
      };
    case USER_AUTH_ERROR_STATE_CHANGE:
      return {
        ...state,
        authError: action.data,
      };
    case USER_AUTH_DELETE_STATE_CHANGE:
      return {
        ...state,
        authDelete: action.data,
      };
    case USER_LOGIN_TOKEN_STATE_CHANGE:
      return {
        ...state,
        loginToken: action.token,
      };
    case USER_REGISTER_TOKEN_STATE_CHANGE:
      return {
        ...state,
        registerToken: action.token,
      };
    case USER_UPDATE_STATE_CHANGE:
      return {
        ...state,
        userUpdate: action.data,
      };
    case USER_ADDRESS_UPDATE_STATE_CHANGE:
      return {
        ...state,
        addressUpdate: action.data,
      };
    case USER_BANKS_STATE_CHANGE:
      return {
        ...state,
        banks: action.data,
      };
    case USER_OTP_STATE_CHANGE:
      return {
        ...state,
        phoneOTP: action.data,
      };
    case USER_OTP_VALIDATION_STATE_CHANGE:
      return {
        ...state,
        validationOTP: action.data,
      };
    case CLEAR_USER_DATA:
      return initialState;
    default:
      return state;
  }
};

export function checkEmpty(string) {
  return string ? string : "";
}
