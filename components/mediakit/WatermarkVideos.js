import React, { useEffect } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash, staticDimensions } from "../../styles/base";
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
  const { mediaKitVideos, watermarkVideos, userId, token } = props;

  useEffect(() => {
    if (mediaKitVideos?.length === undefined || mediaKitVideos?.length < 1) {
      checkAsyncMediaKitVideos();
      //props.getMediaKitVideos(token);
      return;
    }
    setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, mediaKitVideos);
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
      props.getMediaKitVideos(token, props.products);
    } else {
      props.updateReduxMediaKitVideos(storageVideos);
    }
  };

  const checkAsyncWatermarkVideosSaved = async () => {
    const storageWatermarkVideosSaved = await getObjectAsync(
      ASYNC_MEDIA_WATERMARK_VIDEOS_SAVED_KEY
    );
    if (
      !(storageWatermarkVideosSaved === undefined ||
      storageWatermarkVideosSaved === null ||
      storageWatermarkVideosSaved?.length === undefined ||
      storageWatermarkVideosSaved?.length < 1)
    ) {
      props.overwriteWatermarkVideos(storageWatermarkVideosSaved);
    }
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
      thumbnail: item?.foto ? `${mainhttp}${item?.foto}` : getTempThumbnail(index),
      title,
      width: item?.width ? item?.width : vwmarkdefaultsourcewidth,
      height: item?.height ? item?.height : vwmarkdefaultsourceheight,
    });
  }

  function getTempThumbnail(index) {
    return require("../../assets/favicon.png");
  }

  return (
    <View style={styles.containerFlatlist}>
      {mediaKitVideos?.length === undefined || mediaKitVideos?.length < 1 ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : (
        <FlashList
          estimatedItemSize={12}
          horizontal={false}
          numColumns={3}
          data={mediaKitVideos}
          renderItem={({ item, index }) => (
            <TouchableHighlight
              key={index}
              onPress={() => openVideo(item, index)}
              underlayColor={colors.daclen_orange}
              style={styles.containerImage}
            >
              <Image
                style={styles.imageList}
                source={item?.foto ? `${mainhttp}${item?.foto}` : getTempThumbnail(index)}
                contentFit="cover"
                placeholder={blurhash}
                transition={100}
              />
            </TouchableHighlight>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerFlatlist: {
    width: "100%",
    paddingBottom: staticDimensions.pageBottomPadding,
    backgroundColor: "white",
  },
  containerImage: {
    flex: 1,
    backgroundColor: colors.daclen_light,
    borderWidth: 0.5,
    borderColor: colors.daclen_lightgrey,
  },
  imageList: {
    flex: 1,
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
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
