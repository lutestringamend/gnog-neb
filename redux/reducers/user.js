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
  USER_ADDRESSES_STATE_CHANGE,
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
  USER_HPV_STATE_CHANGE,
  USER_POINTS_STATE_CHANGE,
  USER_SYARAT_ROOT_STATE_CHANGE,
  USER_CART_STATE_ERROR,
  USER_SALDO_STATE_CHANGE,
  USER_PROFILE_LOCK_STATE_CHANGE,
  USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE,
  USER_PROFILE_PIN_STATE_CHANGE,
  USER_REGISTER_SNAP_TOKEN_STATE_CHANGE,
  USER_ADDRESS_ID_STATE_CHANGE,
  USER_ADDRESSES_INCREMENT,
  USER_TEMP_CART_STATE_CHANGE,
  USER_TEMP_CART_ITEM_STATE_CHANGE,
  USER_TEMP_CART_NEW_ITEM_CHANGE,
  USER_RECRUITMENT_DEADLINE_STATE_CHANGE,
  USER_REG_DATE_IN_MS_STATE_CHANGE,
  USER_CHECKOUT_ERROR_STATE_CHANGE,
  USER_RIWAYAT_SALDO_STATE_CHANGE,
  USER_HPV_ARRAY_STATE_CHANGE,
  USER_HPV_ARRAY_INCREMENT_STATE_CHANGE,
  USER_HPV_TOTAL_REKRUTMEN_STATE_CHANGE,
  USER_PROFILE_PICTURE_STATE_CHANGE,
  USER_SALDO_AKUMULASI_STATE_CHANGE,
} from "../constants";

import { mainhttp, recruitmenttarget } from "../../axios/constants";
import { determineCountdownColor } from "../../axios/user";

export const initialState = {
  token: null,
  currentUser: null,
  registerSnapToken: null,
  profileLock: true,
  profileLockTimeout: null,
  profilePIN: null,
  profilePicture: null,
  regDateInMs: null,
  recruitmentDeadline: null,
  addresses: null,
  addressId: null,
  hpv: null,
  hpvArray: [],
  hpvTotalRekrutmen: 0,
  points: null,
  syaratRoot: [],
  saldo: null,
  riwayatSaldo: null,
  saldoAkumulasi: null,
  cart: null,
  cartError: null,
  tempCart: [],
  currentAddress: null,
  masterkurir: [],
  couriers: [],
  rajaongkir: {
    provinsi: null,
    kota: null,
    kecamatan: null,
  },
  checkout: null,
  checkoutError: null,
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
          countdownColor: determineCountdownColor(
            action.data?.batas_rekrut,
            action.data?.target_rekrutmen_latest ? action.data?.target_rekrutmen_latest ? action.data?.target_rekrutmen_latest?.target_reseller : recruitmenttarget : recruitmenttarget
          ),
          bank_set: !(
            checkEmpty(action.data?.detail_user?.bank?.id) === "" ||
            checkEmpty(action.data?.detail_user?.bank?.nama) === "" ||
            checkEmpty(action.data?.detail_user?.nomor_rekening) === ""
          ),
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
          isActive: !(
            action.data?.status_member === undefined ||
            action.data?.status_member === null ||
            action.data?.status_member !== "premium" ||
            action.data?.status === undefined ||
            action.data?.status === null ||
            action.data?.nomor_telp_verified_at === undefined ||
            action.data?.nomor_telp_verified_at === null ||
            action.data?.nomor_telp_verified_at === ""
          ),
          join_date: action.data?.join_date
            ? action.data?.join_date
            : action.data?.target_rekrutmen_latest
            ? action.data?.target_rekrutmen_latest?.tgl_mulai
              ? action.data?.target_rekrutmen_latest?.tgl_mulai
              : null
            : null,
        },
      };
    case USER_TOKEN_STATE_CHANGE:
      return {
        ...state,
        token: action.token,
      };
    case USER_REGISTER_SNAP_TOKEN_STATE_CHANGE:
      return {
        ...state,
        registerSnapToken: action.data,
      };
    case USER_PROFILE_LOCK_STATE_CHANGE:
      return {
        ...state,
        profileLock: action.data,
      };
    case USER_PROFILE_LOCK_TIMEOUT_STATE_CHANGE:
      return {
        ...state,
        profileLockTimeout: action.data,
      };
    case USER_PROFILE_PIN_STATE_CHANGE:
      return {
        ...state,
        profilePIN: action.data,
      };
    case USER_REG_DATE_IN_MS_STATE_CHANGE:
      return {
        ...state,
        regDateInMs: action.data,
      };
    case USER_PROFILE_PICTURE_STATE_CHANGE:
      return {
        ...state,
        profilePicture: action.data,
      };
    case USER_RECRUITMENT_DEADLINE_STATE_CHANGE:
      return {
        ...state,
        recruitmentDeadline: action.data,
      };
    case USER_HPV_STATE_CHANGE:
      return {
        ...state,
        hpv: action.data,
      };
    case USER_HPV_ARRAY_STATE_CHANGE:
      return {
        ...state,
        hpvArray: action.data,
      };
    case USER_HPV_ARRAY_INCREMENT_STATE_CHANGE:
      return {
        ...state,
        hpvArray: [...state.hpvArray].concat(action.data),
      };
    case USER_HPV_TOTAL_REKRUTMEN_STATE_CHANGE:
      return {
        ...state,
        hpvTotalRekrutmen: action.data,
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
    case USER_SALDO_STATE_CHANGE:
      return {
        ...state,
        saldo: action.data,
      };
    case USER_SALDO_AKUMULASI_STATE_CHANGE:
      return {
        ...state,
        saldoAkumulasi: action.data,
      };     
    case USER_RIWAYAT_SALDO_STATE_CHANGE:
      return {
        ...state,
        riwayatSaldo: action.data,
      };
    case USER_CART_STATE_CHANGE:
      return {
        ...state,
        cart: action.data,
      };
    case USER_TEMP_CART_STATE_CHANGE:
      return {
        ...state,
        tempCart: action.data,
      };
    case USER_TEMP_CART_NEW_ITEM_CHANGE:
      return {
        ...state,
        tempCart:
          state.tempCart === null
            ? [
                {
                  id: action.id,
                  jumlah: action.data,
                },
              ]
            : [...state.tempCart].concat({
                id: action.id,
                jumlah: action.data,
              }),
      };
    case USER_TEMP_CART_ITEM_STATE_CHANGE:
      return {
        ...state,
        tempCart:
          state.tempCart === null
            ? [
                {
                  id: action.id,
                  jumlah: action.data,
                },
              ]
            : state.tempCart.map((item) =>
                item.id === action.id
                  ? {
                      id: item.id,
                      jumlah: action.data,
                    }
                  : item
              ),
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
    case USER_ADDRESSES_STATE_CHANGE:
      return {
        ...state,
        addresses: action.data,
      };
    case USER_ADDRESSES_INCREMENT:
      return {
        ...state,
        addresses: [...state.addresses].concat(action.data),
      };
    case USER_ADDRESS_ID_STATE_CHANGE:
      return {
        ...state,
        addressId: action.data,
      };
    case USER_ADDRESS_STATE_CHANGE:
      return {
        ...state,
        currentAddress: {
          nomor_telp: checkEmpty(action.data?.nomor_telp),
          email: checkEmpty(action.data?.email),
          alamat: checkEmpty(action.data?.detail_user?.alamat),
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
    case USER_CHECKOUT_ERROR_STATE_CHANGE:
      return {
        ...state,
        checkoutError: action.data,
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
