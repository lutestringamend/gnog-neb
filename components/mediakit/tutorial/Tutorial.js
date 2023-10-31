import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ImageBackground,
  RefreshControl,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../../styles/base";
import VideosFlatlist from "../videos/VideosFlatlist";
import { getTutorialVideos } from "../../../axios/mediakit";

const Tutorial = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const {
    tutorials,
    videoError,
    userId,
    token,
    loading,
  } = props;

  useEffect(() => {
    props.getTutorialVideos(token);
  }, [token]);

  /*useEffect(() => {
    if (mediaKitVideos === null || !fetching) {
      //checkAsyncMediaKitVideos();
      setFetching(true);
      props.getMediaKitVideos(token);
      return;
    }
    if (fetching) {
      setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, mediaKitVideos);
      setFetching(false);
    }
    if (refreshing) {
      setRefreshing(false);
    }
    reorganizeVideos();
    console.log(
      "redux media kit videos - videosMengajak",
      mediaKitVideos,
      videosMengajak
    );
  }, [mediaKitVideos]);

  useEffect(() => {
    if (jenis_video === STARTER_KIT_VIDEO_MENGAJAK_TAG) {
      console.log("redux videosMengajak", videosMengajak);
    }
  }, [videosMengajak]);

  useEffect(() => {
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      checkAsyncWatermarkVideosSaved();
      return;
    }
    console.log("redux media savedWatermarkVideos", watermarkVideos);
  }, [watermarkVideos]);

  const reorganizeVideos = () => {
    try {
      setVideoKeys(Object.keys(mediaKitVideos));
    } catch (e) {
      console.error(e);
      setVideoKeys([]);
    }
  };

  const checkAsyncWatermarkVideosSaved = async () => {
    const storageWatermarkVideosSaved = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY
    );
    if (
      !(
        storageWatermarkVideosSaved === undefined ||
        storageWatermarkVideosSaved === null ||
        storageWatermarkVideosSaved?.length === undefined ||
        storageWatermarkVideosSaved?.length < 1
      )
    ) {
      props.overwriteWatermarkVideos(storageWatermarkVideosSaved);
    }
  };

  const refreshPage = () => {
    if (
      props?.refreshPage === undefined ||
      props?.refreshPage === null ||
      loading
    ) {
      return;
    }
    setRefreshing(true);
    props?.refreshPage();
    //props.getMediaKitVideos(token, products);
  };*/

  return (
    <View style={styles.container}>
        <ImageBackground
          source={require("../../../assets/profilbg.png")}
          style={styles.background}
          resizeMode="cover"
        />
      {loading || fetching || refreshing ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_light}
          style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
        />
      ) : null}
      {loading || fetching || refreshing ? null : (
        <View style={styles.containerInside}>
          {tutorials === null || tutorials?.length === undefined || tutorials?.length < 1 ? (
            <Text allowFontScaling={false} style={styles.textUid}>
              Tidak ada Video Tutorial tersedia.
            </Text>
          ) : (
            <VideosFlatlist
                videos={tutorials}
                refreshing={refreshing}
                refreshPage={() => refreshPage()}
                showTitle={true}
                title={title}
                style={styles.containerFlatlist}
                userId={userId}
                jenis_video="tutorial"
            />
          )}
        </View>
      )}
    </View>
  );
};

/*
                    <View
                      style={[
                        styles.containerOrientation,
                        {
                          backgroundColor:
                            item?.width > item?.height
                              ? colors.daclen_cyan
                              : colors.daclen_blue,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          item?.width > item?.height
                            ? "crop-landscape"
                            : "crop-portrait"
                        }
                        size={20}
                        color={colors.daclen_light}
                        style={{ alignSelf: "center" }}
                      />
                    </View>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
  },
  containerInside: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  containerFlatlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerOrientation: {
    position: "absolute",
    bottom: 6,
    end: 6,
    zIndex: 4,
    backgroundColor: colors.daclen_blue,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textUid: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_light,
    margin: 20,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  tutorials: store.mediaKitState.tutorials,
  videoError: store.mediaKitState.videoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getTutorialVideos,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Tutorial);
