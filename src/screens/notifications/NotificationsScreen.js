import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors, staticDimensions } from "../../../styles/base";
import {
  clearReduxNotifications,
  overhaulReduxNotifications,
  pushNewReduxNotification,
} from "../../../axios/notifications";
import { getObjectAsync } from "../../../components/asyncstorage";
import { ASYNC_NOTIFICATIONS_KEY } from "../../../components/asyncstorage/constants";
import NotificationItem from "../../../components/notifications/NotificationItem";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import { dimensions } from "../../styles/base";
import AlertBox from "../../components/alert/AlertBox";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";

const NotificationsScreen = (props) => {
  const { currentUser, notificationsArray } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*useEffect(() => {
    props.clearReduxNotifications();
  }, []);*/

  useEffect(() => {
    if (currentUser === null || currentUser?.id === undefined) {
      return;
    }
    if (
      notificationsArray === undefined ||
      notificationsArray === null 
    ) {
      refreshPage();
      return;
    }
    if (loading) {
      setLoading(false);
    }
    //console.log("redux notifications", notificationsArray);
  }, [currentUser, notificationsArray]);

  const refreshPage = async () => {
    setLoading(true);
    const storageNotifications = await getObjectAsync(ASYNC_NOTIFICATIONS_KEY);
    if (
      storageNotifications === undefined ||
      storageNotifications === null ||
      storageNotifications?.length === undefined ||
      storageNotifications?.length < 1
    ) {
      props.overhaulReduxNotifications([]);
    } else {
      props.overhaulReduxNotifications(storageNotifications);
    }
  };

  return (
    <CenteredView title="Notifikasi" style={styles.container}>
      {loading || notificationsArray === null ? (
        <EmptySpinner minHeight={dimensions.fullHeight * 0.9} />
      ) : (
        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refreshPage()}
            />
          }
        >
          {currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.id === null || notificationsArray?.length === undefined ||
          notificationsArray?.length < 1 ? (
            <EmptyPlaceholder text="Tidak ada notifikasi tersedia" minHeight={dimensions.fullHeight * 0.9} />
          ) : (
            <FlashList
              estimatedItemSize={10}
              numColumns={1}
              horizontal={false}
              data={notificationsArray}
              contentContainerStyle={{
                paddingBottom: staticDimensions.pageBottomPadding,
              }}
              renderItem={({ item }) => (
                <NotificationItem
                  data={item}
                />
              )}
            />
          )}
        </ScrollView>
      )}
      <AlertBox text={error} onClose={() => setError(null)} />
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.daclen_light,
    width: "100%",
  },
  containerFlatlist: {
    flex: 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  notificationsArray: store.notificationsState.notificationsArray,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearReduxNotifications,
      overhaulReduxNotifications,
      pushNewReduxNotification,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(NotificationsScreen);
