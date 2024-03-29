import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  FlatList,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../../styles/base";
import {
  getMediaKitVideos,
  updateReduxMediaKitVideos,
  clearMediaKitVideosError,
} from "../../../axios/mediakit";
import { overwriteWatermarkVideos } from "../../../components/media";
import {
  getObjectAsync,
  setObjectAsync,
} from "../../../components/asyncstorage";
import {
  ASYNC_MEDIA_WATERMARK_VIDEOS_KEY,
  ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY,
} from "../../../components/asyncstorage/constants";
import StarterKitVideoSegment from "../../components/starterkit/StarterKitVideoSegment";
import VideosFlatlist from "../../components/starterkit/VideosFlatlist";
import {
  STARTER_KIT_VIDEO_MENGAJAK_TAG,
  STARTER_KIT_VIDEO_PRODUK_TAG,
} from "../../axios/constants/starterkit";
import EmptySpinner from "../../components/empty/EmptySpinner";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import { staticDimensions } from "../../styles/base";

const StarterKitVideo = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [videoKeys, setVideoKeys] = useState(null);
  const {
    mediaKitVideos,
    videosMengajak,
    jenis_video,
    watermarkVideos,
    userId,
    token,
    loading,
  } = props;

  useEffect(() => {
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
      videosMengajak,
    );
  }, [mediaKitVideos]);

  useEffect(() => {
    if (jenis_video === STARTER_KIT_VIDEO_MENGAJAK_TAG) {
      console.log("redux videosMengajak", videosMengajak);
    }
  }, [videosMengajak]);

  /*useEffect(() => {
    console.log("videos", videos);
  }, [videos]);*/

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

  /*const checkAsyncMediaKitVideos = async () => {
    const storageVideos = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_VIDEOS_KEY
    );
    if (
      storageVideos === undefined ||
      storageVideos === null ||
      storageVideos?.length === undefined ||
      storageVideos?.length < 1
    ) {
      if (token === undefined || token === null) {
        return;
      }
      props.getMediaKitVideos(token, products);
    } else {
      props.updateReduxMediaKitVideos(storageVideos);
    }
  };*/

  const checkAsyncWatermarkVideosSaved = async () => {
    const storageWatermarkVideosSaved = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY,
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
  };

  return (
    <View style={styles.container}>
      {loading || fetching || refreshing ? <EmptySpinner /> : null}
      {loading || fetching || refreshing ? null : (
        <View style={styles.containerInside}>
          {jenis_video === STARTER_KIT_VIDEO_PRODUK_TAG &&
          videoKeys?.length < 1 ? (
            <EmptyPlaceholder
              title="Video Produk"
              text="Tidak ada Video Produk tersedia."
            />
          ) : jenis_video === STARTER_KIT_VIDEO_MENGAJAK_TAG &&
            videosMengajak?.length < 1 ? (
            <EmptyPlaceholder
              title="Video Mengajak"
              text="Tidak ada Video Mengajak tersedia."
            />
          ) : jenis_video === STARTER_KIT_VIDEO_MENGAJAK_TAG ? (
            <VideosFlatlist
              videos={videosMengajak}
              refreshing={refreshing}
              refreshPage={() => refreshPage()}
              jenis_video={jenis_video}
              showTitle={true}
              style={{
                paddingHorizontal: staticDimensions.marginHorizontal / 2,
              }}
              userId={userId}
            />
          ) : jenis_video === STARTER_KIT_VIDEO_PRODUK_TAG ? (
            <FlatList
              estimatedItemSize={10}
              horizontal={false}
              numColumns={1}
              data={videoKeys}
              style={styles.containerFlatlist}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => refreshPage()}
                />
              }
              renderItem={({ item, index }) => (
                <StarterKitVideoSegment
                  index={index}
                  isLast={index === videoKeys?.length - 1}
                  key={index}
                  title={item}
                  videos={mediaKitVideos[item]}
                  refreshing={refreshing}
                  userId={userId}
                  jenis_video={jenis_video}
                />
              )}
            />
          ) : (
            <EmptyPlaceholder
              title="Starter Kit"
              text="Tidak ada video tersedia."
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
});

const mapStateToProps = (store) => ({
  videosUri: store.mediaKitState.videosUri,
  mediaKitVideos: store.mediaKitState.videos,
  videosMengajak: store.mediaKitState.videosMengajak,
  watermarkVideos: store.mediaState.watermarkVideos,
  videoError: store.mediaKitState.videoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitVideos,
      clearMediaKitVideosError,
      updateReduxMediaKitVideos,
      overwriteWatermarkVideos,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(StarterKitVideo);
