import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
} from "react-native";
//import * as Sharing from "expo-sharing";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../styles/base";
import Header from "../DashboardHeader";
import {
  clearUserData,
  getCurrentUser,
  getHPV,
  updateReduxProfileLockStatus,
} from "../../axios/user";
import DashboardUser from "./components/DashboardUser";
import DashboardStats from "./components/DashboardStats";
import { setObjectAsync } from "../asyncstorage";
import { ASYNC_USER_HPV_KEY } from "../asyncstorage/constants";
import DashboardButtons from "./components/DashboardButtons";
import DashboardBottom from "./components/DashboardBottom";
import DashboardLock from "./components/DashboardLock";
import DashboardLogout from "./components/DashboardLogout";
import DashboardVerification from "./components/DashboardVerification";
import DashboardCreatePIN from "./components/DashboardCreatePIN";
import DashboardUpgrade from "./components/DashboardUpgrade";

const Dashboard = (props) => {
  const [message, setMessage] = useState({
    text: null,
    isError: false,
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { currentUser, token, hpv, profileLock, profilePIN } = props;

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
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.id === null
    ) {
      return;
    }
  }, [token, currentUser]);

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
    if (pinLoading) {
      setPinLoading(false);
    }
    setMessage({
      text: null,
      isError: false,
    });
  }, [profileLock, pinLoading]);

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

  function onLockPress() {
    props.updateReduxProfileLockStatus(!profileLock);
  }

  function receiveOTP(e) {
    console.log("receiveOTP", e);
    setPinLoading(true);
    if (e === profilePIN) {
      setMessage({ text: "PIN benar", isError: false });
      props.updateReduxProfileLockStatus(false);
    } else {
      setMessage({
        text: "PIN salah. Tekan Reset PIN jika Anda lupa PIN.",
        isError: true,
      });
      setPinLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <ImageBackground
          source={require("../../assets/profilbg.png")}
          style={styles.background}
          resizeMode="cover"
        />
      ) : null}

      <Header
        username={currentUser?.name}
        lockStatus={profileLock}
        onLockPress={() => onLockPress()}
      />

      {message?.text === null || message?.text === "" ? null : (
        <Text
          style={[
            styles.textError,
            {
              backgroundColor: message?.isError
                ? colors.daclen_red
                : colors.daclen_green,
            },
          ]}
        >
          {message?.text}
        </Text>
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
        ) : currentUser?.status_member === undefined ||
        currentUser?.status_member === null ||
        currentUser?.status_member !== "premium" ? (
          <DashboardUpgrade />
        ) : profilePIN === null || profilePIN === "" ? (
          <DashboardCreatePIN />
        ) : currentUser?.nomor_telp_verified_at === null ||
          currentUser?.nomor_telp_verified_at === "" ? (
          <DashboardVerification />
        ) : profileLock === undefined ||
          profileLock === null ||
          profileLock ||
          pinLoading ? (
          <DashboardLock receiveOTP={(e) => receiveOTP(e)} />
        ) : (
          <View style={styles.scrollView}>
            <DashboardUser currentUser={currentUser} />
            <DashboardStats currentUser={currentUser} />
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
        {profileLock && pinLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={styles.spinner}
          />
        ) : null}
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
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
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.daclen_light,
    textAlign: "center",
    zIndex: 2,
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  profilePIN: store.userState.profilePIN,
  profileLock: store.userState.profileLock,
  hpv: store.userState.hpv,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearUserData,
      getCurrentUser,
      getHPV,
      updateReduxProfileLockStatus,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Dashboard);
