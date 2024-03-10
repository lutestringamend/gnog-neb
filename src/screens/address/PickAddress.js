import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import {
  updateReduxUserAddressId,
  updateReduxUserAddresses,
} from "../../axios/user";
import AddressItem from "../../components/address/AddressItem";
import { getObjectAsync, setObjectAsync } from "../../asyncstorage";
import {
  ASYNC_USER_ADDRESSES_KEY,
  ASYNC_USER_PROFILE_ADDRESS_ID_KEY,
} from "../../asyncstorage/constants";
import { getCurrentUser } from "../../axios/user";
import { changeAddress, deleteAlamat } from "../../axios/address";
import CenteredView from "../../components/view/CenteredView";
import ButtonCirclePlus from "../../components/Button/ButtonCirclePlus";
import EmptySpinner from "../../components/empty/EmptySpinner";
import AlertBox from "../../components/alert/AlertBox";
import HistoryHiddenView from "../../components/history/HistoryHiddenView";

const ratio = dimensions.fullWidthAdjusted / 430;

function PickAddress(props) {
  const { token, currentUser, currentAddress, addressId, addresses } = props;
  const navigation = useNavigation();

  const [originalId, setOriginalId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (addressId === undefined || addressId === null || addressId === "") {
      setOriginalId("default");
    } else {
      setOriginalId(addressId);
    }
  }, [addressId]);

  useEffect(() => {
    if (addresses === null) {
      fetchData();
      //loadStorageAddresses();
      return;
    }
    if (refreshing) {
      setRefreshing(false);
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

  const fetchData = async () => {
    if (token === null) {
      loadStorageAddresses();
    } else {
      props.getCurrentUser();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  const updatedAddressId = async () => {
    await setObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY, addressId);
    setSuccess(true);
    if (addressId === "default") {
      setError("Alamat Utama dipilih");
    } else if (originalId === addressId) {
      setError("Alamat Pengiriman dikembalikan");
    } else {
      setError("Alamat Pengiriman diganti");
    }
    //navigation.goBack();
  };

  const loadStorageAddresses = async () => {
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
  };

  const checkStorageAddressId = async () => {
    const storageAddressId = await getObjectAsync(
      ASYNC_USER_PROFILE_ADDRESS_ID_KEY,
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
    navigation.navigate("LocationPin", {
      isNew: true,
      savedRegion: null,
    });
  };

  const restoreAddressId = async () => {
    await setObjectAsync(ASYNC_USER_PROFILE_ADDRESS_ID_KEY, null);
    props.updateReduxUserAddressId("default");
  };

  function onAddressPress(item) {
    props.updateReduxUserAddressId(item);
    /*if (item === addressId) {
      navigation.goBack();
    }*/
  }

  const deleteAddressData = async (item) => {
    console.log("deleteAddressData", item?.id);
    const result = await deleteAlamat(token, currentUser?.id, item?.id);
    if (
      !(
        result === undefined ||
        result === null ||
        result?.response !== "success" ||
        result?.error !== null
      )
    ) {
      let newAddresses = changeAddress(addresses, item?.id, null);
      await setObjectAsync(ASYNC_USER_ADDRESSES_KEY, newAddresses);
      props.updateReduxUserAddresses(newAddresses);
    }
  };

  return (
    <CenteredView
      title="Alamat Pengiriman"
      rightButton="Reset"
      onRightButtonPress={() => restoreAddressId()}
      style={styles.container}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
      >
        {currentAddress === null ? null : (
          <AddressItem
            onPress={(e) => onAddressPress(e)}
            isRealtime={false}
            isDefault={true}
            addressId={addressId}
            {...currentAddress}
            style={{ marginTop: staticDimensions.marginHorizontal / 2 }}
          />
        )}

        {addresses === null ? (
          <EmptySpinner minHeight={dimensions.fullHeight * 0.9} />
        ) : addresses?.length < 1 ? null : (
          <SwipeListView
            data={addresses}
            renderItem={(data, rowMap) => (
              <AddressItem
                onPress={(e) => onAddressPress(e)}
                isRealtime={false}
                isDefault={false}
                addressId={addressId}
                {...data?.item}
              />
            )}
            renderHiddenItem={(data, rowMap) => (
              <HistoryHiddenView
                onLeftPress={() => onAddressPress(data?.item?.id)}
                rightText="Hapus"
                rightDisabled={addressId === data?.item?.id}
                leftTextColor={colors.daclen_blue_link}
                rightTextColor={colors.daclen_danger}
                onRightPress={() => deleteAddressData(data?.item)}
              />
            )}
            leftOpenValue={80 * ratio}
            rightOpenValue={-80 * ratio}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
          />
        )}

        <View style={styles.containerBottom} />
      </ScrollView>
      <ButtonCirclePlus onPress={() => addAddress()} />
      <AlertBox
        success={success}
        text={error}
        style={{ bottom: 90 }}
        onClose={() => setError(null)}
      />
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_grey_light,
  },
  containerScroll: {
    backgroundColor: "transparent",
    minHeight: dimensions.fullHeight * 0.75,
  },
  containerBottom: {
    backgroundColor: "transparent",
    height: staticDimensions.pageBottomPadding * 2,
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
      getCurrentUser,
      updateReduxUserAddressId,
      updateReduxUserAddresses,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(PickAddress);
