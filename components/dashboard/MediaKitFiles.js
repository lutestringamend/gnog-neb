import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from "sentry-expo";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getMediaKitPhotos } from "../../axios/mediakit";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { privacypolicy } from "../profile/constants";
import { ErrorView } from "../webview/WebviewChild";
import HistoryTabItem from "../history/HistoryTabItem";
import { webreferral } from "../../axios/constants";
import {
  watermarkphotoicon,
  watermarkvideoicon,
  WATERMARK_PHOTO,
  WATERMARK_VIDEO,
  tempvideoarray,
} from "./constants";
import WatermarkPhotos from "./WatermarkPhotos";
import WatermarkVideos from "./WatermarkVideos";

function MediaKitFiles(props) {
  try {
    const [activeTab, setActiveTab] = useState(props.route.params?.activeTab ? props.route.params?.activeTab : WATERMARK_PHOTO);
    const [expand, setExpand] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = props;
    const navigation = useNavigation();

    const [watermarkData, setWatermarkData] = useState({
      name: currentUser?.name ? currentUser?.name : "",
      phone: currentUser?.nomor_telp ? currentUser?.nomor_telp : "",
      url: currentUser?.name
        ? `https://${webreferral}${currentUser?.name}`
        : "",
    });

    useEffect(() => {
      if (
        props.mediaKitPhotos?.length === undefined ||
        props.mediaKitPhotos?.length < 1
      ) {
        props.getMediaKitPhotos();
      }
    }, [props.mediaKitPhotos]);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <TouchableOpacity onPress={() => setExpand(!expand)}>
            <View style={styles.containerHeader}>
              <Text style={styles.textHeader}>Informasi Watermark</Text>
              {expand ? (
                <MaterialCommunityIcons
                  name="chevron-up"
                  size={24}
                  color={colors.daclen_light}
                />
              ) : (
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color={colors.daclen_light}
                />
              )}
            </View>
          </TouchableOpacity>
          {expand ? (
            <View style={styles.containerInfo}>
              <View style={styles.containerPrivacy}>
                <Text style={styles.textUid}>
                  Kirimkan foto dan video promosi dari katalog Daclen dengan
                  watermark spesial untuk kamu. Watermark berisi nama, nomor
                  telepon dan link referral.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Webview", {
                      webKey: "privacy",
                      text: privacypolicy,
                    })
                  }
                  disabled={loading}
                >
                  <Text style={styles.textChange}>Baca {privacypolicy}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.containerBox}>
                <Text style={styles.textCompulsory}>Nama*</Text>
                <TextInput
                  value={watermarkData?.name}
                  style={styles.textInput}
                  onChangeText={(name) =>
                    setWatermarkData({ ...watermarkData, name })
                  }
                />
                <Text style={styles.textCompulsory}>Nomor telepon*</Text>
                <TextInput
                  value={watermarkData?.phone}
                  style={styles.textInput}
                  onChangeText={(phone) =>
                    setWatermarkData({ ...watermarkData, phone })
                  }
                />
                <Text style={styles.textCompulsory}>Link Referral*</Text>
                <TextInput
                  value={watermarkData?.url}
                  style={styles.textInput}
                  onChangeText={(url) =>
                    setWatermarkData({ ...watermarkData, url })
                  }
                />
              </View>
            </View>
          ) : null}

          <View style={styles.tabView}>
            <HistoryTabItem
              activeTab={activeTab}
              name={WATERMARK_PHOTO}
              icon={watermarkphotoicon}
              onPress={() => setActiveTab(WATERMARK_PHOTO)}
            />

            {currentUser?.id === 8054 ? (
              <HistoryTabItem
                activeTab={activeTab}
                name={WATERMARK_VIDEO}
                icon={watermarkvideoicon}
                onPress={() => setActiveTab(WATERMARK_VIDEO)}
              />
            ) : null}
          </View>
          {activeTab === WATERMARK_VIDEO ? (
            <WatermarkVideos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              videos={tempvideoarray}
            />
          ) : (
            <WatermarkPhotos
              watermarkData={watermarkData}
              userId={currentUser?.id}
              photos={props.mediaKitPhotos}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error(error);
    if (Platform.OS === "web") {
      Sentry.Browser.captureException(error);
    } else {
      Sentry.Native.captureException(error);
    }

    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          error={error.message}
          onOpenExternalLink={() => openExternalLink()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.daclen_graydark,
  },
  containerInfo: {
    backgroundColor: "white",
  },
  containerPrivacy: {
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
  containerBox: {
    backgroundColor: colors.daclen_light,
    borderColor: colors.daclen_gray,
    borderWidth: 2,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    elevation: 10,
  },
  tabView: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  text: {
    color: colors.daclen_gray,
    fontSize: 12,
    fontWeight: "bold",
  },
  textHeader: {
    color: colors.daclen_light,
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontWeight: "bold",
  },
  textChange: {
    color: colors.daclen_blue,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginBottom: 20,
    fontSize: 14,
  },
  textUid: {
    fontSize: 12,
    color: colors.daclen_gray,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  mediaKitPhotos: store.mediaKitState.photos,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ getMediaKitPhotos }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(MediaKitFiles);
