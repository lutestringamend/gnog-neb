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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
  const { mediaKitVideos, watermarkVideos, userId, token, products, loading } =
    props;

  useEffect(() => {
    if (mediaKitVideos?.length === undefined || mediaKitVideos?.length < 1) {
      checkAsyncMediaKitVideos();
      //props.getMediaKitVideos(token);
      return;
    }
    setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, mediaKitVideos);
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
    let title = item?.nama ? item?.nama : "Video Promosi";
    try {
      if (title.includes("/")) {
        let items = title.split("/");
        title = items[items?.length - 1];
      }
    } catch (e) {
      console.error(e);
    }
    navigation.navigate("VideoPlayerScreen", {
      userId,
      videoId: item?.id ? item?.id : item?.video,
      uri: item?.video ? item?.video : null,
      thumbnail: item?.foto ? `${mainhttp}${item?.foto}` : getTempThumbnail(),
      title,
      width: item?.width ? item?.width : vwmarkdefaultsourcewidth,
      height: item?.height ? item?.height : vwmarkdefaultsourceheight,
    });
  }

  function getTempThumbnail() {
    return require("../../assets/favicon.png");
  }

  return (
    <View style={styles.container}>
      {mediaKitVideos?.length < 1 ? null : (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
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
                        mediaKitVideos?.length - index < 2
                          ? staticDimensions.pageBottomPadding / 2
                          : 0,
                    },
                  ]}
                >
                  <View style={styles.containerThumbnail}>
                    <Image
                      style={styles.imageList}
                      source={`${mainhttp}${item?.foto}`}
                      contentFit="cover"
                      placeholder={blurhash}
                      transition={100}
                    />

                  </View>

                  <Text allowFontScaling={false} style={styles.textHeader}>{item?.nama}</Text>
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
    backgroundColor: colors.white,
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
  containerImage: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.daclen_lightgrey,
  },
  containerThumbnail: {
    flex: 1,
    aspectRatio: 1 / 1,
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
    aspectRatio: 1 / 1,
    backgroundColor: colors.white,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 10,
    height: 40,
    paddingVertical: 4,
    color: colors.daclen_black,
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
