import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import packageJson from "../../package.json";
import { userLogout, setNewToken, clearUserData } from "../../axios/user";
import {
  aboutapp,
  aboutappicon,
  addressmenu,
  addressmenuicon,
  adminWAnonusertemplate,
  adminWAtemplate,
  changepassword,
  changepasswordicon,
  contactadmin,
  contactadminicon,
  faq,
  faqicon,
  logoutbuttonnegative,
  logoutbuttonpositive,
  logouttext,
  logouttitle,
  privacypolicy,
  privacypolicyicon,
  tnc,
  tncicon,
} from "./constants";
import { colors, staticDimensions } from "../../styles/base";

import MainHeader from "../main/MainHeader";
import Header from "./Header";
import ProfileMenuItem from "./ProfileMenuItem";
import BSPopup from "../bottomsheets/BSPopup";
import { openWhatsapp } from "../whatsapp/Whatsapp";
import { adminWA } from "./constants";
import { sentryLog } from "../../sentry";
import { useNavigation } from "@react-navigation/native";
import { websyaratketentuan } from "../../axios/constants";

export const userLogOut = async (props, username) => {
  try {
    await userLogout(username);
    props.setNewToken(null, null);
    props.clearUserData(true);
  } catch (e) {
    sentryLog(e);
  }
};

function Profile(props) {
  const { currentUser, token } = props;
  const [loggingOut, setLoggingOut] = useState(false);
  const appVersion = `Versi ${packageJson?.version}`;
  const rbSheet = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined
    ) {
      if (loggingOut) {
        rbSheet.current.close();
        setLoggingOut(false);
        navigation.navigate("Main");
      }
    }
  }, [currentUser, token]);

  const openAddress = () => {
    //console.log("detail_user", currentUser?.detail_user);
    if (
      currentUser?.detail_user === undefined ||
      currentUser?.detail_user?.alamat === undefined ||
      currentUser?.detail_user?.alamat === null ||
      currentUser?.detail_user?.alamat === "" ||
      currentUser?.detail_user?.provinsi === undefined ||
      currentUser?.detail_user?.provinsi === null ||
      currentUser?.detail_user?.provinsi === "" ||
      currentUser?.detail_user?.kota === undefined ||
      currentUser?.detail_user?.kota === null ||
      currentUser?.detail_user?.kota === ""
    ) {
      navigation.navigate("LocationPin", {
        isNew: false,
        isDefault: true,
        savedRegion: null,
      });
    } else {
      navigation.navigate("PickAddress");
    }
  };

  function openDaclenCare() {
    let template = adminWAnonusertemplate;
    if (!(currentUser?.name === undefined || currentUser?.name === null || currentUser?.name === "")) {
      template = adminWAtemplate.replace("#I#", currentUser?.name);
    }
    console.log("openDaclenCare", template);
    openWhatsapp(adminWA, template);
  }

  function openTnc() {
    Linking.openURL(websyaratketentuan);
  }

  const proceedLogout = async () => {
    setLoggingOut(true);
    await userLogOut(props, currentUser?.name);
  };

  /*
        <ProfileMenuItem
          text={commissionpoint}
          icon={commissionpointicon}
          screen="PDFViewer"
          thickness={3}
          webKey={commissionpointpdf}
        />
  */

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader icon="arrow-left" title="Setting Pengguna" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.containerVertical}
      >
        <Header token={token} currentUser={currentUser} thickness={3} />

        {currentUser === null || currentUser?.id === undefined ? null : (
          <View>
            {currentUser?.bank_set === undefined || !currentUser?.bank_set ? null : (
              <ProfileMenuItem
                text={addressmenu}
                icon={addressmenuicon}
                screen={null}
                onItemClick={() => openAddress()}
                thickness={2}
              />
            )}

            <ProfileMenuItem
              text={changepassword}
              icon={changepasswordicon}
              screen="Login"
              webKey="changePassword"
              thickness={3}
            />
          </View>
        )}

        <ProfileMenuItem
          text={contactadmin}
          icon={contactadminicon}
          screen={null}
          onItemClick={() => openDaclenCare()}
          thickness={2}
        />

        <ProfileMenuItem
          text={tnc}
          icon={tncicon}
          screen={null}
          onItemClick={() => openTnc()}
          thickness={2}
          webKey={null}
        />

        <ProfileMenuItem
          text={privacypolicy}
          icon={privacypolicyicon}
          screen="Webview"
          thickness={2}
          webKey="privacy"
        />

        <ProfileMenuItem
          text={aboutapp}
          icon={aboutappicon}
          screen="About"
          textSecondary={appVersion}
          thickness={2}
        />

        <ProfileMenuItem text={faq} icon={faqicon} screen="FAQ" thickness={3} />

        {token === null ||
        currentUser === null ||
        currentUser?.id === undefined ? null : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => rbSheet.current.open()}
          >
            <Text allowFontScaling={false} style={styles.textButton}>Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <RBSheet ref={rbSheet} openDuration={250} height={350}>
        <BSPopup
          title={logouttitle}
          text={logouttext}
          buttonPositive={logoutbuttonpositive}
          buttonPositiveColor={colors.daclen_danger}
          buttonNegative={logoutbuttonnegative}
          buttonNegativeColor={colors.daclen_gray}
          icon="logout"
          closeThis={() => rbSheet.current.close()}
          onPress={() => proceedLogout()}
        />
      </RBSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_danger,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  token: store.userState.token,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      setNewToken,
      clearUserData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Profile);
