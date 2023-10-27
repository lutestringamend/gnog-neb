import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  Share,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../../styles/base";
import { openWhatsapp } from "../../whatsapp/Whatsapp";
import {
  adminWA,
  adminWAnonusertemplate,
  adminWAtemplate,
} from "../../profile/constants";
import {
  dashboardhadiahpdf,
  dashboardkodeetikpdf,
  dashboardpenjelasanbisnispdf,
  mainhttp,
  personalwebsiteurl,
  webdashboard,
  webreferral,
} from "../../../axios/constants";
import {
  dashboardbuttonsdefaultborderradius,
  dashboardbuttonsdefaultborderwidth,
  dashboardbuttonsdefaultfontsize,
  dashboardbuttonsdefaultheight,
  dashboardbuttonsdefaulticonsize,
  dashboardbuttonsdefaultmarginbottom,
  dashboardbuttonsdefaultpaddinghorizontal,
  dashboardbuttonsdefaultpaddingvertical,
  dashboardbuttonsdefaultscreenwidth,
  dashboardbuttonsdefaultwidth,
  dashboardbuttonsmaxratio,
} from "../constants";

const screenWidth = Dimensions.get("window").width;
const ratio =
  screenWidth / dashboardbuttonsdefaultscreenwidth > dashboardbuttonsmaxratio
    ? dashboardbuttonsmaxratio
    : screenWidth / dashboardbuttonsdefaultscreenwidth;

export const DashButton = (props) => {
  /*if (props?.disabled) {
    return null;
  }*/

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          paddingVertical: Math.round(
            ratio * dashboardbuttonsdefaultpaddingvertical
          ),
          paddingHorizontal: Math.round(
            ratio * dashboardbuttonsdefaultpaddinghorizontal
          ),
          width: Math.round(ratio * dashboardbuttonsdefaultwidth),
          height: Math.round(ratio * dashboardbuttonsdefaultheight),
          marginBottom: Math.round(ratio * dashboardbuttonsdefaultmarginbottom),
          borderWidth: Math.round(ratio * dashboardbuttonsdefaultborderwidth),
          borderRadius: Math.round(ratio * dashboardbuttonsdefaultborderradius),
        },
      ]}
      onPress={() => props?.onPress()}
      disabled={props?.disabled}
    >
      {props?.icon ? (
        <MaterialCommunityIcons
          name={props?.icon}
          size={Math.round(ratio * dashboardbuttonsdefaulticonsize)}
          color={colors.daclen_light}
        />
      ) : null}

      <Text
        style={[
          styles.textButton,
          {
            marginStart: props?.icon ? 10 : 0,
            fontSize: Math.round(ratio * dashboardbuttonsdefaultfontsize),
          },
        ]}
      >
        {props?.text}
      </Text>
    </TouchableOpacity>
  );
};

const DashboardButtons = ({ userId, username }) => {
  const navigation = useNavigation();

  const shareURL = async () => {
    let fullLink = `${webreferral}${username}`;
    try {
      const result = await Share.share({
        message: fullLink,
        url: fullLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("share result activityType", result.activityType);
        } else {
          console.log("share result", result);
        }
      } else if (result.action === Share.dismissedAction) {
        copytoClipboard();
      }
    } catch (error) {
      console.error(error);
      sentryLog(error);
      copytoClipboard();
    }
  };

  const copytoClipboard = async () => {
    await Clipboard.setStringAsync(`${personalwebsiteurl}${username}`);
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Link Referral tersalin ke Clipboard",
        ToastAndroid.SHORT
      );
    }
    if (!(props?.setMessage === undefined || props?.setMessage === null)) {
      props?.setMessage("Link Toko Online tersalin ke Clipboard", false);
    }
  };

  function openDaclenCare() {
    let template = adminWAnonusertemplate;
    if (!(username === undefined || username === null || username === "")) {
      template = adminWAtemplate.replace("#I#", username);
    }
    console.log("openDaclenCare", template);
    openWhatsapp(adminWA, template);
  }

  function openKodeEtik() {
    navigation.navigate("PDFViewer", {
      title: "Kode Etik",
      uri: dashboardkodeetikpdf,
    });
  }

  function openBlog() {
    navigation.navigate("BlogFeed");
  }

  function openTutorial() {
    navigation.navigate("Tutorial");
  }

  function openExplanation() {
    /*navigation.navigate("PDFViewer", {
      title: "Penjelasan Bisnis",
      uri: dashboardpenjelasanbisnispdf,
    })*/
    Linking.openURL(dashboardpenjelasanbisnispdf);
  }

  function openWebDashboard() {
    Linking.openURL(webdashboard);
  }

  function openCatalog() {
    /*navigation.navigate("PDFViewer", {
      title: "Katalog Hadiah",
      uri: dashboardhadiahpdf,
    })*/
    Linking.openURL(dashboardhadiahpdf);
  }

  return (
    <View style={styles.containerMain}>
      <View style={styles.container}>
        <View style={[styles.containerVertical, { marginEnd: 10 }]}>
          <DashButton
            text="DACLEN CARE"
            icon="phone-message"
            onPress={() => openDaclenCare()}
          />
          <DashButton
            text="KODE ETIK"
            icon="file-document-multiple"
            onPress={() => openKodeEtik()}
            disabled={true}
          />
          <DashButton
            text="BLOG"
            icon="newspaper-variant"
            onPress={() => openBlog()}
          />
          <DashButton
            text="TUTORIAL"
            icon="play-box"
            onPress={() => openTutorial()}
          />
        </View>
        <View style={[styles.containerVertical, { marginStart: 10 }]}>
          <DashButton
            text={`SHARE\nREFERRAL`}
            icon="account-group"
            onPress={() => shareURL()}
          />
          <DashButton
            text={`PENJELASAN\nBISNIS`}
            icon="help-rhombus"
            onPress={() => openExplanation()}
            disabled={true}
          />
          <DashButton
            text={`DASHBOARD\nWEBSITE`}
            icon="web-check"
            onPress={() => openWebDashboard()}
          />
          <DashButton
            text={`KATALOG\nHADIAH`}
            icon="gift"
            onPress={() => openCatalog()}
            disabled={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    width: "90%",
    backgroundColor: "transparent",
    alignSelf: "center",
    marginBottom: staticDimensions.pageBottomPadding,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerVertical: {
    flex: 1,
    backgroundColor: "transparent",
  },
  button: {
    flexDirection: "row",
    borderColor: colors.daclen_light,
    alignSelf: "center",
    alignItems: "center",
    opacity: 0.9,
    backgroundColor: colors.daclen_lightgrey_button,
  },
  textButton: {
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
  },
});

export default DashboardButtons;
