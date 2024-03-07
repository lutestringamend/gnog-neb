import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getObjectAsync,
  setObjectAsync,
} from "../../../components/asyncstorage";
import {
  getDeliveries,
  clearDeliveryStatus,
  clearHistoryData,
  updateReduxHistoryDeliveries,
  updateReduxHistoryDeliveriesPageNumber,
} from "../../../axios/history";
import { colors, dimensions } from "../../styles/base";
import { ASYNC_HISTORY_DELIVERY_KEY } from "../../../components/asyncstorage/constants";
import { organizeListByCreatedAt } from "../../utils/history";
import EmptySpinner from "../empty/EmptySpinner";
import EmptyPlaceholder from "../empty/EmptyPlaceholder";
import DeliveryDayContainer from "./DeliveryDayContainer";

function DeliveryList(props) {
  const { token, deliveries, delivery, deliveryStatus, deliveryPageNumber } =
    props;
  const navigation = useNavigation();

  const [organizedList, setOrganizedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [onEndReachedCalledDuringMomentum, setEndReachedCalledDuringMomentum] =
    useState(true);

  useEffect(() => {
    if (deliveries === null) {
      checkAsyncStorageHistory();
    } else {
      if (deliveryPageNumber < 2) {
        setObjectAsync(ASYNC_HISTORY_DELIVERY_KEY, deliveries);
      }
      let organized = organizeListByCreatedAt(deliveries, true);
      setOrganizedList(organized);
      setLoading(false);
    }
    if (paginationLoading) {
      setPaginationLoading(false);
    }
    //console.log("redux deliveries", deliveries?.length);
  }, [deliveries]);

  useEffect(() => {
    if (deliveryPageNumber >= 999) {
      setPaginationLoading(false);
      setLoading(false);
    } else if (deliveryPageNumber > 1) {
      props.getDeliveries(token, deliveryPageNumber);
    }
    console.log("deliveryPageNumber", deliveryPageNumber);
  }, [deliveryPageNumber]);

  useEffect(() => {
    if (delivery === null) {
      console.log("delivery is null");
      if (deliveryStatus !== null) props.clearDeliveryStatus();
    }
  }, [delivery, deliveryStatus]);

  const checkAsyncStorageHistory = async () => {
    setLoading(true);
    const storageHistory = await getObjectAsync(ASYNC_HISTORY_DELIVERY_KEY);
    if (
      storageHistory === undefined ||
      storageHistory === null ||
      storageHistory?.length === undefined ||
      storageHistory?.length < 1
    ) {
      refreshScreen();
    } else {
      props.updateReduxHistoryDeliveries(storageHistory);
    }
  };

  const refreshScreen = () => {
    props.getDeliveries(token, 1);
    props.updateReduxHistoryDeliveriesPageNumber(1);
  };

  function onEndReached() {
    if (
      !onEndReachedCalledDuringMomentum &&
      deliveryPageNumber < 999 &&
      !paginationLoading
    ) {
      console.log("onEndReached");
      setEndReachedCalledDuringMomentum(true);
      props.updateReduxHistoryDeliveriesPageNumber(deliveryPageNumber + 1);
      //loadData(false);
    }
  }

  function openItem(item) {
    if (!loading) {
      /*setLoading(true);
      props.getDeliveryItem(id);*/
      navigation.navigate("DeliveryItem", { id: item?.id });
    }
  }

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
              title="Pengiriman"
              text="Anda belum memiliki riwayat Pengiriman."
            />
          ) : (
            organizedList.map((item, index) => (
              <DeliveryDayContainer
                key={index}
                header={item?.date}
                isLast={index >= organizedList?.length - 1}
                list={item?.itemList}
                onLeftPress={(e) => openItem(e)}
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
  delivery: store.historyState.delivery,
  deliveries: store.historyState.deliveries,
  deliveryStatus: store.historyState.deliveryStatus,
  deliveryPageNumber: store.historyState.deliveryPageNumber,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getDeliveries,
      clearDeliveryStatus,
      clearHistoryData,
      updateReduxHistoryDeliveries,
      updateReduxHistoryDeliveriesPageNumber,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(DeliveryList);
