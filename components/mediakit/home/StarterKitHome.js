import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Linking,
} from "react-native";
import {
  STARTER_KIT_FLYER_MENGAJAK,
  STARTER_KIT_FLYER_MENGAJAK_ICON,
  STARTER_KIT_FLYER_MENGAJAK_TEXT,
  STARTER_KIT_FLYER_PRODUK,
  STARTER_KIT_FLYER_PRODUK_ICON,
  STARTER_KIT_FLYER_PRODUK_TEXT,
  STARTER_KIT_PERSONAL_WEBSITE,
  STARTER_KIT_PERSONAL_WEBSITE_ICON,
  STARTER_KIT_REFERRAL,
  STARTER_KIT_REFERRAL_ICON,
  STARTER_KIT_TOKO_ONLINE_DESC,
  STARTER_KIT_TOKO_ONLINE_ICON,
  STARTER_KIT_TOKO_ONLINE_TEXT,
  STARTER_KIT_VIDEO_MENGAJAK,
  STARTER_KIT_VIDEO_MENGAJAK_ICON,
  STARTER_KIT_VIDEO_MENGAJAK_TEXT,
  STARTER_KIT_VIDEO_PRODUK,
  STARTER_KIT_VIDEO_PRODUK_ICON,
  STARTER_KIT_VIDEO_PRODUK_TEXT,
} from "../constants";
import StarterKitHomeButton from "./StarterKitHomeButton";
import { staticDimensions } from "../../../styles/base";
import {
  personalwebsiteurl,
  personalwebsiteurlshort,
  tokoonlineurl,
  tokoonlineurlshort,
  webreferral,
  webreferralshort,
} from "../../../axios/constants";

const screenWidth = Dimensions.get("window").width;

const StarterKitHome = (props) => {
  const { currentUser } = props;

  function setModal(e) {
    if (props?.setModal === undefined || props?.setModal === null) {
      return;
    }
    props?.setModal(e);
  }

  function openTokoOnline() {
    setModal({
      visible: true,
      title: STARTER_KIT_TOKO_ONLINE_TEXT,
      url: `${tokoonlineurl}${currentUser?.name}`,
      urlShort: `${tokoonlineurlshort}${currentUser?.name}`,
      desc: STARTER_KIT_TOKO_ONLINE_DESC,
    });
  }

  function openPersonalWeb() {
    setModal({
      visible: true,
      title: STARTER_KIT_PERSONAL_WEBSITE,
      url: `${personalwebsiteurl}${currentUser?.name}`,
      urlShort: `${personalwebsiteurlshort}${currentUser?.name}`,
      desc: null,
    });
  }

  function openReferral() {
    setModal({
      visible: true,
      title: STARTER_KIT_REFERRAL,
      url: `${webreferral}${currentUser?.name}`,
      urlShort: `${webreferralshort}${currentUser?.name}`,
      desc: null,
    });
  }

  function setActiveTab(e) {
    if (props?.setActiveTab === undefined || props?.setActiveTab === null) {
      return;
    }
    props?.setActiveTab(e);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={[styles.containerHorizontal, {marginTop: 24}]}>
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_FLYER_PRODUK)}
            icon={STARTER_KIT_FLYER_PRODUK_ICON}
            text={STARTER_KIT_FLYER_PRODUK_TEXT}
            style={{ marginEnd: 10 }}
          />
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_VIDEO_PRODUK)}
            icon={STARTER_KIT_VIDEO_PRODUK_ICON}
            text={STARTER_KIT_VIDEO_PRODUK_TEXT}
            style={{ marginStart: 10 }}
          />
        </View>
        <View style={styles.containerHorizontal}>
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_FLYER_MENGAJAK)}
            icon={STARTER_KIT_FLYER_MENGAJAK_ICON}
            text={STARTER_KIT_FLYER_MENGAJAK_TEXT}
            style={{ marginEnd: 10 }}
            disabled={true}
          />
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_VIDEO_MENGAJAK)}
            icon={STARTER_KIT_VIDEO_MENGAJAK_ICON}
            text={STARTER_KIT_VIDEO_MENGAJAK_TEXT}
            style={{ marginStart: 10 }}
            disabled={true}
          />
        </View>
        <View style={styles.containerHorizontal}>
          <StarterKitHomeButton
            onPress={() => openTokoOnline()}
            icon={STARTER_KIT_TOKO_ONLINE_ICON}
            text={STARTER_KIT_TOKO_ONLINE_TEXT}
            style={{ marginHorizontal: 6 }}
            fontSize={12}
          />
          <StarterKitHomeButton
            onPress={() => openPersonalWeb()}
            icon={STARTER_KIT_PERSONAL_WEBSITE_ICON}
            text={STARTER_KIT_PERSONAL_WEBSITE}
            style={{ marginHorizontal: 6 }}
            fontSize={12}
          />
          <StarterKitHomeButton
            onPress={() => openReferral()}
            icon={STARTER_KIT_REFERRAL_ICON}
            text={STARTER_KIT_REFERRAL}
            style={{ marginHorizontal: 6 }}
            fontSize={12}
          />
        </View>
        <View style={styles.containerBottom} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerHorizontal: {
    width:
      screenWidth > staticDimensions.shopMaxWidth
        ? staticDimensions.shopMaxWidth
        : screenWidth,
    paddingHorizontal: 12,
    marginVertical: 20,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerBottom: {
    height: staticDimensions.pageBottomPadding / 2,
    backgroundColor: "transparent",
  },
});

export default StarterKitHome;
