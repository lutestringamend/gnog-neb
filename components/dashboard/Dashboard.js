import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import * as Sharing from "expo-sharing";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../styles/base";
import Header from "./Header";
import {
  clearUserData,
  getCurrentUser,
  getHPV,
  updateReduxHPV,
  updateReduxProfileLockStatus,
  getRegisterSnapToken,
  updateReduxRegisterSnapToken,
  convertInvoiceNumbertoRegDate,
  convertInvoiceNumbertoJoinDate,
  getLaporanSaldo,
} from "../../axios/user";
import DashboardUser from "./components/DashboardUser";
import DashboardStats from "./components/DashboardStats";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  ASYNC_USER_HPV_KEY,
  ASYNC_USER_REGISTER_SNAP_TOKEN_KEY,
} from "../asyncstorage/constants";
import DashboardButtons from "./components/DashboardButtons";
//import DashboardBottom from "./components/DashboardBottom";
import DashboardLock from "./components/DashboardLock";
import DashboardLogout from "./components/DashboardLogout";
import DashboardVerification from "./components/DashboardVerification";
import DashboardCreatePIN from "./components/DashboardCreatePIN";
import DashboardUpgrade from "./components/DashboardUpgrade";
import DashboardTimer from "./components/DashboardTimer";
import { checkNumberEmpty } from "../../axios";
import { convertDateISOStringtoDisplayDate } from "../../axios/profile";
import { APRINDA_ID, APRINDA_MOCK, VIOLETTA_ID, VIOLETTA_MOCK } from "../../axios/constants/mockup";

const defaultTotalRekrutmen = {
  showHPV: 0,
  childrenSize: 0,
};

const Dashboard = (props) => {
  const {
    currentUser,
    token,
    profilePicture,
    registerSnapToken,
    hpv,
    profileLock,
    profilePIN,
    regDateInMs,
    recruitmentTimer,
    saldoAkumulasi,
  } = props;

  const [message, setMessage] = useState({
    text: null,
    isError: false,
  });
  //const [pinLoading, setPinLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingToken, setFetchingToken] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(true);
  const [total_rekrutmen, setTotalRekrutmen] = useState({
    ...defaultTotalRekrutmen,
    showHPV: checkNumberEmpty(props.hpvTotalRekrutmen),
  });
  const [regDate, setRegDate] = useState(null);
  const [hpvError, setHpvError] = useState(null);
  const [mockData, setMockData] = useState(null);

  /*const [isSharingAvailable, setSharingAvailable] = useState(false);
  useEffect(() => {
    const checkSharingAsync = async () => {
      const isAvailable = await Sharing.isAvailableAsync();
      setSharingAvailable(isAvailable && Platform.OS !== "web");
      console.log("Sharing isAvailable", isAvailable);
    };
    checkSharingAsync();
  }, []);*/

  useEffect(() => {
    if (
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.id === null ||
      currentUser?.status_member === undefined ||
      currentUser?.status_member === "premium" ||
      (currentUser?.status !== undefined && currentUser?.status !== null) ||
      currentUser?.level === "spv" ||
      currentUser?.status_member === "supervisor"
    ) {
      try {
        setRegDate(new Date(currentUser?.join_date));
      } catch (e) {
        console.error(e);
        setRegDate(
          currentUser?.join_date
            ? convertInvoiceNumbertoRegDate(currentUser?.join_date)
            : null
        );
      }
      try {
        setTotalRekrutmen({
          ...total_rekrutmen,
          childrenSize: checkNumberEmpty(
            currentUser?.target_rekrutmen_latest?.target_dicapai
          ),
        });
      } catch (e) {
        console.error(e);
        setTotalRekrutmen({
          ...total_rekrutmen,
          childrenSize: 0,
        });
      }
      return;
    }

    if (fetchingToken) {
      props.getRegisterSnapToken(currentUser?.id, token);
    } else if (registerSnapToken === null) {
      checkAsyncSnapToken();
    }
  }, [currentUser]);

  useEffect(() => {
    if (registerSnapToken !== null) {
      setObjectAsync(ASYNC_USER_REGISTER_SNAP_TOKEN_KEY, registerSnapToken);
      setFetchingToken(false);
    }
    //console.log("redux registerSnapToken", registerSnapToken);
  }, [registerSnapToken]);

  useEffect(() => {
    if (hpv === undefined || hpv === null || hpv?.data === undefined) {
      fetchHPV();
      /*} else if (hpv?.data === null) {
      setMessage({
        text: "Mohon cek koneksi Internet Anda",
        isError: true,
      });*/
    } else {
      setRefreshing(false);
      setMessage({
        text: null,
        isError: false,
      });
      console.log("redux HPV", hpv);
      setObjectAsync(ASYNC_USER_HPV_KEY, hpv);
    }
  }, [hpv]);

  useEffect(() => {
    if (profileLock) {
      return;
    }
    /*if (pinLoading) {
      setPinLoading(false);
    }*/
    setMessage({
      text: null,
      isError: false,
    });
  }, [profileLock]);

  useEffect(() => {
    if (saldoAkumulasi === null && !(token === null || currentUser === null || currentUser?.id === undefined || currentUser?.id === null)) {
      props.getLaporanSaldo(currentUser?.id, token);
    }
  }, [saldoAkumulasi]);

  /*useEffect(() => {
    if (mockData === null) {
      return;
    }
    console.log("mockData", mockData, mockData?.status, mockData?.reseller);
  }, [mockData]);*/

  const checkAsyncSnapToken = async () => {
    if (fetchingToken) {
      return;
    }
    setFetchingToken(true);
    const storageSnapToken = await getObjectAsync(
      ASYNC_USER_REGISTER_SNAP_TOKEN_KEY
    );
    if (
      storageSnapToken === undefined ||
      storageSnapToken === null ||
      storageSnapToken?.snap_token === undefined
    ) {
      props.getRegisterSnapToken(currentUser?.id, token);
    } else {
      props.updateReduxRegisterSnapToken(storageSnapToken);
    }
  };

  const loadUpgradeData = async () => {
    if (token === undefined || token === null) {
      return;
    }
    setFetchingToken(true);
    props.getCurrentUser(token, null);
  };

  const fetchHPV = async () => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.id === null ||
      currentUser?.status === undefined ||
      currentUser?.status === null
    ) {
      return;
    }
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
      setHpvError(result?.error ? result?.error : "");
    } else {
      props.updateReduxHPV(result?.result);
      setHpvError(null);
    }
  };

  function onLockPress() {
    props.updateReduxProfileLockStatus(!profileLock);
    if (!showTimerModal) {
      setShowTimerModal(true);
    }
  }

  function receiveOTP(e) {
    console.log("receiveOTP", e);
    //setPinLoading(true);
    if (e === profilePIN) {
      setMessage({ text: "PIN benar", isError: false });
      props.updateReduxProfileLockStatus(false);
    } else {
      setMessage({
        text: "PIN salah. Tekan Reset PIN jika Anda lupa PIN.",
        isError: true,
      });
      //setPinLoading(false);
    }
  }

  function onDatePress() {
    if (currentUser?.id === 8054) {
      if (mockData === null) {
        setMockData(VIOLETTA_MOCK);
      } else if (mockData === VIOLETTA_MOCK) {
        setMockData(APRINDA_MOCK);
      } else {
        setMockData(null);
      }
    } else if (mockData !== null) {
      setMockData(null);
    } else if (currentUser?.id === VIOLETTA_ID) {
      setMockData(VIOLETTA_MOCK);
    } else if (currentUser?.id === APRINDA_ID) {
      setMockData(APRINDA_MOCK);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/profilbg.png")}
        style={styles.background}
        resizeMode="cover"
      />

      <Header
        username={currentUser?.name}
        lockStatus={profileLock}
        onLockPress={() => onLockPress()}
      />

      {(message?.text === null || message?.text === "") &&
      hpvError === null ? null : (
        <TouchableOpacity
          onPress={() => fetchHPV()}
          style={[
            styles.containerError,
            {
              backgroundColor:
                hpvError !== null
                  ? colors.daclen_blue
                  : message?.isError
                  ? colors.daclen_red
                  : colors.daclen_green,
            },
          ]}
          disabled={hpvError === null}
        >
          {hpvError === null ? null : (
            <MaterialCommunityIcons
              name="refresh"
              size={20}
              color={colors.daclen_light}
              style={styles.refresh}
            />
          )}
          <Text allowFontScaling={false} style={styles.textError}>
            {hpvError === null
              ? message?.text === null || message?.text === ""
                ? ""
                : message?.text
              : "Refresh Catatan Akun"}
          </Text>
        </TouchableOpacity>
      )}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchHPV()}
          />
        }
      >
        {currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.name === undefined ? (
          <DashboardLogout />
        ) : (currentUser?.status === undefined ||
            currentUser?.status === null) &&
          !(
            currentUser?.level === "spv" ||
            currentUser?.status_member === "supervisor"
          ) ? (
          <DashboardUpgrade
            registerSnapToken={registerSnapToken}
            fetchingToken={fetchingToken}
            loadData={() => loadUpgradeData()}
          />
        ) : currentUser?.nomor_telp_verified_at === null ||
          currentUser?.nomor_telp_verified_at === "" ? (
          <DashboardVerification />
        ) : profilePIN === null || profilePIN === "" ? (
          <DashboardCreatePIN />
        ) : profileLock === true ? (
          <DashboardLock receiveOTP={(e) => receiveOTP(e)} />
        ) : (
          <View style={styles.scrollView}>
            <DashboardUser
              currentUser={currentUser}
              profilePicture={profilePicture}
              mockData={mockData}
              saldoAkumulasi={currentUser?.total_komisi_user ? currentUser?.total_komisi_user : saldoAkumulasi}
              refreshSaldo={() => props.getLaporanSaldo(currentUser?.id, token)}
            />
            <DashboardStats
              currentUser={currentUser}
              regDate={regDate}
              recruitmentTimer={recruitmentTimer}
              mockData={mockData}
              onDatePress={() => onDatePress()}
              showTimerModal={() => setShowTimerModal(true)}
            />
            <DashboardButtons
              userId={currentUser?.id}
              username={currentUser?.name}
              setMessage={(text, isError) =>
                setMessage({
                  text,
                  isError,
                })
              }
            />
          </View>
        )}
        {profileLock === undefined || profileLock === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={styles.spinner}
          />
        ) : null}
      </ScrollView>

      {currentUser === null ||
      currentUser?.status === undefined ||
      currentUser?.status === null ||
      profileLock ||
      recruitmentTimer === undefined ||
      recruitmentTimer === null ||
      recruitmentTimer < 0 ||
      !showTimerModal ? null : (
        <DashboardTimer
          recruitmentTimer={recruitmentTimer}
          showTimerModal={showTimerModal}
          setShowTimerModal={setShowTimerModal}
          join_date={convertDateISOStringtoDisplayDate(currentUser?.join_date, true, null)}
          regDateInMs={regDateInMs}
          countdownColor={
            currentUser?.countdownColor ? currentUser?.countdownColor : null
          }
          target_rekrutmen={
            currentUser?.target_rekrutmen_latest
              ? currentUser?.target_rekrutmen_latest?.target_reseller
                ? currentUser?.target_rekrutmen_latest?.target_reseller
                : currentUser?.target_rekrutmen
              : currentUser?.target_rekrutmen
          }
          target_rekrutmen_latest={currentUser?.target_rekrutmen_latest}
          total_rekrutmen={total_rekrutmen}
        />
      )}
    </View>
  );
};

/*

      {profileLock === undefined ||
      profileLock === null ||
      profileLock ? null : (
        <DashboardBottom
          isSharingAvailable={Platform.OS !== "web"}
          setMessage={(text, isError) =>
            setMessage({
              text,
              isError,
            })
          }
        />
      )}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerError: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.daclen_light,
    textAlignVertical: "center",
    textAlign: "center",
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
  refresh: {
    alignSelf: "center",
    marginEnd: 10,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  profilePicture: store.userState.profilePicture,
  regDateInMs: store.userState.regDateInMs,
  registerSnapToken: store.userState.registerSnapToken,
  profilePIN: store.userState.profilePIN,
  profileLock: store.userState.profileLock,
  hpv: store.userState.hpv,
  hpvTotalRekrutmen: store.userState.hpvTotalRekrutmen,
  saldoAkumulasi: store.userState.saldoAkumulasi,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearUserData,
      getCurrentUser,
      updateReduxHPV,
      updateReduxProfileLockStatus,
      getRegisterSnapToken,
      updateReduxRegisterSnapToken,
      getLaporanSaldo,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Dashboard);
