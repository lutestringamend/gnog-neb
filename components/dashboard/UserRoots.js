import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import UserRootItem, { VerticalLine } from "./userroot/UserRootItem";
import UserRootModal from "./userroot/UserRootModal";
import { colors, staticDimensions } from "../../styles/base";
import { getHPV, updateReduxHPV, overhaulReduxUserHpvArray, incrementReduxUserHpvArray } from "../../axios/user";
import { devuserroottree } from "./constants";
/*import UserRootHeaderItem from "./UserRootHeaderItem";
import { notverified, userverified } from "./constants";*/

const defaultModal = {
  visible: false,
  data: null,
  isVerified: true,
};

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
  const [selfData, setSelfData] = useState(null);
  //const [numVerified, setNumVerified] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(defaultModal);
  const { token, currentUser, hpv, hpvArray } = props;

  useEffect(() => {
    if (currentUser === null) {
      setError("Anda harus login ke akun Daclen.");
    } else {
      setSelfData({
        id: currentUser?.id,
        name: currentUser?.name,
        status: currentUser?.status,
        foto: currentUser?.detail_user
          ? currentUser?.detail_user?.foto
            ? currentUser?.detail_user?.foto
            : null
          : null,
        email: currentUser?.email,
        nomor_telp: currentUser?.nomor_telp,
        join_date: currentUser?.inv[0]?.created_at,
        pv: currentUser?.poin_user?.poin,
        hpv: currentUser?.poin_user?.hpv,
        poin_user_this_month: currentUser?.poin_user_this_month,
        total_nominal_penjualan: currentUser?.total_nominal_penjualan,
      });
    }
  }, [currentUser]);

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
    console.log("redux hpvArray", hpvArray);
  }, [hpvArray]);

  function openUserPopup(data, isVerified) {
    setModal({
      visible: true,
      data,
      isVerified,
    });
  }

  const fetchHPV = async () => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.id === null ||
      loading
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await getHPV(currentUser?.id, token);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      if (!(hpv === undefined || hpv === null || hpv?.data === undefined)) {
        props.updateReduxHPV(null);
      }
      setError(
        result?.error ? result?.error : "Gagal mendapatkan data Agen & Reseller"
      );
    } else {
      props.updateReduxHPV(result?.result);
    }
    setLoading(false);
    if (refreshing) {
      setRefreshing(false);
    }
  };

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

  function concatHPVArray(id, data) {
    if (hpvArray?.length === undefined || hpvArray?.length < 1) {
      props.overhaulReduxUserHpvArray([data]);
    } else {
      let isFound = false;
      for (let h of hpvArray) {
        if (h?.id === id) {
          isFound = true;
        }
      }
      if (!isFound) {
        props.incrementReduxUserHpvArray(data);
      }
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
      <ImageBackground
        source={require("../../assets/profilbg.png")}
        style={styles.background}
        resizeMode="cover"
      />
      {error ? (
        <Text allowFontScaling={false} style={styles.textError}>
          {error}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={() => switchTree()}
          style={styles.containerLeader}
          disabled={currentUser?.id !== 8054}
        >
          <Text allowFontScaling={false} style={styles.textLeader}>
            {`Total: ${numRoots} Reseller`}
          </Text>
          <TouchableOpacity
            style={styles.containerRefresh}
            disabled={loading || refreshing}
            onPress={() => fetchHPV()}
          >
            {loading || refreshing ? (
              <ActivityIndicator
                size={28}
                color={colors.daclen_light}
                style={styles.spinner}
              />
            ) : (
              <MaterialCommunityIcons
                name="refresh-circle"
                size={28}
                color={colors.daclen_light}
                style={{ alignSelf: "center" }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        showsHorizontalScrollIndicator={true}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshChildren()}
          />
        }
      >
        <View style={styles.containerMain}>
          <UserRootItem
            userData={{
              foto: hpv?.data?.foto,
              name: hpv?.data?.name,
              title: hpv?.data?.title,
            }}
            onPress={() => openUserPopup(hpv?.data, true)}
            isCurrentUser={false}
            isParent={true}
            status={hpv?.data?.status ? hpv?.data?.status : "Distributor"}
            isFirstItem={false}
            isLastItem={false}
            isNextBranch={false}
            isSingleChild={true}
            isVerified={true}
          />
          <VerticalLine style={{ height: 32, marginStart: 80 }} />
          <UserRootItem
            userData={selfData}
            onPress={() =>
              openUserPopup(selfData, checkVerification(currentUser))
            }
            isCurrentUser={true}
            isParent={false}
            status={currentUser?.status}
            isFirstItem={false}
            isLastItem={false}
            isNextBranch={false}
            isSingleChild={true}
            isVerified={checkVerification(currentUser)}
          />
          {loading ? (
            tree === null ? (
              <TouchableOpacity
                onPress={() => fetchHPV()}
                style={[
                  styles.button,
                  {
                    backgroundColor: loading
                      ? colors.daclen_gray
                      : colors.daclen_orange,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator
                    color={colors.daclen_light}
                    size="small"
                    style={styles.spinner}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="refresh"
                    size={20}
                    color={colors.daclen_light}
                  />
                )}
                <Text allowFontScaling={false} style={styles.textButton}>
                  {loading ? "Loading..." : "Refresh Agen & Reseller"}
                </Text>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator
                color={colors.daclen_light}
                size="large"
                style={[styles.spinner, { marginVertical: 32 }]}
              />
            )
          ) : numRoots > 0 ? (
            <View style={styles.containerFlatlist}>
              <VerticalLine
                style={{
                  height: 32,
                  backgroundColor: colors.daclen_light,
                }}
              />
              {tree.map((item, index) => (
                <UserRootItem
                  key={index}
                  userData={item}
                  onPress={() => openUserPopup(item, checkVerification(item))}
                  isCurrentUser={false}
                  isParent={false}
                  isFirstItem={index === 0}
                  isLastItem={index >= tree?.length - 1}
                  isNextBranch={false}
                  isSingleChild={tree?.length < 2}
                  isCurrentVerified={checkVerification(currentUser)}
                  isVerified={checkVerification(item)}
                  openUserPopup={openUserPopup}
                />
              ))}
            </View>
          ) : (
            <Text allowFontScaling={false} style={styles.textUid}>
              User Roots kosong.
            </Text>
          )}
        </View>
      </ScrollView>

      {modal?.visible ? (
        <UserRootModal
          modal={modal}
          hpvArray={hpvArray}
          token={token}
          isSelf={modal?.data?.id === currentUser?.id}
          toggleModal={() =>
            setModal((modal) => ({ ...modal, visible: !modal?.visible }))
          }
          concatHPVArray={(id, data) => concatHPVArray(id, data)}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_bg,
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
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
    backgroundColor: "transparent",
    paddingBottom: staticDimensions.pageBottomPadding,
    paddingTop: 24,
    marginBottom: 10,
    marginHorizontal: 12,
  },
  containerRefresh: {
    alignSelf: "center",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginStart: 6,
  },
  containerLeader: {
    backgroundColor: colors.daclen_black,
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 12,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
    marginStart: 10,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    justifyContent: "flex-start",
  },
  textLeader: {
    marginStart: 10,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    flex: 1,
    color: colors.daclen_light,
  },
  textUid: {
    fontFamily: "Poppins",
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
    backgroundColor: colors.daclen_light,
    elevation: 2,
  },
  spinner: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  hpv: store.userState.hpv,
  hpvArray: store.userState.hpvArray,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxHPV,
      overhaulReduxUserHpvArray, 
      incrementReduxUserHpvArray,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(UserRoots);
