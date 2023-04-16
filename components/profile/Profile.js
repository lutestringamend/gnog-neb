import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import packageJson from "../../package.json";
import { enableForceLogout } from "../../axios/user";
import {
  aboutapp,
  aboutappicon,
  addressmenu,
  addressmenuicon,
  changepassword,
  changepasswordicon,
  commissionpoint,
  commissionpointicon,
  contactadmin,
  contactadminicon,
  faq,
  faqicon,
  logoutbuttonnegative,
  logoutbuttonpositive,
  logouttext,
  logouttitle,
  mediakit,
  mediakiticon,
  privacypolicy,
  privacypolicyicon,
  tnc,
  tncicon,
} from "./constants";
import { commissionpointpdf, webmediakit } from "../../axios/constants";
import { colors, dimensions, staticDimensions } from "../../styles/base";

import MainHeader from "../main/MainHeader";
import Header from "./Header";
import ProfileMenuItem from "./ProfileMenuItem";
import BSPopup from "../bottomsheets/BSPopup";
import { openWhatsapp } from "../whatsapp/Whatsapp";
import { adminWA, adminWAtemplate } from "./constants";
//import { setObjectAsync, setTokenAsync } from "../asyncstorage";
//import { ASYNC_USER_CURRENTUSER_KEY } from "../asyncstorage/constants";

function Profile(props) {
  const { currentUser, token } = props;
  const appVersion = `Versi ${packageJson?.version}`;
  const rbSheet = useRef();

  const userLogOut = async () => {
    props.enableForceLogout();
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader icon="account-circle" title="Profil Pengguna" />
      <ScrollView style={styles.scrollView}>
        <Header
          token={token}
          username={currentUser?.name}
          foto={currentUser?.detail_user?.foto}
          nama_lengkap={currentUser?.detail_user?.nama_lengkap}
          email={currentUser?.email}
          nomor_telp={currentUser?.nomor_telp}
          thickness={3}
        />

        {token && (
          <View>
            <ProfileMenuItem
              text={addressmenu}
              icon={addressmenuicon}
              screen="Address"
              thickness={2}
            />
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
          onItemClick={() => openWhatsapp(adminWA, adminWAtemplate)}
          thickness={2}
        />

        <ProfileMenuItem
          text={commissionpoint}
          icon={commissionpointicon}
          screen="PDFViewer"
          thickness={3}
          webKey={commissionpointpdf}
        />

        <ProfileMenuItem
          text={mediakit}
          icon={mediakiticon}
          screen="Webview"
          thickness={2}
          webKey="mediakit"
          url={webmediakit}
        />

        <ProfileMenuItem
          text={tnc}
          icon={tncicon}
          screen="Webview"
          thickness={2}
          webKey="tnc"
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

        <ProfileMenuItem
          text={faq}
          icon={faqicon}
          screen="FAQ"
          thickness={3}
        />

        {token && (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => rbSheet.current.open()}
            >
              <Text style={styles.textButton}>Logout</Text>
            </TouchableOpacity>
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
                onPress={() => userLogOut()}
              />
            </RBSheet>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  token: store.userState.token,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      enableForceLogout,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Profile);
