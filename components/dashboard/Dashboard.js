import React, { useEffect, useState } from "react";
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

import Header from "./Header";
import { colors, dimensions } from "../../styles/base";
import Main from "./Main";
import { webdashboard } from "../../axios/constants";
import { useNavigation } from "@react-navigation/native";

function DashboardMain(props) {
  const [message, setMessage] = useState({
    text: null,
    isError: false,
  });
  const [browserText, setBrowserText] = useState(null);
  const navigation = useNavigation();
  const { currentUser, token } = props;

  useEffect(() => {
    props.getHPV(currentUser?.id, token);
  }, [token]);

  function buttonPress(text) {
    setBrowserText(`Lihat ${text} di Browser`);
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
            onButtonPress={(e) => buttonPress(e)}
          />
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.fullWidth,
  },
  scrollView: {
    flex: 1,
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
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
