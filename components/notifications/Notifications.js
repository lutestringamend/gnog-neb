import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors, staticDimensions } from "../../styles/base";
import {
  clearReduxNotifications,
  overhaulReduxNotifications,
  pushNewReduxNotification,
} from "../../axios/notifications";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_NOTIFICATIONS_KEY } from "../asyncstorage/constants";
import NotificationItem from "./NotificationItem";

const Notifications = (props) => {
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
    <SafeAreaView style={styles.container}>
      {error ? <Text allowFontScaling={false} style={styles.textError}>{error}</Text> : null}
      {loading || notificationsArray === null ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={styles.spinner}
        />
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
            <Text allowFontScaling={false} style={styles.textUid}>Tidak ada notifikasi tersedia</Text>
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
    </SafeAreaView>
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
  textError: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_light,
    fontFamily: "Poppins-SemiBold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    marginHorizontal: 12,
    marginVertical: 20,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  spinner: {
    marginTop: 20,
    alignSelf: "center",
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

export default connect(mapStateToProps, mapDispatchProps)(Notifications);
