import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import UserRootItem, {
  VerticalLine,
} from "../../components/userroot/UserRootItem";
import UserRootModal from "../../components/modal/UserRootModal";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import {
  getHPV,
  showHPV,
  updateReduxHPV,
  overhaulReduxUserHpvArray,
  incrementReduxUserHpvArray,
} from "../../../axios/user";
import { devuserroottree } from "../../../components/dashboard/constants";
import { capitalizeFirstLetter } from "../../../axios/cart";
import {
  godlevelusername,
  monthNames,
  monthNamesShort,
} from "../../../axios/constants";
import { checkNumberEmpty } from "../../../axios/cart";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import EmptySpinner from "../../components/empty/EmptySpinner";
import Button from "../../components/Button/Button";
/*import UserRootHeaderItem from "./UserRootHeaderItem";
import { notverified, userverified } from "./constants";*/

const defaultModal = {
  visible: false,
  data: null,
  isVerified: true,
  isParent: false,
};

const now = new Date();

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

const UserRootScreen = (props) => {
  const [numRoots, setNumRoots] = useState(0);
  const [tree, setTree] = useState(null);
  const [selfData, setSelfData] = useState(null);
  //const [numVerified, setNumVerified] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(defaultModal);
  const { token, currentUser, hpv, hpvArray, profilePicture } = props;

  useEffect(() => {
    if (currentUser === null) {
      setError("Anda harus login ke akun Daclen.");
    } else {
      showSelfHPV();
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
    console.log("UserRoots modal", modal);
  }, [modal]);

  function openUserPopup(data, isVerified, isParent) {
    setModal({
      visible: true,
      data,
      isVerified,
      isParent,
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
        result?.error
          ? result?.error
          : "Gagal mendapatkan data Agen & Reseller",
      );
    } else {
      props.updateReduxHPV(result?.result);
    }
    await showSelfHPV();
    setLoading(false);
    if (refreshing) {
      setRefreshing(false);
    }
  };

  const showSelfHPV = async () => {
    let join_date = currentUser?.join_date;
    /*try {
      let joinDate = new Date(join_date);
    } catch (e) {
      console.error(e);
      join_date = convertInvoiceNumbertoRegDate(join_date);
    }*/
    try {
      let hpvData = hpv?.data?.children[0] ? hpv?.data?.children[0] : null;
      let newSelfData = {
        id: currentUser?.id,
        name: currentUser?.name,
        status: currentUser?.status,
        email: currentUser?.email,
        nomor_telp: currentUser?.nomor_telp,
        children_length: hpv
          ? hpv?.data?.children[0]?.children?.length
            ? hpv?.data?.children[0]?.children?.length
            : null
          : null,
        join_date,
        pv: currentUser?.poin_user?.poin,
        hpv: currentUser?.poin_user?.hpv,
        poin_user_this_month: currentUser?.poin_user_this_month,
        total_nominal_penjualan: currentUser?.total_nominal_penjualan,
        ...hpvData,
      };
      if (!(hpvArray?.length === undefined || hpvArray?.length < 1)) {
        for (let h of hpvArray) {
          if (h?.id === currentUser?.id) {
            newSelfData = { ...newSelfData, ...h };
            setSelfData(newSelfData);
            return;
          }
        }
      }
      fetchSelfHPV(newSelfData);
    } catch (e) {
      console.error(e);
      setSelfData(null);
    }
  };

  const fetchSelfHPV = async (newSelfData) => {
    const result = await showHPV(currentUser?.id, token);
    if (
      !(
        result === undefined ||
        result === null ||
        result?.result === undefined ||
        result?.result === null
      )
    ) {
      let newHpvData = result?.result;
      newSelfData = { ...newSelfData, ...newHpvData };
    }
    setSelfData(newSelfData);
    concatHPVArray(currentUser?.id, newSelfData);
  };

  function refreshChildren() {
    setRefreshing(true);
    fetchHPV();
  }

  function switchTree() {
    setTree(devuserroottree.data.children);
    /*if (tree?.length === numRoots) {
      
    } else {
      setTree(hpv?.data?.children[0]?.children);
    }*/
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

  /*
 <TouchableOpacity
          onPress={() => switchTree()}
          style={styles.containerLeader}
          disabled={currentUser?.id !== 8054}
        >
          {selfData === null ? null : (
            <Text allowFontScaling={false} style={styles.textLeader}>
              {`Total: ${
                selfData?.distributor_count
                  ? `${selfData?.distributor_count} Distributor `
                  : ""
              }${selfData?.agen_count ? `${selfData?.agen_count} Agen ` : ""}${
                !(
                  selfData?.children_length === undefined ||
                  selfData?.children_length === null
                ) &&
                checkNumberEmpty(selfData?.children_length) <
                  checkNumberEmpty(selfData?.reseller_count)
                  ? checkNumberEmpty(selfData?.children_length)
                  : selfData?.reseller_count === undefined ||
                      selfData?.reseller_count === null
                    ? "0"
                    : selfData?.reseller_count
              } Reseller -- ${
                monthNamesShort[new Date().getMonth()]
              } ${new Date().getFullYear().toString()}`}
            </Text>
          )}

          <TouchableOpacity
            style={styles.containerRefresh}
            disabled={loading || refreshing}
            onPress={() => fetchHPV()}
          >
            {loading || refreshing || selfData === null ? (
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
        */

  return (
    <CenteredView
      title="Agen & Reseller"
      style={styles.container}
      rightIcon="refresh"
      onRightIconPress={() => refreshChildren()}
    >
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
        <Text allowFontScaling={false} style={styles.textHeader}>
          {`${monthNames[now.getMonth()]} ${now.getFullYear()}`}
        </Text>
        <View style={styles.containerMain}>
          <UserRootItem
            userData={{
              foto:
                hpv?.data?.name === godlevelusername
                  ? require("../../assets/favicon.png")
                  : hpv?.data?.foto,
              name: hpv?.data?.name,
              title: hpv?.data?.title,
            }}
            onPress={() => openUserPopup(hpv?.data, true, true)}
            status={
              hpv?.data?.name === godlevelusername
                ? ""
                : hpv?.data?.status
                  ? capitalizeFirstLetter(hpv?.data?.status)
                  : currentUser?.status == "distributor" ||
                      currentUser?.status === "agen"
                    ? "Distributor"
                    : "Agen"
            }
            isCurrentUser={false}
            isParent={true}
            isFirstItem={false}
            isLastItem={false}
            isNextBranch={false}
            isSingleChild={true}
            isVerified={true}
            hpvArray={hpvArray}
          />
          <VerticalLine style={{ height: 32, marginStart: staticDimensions.marginHorizontal / 2 }} />
          <UserRootItem
            userData={{
              ...selfData,
              foto: profilePicture ? profilePicture : null,
            }}
            onPress={() =>
              openUserPopup(selfData, checkVerification(currentUser), false)
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
              <Button
                onPress={() => fetchHPV()}
                loading={loading}
                text="Refresh"
              />
            ) : (
              <EmptySpinner minHeight={dimensions.fullHeight * 0.25} />
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
                  onPress={() =>
                    openUserPopup(item, checkVerification(item), false)
                  }
                  isCurrentUser={false}
                  isParent={false}
                  isFirstItem={index === 0}
                  isLastItem={index >= tree?.length - 1}
                  isNextBranch={false}
                  isSingleChild={tree?.length < 2}
                  isCurrentVerified={checkVerification(currentUser)}
                  isVerified={checkVerification(item)}
                  openUserPopup={openUserPopup}
                  hpvArray={hpvArray}
                />
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => switchTree()}
              disabled={currentUser?.id !== 8054}
            >
              <EmptyPlaceholder
                text="Jaringan Anda masih kosong"
                minHeight={dimensions.fullHeight * 0.25}
              />
            </TouchableOpacity>
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
      <AlertBox text={error} onClose={() => setError(null)} />
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_grey_light,
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
    marginStart: staticDimensions.marginHorizontal,
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
  textHeader: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginVertical: 16,
    textAlign: "center",
    width: "100%",
    color: colors.black,
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
  profilePicture: store.userState.profilePicture,
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
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(UserRootScreen);
