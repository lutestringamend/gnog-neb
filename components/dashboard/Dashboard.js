import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
//import * as Sharing from "expo-sharing";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../styles/base";
import Header from "../DashboardHeader";
import { clearUserData, getCurrentUser, getHPV, updateReduxProfileLockStatus } from "../../axios/user";
import DashboardUser from "./components/DashboardUser";
import DashboardStats from "./components/DashboardStats";
import { setObjectAsync } from "../asyncstorage";
import { ASYNC_USER_HPV_KEY } from "../asyncstorage/constants";
import DashboardButtons from "./components/DashboardButtons";
import DashboardBottom from "./components/DashboardBottom";

const Dashboard = (props) => {
  const [message, setMessage] = useState({
    text: null,
    isError: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  const { currentUser, token, hpv, profileLock } = props;

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
    } else if (hpv?.data === null) {
      setMessage({
        text: "Mohon cek koneksi Internet Anda",
        isError: true,
      });
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

  function fetchHPV() {
    props.getHPV(currentUser?.id, token);
  }

  function onLockPress() {
    props.updateReduxProfileLockStatus(!profileLock);
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
      <ScrollView style={styles.scrollView}>
        <Header
          username={currentUser?.name}
          lockStatus="closed"
          onLockPress={() => onLockPress()}
        />
        {currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.name === undefined ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={styles.spinner}
          />
        ) : profileLock === undefined || profileLock === null || profileLock ? (
          <View style={styles.containerLock}>
            <Text style={styles.textLockHeader}>TERKUNCI</Text>
          </View>
        ) : (
          <View style={styles.scrollView}>
            <DashboardUser currentUser={currentUser} />
            <DashboardStats currentUser={currentUser} />
            <DashboardButtons />
          </View>
        )}
      </ScrollView>

      {profileLock === undefined ||
      profileLock === null ||
      profileLock ? null : (
        <DashboardBottom
          username={currentUser?.name}
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
  containerLock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  textLockHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.daclen_light,
    textAlign: "center",
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
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
