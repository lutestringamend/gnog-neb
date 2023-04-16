import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  updateUserAddressData,
  callRajaOngkir,
  clearRajaOngkir,
} from "../../axios/address";
import AddressData from "./AddressData";
import BSTextInput from "../bottomsheets/BSTextInput";
import BSContainer from "../bottomsheets/BSContainer";
import { privacypolicy } from "../profile/constants";
import { selectprovinsi, selectkota, selectkecamatan } from "./constants";
import { colors, dimensions, staticDimensions } from "../../styles/base";

function FillAddress(props) {
  const [address, setAddress] = useState(AddressData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [bottomList, setBottomList] = useState([]);
  const [bottomTitle, setBottomTitle] = useState("");
  const [bottomKey, setBottomKey] = useState(null);
  const [inputNames, setInputNames] = useState({
    provinsi: "",
    kota: "",
    kecamatan: "",
  });

  const navigation = useNavigation();
  const rbSheet = useRef();

  useEffect(() => {
    if (
      props.token === null ||
      props.token === undefined ||
      props.token === ""
    ) {
      navigation.navigate("Login");
    }
  }, [props.token]);

  useEffect(() => {
    //console.log(props.currentAddress);
    if (props.currentAddress !== null && props.currentAddress !== undefined) {
      setLoading(true);
      setAddress({
        nama_lengkap:
          props.currentAddress?.nama_depan +
          " " +
          props.currentAddress?.nama_belakang,
        email: props.currentAddress?.email,
        nomor_telp: props.currentAddress?.nomor_telp,
        alamat: props.currentAddress?.alamat_short,
        kode_pos: props.currentAddress?.kode_pos,
        provinsi_id: props.currentAddress?.provinsi?.id
          ? props.currentAddress?.provinsi?.id
          : "",
        kota_id: props.currentAddress?.kota?.id
          ? props.currentAddress?.kota?.id
          : "",
        kecamatan_id: props.currentAddress?.kecamatan?.id
          ? props.currentAddress?.kecamatan?.id
          : "",
        lat: props.currentAddress?.lat,
        long: props.currentAddress?.long,
        catatan: props.currentAddress?.catatan,
        nama_depan: props.currentAddress?.nama_depan,
        nama_belakang: props.currentAddress?.nama_belakang,
      });
      setInputNames({
        provinsi: props.currentAddress?.provinsi?.name
          ? props.currentAddress?.provinsi?.name
          : "",
        kota: props.currentAddress?.kota?.name
          ? props.currentAddress?.kota?.name
          : "",
        kecamatan: props.currentAddress?.kecamatan?.name
          ? props.currentAddress?.kecamatan?.name
          : "",
      });
    } else {
      setLoading(false);
    }
  }, [props.currentAddress]);

  useEffect(() => {
    //console.log(address);
    setLoading(false);
  }, [address]);

  useEffect(() => {
    if (loading) {
      if (props.addressUpdate?.session === "success") {
        setSuccess(true);
        setError(props.addressUpdate?.message);
        if (props.route.params?.isCheckout) {
          navigation.navigate("Checkout");
        }
      } else {
        setSuccess(false);
        setError("Terjadi kesalahan\n\n" + props.addressUpdate?.message);
      }
      setLoading(false);
    }
  }, [props.addressUpdate]);

  useEffect(() => {
    if (loading) {
      openBottomSheet("provinsi", props.rajaongkir.provinsi, selectprovinsi);
    }
    //console.log(props.rajaongkir);
  }, [props.rajaongkir?.provinsi]);

  useEffect(() => {
    if (loading) {
      openBottomSheet("kota", props.rajaongkir.kota, selectkota);
    }
    //console.log(props.rajaongkir);
  }, [props.rajaongkir?.kota]);

  useEffect(() => {
    if (loading) {
      openBottomSheet("kecamatan", props.rajaongkir.kecamatan, selectkecamatan);
    }
    //console.log(props.rajaongkir);
  }, [props.rajaongkir?.kecamatan]);

  function openBottomSheet(key, arrayList, title) {
    setLoading(false);
    setBottomList(arrayList);
    setBottomTitle(title);
    setBottomKey(key);
    rbSheet.current.open();
  }

  function callRajaOngkir(key, param, id) {
    if (!loading) {
      if (key === "provinsi" && props.rajaongkir.provinsi !== null) {
        openBottomSheet(key, props.rajaongkir.provinsi, selectprovinsi);
      } else if (key === "kota" && props.rajaongkir.kota !== null) {
        openBottomSheet(key, props.rajaongkir.kota, selectkota);
      } else if (key === "kecamatan" && props.rajaongkir.kecamatan !== null) {
        openBottomSheet(key, props.rajaongkir.kecamatan, selectkecamatan);
      } else if (props.token !== null) {
        setLoading(true);
        props.callRajaOngkir(props.token, key, param, id);
      }
    }
  }

  function getBSValue(item) {
    switch (bottomKey) {
      case "provinsi":
        if (
          item?.id !== null &&
          item?.id !== undefined &&
          item?.id !== address?.provinsi_id
        ) {
          props.clearRajaOngkir(true, true);
          setAddress({
            ...address,
            provinsi_id: item?.id,
            kota_id: "",
            kecamatan_id: "",
          });
          setInputNames({ provinsi: item?.name, kota: "", kecamatan: "" });
        }
        break;
      case "kota":
        if (
          item?.id !== null &&
          item?.id !== undefined &&
          item?.id !== address?.kota_id
        ) {
          props.clearRajaOngkir(false, true);
          setAddress({ ...address, kota_id: item?.id, kecamatan_id: "" });
          setInputNames({ ...inputNames, kota: item?.name, kecamatan: "" });
        }
        break;
      case "kecamatan":
        if (
          item?.id !== null &&
          item?.id !== undefined &&
          item?.id !== address?.kecamatan_id
        ) {
          setAddress({ ...address, kecamatan_id: item?.id });
          setInputNames({ ...inputNames, kecamatan: item?.name });
        }
        break;
      default:
        break;
    }
    console.log(bottomKey + ": " + JSON.stringify(item));
    rbSheet.current.close();
  }

  function updateUserAddressData() {
    if (address?.nama_depan === "") {
      setError("Nama Depan harus diisi");
    } else if (address?.alamat === "") {
      setError("Alamat harus diisi");
    } else if (address?.provinsi_id === "") {
      setError("Provinsi harus dipilih");
    } else if (address?.kota_id === "") {
      setError("Kota / Kabupaten harus dipilih");
    } else if (address?.kecamatan_id === "") {
      setError("Kecamatan harus dipiilh");
    } else if (address?.nomor_telp === "") {
      setError("Nomor Telepon harus diisi");
    } else if (
      !loading &&
      props.token !== null &&
      props.currentUser?.id !== undefined
    ) {
      setLoading(true);
      props.updateUserAddressData(props.currentUser, address, props.token);
    }
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text
          style={[
            styles.textError,
            success && { backgroundColor: colors.daclen_green },
          ]}
        >
          {error}
        </Text>
      ) : null}

      <ScrollView style={styles.scrollView}>
        <View style={styles.containerLogo}>
          <Image
            source={require("../../assets/alamat.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.containerPrivacy}>
          <Text style={styles.textUid}>
            Mohon mengisi alamat lengkap yang akan digunakan untuk informasi
            Checkout Anda dan pengiriman barang. Informasi ini akan dibagikan ke
            kurir pengiriman sebagai pihak ketiga apabila Anda telah melunasi
            Checkout.
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Webview", {
                webKey: "privacy",
                text: privacypolicy,
              })
            }
            disabled={loading}
          >
            <Text style={styles.textChange}>Baca {privacypolicy}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.textCompulsory}>Nama depan*</Text>
        <TextInput
          value={address?.nama_depan}
          style={styles.textInput}
          onChangeText={(nama_depan) => setAddress({ ...address, nama_depan })}
        />
        <Text style={styles.text}>Nama belakang (opsional)</Text>
        <TextInput
          value={address?.nama_belakang}
          style={styles.textInput}
          onChangeText={(nama_belakang) =>
            setAddress({ ...address, nama_belakang })
          }
        />
        <Text style={styles.textCompulsory}>Alamat Lengkap*</Text>
        <TextInput
          value={address?.alamat}
          style={styles.textInput}
          onChangeText={(alamat) => setAddress({ ...address, alamat })}
        />
        <Text style={styles.textCompulsory}>Provinsi*</Text>
        <BSTextInput
          disabled={loading}
          onPress={() => callRajaOngkir("provinsi", null, null)}
          value={inputNames.provinsi}
          style={styles.textInput}
          onChangeText={(provinsi_id) =>
            setAddress({ ...address, provinsi_id })
          }
        />
        <Text style={styles.textCompulsory}>Kota/Kabupaten*</Text>
        <BSTextInput
          disabled={loading}
          onPress={() =>
            callRajaOngkir("kota", "provinsi_id", address?.provinsi_id)
          }
          value={inputNames.kota}
          style={styles.textInput}
          onChangeText={(kota_id) => setAddress({ ...address, kota_id })}
        />
        <Text style={styles.textCompulsory}>Kecamatan*</Text>
        <BSTextInput
          disabled={loading}
          onPress={() =>
            callRajaOngkir("kecamatan", "kota_id", address?.kota_id)
          }
          value={inputNames.kecamatan}
          style={styles.textInput}
          onChangeText={(kecamatan_id) =>
            setAddress({ ...address, kecamatan_id })
          }
        />
        <Text style={styles.text}>Kode Pos (opsional)</Text>
        <TextInput
          value={address?.kode_pos}
          style={styles.textInput}
          onChangeText={(kode_pos) => setAddress({ ...address, kode_pos })}
        />
        <Text style={styles.textCompulsory}>Nomor Telepon*</Text>
        <TextInput
          value={address?.nomor_telp}
          style={styles.textInput}
          onChangeText={(nomor_telp) => setAddress({ ...address, nomor_telp })}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => updateUserAddressData()}
            style={[
              styles.button,
              loading && { backgroundColor: colors.daclen_gray },
            ]}
            disabled={loading}
          >
            <Text style={styles.textButton}>Simpan Alamat</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <RBSheet ref={rbSheet} openDuration={250} height={400}>
        <BSContainer
          title={bottomTitle}
          list={bottomList}
          closeThis={() => rbSheet.current.close()}
          onPress={(item) => getBSValue(item)}
        />
      </RBSheet>
    </View>
  );
}

/*
<Text style={styles.text}>Catatan (opsional)</Text>
      <TextInput
        value={address?.catatan}
        style={styles.textInput}
        onChangeText={(catatan) => setAddress({ ...address, catatan })}
      />
      */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: dimensions.fullWidth,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
    paddingTop: 10,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerPrivacy: {
    marginBottom: 20,
    alignItems: "center",
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontWeight: "bold",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 32,
    elevation: 3,
    backgroundColor: colors.daclen_black,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    textAlign: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  currentAddress: store.userState.currentAddress,
  addressUpdate: store.userState.addressUpdate,
  rajaongkir: store.userState.rajaongkir,
  token: store.userState.token,
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { updateUserAddressData, callRajaOngkir, clearRajaOngkir },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(FillAddress);
