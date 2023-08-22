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
} from "react-native";
//import * as Location from "expo-location";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
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
import { setObjectAsync } from "../asyncstorage";
import { ASYNC_USER_PROFILE_ADDRESS_ID_KEY } from "../asyncstorage/constants";
import { AddressData } from "./AddressData";
import Header from "../profile/Header";
import { privacypolicy } from "../profile/constants";

function PickAddress(props) {
  const navigation = useNavigation();
  const [originalId, setOriginalId] = useState(null);
  const [changeText, setChangeText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser, addressId, addresses } = props;
  const { isCheckout } = props.route.params;

  try {
    useEffect(() => {
      if (addressId === undefined || addressId === null || addressId === "") {
        return;
      }

      setOriginalId(addressId);
    }, []);
    useEffect(() => {
      if (originalId === null || addressId === null) {
        return;
      }
      if (originalId === addressId) {
        setChangeText("Alamat Aktif telah dikembalikan");
      } else {
        setChangeText("Anda mengganti Alamat Aktif");
      }
    }, [addressId]);

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
        isCheckout,
        isNew: true,
        isRealtime: false,
      });
    };

    const restoreAddressId = async () => {
      await setObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY, originalId);
      props.updateReduxUserAddressId(originalId);
    };

    function onAddressPress(item) {
      props.updateReduxUserAddressId(item?.id);
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
          <Text style={[styles.textUid, { textAlign: "start", marginBottom: 12, }]}>
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
            <Text style={styles.textUid}>
              Tidak ada alamat terdaftar di akun Anda
            </Text>
          ) : (
            <FlashList
              estimatedItemSize={10}
              horizontal={false}
              numColumns={1}
              contentContainerStyle={styles.containerFlatlist}
              data={addresses}
              renderItem={({ item, index }) => (
                <AddressItem
                  onPress={(e) => onAddressPress(e)}
                  isRealtime={false}
                  isSelected={addressId === item?.id}
                  item={item}
                  location={null}
                  locationError={null}
                  style={{ marginTop: index === 0 ? 12 : 20 }}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => reloadUserData()}
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
    fontFamily: "Montserrat-Light",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_red,
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
    color: colors.daclen_black,
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
