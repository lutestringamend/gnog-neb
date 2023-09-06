import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import BSUserRoot from "../bottomsheets/BSUserRoot";
import UserRootItem, { VerticalLine } from "./UserRootItem";
import { colors, staticDimensions } from "../../styles/base";
import { getHPV } from "../../axios/user";
/*import UserRootHeaderItem from "./UserRootHeaderItem";
import { notverified, userverified } from "./constants";*/

function checkVerification(userData) {
  if (
    userData?.nomor_telp_verified_at === undefined ||
    userData?.nomor_telp_verified_at === null ||
    userData?.nomor_telp_verified_at === ""
  ) {
    return false;
  } else {
    return true;
  }
}

const UserRoots = (props) => {
  const [numRoots, setNumRoots] = useState(0);
  //const [numVerified, setNumVerified] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [popupUser, setPopupUser] = useState({ name: null });
  const { token, currentUser, hpv } = props;
  const rbSheet = useRef();

  useEffect(() => {
    if (
      hpv === undefined ||
      hpv === null ||
      hpv?.data === undefined ||
      hpv?.data === null ||
      hpv?.data?.children === undefined
    ) {
      fetchHPV();
      return;
    }
    if (
      hpv?.data?.children === null ||
      hpv?.data?.children?.length === undefined ||
      hpv?.data?.children?.length < 1
    ) {
      setNumRoots(0);
      console.log("hpv children empty", hpv?.data);
      //setNumVerified(0);
    } else {
      setNumRoots(hpv?.data?.children?.length);
      console.log("hpv children", hpv?.data?.children);
      /*for (let i = 0; i < hpv?.data?.children?.length; i++) {
        if (checkVerification(hpv?.data?.children[i])) {
          setNumVerified((n) => n + 1);
        }
      }*/
    }
    if (loading) {
      setLoading(false);
    }
    if (refreshing) {
      setRefreshing(false);
    }
  }, [hpv]);

  useEffect(() => {
    if (popupUser?.name !== null) {
      rbSheet.current.open();
    }
  }, [popupUser]);

  function openUserPopup(data) {
    if (popupUser?.name === null || popupUser?.name !== data?.name) {
      setPopupUser(data);
    } else {
      rbSheet.current.open();
    }
  }

  function fetchHPV() {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.id === null
    ) {
      return;
    }
    setLoading(true);
    props.getHPV(currentUser?.id, token);
  }

  function refreshChildren() {
    setRefreshing(true);
    fetchHPV();
  }

  /*
        <View style={styles.containerHorizontal}>
          <UserRootHeaderItem
            title={userverified}
            backgroundColor={colors.daclen_green}
            color={colors.daclen_light}
            icon="account-check"
            content={numVerified}
          />
          <UserRootHeaderItem
            title={notverified}
            backgroundColor={colors.daclen_red}
            color={colors.daclen_light}
            icon="account-remove"
            content={numRoots - numVerified}
          />
        </View>
  */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerLeader}>
        <MaterialCommunityIcons
          name="head"
          size={18}
          color={colors.daclen_light}
        />
        <Text style={styles.textLeader}>DACLEN</Text>
      </View>
      <View style={styles.scrollView}>
        <View style={styles.containerMain}>
          <UserRootItem
            userData={currentUser}
            onPress={() => openUserPopup(currentUser)}
            isCurrentUser={true}
            status={currentUser?.status}
            isLastItem={false}
            isVerified={checkVerification(currentUser)}
          />
          <View style={styles.containerFlatlist}>
            {numRoots > 0 ? (
              <VerticalLine
                style={{
                  height: 32,
                  backgroundColor: checkVerification(currentUser)
                    ? colors.daclen_green
                    : colors.daclen_red,
                }}
              />
            ) : null}
            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.daclen_orange}
                style={styles.spinner}
              />
            ) : numRoots > 0 ? (
              <FlatList
                numColumns={1}
                horizontal={false}
                data={hpv?.data?.children}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => refreshChildren()}
                  />
                }
                renderItem={({ item, index }) => (
                  <UserRootItem
                    userData={item}
                    onPress={() => openUserPopup(item)}
                    isCurrentUser={false}
                    isLastItem={index >= numRoots - 1}
                    isCurrentVerified={checkVerification(currentUser)}
                    isVerified={checkVerification(item)}
                  />
                )}
              />
            ) : (
              <Text style={styles.textUid}>User Roots Anda masih kosong.</Text>
            )}
          </View>
        </View>
      </View>
      <RBSheet ref={rbSheet} openDuration={250} height={300}>
        <BSUserRoot
          title="Detail User"
          data={popupUser}
          closeThis={() => rbSheet.current.close()}
        />
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "stretch",
    paddingHorizontal: staticDimensions.dashboardBoxHorizontalMargin,
    marginVertical: 10,
  },
  containerMain: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    paddingBottom: staticDimensions.pageBottomPadding,
    marginVertical: 10,
    marginHorizontal: 12,
  },
  containerLeader: {
    backgroundColor: colors.daclen_black,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  containerFlatlist: {
    justifyContent: "flex-start",
  },
  textLeader: {
    marginStart: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: colors.daclen_light,
  },
  textUid: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
    color: colors.daclen_gray,
    marginHorizontal: 10,
  },
  spinner: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginVertical: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  hpv: store.userState.hpv,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getHPV,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(UserRoots);
