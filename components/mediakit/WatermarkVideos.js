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
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { ASYNC_MEDIA_WATERMARK_VIDEOS_KEY } from "../asyncstorage/constants";
import { tempmediakitvideothumbnail, tempmediakitvideouri, tempvideoarray, vwmarkdefaultsourceheight, vwmarkdefaultsourcewidth } from "./constants";

const WatermarkVideos = (props) => {
  const navigation = useNavigation();
  const { mediaKitVideos, videoError, videosUri, userId, token } = props;

  useEffect(() => {
    if (mediaKitVideos?.length === undefined || mediaKitVideos?.length < 1) {
      //checkAsyncMediaKitVideos();
      props.getMediaKitVideos(token);
      return;
    }
    setObjectAsync(ASYNC_MEDIA_WATERMARK_VIDEOS_KEY, mediaKitVideos);
    console.log("redux media kit videos", mediaKitVideos);
  }, [mediaKitVideos]);

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
      props.getMediaKitVideos(token);
    } else {
      props.updateReduxMediaKitVideos(storageVideos);
    }
  };

  function openVideo(item) {
    navigation.navigate("VideoPlayerScreen", {
      userId,
      uri: "https://daclen.com/video/watermark/aurora_army_hs1.mp4",
      thumbnail: tempmediakitvideothumbnail,
      title: item?.nama ? item?.nama : "Video Promosi",
      width: 720,
      height: 1080,
    });
  }

  /*
 width: item?.width,
      height: item?.height,
      text_align: item?.text_align,
      text_x: item?.text_x,
      text_y: item?.text_y,
      font: item?.font,
  */

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
              onPress={() => openVideo(item)}
              underlayColor={colors.daclen_orange}
              style={styles.containerImage}
            >
              <Image
                style={styles.imageList}
                source={tempmediakitvideothumbnail}
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
  videoError: store.mediaKitState.videoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitVideos,
      clearMediaKitVideosError,
      updateReduxMediaKitVideos,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(WatermarkVideos);
