import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, Text, ScrollView } from "react-native";
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
  updateUserAlamat,
} from "../../../axios/address";
import {
  generateUuid,
  updateReduxUserAddresses,
  incrementReduxUserAddresses,
} from "../../../axios/user";
import AddressData, {
  AddressInputNamesData,
} from "../../../components/address/AddressData";
import BSTextInput from "../../components/bottomsheets/BSTextInput";
import BSContainer from "../../components/bottomsheets/BSContainer";
import {
  selectprovinsi,
  selectkota,
  selectkecamatan,
} from "../../../components/address/constants";
import { colors, staticDimensions } from "../../../styles/base";
import {
  getObjectAsync,
  setObjectAsync,
} from "../../../components/asyncstorage";
import {
  ASYNC_RAJAONGKIR_KECAMATAN_KEY,
  ASYNC_RAJAONGKIR_KOTA_KEY,
  ASYNC_RAJAONGKIR_PROVINSI_KEY,
  ASYNC_USER_ADDRESSES_KEY,
} from "../../../components/asyncstorage/constants";
import { sentryLog } from "../../../sentry";
import {
  defaultlatitudedelta,
  defaultlongitudedelta,
} from "../../../axios/constants";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import AlertBox from "../../components/alert/AlertBox";
import { privacypolicy } from "../../../components/profile/constants";
import TextBox from "../../components/textbox/TextBox";
import { FILL_ADDRESS_DESC } from "../../constants/strings";
import Button from "../../components/Button/Button";
import TextInputLabel from "../../components/textinputs/TextInputLabel";
import TextInputButton from "../../components/textinputs/TextInputButton";
import { phone_regex } from "../../axios/constants";

function FillAddress(props) {
  const [address, setAddress] = useState(AddressData);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(AddressData);

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
    let newAddress = props.route.params?.addressData
      ? props.route.params?.addressData
      : AddressData;
    let newInputNames = props.route.params?.addressData
      ? {
          provinsi: props.route.params?.addressData?.provinsi_name,
          kota: props.route.params?.addressData?.kota_name,
          kecamatan: props.route.params?.addressData?.kecamatan_name,
        }
      : AddressInputNamesData;
    console.log("initial newAddress", newAddress);
    if (isDefault) {
      console.log("currentAddress", currentAddress);
      console;
      if (
        currentAddress === undefined ||
        currentAddress === null ||
        currentAddress?.alamat === undefined ||
        currentAddress?.alamat === null ||
        currentAddress?.alamat === "" ||
        currentAddress?.provinsi === undefined ||
        currentAddress?.provinsi === null ||
        currentAddress?.provinsi?.id === "" ||
        currentAddress?.kota === undefined ||
        currentAddress?.kota === null ||
        currentAddress?.kota?.id === "" ||
        currentAddress?.alamat !== newAddress?.alamat ||
        currentAddress?.kode_pos !== newAddress?.kode_pos ||
        currentAddress?.provinsi !== newAddress?.provinsi ||
        currentAddress?.kota !== newAddress?.kota ||
        currentAddress?.kecamatan !== newAddress?.kecamatan
      ) {
        console.log("do not use currentAddress");
        newAddress = {
          ...newAddress,
          nama_lengkap: currentUser?.detail_user?.nama_lengkap,
          email: currentUser?.email,
          nomor_telp: currentUser?.nomor_telp,
          nama_depan: currentUser?.detail_user?.nama_depan,
          nama_belakang: currentUser?.detail_user?.nama_belakang,
        };
      } else {
        console.log("use currentAddress");
        newAddress = {
          nama_lengkap:
            currentAddress?.nama_depan + " " + currentAddress?.nama_belakang,
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
        };
        newInputNames = {
          provinsi: currentAddress?.provinsi?.name
            ? currentAddress?.provinsi?.name
            : "",
          kota: currentAddress?.kota?.name ? currentAddress?.kota?.name : "",
          kecamatan: currentAddress?.kecamatan?.name
            ? currentAddress?.kecamatan?.name
            : "",
        };
      }
    }
    setAddress(newAddress);
    setInputNames(newInputNames);
    console.log(newAddress, newInputNames);
  }, [props.route.params, currentAddress]);

  useEffect(() => {
    //console.log("address", address);
    if (loading) {
      setLoading(false);
    }
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
    //console.log("rajaongkir provinsi", props.rajaongkir?.provinsi);
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

  useEffect(() => {
    let newErrors = { ...errors };

    if (
      !isDefault &&
      !(address?.nama_depan === "" || address?.nama_depan?.length < 3)
    ) {
      newErrors = { ...newErrors, nama_depan: "" };
    }
    if (phone_regex.test(address?.nomor_telp)) {
      newErrors = { ...newErrors, nomor_telp: "" };
    }
    if (address?.provinsi_id !== "") {
      newErrors = { ...newErrors, provinsi_id: "" };
    }
    if (address?.kota_id !== "") {
      newErrors = { ...newErrors, kota_id: "" };
    }
    if (address?.kecamatan_id === "") {
      newErrors = { ...newErrors, kecamatan_id: "" };
    }
    if (!(address?.alamat === "" || address?.alamat?.length < 3)) {
      newErrors = { ...newErrors, alamat: "" };
    }
    setErrors(newErrors);
  }, [address]);

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
          address?.provinsi_id,
        );
        props.updateReduxRajaOngkirWithKey("kota", newData);
      } else {
        const match = storageKota.find(
          ({ provinsi_id }) => provinsi_id === address?.provinsi_id,
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
            address?.provinsi_id,
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
          address?.kota_id,
        );
        props.updateReduxRajaOngkirWithKey("kecamatan", newData);
      } else {
        const match = storageKota.find(
          ({ kota_id }) => kota_id === address?.kota_id,
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
            address?.kota_id,
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
      if (
        (address?.nama_depan === "" || address?.nama_depan?.length < 3) &&
        !isDefault
      ) {
        setErrors({ ...AddressData, nama_depan: "Nama Depan wajib diisi." });
      } else if (!phone_regex.test(address?.nomor_telp)) {
        setErrors({
          ...AddressData,
          nomor_telp: "Harap isi nomor telepon yang valid.",
        });
      } else if (address?.provinsi_id === "") {
        setErrors({ ...AddressData, provinsi_id: "Provinsi wajib diisi." });
      } else if (address?.kota_id === "") {
        setErrors({ ...AddressData, kota_id: "Kota / Kabupaten wajib diisi." });
      } else if (address?.kecamatan_id === "") {
        setErrors({ ...AddressData, kecamatan_id: "Kecamatan wajib diisi." });
      } else if (address?.alamat === "" || address?.alamat?.length < 3) {
        setErrors({ ...AddressData, alamat: "Alamat Lengkap wajib diisi." });
      } else if (!loading && token !== null && currentUser?.id !== undefined) {
        setErrors(AddressData);
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
          updateUserAlamat(token, currentUser?.id, newAddress);
        } else if (isDefault) {
          props.updateUserAddressData(currentUser, address, token);
        } else {
          let newAddresses = changeAddress(addresses, address?.id, address);
          props.updateReduxUserAddresses(newAddresses);
          updateUserAlamat(token, currentUser?.id, address);
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

  /*
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

            <Text allowFontScaling={false} style={styles.textButton}>Tentukan di Peta</Text>
          </TouchableOpacity>
        )}
  */

  return (
    <CenteredView title="Isi Alamat" style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextBox
          text={FILL_ADDRESS_DESC}
          linkText={`Baca ${privacypolicy}`}
          onPress={() =>
            navigation.navigate("Webview", {
              webKey: "privacy",
              text: privacypolicy,
            })
          }
          style={{ margin: staticDimensions.marginHorizontal }}
        />

        {isDefault ? null : (
          <View style={styles.containerVertical}>
            <TextInputLabel
              label="Nama Depan Penerima"
              compulsory
              value={address?.nama_depan}
              inputMode="decimal"
              error={errors?.nama_depan}
              onChangeText={(nama_depan) =>
                setAddress({ ...address, nama_depan })
              }
            />

            <TextInputLabel
              label="Nama Belakang Penerima"
              value={address?.nama_belakang}
              error={errors?.nama_belakang}
              onChangeText={(nama_belakang) =>
                setAddress({ ...address, nama_belakang })
              }
            />

            <TextInputLabel
              label="Nomor Telepon"
              compulsory
              placeholder="08xxxxxxxxx"
              value={address?.nomor_telp}
              inputMode="decimal"
              error={errors?.nomor_telp}
              onChangeText={(nomor_telp) =>
                setAddress({ ...address, nomor_telp })
              }
            />
          </View>
        )}

        <View style={styles.containerVertical}>
          <TextInputButton
            label="Provinsi"
            onPress={() => openProvinsi()}
            disabled={loading}
            compulsory
            value={inputNames.provinsi}
            error={errors?.provinsi_id}
          />

          {inputNames.provinsi ? (
            <TextInputButton
              label="Kota / Kabupaten"
              disabled={loading || props.rajaongkir?.provinsi === null}
              onPress={() => openKota()}
              compulsory
              value={
                inputNames.kota === null || inputNames.kota === ""
                  ? inputNames.provinsi === null || inputNames.provinsi === ""
                    ? "Pilih Provinsi terlebih dahulu"
                    : "Pilih Kota / Kabupaten"
                  : inputNames.kota
              }
              error={errors?.kota_id}
            />
          ) : null}

          {inputNames.provinsi && inputNames.kota ? (
            <TextInputButton
              disabled={
                loading ||
                props.rajaongkir?.provinsi === null ||
                props.rajaongkir?.kota === null
              }
              onPress={() => openKecamatan()}
              value={
                inputNames.kecamatan === null || inputNames.kecamatan === ""
                  ? inputNames.provinsi === null || inputNames.provinsi === ""
                    ? "Pilih Provinsi terlebih dahulu"
                    : props.rajaongkir?.kota === null
                      ? "Pilih Kota/Kabupaten terlebih dahulu"
                      : "Pilih Kecamatan"
                  : inputNames.kecamatan
              }
              compulsory
              error={errors?.kecamatan_id}
            />
          ) : null}

          <TextInputLabel
            label="Alamat Lengkap"
            compulsory
            value={address?.alamat}
            error={errors?.alamat}
            onChangeText={(alamat) => setAddress({ ...address, alamat })}
          />

          <TextInputLabel
            label="Kode Pos"
            error={errors?.kode_pos}
            value={address?.kode_pos}
            inputMode="decimal"
            onChangeText={(kode_pos) => setAddress({ ...address, kode_pos })}
          />
        </View>

        <Button
          text="Simpan Alamat"
          loading={loading}
          onPress={() => updateUserAddressData()}
          style={styles.button}
        />
        <Button
          text="Hapus Alamat"
          inverted
          fontColor={colors.daclen_danger}
          onPress={() => deleteAddressData()}
          style={styles.button}
        />
      </ScrollView>

      <AlertBox text={error} success={success} onClose={() => setError(null)} />
      <RBSheet ref={rbSheet} openDuration={250} height={400}>
        <BSContainer
          title={bottomTitle}
          list={bottomList}
          closeThis={() => rbSheet.current.close()}
          onPress={(item) => getBSValue(item)}
        />
      </RBSheet>
    </CenteredView>
  );
}

/*
<Text allowFontScaling={false} style={styles.text}>Catatan (opsional)</Text>
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
    backgroundColor: "transparent",
    paddingTop: 10,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerVertical: {
    backgroundColor: "transparent",
    paddingHorizontal: staticDimensions.marginHorizontal,
  },
  button: {
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: staticDimensions.marginHorizontal,
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
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(FillAddress);
