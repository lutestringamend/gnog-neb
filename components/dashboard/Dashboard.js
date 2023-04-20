import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  Linking,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { clearUserData, getCurrentUser, getHPV } from "../../axios/user";

import RBSheet from "react-native-raw-bottom-sheet";
import Header from "./Header";
import { colors } from "../../styles/base";
import Main from "./Main";
import { webdashboard } from "../../axios/constants";
import { useNavigation } from "@react-navigation/native";
import BSDashboard from "../bottomsheets/BSDashboard";
import {
  bonusrootpopup,
  komisiuserpopup,
  poinuserhpvpopup,
  poinuserpopup,
  poinusertotalpopup,
} from "./constants";

function DashboardMain(props) {
  const [message, setMessage] = useState({
    text: null,
    isError: false,
  });
  const [browserText, setBrowserText] = useState(null);
  const [popupDetail, setPopupDetail] = useState({title: null});
  const navigation = useNavigation();
  const rbSheet = useRef();
  const { currentUser, token, hpv } = props;

  useEffect(() => {
    if (token !== null) {
      if (hpv === null) {
        props.getHPV(currentUser?.id, token);
      } else {
        console.log({ hpv });
      }
    }
  }, [token, hpv]);

  useEffect(() => {
    if (popupDetail?.title !== null) {
      rbSheet.current.open();
    }
    //console.log("popupDetail", popupDetail);
  }, [popupDetail]);

  function buttonPress(title) {
    if (title !== null && title === popupDetail?.title) {
      rbSheet.current.open();
    } else {
      //setBrowserText(`Lihat ${title} di Browser`);
      switch (title) {
        case poinuserpopup.title:
          setPopupDetail(poinuserpopup);
          break;
        case poinuserhpvpopup.title:
          setPopupDetail(poinuserhpvpopup);
          break;
        case poinusertotalpopup.title:
          setPopupDetail(poinusertotalpopup);
          break;
        case komisiuserpopup.title:
          setPopupDetail(komisiuserpopup);
          break;
        case bonusrootpopup.title:
          setPopupDetail(bonusrootpopup);
          break;
        default:
          break;
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header
          username={currentUser?.name}
          onMessageChange={(m) => setMessage(m)}
        />
        {message?.text !== null && message?.text !== undefined ? (
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
        ) : null}
        <TouchableOpacity onPress={() => Linking.openURL(webdashboard)}>
          <Text
            style={[
              styles.textLogin,
              {
                backgroundColor:
                  browserText === null
                    ? colors.daclen_graydark
                    : colors.daclen_orange,
              },
            ]}
          >
            {browserText === null ? "Lihat Dashboard lengkap" : browserText}
          </Text>
        </TouchableOpacity>
        {currentUser?.nomor_telp_verified_at === null ? (
          <View style={styles.containerVerification}>
            <View style={styles.containerLogo}>
              <Image
                source={require("../../assets/whatsappverify.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.containerContent}>
              <Text style={styles.textHeader}>Verifikasi Nomor Handphone</Text>
              <Text style={styles.text}>
                Anda perlu verifikasi nomor handphone melalui Whatsapp sebelum
                bisa menggunakan Dashboard.
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("VerifyPhone")}
                style={styles.button}
              >
                <Text style={styles.textButton}>Verifikasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Main
            poin_user={currentUser?.poin_user}
            komisi_user={currentUser?.komisi_user}
            bonus_level_user={currentUser?.bonus_level_user}
            referral_number={hpv?.data?.children?.length}
            onButtonPress={(e) => buttonPress(e)}
          />
        )}
      </ScrollView>
      <RBSheet ref={rbSheet} openDuration={250} height={popupDetail?.height ? popupDetail?.height : 370}>
        <BSDashboard
          data={popupDetail}
          closeThis={() => rbSheet.current.close()}
        />
      </RBSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.daclen_black,
  },
  containerVerification: {
    flex: 1,
    marginHorizontal: 10,
    borderColor: colors.daclen_gray,
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  containerContent: {
    backgroundColor: "white",
  },
  containerLogo: {
    marginVertical: 32,
    backgroundColor: "white",
    alignSelf: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginStart: 6,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_black,
  },
  text: {
    fontSize: 14,
    marginVertical: 20,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textLogin: {
    color: colors.daclen_light,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    marginBottom: 10,
  },
  textError: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.daclen_light,
    textAlign: "center",
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

export default connect(mapStateToProps, mapDispatchProps)(DashboardMain);
