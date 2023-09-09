import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BSUserRoot from "../bottomsheets/BSUserRoot";
import UserRootItem, { VerticalLine } from "./UserRootItem";
import { colors, staticDimensions } from "../../styles/base";
import { getHPV } from "../../axios/user";
import { devuserroottree } from "./constants";
/*import UserRootHeaderItem from "./UserRootHeaderItem";
import { notverified, userverified } from "./constants";*/

export function checkVerification(userData) {
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
  const [tree, setTree] = useState(null);
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
      hpv?.data?.children === undefined ||
      hpv?.data?.children === null ||
      hpv?.data?.children?.length === undefined ||
      hpv?.data?.children[0] === undefined ||
      hpv?.data?.children[0] === null
    ) {
      setLoading(true);
      fetchHPV();
      return;
    }
    if (
      hpv?.data?.children[0]?.children === undefined ||
      hpv?.data?.children[0]?.children?.length === undefined ||
      hpv?.data?.children[0]?.children?.length < 1
    ) {
      setNumRoots(0);
      setTree([]);
      console.log("hpv children empty", hpv?.data);
      //setNumVerified(0);
    } else {
      setNumRoots(hpv?.data?.children[0]?.children?.length);
      setTree(hpv?.data?.children[0]?.children);
      //console.log("hpv children", hpv?.data?.children[0]?.children);
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
    console.log("tree", tree);
  }, [tree]);

  useEffect(() => {
    if (popupUser?.name !== null) {
      rbSheet.current.open();
    }
  }, [popupUser]);

  function openUserPopup(data, isVerified) {
    if (popupUser?.name === null || popupUser?.name !== data?.name) {
      setPopupUser({
        ...data,
        isVerified
      });
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
    props.getHPV(currentUser?.id, token);
  }

  function refreshChildren() {
    setRefreshing(true);
    fetchHPV();
  }

  function switchTree() {
    if (tree?.length === numRoots) {
      setTree(devuserroottree.data.children);
    } else {
      setTree(hpv?.data?.children[0]?.children);
    }
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
      <TouchableOpacity
        onPress={() => switchTree()}
        style={styles.containerLeader}
        disabled={currentUser?.id !== 8054}
      >
        <Image
          source={
            hpv?.data?.foto ? hpv?.data?.foto : require("../../assets/user.png")
          }
          style={styles.parent}
          alt={hpv?.data?.name ? hpv?.data?.name : ""}
          contentFit="cover"
          placeholder={require("../../assets/user.png")}
          transition={0}
        />
        <Text style={styles.textLeader}>
          {hpv?.data?.name ? hpv?.data?.name : "DACLEN"}
        </Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshChildren()}
          />
        }
      >
        {loading || tree === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={styles.spinner}
          />
        ) : (
          <View style={styles.containerMain}>
            <VerticalLine
              style={{height: 24}}
            />
            <UserRootItem
              userData={currentUser}
              onPress={() => openUserPopup(hpv?.data?.children[0], checkVerification(currentUser))}
              isCurrentUser={true}
              status={currentUser?.status}
              isFirstItem={false}
              isLastItem={false}
              isNextBranch={false}
              isVerified={checkVerification(currentUser)}
            />
            {numRoots > 0 ? (
              <View style={styles.containerFlatlist}>
                <VerticalLine
                  style={{
                    height: 32,
                    backgroundColor: checkVerification(currentUser)
                      ? colors.daclen_green
                      : colors.daclen_red,
                  }}
                />
                {tree.map((item, index) => (
                  <UserRootItem
                    key={index}
                    userData={item}
                    onPress={() => openUserPopup(item, checkVerification(item))}
                    isCurrentUser={false}
                    isFirstItem={index === 0}
                    isLastItem={index >= tree?.length - 1}
                    isNextBranch={false}
                    isCurrentVerified={checkVerification(currentUser)}
                    isVerified={checkVerification(item)}
                    openUserPopup={openUserPopup}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.textUid}>User Roots kosong.</Text>
            )}
          </View>
        )}
      </ScrollView>
      <RBSheet ref={rbSheet} openDuration={250} height={350}>
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
    marginBottom: 10,
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
    marginStart: 10,
    fontWeight: "bold",
    fontSize: 20,
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
  parent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    elevation: 2,
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
