import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
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
import DashboardUser from "../../../components/dashboard/components/DashboardUser";
import DashboardStats from "../../../components/dashboard/components/DashboardStats";
import {
  getObjectAsync,
  setObjectAsync,
} from "../../../components/asyncstorage";
import {
  ASYNC_USER_HPV_KEY,
  ASYNC_USER_REGISTER_SNAP_TOKEN_KEY,
} from "../../../components/asyncstorage/constants";
import DashboardButtons, {
  DashButton,
} from "../../components/dashboard/DashboardButtons";
import DashboardLock from "../../components/dashboard/DashboardLock";
import DashboardUpgrade from "../../../components/dashboard/components/DashboardUpgrade";
import DashboardTimer from "../../../components/dashboard/components/DashboardTimer";
import { updateReduxHomePDFFiles } from "../../axios/home";
import { checkNumberEmpty } from "../../axios";
import { convertDateISOStringtoDisplayDate } from "../../axios/profile";
import {
  APRINDA_ID,
  APRINDA_MOCK,
  VIOLETTA_ID,
  VIOLETTA_MOCK,
} from "../../axios/constants/mockup";
import { monthNames, recruitmenttarget } from "../../axios/constants";
import { getPDFFiles } from "../../axios/pdf";
import CenteredView from "../../components/view/CenteredView";
import DashboardContainer from "../../components/dashboard/DashboardContainer";
import AlertBox from "../../components/alert/AlertBox";
import EmptySpinner from "../../components/empty/EmptySpinner";
import DashboardSaldo from "../../components/dashboard/DashboardSaldo";
import { formatPrice } from "../../axios/cart";

const ratio = dimensions.fullWidthAdjusted / 430;
const topMargin = 32 * ratio;

const defaultTotalRekrutmen = {
  showHPV: 0,
  childrenSize: 0,
};

const DefaultMessage = {
  text: null,
  isError: false,
};

const DashboardScreen = (props) => {
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
    pdfFiles,
  } = props;
  const navigation = useNavigation();

  const [message, setMessage] = useState(DefaultMessage);
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
  const [oldStats, setOldStats] = useState(false);
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
      (currentUser?.status !== undefined && currentUser?.status !== null) ||
      currentUser?.level === "spv" ||
      currentUser?.status_member === "supervisor" ||
      (currentUser?.name === "daclen" &&
        currentUser?.level === "super_user" &&
        currentUser?.id === 2)
    ) {
      try {
        setRegDate(new Date(currentUser?.join_date));
      } catch (e) {
        console.error(e);
        setRegDate(
          currentUser?.join_date
            ? convertInvoiceNumbertoRegDate(currentUser?.join_date)
            : null,
        );
      }
      try {
        setTotalRekrutmen({
          ...total_rekrutmen,
          childrenSize: checkNumberEmpty(
            currentUser?.target_rekrutmen_latest?.target_dicapai,
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
  }, [currentUser]);

  useEffect(() => {
    if (fetchingToken) {
      props.getRegisterSnapToken(currentUser?.id, token);
    } else if (registerSnapToken === null) {
      checkAsyncSnapToken();
    }
  }, [fetchingToken]);

  useEffect(() => {
    if (registerSnapToken !== null) {
      setObjectAsync(ASYNC_USER_REGISTER_SNAP_TOKEN_KEY, registerSnapToken);
      setFetchingToken(false);
    }
    console.log("redux registerSnapToken", registerSnapToken);
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
    if (
      saldoAkumulasi === null &&
      !(
        token === null ||
        currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.id === null ||
        !currentUser?.isActive
      )
    ) {
      props.getLaporanSaldo(currentUser?.id, token);
    }
  }, [saldoAkumulasi]);

  useEffect(() => {
    if (token === null) {
      return;
    }
    if (pdfFiles === null) {
      fetchPDFFiles();
    }
  }, [token, pdfFiles]);

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
      ASYNC_USER_REGISTER_SNAP_TOKEN_KEY,
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
      currentUser?.join_date === undefined ||
      currentUser?.join_date === null ||
      currentUser?.target_rekrutmen_latest === undefined ||
      currentUser?.target_rekrutmen_latest === null
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

  const fetchPDFFiles = async () => {
    const fetchData = await getPDFFiles(token);
    if (fetchData !== null) {
      props.updateReduxHomePDFFiles(fetchData);
    }
  };

  const refreshDashboard = () => {
    fetchHPV();
    fetchPDFFiles();
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
        text: "PIN yang Anda masukkan salah.",
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

  const closeError = () => {
    if (hpvError) {
      fetchHPV();
    } else {
      setMessage(DefaultMessage);
    }
  };

  return (
    <CenteredView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshDashboard()}
          />
        }
      >
        <DashboardHeader
          username={currentUser?.name}
          onLockPress={() => onLockPress()}
        />

        {currentUser === null ||
        currentUser?.id === undefined ||
        currentUser?.name === undefined ? (
          <DashboardContainer
            header="Login"
            text="Login / Register untuk menggunakan aplikasi Daclen"
            buttonText="Login"
            buttonWidth={100 * ratio}
            onPress={() => navigation.navigate("Login")}
            style={styles.containerModal}
          />
        ) : (currentUser?.join_date === undefined ||
            currentUser?.join_date === null ||
            currentUser?.target_rekrutmen_latest === undefined ||
            currentUser?.target_rekrutmen_latest === null) &&
          !(
            currentUser?.level === "spv" ||
            currentUser?.status_member === "supervisor"
          ) &&
          !(
            currentUser?.name === "daclen" &&
            currentUser?.level === "super_user" &&
            currentUser?.id === 2
          ) ? (
          <DashboardUpgrade
            registerSnapToken={registerSnapToken}
            fetchingToken={fetchingToken}
            loadData={() => loadUpgradeData()}
          />
        ) : profilePIN === null || profilePIN === "" ? (
          <DashboardContainer
            header="PIN"
            text="Anda perlu membuat PIN 4 digit untuk mengamankan halaman Profil"
            buttonText="Buat PIN"
            buttonWidth={120 * ratio}
            onPress={() => navigation.navigate("CreatePIN")}
            style={styles.containerModal}
          />
        ) : profileLock === true ? (
          <DashboardContainer
            header="Masukkan PIN"
            content={<DashboardLock receiveOTP={(e) => receiveOTP(e)} />}
            buttonText="Reset PIN"
            buttonWidth={120 * ratio}
            onPress={() =>
              navigation.navigate("Login", {
                resetPIN: true,
              })
            }
            style={styles.containerModal}
          />
        ) : (
          <View style={styles.containerInside}>
            <DashboardSaldo
              {...currentUser}
              mockData={mockData}
              style={[styles.containerModal, { top: 0 }]}
              refreshSaldo={() => props.getLaporanSaldo(currentUser?.id, token)}
            />
            <TouchableOpacity
              onPress={() => setOldStats((oldStats) => !oldStats)}
            >
              <Text allowFontScaling={false} style={styles.textHeader}>
                Overview
              </Text>
            </TouchableOpacity>

            {oldStats ? (
              <DashboardStats
                currentUser={currentUser}
                hpv={hpv}
                regDate={regDate}
                recruitmentTimer={recruitmentTimer}
                mockData={mockData}
                onDatePress={() => onDatePress()}
                showTimerModal={() => setShowTimerModal(true)}
              />
            ) : (
              <View style={styles.containerHorizontal}>
                <DashboardContainer
                  header={
                    checkNumberEmpty(currentUser?.total_nominal_penjualan)
                      ? formatPrice(
                          checkNumberEmpty(
                            currentUser?.total_nominal_penjualan,
                          ),
                        )
                      : "Rp 0"
                  }
                  content={
                    <View style={styles.containerText}>
                      <Text allowFontScaling={false} style={styles.text}>
                        Jumlah Total Transaksi
                      </Text>
                      <Text allowFontScaling={false} style={styles.text}>
                        Anda memiliki{" "}
                        <Text
                          style={{ fontFamily: "Poppins-SemiBold" }}
                        >{`${checkNumberEmpty(
                          currentUser?.jumlah_invoice,
                        )} invoice`}</Text>{" "}
                        di bulan {monthNames[new Date().getMonth()]}{" "}
                        {new Date().getFullYear().toString()}
                      </Text>
                    </View>
                  }
                  buttonText="Transaksi"
                  buttonWidth={100 * ratio}
                  onPress={() => navigation.navigate("History")}
                  style={{ flex: 5, minHeight: 200 * ratio }}
                />
                <DashboardContainer
                  header={`Reseller & Agen`}
                  content={
                    <View
                      style={[styles.containerText, { width: 120 * ratio }]}
                    >
                      <Text allowFontScaling={false} style={styles.text}>
                        Anda memiliki{" "}
                        <Text
                          style={{ fontFamily: "Poppins-SemiBold" }}
                        >{`${checkNumberEmpty(
                          currentUser?.jumlah_agen,
                        )} Agen`}</Text>{" "}
                        dan{" "}
                        <Text
                          style={{ fontFamily: "Poppins-SemiBold" }}
                        >{`${checkNumberEmpty(
                          currentUser?.jumlah_reseller,
                        )} Reseller`}</Text>
                      </Text>
                    </View>
                  }
                  buttonText="Detil"
                  buttonWidth={100 * ratio}
                  onPress={() => navigation.navigate("UserRootsScreen")}
                  maxTextWidth={120}
                  style={{
                    flex: 4,
                    minHeight: 200 * ratio,
                    marginStart: staticDimensions.marginHorizontal / 2,
                  }}
                />
              </View>
            )}

            {currentUser?.bonus_level_user ? (
              <DashButton
                iconStyle={{ borderRadius: 8 * ratio, borderWidth: 0 }}
                text="Bonus Level Jaringan"
                iconText="A"
                caption="Anda memiliki bonus level jaringan "
                style={{ marginHorizontal: staticDimensions.marginHorizontal }}
                onPress={() => navigation.navigate("BonusRootScreen")}
              />
            ) : null}

            <Text allowFontScaling={false} style={styles.textHeader}>
              History
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.containerHorizontalItems}
            >
              <DashboardContainer
                header="Saldo"
                text="Lihat riwayat saldo Anda, dari saldo masuk hingga saldo keluar."
                buttonText="Selengkapnya"
                buttonWidth={185 * ratio}
                onPress={() => navigation.navigate("SaldoReportScreen")}
                style={{
                  marginHorizontal: staticDimensions.marginHorizontal,
                }}
              />
              <DashboardContainer
                header="Poin"
                text="Lihat riwayat poin Anda, dari transaksi, rekrutmen dan penukaran."
                buttonText="Selengkapnya"
                buttonWidth={185 * ratio}
                onPress={() => navigation.navigate("PointReportScreen")}
                style={{
                  marginEnd: staticDimensions.marginHorizontal,
                }}
              />
            </ScrollView>

            <Text allowFontScaling={false} style={styles.textHeader}>
              More Information
            </Text>

            <DashboardButtons
              userId={currentUser?.id}
              username={currentUser?.name}
              openCountdown={() => setShowTimerModal(true)}
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
          <EmptySpinner minHeight={dimensions.fullHeight * 0.75} />
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
          join_date={convertDateISOStringtoDisplayDate(
            currentUser?.join_date,
            true,
            null,
          )}
          regDateInMs={regDateInMs}
          countdownColor={
            currentUser?.countdownColor ? currentUser?.countdownColor : null
          }
          target_rekrutmen={
            currentUser?.target_rekrutmen_latest
              ? currentUser?.target_rekrutmen_latest?.target_reseller
                ? currentUser?.target_rekrutmen_latest?.target_reseller
                : recruitmenttarget
              : recruitmenttarget
          }
          target_rekrutmen_latest={currentUser?.target_rekrutmen_latest}
          total_rekrutmen={total_rekrutmen}
        />
      )}
      <AlertBox
        text={hpvError ? "Refresh catatan akun sekarang." : message.text}
        closeText={hpvError ? "Refresh" : null}
        success={!message.isError}
        onClose={() => closeError()}
        style={{ bottom: 100 }}
      />
    </CenteredView>
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
    backgroundColor: colors.daclen_grey_light,
  },
  containerModal: {
    marginHorizontal: staticDimensions.marginHorizontal,
    zIndex: 6,
    top: -topMargin,
  },
  scrollView: {
    flex: 1,
    width: dimensions.fullWidthAdjusted,
    backgroundColor: "transparent",
  },
  containerInside: {
    backgroundColor: "transparent",
    zIndex: 6,
    top: -topMargin,
    minHeight: dimensions.fullHeight,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: staticDimensions.marginHorizontal / 2,
    flexDirection: "row",
    alignItems: "center",
  },
  containerHorizontalItems: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  containerText: {
    backgroundColor: "transparent",
    flex: 1,
  },
  textHeader: {
    fontSize: 18 * ratio,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.black,
    marginVertical: staticDimensions.marginHorizontal / 2,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  text: {
    fontSize: 12 * ratio,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    color: colors.black,
    maxWidth: 150 * ratio,
    marginTop: staticDimensions.marginHorizontal / 2,
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
  pdfFiles: store.homeState.pdfFiles,
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
      updateReduxHomePDFFiles,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(DashboardScreen);
