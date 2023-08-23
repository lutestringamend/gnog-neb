import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
//import * as Location from "expo-location";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors, staticDimensions } from "../../styles/base";
import {
  updateReduxUserAddressId,
  updateReduxUserAddresses,
} from "../../axios/user";
import { sentryLog } from "../../sentry";
import AddressItem from "./AddressItem";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  ASYNC_USER_ADDRESSES_KEY,
  ASYNC_USER_PROFILE_ADDRESS_ID_KEY,
} from "../asyncstorage/constants";
import Header from "../profile/Header";
import { privacypolicy } from "../profile/constants";
import Separator from "../profile/Separator";

function PickAddress(props) {
  const navigation = useNavigation();
  const [originalId, setOriginalId] = useState(null);
  const [changeText, setChangeText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser, currentAddress, addressId, addresses } = props;

  try {
    useEffect(() => {
      if (addressId === undefined || addressId === null || addressId === "") {
        setOriginalId("default");
      } else {
        setOriginalId(addressId);
      }
    }, []);

    useEffect(() => {
      if (
        addresses === null ||
        addresses?.length === undefined ||
        addresses?.length < 1
      ) {
        loadStorageAddresses();
        return;
      }
      console.log("redux user addresses", addresses);
    }, [addresses]);

    useEffect(() => {
      if (originalId === null || addressId === null || addressId === "") {
        checkStorageAddressId();
        return;
      }
      updatedAddressId();
    }, [addressId]);

    const updatedAddressId = async () => {
      await setObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY, addressId);
      if (addressId === "default") {
        setChangeText("Pengiriman dikirimkan ke Alamat Utama")
      } else if (originalId === addressId) {
        setChangeText("Alamat Pengiriman telah dikembalikan");
      } else {
        setChangeText("Anda mengganti Alamat Pengiriman");
      }
      navigation.goBack();
    }

    const loadStorageAddresses = async () => {
      setLoading(true);
      const storageAddresses = await getObjectAsync(ASYNC_USER_ADDRESSES_KEY);
      if (
        !(
          storageAddresses === null ||
          storageAddresses?.length === undefined ||
          storageAddresses?.length < 1
        )
      ) {
        props.updateReduxUserAddresses(storageAddresses);
      }
      setRefreshing(false);
      setLoading(false);
    };

    const checkStorageAddressId = async() => {
      const storageAddressId = await getObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY);
      if (storageAddressId === undefined || storageAddressId === null || storageAddressId === "") {
        props.updateReduxUserAddressId("default");
      } else {
        props.updateReduxUserAddressId(storageAddressId);
      }
    }

    const addAddress = async () => {
      /*if (addresses?.length === undefined || addresses?.length < 1) {
        let result = await updateAddressData(props.currentUser?.id, addresses);
        console.log("updateAddressData", result);
        if (result?.success) {
          await getNewUserProfileData(props);
        }
      }*/
      if (navigation === undefined || navigation === null) {
        return;
      }
      navigation.navigate("Address", {
        isNew: true,
        isDefault: false,
        isRealtime: false,
      });
    };

    const restoreAddressId = async () => {
      await setObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY, originalId);
      props.updateReduxUserAddressId(originalId);
    };

    function onAddressPress(item) {
      props.updateReduxUserAddressId(item);
      if (item === addressId) {
        navigation.goBack();
      }
    }

    if (currentUser === null || currentUser?.id === undefined) {
      return (
        <Header
          currentUser={currentUser}
          profile={null}
          backgroundColor="transparent"
        />
      );
    }

    return (
      <View style={styles.container}>
        {changeText ? (
          <TouchableOpacity
            disabled={originalId === addressId}
            onPress={() => restoreAddressId()}
          >
            <Text style={styles.textError}>{changeText}</Text>
          </TouchableOpacity>
        ) : null}
        <ScrollView style={styles.containerScroll}>
          <Image
            source={require("../../assets/alamat.png")}
            style={styles.logo}
          />
          <Text
            style={[styles.textUid, { textAlign: "center", marginBottom: 12 }]}
          >
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

          <AddressItem
            onPress={(e) => onAddressPress(e)}
            isRealtime={false}
            isDefault={true}
            addressId={addressId}
            item={currentAddress}
            style={{marginTop: 20}}
          />

          <Separator thickness={2} style={{ marginTop: 12 }} />

          <Text style={styles.textHeader}>
            Alamat Lainnya
          </Text>

          <TouchableOpacity style={styles.button} onPress={() => addAddress()}>
            <MaterialCommunityIcons
              name="map-plus"
              size={18}
              color={colors.daclen_light}
            />
            <Text style={styles.textButton}>Tambah Alamat Baru</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator
              size="small"
              color={colors.splash_blue}
              style={styles.spinner}
            />
          ) : addresses?.length === undefined || addresses?.length < 1 ? (
            <Text style={styles.textUid}>Tidak ada alamat lain tersimpan.</Text>
          ) : (
            <FlatList
              horizontal={false}
              numColumns={1}
              style={styles.containerFlatlist}
              data={addresses}
              renderItem={({ item, index }) => (
                <AddressItem
                  onPress={(e) => onAddressPress(e)}
                  isRealtime={false}
                  isDefault={false}
                  addressId={addressId}
                  item={item}
                  style={{ marginTop: index === 0 ? 12 : 20 }}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadStorageAddresses()}
                />
              }
            />
          )}
          <View style={styles.containerBottom} />
        </ScrollView>
      </View>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <View style={styles.container}>
        <Text style={styles.textError}>{e.toString()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerScroll: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerBottom: {
    backgroundColor: "transparent",
    height: staticDimensions.pageBottomPadding / 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_orange,
    textAlign: "center",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
    marginHorizontal: 20,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.daclen_gray,
    marginHorizontal: 20,
    marginTop: 20,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.daclen_light,
    marginStart: 10,
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: "center",
  },
  spinner: {
    marginTop: 20,
    alignSelf: "center",
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  currentAddress: store.userState.currentAddress,
  addresses: store.userState.addresses,
  addressId: store.userState.addressId,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxUserAddressId,
      updateReduxUserAddresses,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(PickAddress);
