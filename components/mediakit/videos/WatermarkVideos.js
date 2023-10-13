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
import { overwriteWatermarkVideos } from "../../media";
import { getObjectAsync, setObjectAsync } from "../../asyncstorage";
import {
  ASYNC_MEDIA_WATERMARK_VIDEOS_KEY,
  ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY,
} from "../../asyncstorage/constants";
import WatermarkVideosSegment from "./WatermarkVideosSegment";
import VideosFlatlist from "./VideosFlatlist";
import { STARTER_KIT_VIDEO_PRODUK_TAG } from "../constants";

const WatermarkVideos = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [videos, setVideos] = useState(null);
  const [videoKeys, setVideoKeys] = useState(null);
  const { mediaKitVideos, watermarkVideos, userId, token, products, loading } =
    props;

  useEffect(() => {
    if (mediaKitVideos?.length === undefined || !fetching) {
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
    console.log("redux media kit videos", mediaKitVideos);
  }, [mediaKitVideos]);

  useEffect(() => {
    console.log("videos", videos);
  }, [videos]);

  useEffect(() => {
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      checkAsyncWatermarkVideosSaved();
      return;
    }
    console.log("redux media savedWatermarkVideos", watermarkVideos);
  }, [watermarkVideos]);

  const reorganizeVideos = () => {
    let newVideos = {
      Lainnya: [],
    };
    try {
      for (let vid of mediaKitVideos) {
        if (
          vid?.produk === undefined ||
          vid?.produk?.nama === undefined ||
          vid?.produk?.nama === null
        ) {
          newVideos["Lainnya"].unshift(vid);
        } else {
          if (newVideos[vid?.produk?.nama] === undefined) {
            newVideos[vid?.produk?.nama] = [vid];
          } else {
            newVideos[vid?.produk?.nama].unshift(vid);
          }
        }
      }
      if (
        newVideos["Lainnya"]?.length === undefined ||
        newVideos["Lainnya"]?.length < 1
      ) {
        delete newVideos.Lainnya;
      }
      setVideos(newVideos);
      setVideoKeys(Object.keys(newVideos).sort());
    } catch (e) {
      console.error(e);
      setVideos(null);
      setVideoKeys([]);
    }
  };

  const checkAsyncMediaKitVideos = async () => {
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
  };

  return (
    <View style={styles.container}>
      {loading || fetching || refreshing || videoKeys === null ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_light}
          style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
        />
      ) : null}
      {mediaKitVideos?.length === undefined || loading ? null : (
        <View style={styles.containerInside}>
          {mediaKitVideos?.length < 1 ? (
            <Text allowFontScaling={false} style={styles.textUid}>
              Tidak ada Video Produk tersedia.
            </Text>
          ) : videos === null && videoKeys !== null ? (
            <VideosFlatlist
              videos={mediaKitVideos}
              refreshing={refreshing}
              refreshPage={() => refreshPage()}
              showTitle={true}
              userId={userId}
            />
          ) : (
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
                <WatermarkVideosSegment
                  index={index}
                  isLast={index === videoKeys?.length - 1}
                  key={item}
                  title={item}
                  videos={videos[item]}
                  refreshing={refreshing}
                  userId={userId}
                  jenis_video={STARTER_KIT_VIDEO_PRODUK_TAG}
                />
              )}
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
  videosUri: store.mediaKitState.videosUri,
  mediaKitVideos: store.mediaKitState.videos,
  watermarkVideos: store.mediaState.watermarkVideos,
  videoError: store.mediaKitState.videoError,
  products: store.productState.products,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitVideos,
      clearMediaKitVideosError,
      updateReduxMediaKitVideos,
      overwriteWatermarkVideos,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(WatermarkVideos);
