import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getCheckouts,
  getCheckoutItem,
  postPembayaran,
  clearUserCheckoutData,
  clearHistoryData,
  updateReduxHistoryCheckouts,
  updateReduxHistoryCheckoutsPageNumber,
  cancelCheckout,
  confirmCheckout,
  deleteCheckout,
} from "../../axios/history";
import {
  getObjectAsync,
  setObjectAsync,
} from "../../../components/asyncstorage";

import { colors, dimensions } from "../../styles/base";
import { ASYNC_HISTORY_CHECKOUT_KEY } from "../../../components/asyncstorage/constants";
import EmptySpinner from "../empty/EmptySpinner";
import EmptyPlaceholder from "../empty/EmptyPlaceholder";
import HistoryDayContainer from "./HistoryDayContainer";
import { organizeListByCreatedAt } from "../../utils/history";

function HistoryList(props) {
  const { token, checkouts, checkout, checkoutPageNumber } = props;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [onEndReachedCalledDuringMomentum, setEndReachedCalledDuringMomentum] =
    useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [organizedList, setOrganizedList] = useState([]);

  useEffect(() => {
    if (checkouts === null) {
      checkAsyncStorageHistory();
    } else {
      if (checkoutPageNumber < 2) {
        setObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY, checkouts);
      }
      let organized = organizeListByCreatedAt(checkouts);
      setOrganizedList(organized);
      //console.log("organized", organized);
      setLoading(false);
    }
    if (paginationLoading) {
      setPaginationLoading(false);
    }
    //console.log("redux checkouts", checkouts?.length);
  }, [checkouts]);

  useEffect(() => {
    if (checkoutPageNumber >= 999) {
      setPaginationLoading(false);
      setLoading(false);
    } else if (checkoutPageNumber > 1) {
      props.getCheckouts(token, checkoutPageNumber);
    }
    console.log("checkoutPageNumber", checkoutPageNumber);
  }, [checkoutPageNumber]);

  useEffect(() => {
    if (checkout === null) {
      props.clearUserCheckoutData();
      console.log("checkout is null");
    }
  }, [checkout]);

  const checkAsyncStorageHistory = async () => {
    setLoading(true);
    const storageHistory = await getObjectAsync(ASYNC_HISTORY_CHECKOUT_KEY);
    if (
      storageHistory === undefined ||
      storageHistory === null ||
      storageHistory?.length === undefined ||
      storageHistory?.length < 1
    ) {
      refreshScreen();
    } else {
      props.updateReduxHistoryCheckouts(storageHistory);
    }
  };

  const refreshScreen = () => {
    props.getCheckouts(token, 1);
    props.updateReduxHistoryCheckoutsPageNumber(1);
  };

  function onEndReached() {
    if (
      !onEndReachedCalledDuringMomentum &&
      checkoutPageNumber < 999 &&
      !paginationLoading
    ) {
      console.log("onEndReached");
      setEndReachedCalledDuringMomentum(true);
      props.updateReduxHistoryCheckoutsPageNumber(checkoutPageNumber + 1);
      //loadData(false);
    }
  }

  function openItem(item) {
    if (!loading) {
      /*setLoading(true);
      props.getCheckoutItem(id);*/
      //console.log("checkout item", item);
      navigation.navigate("CheckoutItem", { id: item?.id });
    }
  }

  const cancelItem = async (item) => {
    if (!loading) {
      /*setLoading(true);
      props.getCheckoutItem(id);*/
      const { id, status } = item;
      //console.log("cancelItem", id, status);
      try {
        if (status === "diverifikasi") {
          const response = await confirmCheckout(token, id);
          console.log("confirmCheckout response", response);
          if (response === true) {
            let newArray = [];
            for (let i = 0; i < checkouts?.length; i++) {
              if (checkouts[i]?.id === id) {
                let newCheckout = {
                  ...checkouts[i],
                  status: "diterima",
                };
                newArray.push(newCheckout);
              } else {
                newArray.push(checkouts[i]);
              }
            }
            props.updateReduxHistoryCheckouts(newArray);
          }
        } else if (status === null) {
          const response = await cancelCheckout(token, id);
          console.log("cancelCheckout response", response);
          if (response === true) {
            let newArray = [];
            for (let i = 0; i < checkouts?.length; i++) {
              if (checkouts[i]?.id === id) {
                let newCheckout = {
                  ...checkouts[i],
                  status: "ditolak",
                };
                newArray.push(newCheckout);
              } else {
                newArray.push(checkouts[i]);
              }
            }
            props.updateReduxHistoryCheckouts(newArray);
          }
        } else if (status === "ditolak") {
          const response = await deleteCheckout(token, id);
          console.log("deleteCheckout response", response);
          if (response === true) {
            let newArray = [];
            for (let i = 0; i < checkouts?.length; i++) {
              if (checkouts[i]?.id !== id) {
                newArray.push(checkouts[i]);
              }
            }
            props.updateReduxHistoryCheckouts(newArray);
          }
        }
      } catch (e) {
        console.error(e);
      }
      //console.log("deleteItem", id);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        onMomentumScrollBegin={() => setEndReachedCalledDuringMomentum(false)}
        onEndReachedThreshold={0.2}
        onEndReached={() => onEndReached()}
        nestedScrollEnabled={false}
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refreshScreen()}
          />
        }
      >
        {loading ? (
          <EmptySpinner minHeight={0.9 * dimensions.fullHeight} />
        ) : token ? (
          organizedList?.length === undefined || organizedList?.length < 1 ? (
            <EmptyPlaceholder
              title="Checkout"
              text="Anda belum memiliki riwayat Checkout."
            />
          ) : (
            organizedList.map((item, index) => (
              <HistoryDayContainer
                key={index}
                header={item?.date}
                isLast={index >= organizedList?.length - 1}
                list={item?.itemList}
                onLeftPress={(e) => openItem(e)}
                onRightPress={(e) => cancelItem(e)}
              />
            ))
          )
        ) : null}
      </ScrollView>
      {paginationLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.black}
          style={styles.activityControl}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.daclen_grey_light,
    width: "100%",
  },
  containerScroll: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  activityControl: {
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
    elevation: 10,
    zIndex: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  userCheckout: store.userState.checkout,
  checkouts: store.historyState.checkouts,
  checkout: store.historyState.checkout,
  checkoutPageNumber: store.historyState.checkoutPageNumber,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getCheckouts,
      getCheckoutItem,
      postPembayaran,
      clearUserCheckoutData,
      clearHistoryData,
      updateReduxHistoryCheckouts,
      updateReduxHistoryCheckoutsPageNumber,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(HistoryList);
