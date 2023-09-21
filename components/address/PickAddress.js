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
  Platform,
} from "react-native";
//import * as Location from "expo-location";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SwipeListView } from "react-native-swipe-list-view";
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
import { changeAddress, deleteAlamat } from "../../axios/address";

function PickAddress(props) {
  const navigation = useNavigation();
  const [originalId, setOriginalId] = useState(null);
  const [changeText, setChangeText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { token, currentUser, currentAddress, addressId, addresses } = props;

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
        setChangeText("Pengiriman dikirimkan ke Alamat Utama");
      } else if (originalId === addressId) {
        setChangeText("Alamat Pengiriman telah dikembalikan");
      } else {
        setChangeText("Anda mengganti Alamat Pengiriman");
      }
      navigation.goBack();
    };

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

    const checkStorageAddressId = async () => {
      const storageAddressId = await getObjectAsync(
        ASYNC_USER_PROFILE_ADDRESS_ID_KEY
      );
      if (
        storageAddressId === undefined ||
        storageAddressId === null ||
        storageAddressId === ""
      ) {
        props.updateReduxUserAddressId("default");
      } else {
        props.updateReduxUserAddressId(storageAddressId);
      }
    };

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
      /*if (Platform.OS === "ios") {
        navigation.navigate("Address", {
          isNew: true,
          isDefault: false,
          isRealtime: false,
        });
      }*/
      navigation.navigate("LocationPin", {
        isNew: true,
        savedRegion: null,
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

    const editAddress = (item) => {
      navigation.navigate("Address", {
        addressData: item,
        isRealtime: false,
        isDefault: false,
        isNew: false,
      });
    };

    const deleteAddressData = async (item) => {
      console.log("deleteAddressData", item?.id);
      const result = await deleteAlamat(token, currentUser?.id, item?.id);
      if (!(result === undefined || result === null || result?.response !== "success" || result?.error !== null)) {
        let newAddresses = changeAddress(addresses, item?.id, null);
        await setObjectAsync(ASYNC_USER_ADDRESSES_KEY, newAddresses);
        props.updateReduxUserAddresses(newAddresses);
      }
    };

    const onRowDidOpen = (rowKey) => {
      console.log("onRowDidOpen", rowKey);
    };

    const renderHiddenItem = (data, rowMap) => (
      <View
        style={[
          styles.rowBack,
          {
            backgroundColor:
              addressId === data?.item?.id
                ? colors.daclen_green_dark
                : colors.daclen_green,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => onAddressPress(data?.item?.id)}
          disabled={addressId === data?.item?.id}
        >
          <Text allowFontScaling={false} style={styles.textHiddenButton}>
            {addressId === data?.item?.id ? "Terpilih" : "Pilih"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => editAddress(data?.item)}
        >
          <Text allowFontScaling={false} style={styles.textHiddenButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteAddressData(data?.item)}
        >
          <Text allowFontScaling={false} style={styles.textHiddenButton}>Hapus</Text>
        </TouchableOpacity>
      </View>
    );

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
            <Text allowFontScaling={false} style={styles.textError}>{changeText}</Text>
          </TouchableOpacity>
        ) : null}
        <ScrollView style={styles.containerScroll}>
          <Image
            source={require("../../assets/alamat.png")}
            style={styles.logo}
          />
          <Text allowFontScaling={false}
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
            <Text allowFontScaling={false} style={styles.textChange}>Baca {privacypolicy}</Text>
          </TouchableOpacity>

          <AddressItem
            onPress={(e) => onAddressPress(e)}
            isRealtime={false}
            isDefault={true}
            addressId={addressId}
            item={currentAddress}
            style={{ marginTop: 20, marginHorizontal: 20 }}
          />

          <Separator thickness={2} style={{ marginTop: 12 }} />

          {loading ? null : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => addAddress()}
            >
              <MaterialCommunityIcons
                name="map-plus"
                size={18}
                color={colors.daclen_light}
              />
              <Text allowFontScaling={false} style={styles.textButton}>
                {addresses?.length === undefined || addresses?.length < 1
                  ? "Tambah Alamat Lainnya"
                  : "Tambah Alamat Baru"}
              </Text>
            </TouchableOpacity>
          )}

          {loading ? (
            <ActivityIndicator
              size="small"
              color={colors.daclen_orange}
              style={styles.spinner}
            />
          ) : addresses?.length === undefined ||
            addresses?.length < 1 ? null : (
            <SwipeListView
              data={addresses}
              renderItem={(data, rowMap) => (
                <AddressItem
                  onPress={(e) => onAddressPress(e)}
                  isRealtime={false}
                  isDefault={false}
                  addressId={addressId}
                  item={data.item}
                />
              )}
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={75}
              rightOpenValue={-150}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              style={{ marginTop: 20 }}
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
        <Text allowFontScaling={false} style={styles.textError}>{e.toString()}</Text>
      </View>
    );
  }
}

/*

          <Text allowFontScaling={false} style={styles.textHeader}>Alamat Lainnya</Text>

            <FlatList
              horizontal={false}
              numColumns={1}
              style={styles.containerFlatlist}
              data={addresses}
              renderItem={({ item, index }) => (

              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadStorageAddresses()}
                />
              }
            />
*/

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
    height: staticDimensions.pageBottomPadding * 2,
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
    fontFamily: "Poppins-Bold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_orange,
    textAlign: "center",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginVertical: 4,
    marginHorizontal: 20,
  },
  textHeader: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_gray,
    marginHorizontal: 20,
    marginTop: 20,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
    marginStart: 10,
  },
  textUid: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: "center",
  },
  textHiddenButton: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
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
  rowBack: {
    alignItems: "center",
    backgroundColor: colors.daclen_black,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: colors.daclen_indigo,
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: colors.daclen_danger,
    right: 0,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
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
