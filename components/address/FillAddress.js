import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import RBSheet from "react-native-raw-bottom-sheet";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  updateUserAddressData,
  callRajaOngkir,
  clearRajaOngkir,
  changeAddress,
  updateReduxRajaOngkirWithKey,
  fetchRajaOngkir,
} from "../../axios/address";
import {
  generateUuid,
  updateReduxUserAddresses,
  incrementReduxUserAddresses,
} from "../../axios/user";
import AddressData, { AddressInputNamesData } from "./AddressData";
import BSTextInput from "../bottomsheets/BSTextInput";
import BSContainer from "../bottomsheets/BSContainer";
import { selectprovinsi, selectkota, selectkecamatan } from "./constants";
import { colors, staticDimensions } from "../../styles/base";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  ASYNC_RAJAONGKIR_KECAMATAN_KEY,
  ASYNC_RAJAONGKIR_KOTA_KEY,
  ASYNC_RAJAONGKIR_PROVINSI_KEY,
  ASYNC_USER_ADDRESSES_KEY,
} from "../asyncstorage/constants";
import { sentryLog } from "../../sentry";
import {
  defaultlatitudedelta,
  defaultlongitudedelta,
} from "../../axios/constants";

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

  const isNew = props.route.params?.isNew ? props.route.params?.isNew : false;
  const isDefault = props.route.params?.isDefault
    ? props.route.params?.isDefault
    : false;
  const isRealtime = props.route.params?.isRealtime
    ? props.route.params?.isRealtime
    : false;
  const { token, currentUser, currentAddress, addressUpdate, addresses } =
    props;

  const navigation = useNavigation();
  const rbSheet = useRef();

  useEffect(() => {
    if (loading) {
      updateStorageAddresses();
    }
  }, [addresses]);

  useEffect(() => {
    //console.log("route params addressData", props.route.params?.addressData?.lat, props.route.params?.addressData?.long);
    setAddress(
      isNew
        ? props.route.params?.addressData
          ? props.route.params?.addressData
          : AddressData
        : isDefault
        ? currentAddress === undefined || currentAddress === null
          ? AddressData
          : {
              nama_lengkap:
                currentAddress?.nama_depan +
                " " +
                currentAddress?.nama_belakang,
              email: currentAddress?.email,
              nomor_telp: currentAddress?.nomor_telp,
              alamat: currentAddress?.alamat,
              kode_pos: currentAddress?.kode_pos,
              provinsi_id: currentAddress?.provinsi?.id
                ? currentAddress?.provinsi?.id
                : "",
              kota_id: currentAddress?.kota?.id ? currentAddress?.kota?.id : "",
              kecamatan_id: currentAddress?.kecamatan?.id
                ? currentAddress?.kecamatan?.id
                : "",
              lat: currentAddress?.lat,
              long: currentAddress?.long,
              catatan: currentAddress?.catatan,
              nama_depan: currentAddress?.nama_depan,
              nama_belakang: currentAddress?.nama_belakang,
            }
        : props.route.params?.addressData
        ? props.route.params?.addressData
        : AddressData
    );
    setInputNames(
      isNew
        ? props.route.params?.addressData
          ? {
              provinsi: props.route.params?.addressData?.provinsi_name,
              kota: props.route.params?.addressData?.kota_name,
              kecamatan: props.route.params?.addressData?.kecamatan_name,
            }
          : AddressInputNamesData
        : isDefault
        ? currentAddress === undefined || currentAddress === null
          ? AddressInputNamesData
          : {
              provinsi: currentAddress?.provinsi?.name
                ? currentAddress?.provinsi?.name
                : "",
              kota: currentAddress?.kota?.name
                ? currentAddress?.kota?.name
                : "",
              kecamatan: currentAddress?.kecamatan?.name
                ? currentAddress?.kecamatan?.name
                : "",
            }
        : props.route.params?.addressData
        ? {
            provinsi: props.route.params?.addressData?.provinsi_name,
            kota: props.route.params?.addressData?.kota_name,
            kecamatan: props.route.params?.addressData?.kecamatan_name,
          }
        : AddressInputNamesData
    );
  }, [props.route.params, currentAddress]);

  useEffect(() => {
    //console.log("address", address);
    setLoading(false);
  }, [address]);

  /*useEffect(() => {
    console.log("inputNames", inputNames);
  }, [inputNames]);*/

  useEffect(() => {
    if (isDefault && loading) {
      setLoading(false);
      navigation.navigate("PickAddress");
    }
  }, [currentUser]);

  useEffect(() => {
    if (loading) {
      if (addressUpdate?.session === "success") {
        setSuccess(true);
        setError(addressUpdate?.message);
        navigation.navigate("PickAddress");
      } else {
        setSuccess(false);
        setError("Terjadi kesalahan\n\n" + addressUpdate?.message);
      }
      setLoading(false);
    }
  }, [addressUpdate]);

  /*useEffect(() => {
    console.log("redux rajaongkir", props.rajaongkir);
  }, [props.rajaongkir]);*/

  useEffect(() => {
    if (
      props.rajaongkir?.provinsi === undefined ||
      props.rajaongkir?.provinsi === null
    ) {
      checkStorageProvinsi();
    } else if (loading) {
      openBottomSheet("provinsi", props.rajaongkir.provinsi, selectprovinsi);
    }
  }, [props.rajaongkir?.provinsi]);

  useEffect(() => {
    if (loading) {
      openBottomSheet("kota", props.rajaongkir.kota, selectkota);
    }
  }, [props.rajaongkir?.kota]);

  useEffect(() => {
    if (loading) {
      openBottomSheet("kecamatan", props.rajaongkir.kecamatan, selectkecamatan);
    }
  }, [props.rajaongkir?.kecamatan]);

  function openBottomSheet(key, arrayList, title) {
    setLoading(false);
    setBottomList(arrayList);
    setBottomTitle(title);
    setBottomKey(key);
    rbSheet.current.open();
  }

  const checkStorageProvinsi = async () => {
    const storageProvinsi = await getObjectAsync(ASYNC_RAJAONGKIR_PROVINSI_KEY);
    if (!(storageProvinsi === undefined || storageProvinsi === null)) {
      props.updateReduxRajaOngkirWithKey("provinsi", storageProvinsi);
    }
  };

  const openProvinsi = () => {
    if (
      props.rajaongkir?.provinsi === undefined ||
      props.rajaongkir?.provinsi === null ||
      props.rajaongkir?.provinsi?.length === undefined
    ) {
      callRajaOngkir("provinsi", null, null);
    } else {
      openBottomSheet("provinsi", props.rajaongkir.provinsi, selectprovinsi);
    }
  };

  const openKota = async () => {
    if (
      props.rajaongkir?.kota === undefined ||
      props.rajaongkir?.kota === null ||
      props.rajaongkir?.kota?.length === undefined
    ) {
      setLoading(true);
      const storageKota = await getObjectAsync(ASYNC_RAJAONGKIR_KOTA_KEY);
      if (
        storageKota === undefined ||
        storageKota === null ||
        storageKota?.length === undefined ||
        storageKota?.length < 1
      ) {
        const newData = await fetchRajaOngkir(
          token,
          "kota",
          "provinsi_id",
          address?.provinsi_id
        );
        props.updateReduxRajaOngkirWithKey("kota", newData);
      } else {
        const match = storageKota.find(
          ({ provinsi_id }) => provinsi_id === address?.provinsi_id
        );
        if (
          match === undefined ||
          match === null ||
          match?.data === undefined ||
          match?.data === null ||
          match?.data?.length === undefined
        ) {
          const newData = await fetchRajaOngkir(
            token,
            "kota",
            "provinsi_id",
            address?.provinsi_id
          );
          props.updateReduxRajaOngkirWithKey("kota", newData);
        } else {
          props.updateReduxRajaOngkirWithKey("kota", match?.data);
        }
      }
    } else {
      openBottomSheet("kota", props.rajaongkir.kota, selectkota);
    }
  };

  const openKecamatan = async () => {
    if (
      props.rajaongkir?.kecamatan === undefined ||
      props.rajaongkir?.kecamatan === null ||
      props.rajaongkir?.kecamatan?.length === undefined
    ) {
      setLoading(true);
      const storageKota = await getObjectAsync(ASYNC_RAJAONGKIR_KECAMATAN_KEY);
      if (
        storageKota === undefined ||
        storageKota === null ||
        storageKota?.length === undefined ||
        storageKota?.length < 1
      ) {
        const newData = await fetchRajaOngkir(
          token,
          "kecamatan",
          "kota_id",
          address?.kota_id
        );
        props.updateReduxRajaOngkirWithKey("kecamatan", newData);
      } else {
        const match = storageKota.find(
          ({ kota_id }) => kota_id === address?.kota_id
        );
        if (
          match === undefined ||
          match === null ||
          match?.data === undefined ||
          match?.data === null ||
          match?.data?.length === undefined
        ) {
          const newData = await fetchRajaOngkir(
            token,
            "kecamatan",
            "kota_id",
            address?.kota_id
          );
          props.updateReduxRajaOngkirWithKey("kecamatan", newData);
        } else {
          props.updateReduxRajaOngkirWithKey("kecamatan", match?.data);
        }
      }
    } else {
      openBottomSheet("kecamatan", props.rajaongkir.kecamatan, selectkecamatan);
    }
  };

  function callRajaOngkir(key, param, id) {
    if (!loading) {
      if (key === "provinsi" && props.rajaongkir.provinsi !== null) {
        openBottomSheet(key, props.rajaongkir.provinsi, selectprovinsi);
      } else if (key === "kota" && props.rajaongkir.kota !== null) {
        openBottomSheet(key, props.rajaongkir.kota, selectkota);
      } else if (key === "kecamatan" && props.rajaongkir.kecamatan !== null) {
        openBottomSheet(key, props.rajaongkir.kecamatan, selectkecamatan);
      } else if (token !== null) {
        setLoading(true);
        props.callRajaOngkir(token, key, param, id);
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

  const openLocationPin = () => {
    try {
      let savedRegion = null;
      console.log("address lat long", address.lat, address.long);
      if (
        !(
          address.lat === null ||
          address.long === null ||
          address.lat === "" ||
          address.long === ""
        )
      ) {
        savedRegion = {
          latitude: parseFloat(address.lat),
          longitude: parseFloat(address.long),
          latitudeDelta: defaultlatitudedelta,
          longitudeDelta: defaultlongitudedelta,
        };
      }
      navigation.navigate("LocationPin", {
        isNew,
        isDefault,
        savedRegion,
        addressData: address,
      });
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  const updateUserAddressData = async () => {
    try {
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
      } else if (!loading && token !== null && currentUser?.id !== undefined) {
        setSuccess(true);
        setLoading(true);

        if (isNew) {
          let newAddress = {
            ...address,
            id: generateUuid(),
            nama_lengkap: `${address.nama_depan} ${address.nama_belakang}`,
            provinsi_name: inputNames.provinsi,
            kota_name: inputNames.kota,
            kecamatan_name: inputNames.kecamatan,
          };
          props.incrementReduxUserAddresses(newAddress);
        } else if (isDefault) {
          props.updateUserAddressData(currentUser, address, token);
        } else {
          let newAddresses = changeAddress(addresses, address?.id, address);
          props.updateReduxUserAddresses(newAddresses);
        }
      }
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setSuccess(false);
      setLoading(false);
      setError(e.toString());
    }
  };

  const updateStorageAddresses = async () => {
    await setObjectAsync(ASYNC_USER_ADDRESSES_KEY, addresses);
    navigation.navigate("PickAddress");
  };

  const deleteAddressData = async () => {
    setLoading(true);
    let newAddresses = changeAddress(addresses, address?.id, null);
    //console.log("newAddresses", newAddresses);
    await setObjectAsync(ASYNC_USER_ADDRESSES_KEY, newAddresses);
    props.updateReduxUserAddresses(newAddresses);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {Platform.OS === "ios" ? null : (
          <TouchableOpacity
            onPress={() => openLocationPin()}
            style={[
              styles.button,
              {
                backgroundColor: loading
                  ? colors.daclen_gray
                  : colors.daclen_orange,
              },
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_light}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <MaterialCommunityIcons
                name="map-marker-plus"
                size={18}
                color={colors.daclen_light}
              />
            )}

            <Text style={styles.textButton}>Tentukan di Peta</Text>
          </TouchableOpacity>
        )}

        {isDefault ? null : (
          <View style={styles.containerVertical}>
            <Text style={[styles.textCompulsory]}>Nama Depan Penerima*</Text>
            <TextInput
              value={address?.nama_depan}
              style={styles.textInput}
              onChangeText={(nama_depan) =>
                setAddress({ ...address, nama_depan })
              }
              editable={!isDefault}
            />
            <Text style={styles.text}>Nama Belakang Penerima (opsional)</Text>
            <TextInput
              value={address?.nama_belakang}
              style={styles.textInput}
              onChangeText={(nama_belakang) =>
                setAddress({ ...address, nama_belakang })
              }
              editable={!isDefault}
            />
          </View>
        )}

        <Text style={styles.textCompulsory}>Alamat Lengkap*</Text>
        <TextInput
          value={address?.alamat}
          style={styles.textInput}
          onChangeText={(alamat) => setAddress({ ...address, alamat })}
        />
        <Text style={styles.textCompulsory}>Provinsi*</Text>
        <BSTextInput
          disabled={loading}
          onPress={() => openProvinsi()}
          value={inputNames.provinsi}
          style={styles.textInput}
          onChangeText={(provinsi_id) =>
            setAddress({ ...address, provinsi_id })
          }
        />
        <Text style={styles.textCompulsory}>Kota/Kabupaten*</Text>
        <BSTextInput
          disabled={loading || props.rajaongkir?.provinsi === null}
          onPress={() => openKota()}
          value={
            inputNames.kota === null || inputNames.kota === ""
              ? props.rajaongkir?.provinsi === null
                ? "Pilih Provinsi terlebih dahulu"
                : "Tekan untuk memilih"
              : inputNames.kota
          }
          style={styles.textInput}
          onChangeText={(kota_id) => setAddress({ ...address, kota_id })}
        />
        <Text style={styles.textCompulsory}>Kecamatan*</Text>
        <BSTextInput
          disabled={
            loading ||
            props.rajaongkir?.provinsi === null ||
            props.rajaongkir?.kota === null
          }
          onPress={() => openKecamatan()}
          value={
            inputNames.kecamatan === null || inputNames.kecamatan === ""
              ? props.rajaongkir?.provinsi === null
                ? "Pilih Provinsi terlebih dahulu"
                : props.rajaongkir?.kota === null
                ? "Pilih Kota/Kabupaten terlebih dahulu"
                : "Tekan untuk memilih"
              : inputNames.kecamatan
          }
          style={styles.textInput}
          onChangeText={(kecamatan_id) =>
            setAddress({ ...address, kecamatan_id })
          }
        />
        <Text style={styles.text}>Kode Pos (opsional)</Text>
        <TextInput
          value={address?.kode_pos}
          style={styles.textInput}
          inputMode="decimal"
          onChangeText={(kode_pos) => setAddress({ ...address, kode_pos })}
        />

        {isDefault ? null : (
          <View style={styles.containerVertical}>
            <Text style={styles.textCompulsory}>Nomor Telepon*</Text>
            <TextInput
              value={address?.nomor_telp}
              style={styles.textInput}
              inputMode="decimal"
              onChangeText={(nomor_telp) =>
                setAddress({ ...address, nomor_telp })
              }
              editable={!isDefault}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={() => updateUserAddressData()}
          style={[
            styles.button,
            loading && { backgroundColor: colors.daclen_gray },
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_light}
              style={{ alignSelf: "center" }}
            />
          ) : (
            <MaterialCommunityIcons
              name="cursor-pointer"
              size={18}
              color={colors.daclen_light}
            />
          )}
          <Text style={styles.textButton}>Simpan Alamat</Text>
        </TouchableOpacity>

        {isDefault || isRealtime || isNew ? null : (
          <TouchableOpacity
            onPress={() => deleteAddressData()}
            style={[
              styles.button,
              {
                backgroundColor: loading
                  ? colors.daclen_gray
                  : colors.daclen_red,
                marginVertical: 0,
              },
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.daclen_light}
                style={{ alignSelf: "center" }}
              />
            ) : (
              <MaterialCommunityIcons
                name="delete"
                size={18}
                color={colors.daclen_light}
              />
            )}
            <Text style={styles.textButton}>Hapus Alamat</Text>
          </TouchableOpacity>
        )}

        <View style={styles.containerBottom} />
      </ScrollView>

      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" color={colors.daclen_orange} />
        </View>
      ) : null}
      <RBSheet ref={rbSheet} openDuration={250} height={400}>
        <BSContainer
          title={bottomTitle}
          list={bottomList}
          closeThis={() => rbSheet.current.close()}
          onPress={(item) => getBSValue(item)}
        />
      </RBSheet>
    </SafeAreaView>
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
    backgroundColor: colors.white,
    width: "100%",
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerLoading: {
    width: "100%",
    height: "100%",
    zIndex: 6,
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: colors.daclen_light,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerPrivacy: {
    marginBottom: 20,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerBottom: {
    backgroundColor: "transparent",
    height: staticDimensions.pageBottomPadding / 2,
  },
  text: {
    marginHorizontal: 20,
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    marginHorizontal: 20,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    borderRadius: 4,
    marginVertical: 20,
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
    marginStart: 10,
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  currentAddress: store.userState.currentAddress,
  addressUpdate: store.userState.addressUpdate,
  rajaongkir: store.userState.rajaongkir,
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  addresses: store.userState.addresses,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateUserAddressData,
      callRajaOngkir,
      clearRajaOngkir,
      updateReduxUserAddresses,
      incrementReduxUserAddresses,
      updateReduxRajaOngkirWithKey,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(FillAddress);
