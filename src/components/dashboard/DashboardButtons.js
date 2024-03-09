import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { openWhatsapp } from "../../../components/whatsapp/Whatsapp";
import {
  adminWA,
  adminWAnonusertemplate,
  adminWAtemplate,
} from "../../../components/profile/constants";
import {
  dashboardhadiahpdf,
  dashboardkodeetikpdf,
  dashboardpenjelasanbisnispdf,
  mainhttp,
  personalwebsiteurl,
  webdashboard,
  webreferral,
} from "../../axios/constants";
import {
  kataloghadiahtag,
  kodeetiktag,
  penjelasanbisnistag,
} from "../../constants/dashboard";

const ratio = dimensions.fullWidthAdjusted / 430;

export const DashButton = (props) => {
  /*if (props?.disabled) {
    return null;
  }*/
  const { icon, text, caption, pdfFiles, tag, disabled, style, iconText, iconStyle } = props;

  return (
    <TouchableOpacity
      style={[styles.button, style ? style : null]}
      onPress={() => props?.onPress()}
      disabled={
        disabled ||
        (pdfFiles !== undefined &&
          (pdfFiles === undefined ||
            pdfFiles === null ||
            pdfFiles?.length === undefined ||
            pdfFiles?.length < 1 ||
            pdfFiles.find(
              ({ judul }) => judul.toLowerCase() === tag.toLowerCase(),
            ) === undefined ||
            pdfFiles.find(
              ({ judul }) => judul.toLowerCase() === tag.toLowerCase(),
            ) === null))
      }
    >
      <View style={[styles.containerIcon, iconStyle ? iconStyle : null]}>
        {iconText ? 
        <Text allowFontScaling={false} style={styles.textIcon}>
          {iconText}
        </Text>
        : icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={25 * ratio}
            color={colors.black}
          />
        ) : null}
      </View>

      <View style={styles.containerText}>
        {text ? (
          <Text allowFontScaling={false} style={styles.textHeader}>
            {text}
          </Text>
        ) : null}
        {caption ? (
          <Text allowFontScaling={false} style={styles.text}>
            {caption}
          </Text>
        ) : null}
      </View>
      <MaterialCommunityIcons
            name="chevron-right"
            size={35 * ratio}
            color={colors.black}
          />
    </TouchableOpacity>
  );
};

const DashboardButtons = (props) => {
  const { userId, username, pdfFiles } = props;
  const navigation = useNavigation();

  /*const shareURL = async () => {
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
        ToastAndroid.SHORT,
      );
    }
    if (!(props?.setMessage === undefined || props?.setMessage === null)) {
      props?.setMessage("Link Toko Online tersalin ke Clipboard", false);
    }
  };*/

  function openDaclenCare() {
    let template = adminWAnonusertemplate;
    if (!(username === undefined || username === null || username === "")) {
      template = adminWAtemplate.replace("#I#", username);
    }
    console.log("openDaclenCare", template);
    openWhatsapp(adminWA, template, true);
  }

  /*function openKodeEtik() {
    navigation.navigate("PDFViewer", {
      title: "Kode Etik",
      uri: dashboardkodeetikpdf,
    });
  }*/

  function openCountdown() {
    if (props?.openCountdown === undefined || props?.openCountdown === null) {
      return;
    }
    props.openCountdown();
  }

  function openBlog() {
    navigation.navigate("BlogFeed");
  }

  function openTutorial() {
    navigation.navigate("Tutorial");
  }

  function openPDFFile(tag) {
    try {
      const data = pdfFiles.find(
        ({ judul }) => judul.toLowerCase() === tag.toLowerCase(),
      );
      if (!(data === undefined || data === null)) {
        /*navigation.navigate("PDFViewer", {
          title: tag,
          uri: data?.file,
        });*/
        Linking.openURL(data?.file);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function openWebDashboard() {
    Linking.openURL(webdashboard);
  }

  /*function openCatalog() {
    navigation.navigate("PDFViewer", {
      title: "Katalog Hadiah",
      uri: dashboardhadiahpdf,
    })
    Linking.openURL(dashboardhadiahpdf);
  }*/

  return (
    <View style={styles.containerMain}>
      <DashButton
        text="Target Rekrutmen"
        caption="Lihat target rekrutmen Anda."
        icon="timer"
        onPress={() => openCountdown()}
      />
      <DashButton
        text="Penjelasan Bisnis"
        caption="Baca penjelasan bisnis Daclen."
        icon="help-rhombus"
        onPress={() => openPDFFile(penjelasanbisnistag)}
        tag={penjelasanbisnistag}
      />
      <DashButton
        text="Tutorial"
        caption="Lihat tutorial untuk menggunakan aplikasi."
        icon="play-box"
        onPress={() => openTutorial()}
      />
      <DashButton
        text="Simulasi Saldo"
        caption="Simulasikan strategi bisnis Anda."
        icon="calculator"
        onPress={() => navigation.navigate("Calculator")}
      />
      <DashButton
        text="Katalog Hadiah"
        caption="Lihat katalog hadiah Daclen."
        icon="gift"
        onPress={() => openPDFFile(kataloghadiahtag)}
        tag={kataloghadiahtag}
      />
      <DashButton
        text="Kode Etik"
        caption="Baca kode etik Daclen."
        icon="file-document-multiple"
        onPress={() => openPDFFile(kodeetiktag)}
        tag={kodeetiktag}
      />
      <DashButton
        text="Daclen Care"
        caption="Hubungi Daclen Care untuk bantuan."
        icon="phone-message"
        onPress={() => openDaclenCare()}
      />

      <DashButton
        text="Blog"
        caption="Artikel dan konten mengenai Daclen."
        icon="newspaper-variant"
        onPress={() => openBlog()}
      />

      <DashButton
        text="Dashboard Web"
        caption="Buka dashboard Daclen di browser."
        icon="web-check"
        onPress={() => openWebDashboard()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: dimensions.fullHeight * 0.2,
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
    height: 65 * ratio,
    borderRadius: 16 * ratio,
    backgroundColor: colors.white,
    paddingHorizontal: 14 * ratio,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: staticDimensions.marginHorizontal / 3,
  },
  containerIcon: {
    backgroundColor: colors.daclen_grey_container_background,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 45 * ratio,
    height: 45 * ratio,
    borderRadius: 22.5 * ratio,
    borderWidth: 1,
    borderColor: colors.daclen_grey_placeholder,
  },
  containerText: {
    marginStart: 14 * ratio,
    backgroundColor: "transparent",
    flex: 1,
  },
  textHeader: {
    fontSize: 14 * ratio,
    fontFamily: "Poppins-SemiBold",
    backgroundColor: "transparent",
    color: colors.black,
  },
  text: {
    fontSize: 12 * ratio,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    color: colors.black,
    marginTop: 2,
  },
  textIcon: {
    fontSize: 32 * ratio,
    fontFamily: "Poppins-ExtraBold",
    backgroundColor: "transparent",
    color: colors.daclen_black,
  },
});

const mapStateToProps = (store) => ({
  pdfFiles: store.homeState.pdfFiles,
});

export default connect(mapStateToProps, null)(DashboardButtons);
