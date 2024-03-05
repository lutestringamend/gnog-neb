import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import {
  STARTER_KIT_FLYER_MENGAJAK,
  STARTER_KIT_FLYER_MENGAJAK_ICON,
  STARTER_KIT_FLYER_MENGAJAK_TEXT,
  STARTER_KIT_FLYER_PRODUK,
  STARTER_KIT_FLYER_PRODUK_ICON,
  STARTER_KIT_FLYER_PRODUK_TEXT,
  STARTER_KIT_VIDEO_MENGAJAK,
  STARTER_KIT_VIDEO_MENGAJAK_ICON,
  STARTER_KIT_VIDEO_MENGAJAK_TEXT,
  STARTER_KIT_VIDEO_PRODUK,
  STARTER_KIT_VIDEO_PRODUK_ICON,
  STARTER_KIT_VIDEO_PRODUK_TEXT,
} from "../../../components/mediakit/constants";
import StarterKitHomeButton from "../../../components/mediakit/home/StarterKitHomeButton";
import { staticDimensions } from "../../styles/base";
import { getMediaKitKategoriThumbnail } from "../../axios/mediakit";

const screenWidth = Dimensions.get("window").width;

const StarterKitHomeScreen = (props) => {
  const { token, currentUser, mediaKitPhotos, flyerMengajak, mediaKitVideos, videosMengajak } = props;

  /*useEffect(() => {
    if (token === null) {
      return;
    }
    getMediaKitKategoriThumbnail(token);
  }, [token]);*/

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
            style={{ marginEnd: 10, flex: 1 / 2 }}
          />
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_VIDEO_PRODUK)}
            icon={STARTER_KIT_VIDEO_PRODUK_ICON}
            text={STARTER_KIT_VIDEO_PRODUK_TEXT}
            style={{ marginStart: 10, flex: 1 / 2 }}
          />
        </View>
        <View style={styles.containerHorizontal}>
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_FLYER_MENGAJAK)}
            icon={STARTER_KIT_FLYER_MENGAJAK_ICON}
            text={STARTER_KIT_FLYER_MENGAJAK_TEXT}
            style={{ marginEnd: 10, flex: 1 / 2 }}
          />
          <StarterKitHomeButton
            onPress={() => setActiveTab(STARTER_KIT_VIDEO_MENGAJAK)}
            icon={STARTER_KIT_VIDEO_MENGAJAK_ICON}
            text={STARTER_KIT_VIDEO_MENGAJAK_TEXT}
            style={{ marginStart: 10, flex: 1 / 2 }}
          />
        </View>
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

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  mediaKitPhotos: store.mediaKitState.photos,
  mediaKitVideos: store.mediaKitState.videos,
  flyerMengajak: store.mediaKitState.flyerMengajak,
  videosMengajak: store.mediaKitState.videosMengajak,
});

export default connect(mapStateToProps, null)(StarterKitHomeScreen);
