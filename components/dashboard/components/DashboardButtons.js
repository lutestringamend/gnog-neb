import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  Share,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../../styles/base";
import { openWhatsapp } from "../../whatsapp/Whatsapp";
import { adminWA, adminWAtemplate } from "../../profile/constants";
import {
  dashboardhadiahpdf,
  dashboardkodeetikpdf,
  dashboardpenjelasanbisnispdf,
  mainhttp,
  personalwebsiteurl,
  webdashboard,
  webreferral,
} from "../../../axios/constants";

export const DashButton = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => props?.onPress()}>
      {props?.icon ? (
        <MaterialCommunityIcons
          name={props?.icon}
          size={24}
          color={colors.daclen_light}
        />
      ) : null}

      <Text style={[styles.textButton, { marginStart: props?.icon ? 10 : 0 }]}>
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
      props?.setMessage("Link Personal Website tersalin ke Clipboard", false);
    }
  };

  function openDaclenCare() {
    let template = adminWAtemplate;
    if (!(username === undefined || username === null)) {
      template = template.replace("#I#", username);
    }
    /*if (!(userId === undefined || userId === null)) {
      template = template.replace("#USERID#", userId);
    }*/
    template = template.replace("#P#", Platform.OS);
    console.log("Daclen care intro", template);
    openWhatsapp(adminWA, template);
  }

  function openKodeEtik() {
    navigation.navigate("PDFViewer", {
      title: "Kode Etik",
      uri: dashboardkodeetikpdf,
    })
  }

  function openBlog() {
    navigation.navigate("BlogFeed");
  }

  function openTutorial() {
    Linking.openURL(mainhttp);
  }

  function openExplanation() {
    navigation.navigate("PDFViewer", {
      title: "Penjelasan Bisnis",
      uri: dashboardpenjelasanbisnispdf,
    })
  }

  function openWebDashboard() {
    Linking.openURL(webdashboard);
  }

  function openCatalog() {
    navigation.navigate("PDFViewer", {
      title: "Katalog Hadiah",
      uri: dashboardhadiahpdf,
    })
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
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    width: "100%",
    backgroundColor: "transparent",
    marginBottom: staticDimensions.pageBottomPadding,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  containerVertical: {
    flex: 1,
    backgroundColor: "transparent",
  },
  button: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.daclen_light,
    alignSelf: "center",
    alignItems: "center",
    opacity: 0.9,
    backgroundColor: colors.daclen_lightgrey_button,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: 160,
    height: 60,
    marginBottom: 12,
  },
  textButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_light,
  },
});

export default DashboardButtons;
