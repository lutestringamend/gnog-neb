import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Linking,
} from "react-native";
//import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import packageJson from "../../../package.json";
import { setNewToken, clearUserData, serverLogout } from "../../../axios/user";
import { userLogOut } from "../../utils/auth";
import {
  adminWAnonusertemplate,
  adminWAtemplate,
} from "../../../components/profile/constants";
import { colors, dimensions, staticDimensions } from "../../styles/base";

import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
//import BSPopup from "../../components/bottomsheets/BSPopup";
import { openWhatsapp } from "../../../components/whatsapp/Whatsapp";
import { adminWA } from "../../../components/profile/constants";
import { useNavigation } from "@react-navigation/native";
import { websyaratketentuan } from "../../../axios/constants";
import AlertBox from "../../components/alert/AlertBox";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { updateReduxUserMainModal } from "../../utils/user";
import { ModalModel } from "../../models/modal";
import ModalView from "../../components/modal/ModalView";

const appVersion = `Versi ${packageJson?.version}`;
const LogoutModal = {
  ...ModalModel,
  visible: false,
  modalAspectRatio: 298 / 302,
  title: "Logout",
  text: "Anda yakin ingin logout? Anda harus login untuk kembali ke akun Anda.",
  buttonSubmit: "Logout",
  buttonClose: "Batal",
}

function ProfileScreen(props) {
  const { currentUser, token, profilePicture } = props;
  const [loggingOut, setLoggingOut] = useState(false);
  const [modal, setModal] = useState(LogoutModal);
  const [error, setError] = useState(null);

  //const rbSheet = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined
    ) {
      if (loggingOut) {
        setModal({
          ...modal,
          visible: false
        });
        setLoggingOut(false);
        navigation.navigate("Login");
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
    if (
      !(
        currentUser?.name === undefined ||
        currentUser?.name === null ||
        currentUser?.name === ""
      )
    ) {
      template = adminWAtemplate.replace("#I#", currentUser?.name);
    }
    console.log("openDaclenCare", template);
    openWhatsapp(adminWA, template);
  }

  function openTnc() {
    Linking.openURL(websyaratketentuan);
  }

  const openLogoutModal = () => {
    setModal({
      ...modal,
      visible: true
    });
  }

  const proceedLogout = async () => {
    setLoggingOut(true);
    setError(null);
    const check = await serverLogout(token);
    if (check?.session === "success") {
      await userLogOut(props, currentUser?.name);
    } else {
      setModal({
        ...modal,
        visible: false
      });
      setError("Gagal Logout.");
      setLoggingOut(false);
    }
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
      <ScrollView
        style={styles.containerInside}
        contentContainerStyle={styles.containerVertical}
      >
        <ProfileHeader
          token={token}
          currentUser={currentUser}
          profilePicture={profilePicture}
          thickness={3}
        />

        <View style={styles.containerItems}>
          {token === null ||
          currentUser === null ||
          currentUser?.id === undefined ? null : (
            <View style={styles.containerAccount}>
              <Text allowFontScaling={false} style={styles.textHeader}>
                Akun
              </Text>
              <ProfileMenuItem
                text="Alamat Pengiriman"
                icon="map"
                screen={null}
                onItemClick={() => openAddress()}
              />
              <ProfileMenuItem
                text="Ganti Password"
                icon="lock-open"
                screen="Login"
                webKey="changePassword"
                thickness={3}
              />
              <ProfileMenuItem
                text="Bank"
                icon="card"
                screen="Login"
                webKey="changePassword"
                thickness={3}
              />
              <ProfileMenuItem
                text="Logout"
                icon="logout"
                screen={null}
                onItemClick={() => openLogoutModal()}
                thickness={2}
              />
            </View>
          )}

          <Text
            allowFontScaling={false}
            style={[
              styles.textHeader,
              { marginTop: staticDimensions.marginHorizontal * 2 },
            ]}
          >
            Info Lainnya
          </Text>

          <ProfileMenuItem
            text="Syarat dan Ketentuan"
            icon="file-document"
            screen={null}
            onItemClick={() => openTnc()}
            thickness={2}
            webKey={null}
          />

          <ProfileMenuItem
            text="Kebijakan Privasi"
            icon="shield-half-full"
            screen="Webview"
            thickness={2}
            webKey="privacy"
          />

          <ProfileMenuItem
            text="Tentang Daclen"
            icon="information"
            screen="About"
            textSecondary={appVersion}
            thickness={2}
          />

          <ProfileMenuItem
            text="Frequently Asked Questions"
            icon="chat-question"
            screen="FAQ"
            thickness={3}
          />

          <ProfileMenuItem
            text="Daclen Care"
            icon="headset"
            screen={null}
            onItemClick={() => openDaclenCare()}
            thickness={2}
          />
        </View>
      </ScrollView>
      <AlertBox text={error} success={false} />
      {modal?.visible ? 
    <ModalView
      {...modal}
      onPress={() => proceedLogout()}
      loading={loggingOut}
      setModal={() => setModal((modal) => ({...modal, visible: !modal?.visible}))}
    />  : null
    }
     
    </SafeAreaView>
  );
}

/*
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
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_black,
    alignItems: "center",
  },
  containerInside: {
    flex: 1,
    backgroundColor: "transparent",
    width: dimensions.fullWidthAdjusted,
  },
  containerVertical: {
    backgroundColor: colors.daclen_black,
  },
  containerAccount: {
    backgroundColor: "transparent",
  },
  containerItems: {
    flex: 1,
    top: -1,
    minHeight: dimensions.fullHeight,
    backgroundColor: colors.white,
    paddingTop: staticDimensions.marginHorizontal,
    paddingHorizontal: staticDimensions.marginHorizontal,
    borderTopEndRadius: 20,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins",
    fontSize: 18,
    color: colors.black,
    marginBottom: staticDimensions.marginHorizontal,
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
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  token: store.userState.token,
  profilePicture: store.userState.profilePicture,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      setNewToken,
      clearUserData,
      updateReduxUserMainModal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(ProfileScreen);
