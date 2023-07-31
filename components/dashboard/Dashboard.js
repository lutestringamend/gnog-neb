import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
//import * as Sharing from "expo-sharing";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../styles/base";
import Header from "../DashboardHeader";
import { clearUserData, getCurrentUser, getHPV } from "../../axios/user";
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

  const { currentUser, token, hpv } = props;

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

  return (
    <View style={styles.container}>
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
        <Header username={currentUser?.name} />
        {currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.name === undefined ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={styles.spinner}
          />
        ) : (
          <View style={styles.scrollView}>
            <DashboardUser currentUser={currentUser} />
            <DashboardStats currentUser={currentUser} />
            <DashboardButtons />
          </View>
        )}
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  hpv: store.userState.hpv,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearUserData,
      getCurrentUser,
      getHPV,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Dashboard);
