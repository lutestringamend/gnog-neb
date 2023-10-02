import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";

import {
  colors,
  blurhash,
  staticDimensions,
  dimensions,
} from "../../styles/base";
import {
  getMediaKitVideos,
  updateReduxMediaKitVideos,
  clearMediaKitVideosError,
} from "../../axios/mediakit";
import { overwriteWatermarkVideos } from "../media";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import {
  ASYNC_MEDIA_WATERMARK_VIDEOS_KEY,
  ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY,
} from "../asyncstorage/constants";
import {
  tempmediakitvideothumbnail,
  vwmarkdefaultsourceheight,
  vwmarkdefaultsourcewidth,
} from "./constants";
import { mainhttp } from "../../axios/constants";

const WatermarkVideos = (props) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
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
    console.log("redux media kit videos", mediaKitVideos);
  }, [mediaKitVideos]);

  useEffect(() => {
    if (watermarkVideos?.length === undefined || watermarkVideos?.length < 1) {
      checkAsyncWatermarkVideosSaved();
      return;
    }
    console.log("redux media savedWatermarkVideos", watermarkVideos);
  }, [watermarkVideos]);

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

  function openVideo(item, index) {
    navigation.navigate("VideoPlayerScreen", {
      userId,
      videoId: item?.id ? item?.id : item?.video,
      uri: item?.video ? item?.video : null,
      thumbnail: getTempThumbnail(item),
      title: getTitle(item),
      width: item?.width ? item?.width : vwmarkdefaultsourcewidth,
      height: item?.height ? item?.height : vwmarkdefaultsourceheight,
    });
  }

  function getTitle(item) {
    if (!(item?.produk === undefined || item?.produk?.nama === undefined || item?.produk?.nama === null || item?.produk?.nama === "")) {
      return item?.produk?.nama;
    }
    let title = item?.nama ? item?.nama : "Video Promosi";
    try {
      if (title.includes("/")) {
        let items = title.split("/");
        title = items[items?.length - 1];
      }
    } catch (e) {
      console.error(e);
    }
    return title;
  }

  function getTempThumbnail(item) {
    if (!(item?.thumbnail === undefined || item?.thumbnail === null || item?.thumbnail === "")) {
      return item?.thumbnail;
    }
    if (!(item?.produk === undefined || item?.produk?.thumbnail_url === undefined || item?.produk?.thumbnail_url === null)) {
      return item?.produk?.thumbnail_url;
    }
    return require("../../assets/favicon.png");
  }

  return (
    <View style={styles.container}>
      {mediaKitVideos?.length === undefined || fetching || mediaKitVideos?.length > 0 ? null : (
        <ActivityIndicator
          size="large"
          color={colors.daclen_light}
          style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
        />
      )}
      {mediaKitVideos?.length === undefined || loading ? null : (
        <View style={styles.containerInside}>
          {mediaKitVideos?.length < 1 ? (
            <Text allowFontScaling={false} style={styles.textUid}>
              Tidak ada Video Promosi tersedia.
            </Text>
          ) : (
            <FlashList
              estimatedItemSize={6}
              horizontal={false}
              numColumns={3}
              data={mediaKitVideos}
              contentContainerStyle={styles.containerFlatlist}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => refreshPage()}
                />
              }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openVideo(item, index)}
                  style={[
                    styles.containerImage,
                    {
                      marginBottom:
                        mediaKitVideos?.length - index < 1
                          ? staticDimensions.pageBottomPadding / 2
                          : 0,
                    },
                  ]}
                >
                  <View style={styles.containerThumbnail}>
                    <Image
                      style={styles.imageList}
                      source={getTempThumbnail(item)}
                      contentFit="cover"
                      placeholder={blurhash}
                      transition={100}
                    />
                  </View>

                  <Text allowFontScaling={false} style={styles.textHeader}>
                    {getTitle(item)}
                  </Text>
                </TouchableOpacity>
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
    marginHorizontal: 10,
  },
  containerImage: {
    flex: 1,
    backgroundColor: "transparent",
    marginHorizontal: 10,
  },
  containerThumbnail: {
    flex: 1,
    aspectRatio: 3 / 4,
    backgroundColor: colors.daclen_lightgrey,
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
  imageList: {
    flex: 1,
    aspectRatio: 3 / 4,
    backgroundColor: colors.daclen_light,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 6,
    marginBottom: 12,
    marginHorizontal: 10,
    height: 52,
    color: colors.daclen_light,
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
