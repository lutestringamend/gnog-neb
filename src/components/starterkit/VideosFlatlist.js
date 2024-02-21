import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions, dimensions } from "../../styles/base";
import {
  FLYER_MENGAJAK_PAGINATION_LIMIT,
  STARTER_KIT_VIDEO_PRODUK_TAG,
    vwmarkdefaultsourceheight,
    vwmarkdefaultsourcewidth,
  } from "../../constants/starterkit";
import { checkVideoFileName } from "../../axios/mediakit";

const screenAR = dimensions.fullWidth / dimensions.fullHeight;
const limitAR = 9 / 16;
const numColumns = screenAR >= limitAR ? 4 : 3;
const itemLimit = FLYER_MENGAJAK_PAGINATION_LIMIT * numColumns;
const width = (dimensions.fullWidth - (numColumns + 1) * 20) / numColumns;
const height = (180 * width) / 135;

const smallWidth = 135 * dimensions.fullWidthAdjusted / 430;
const smallHeight = 180 * dimensions.fullWidthAdjusted / 430;

const VideosFlatlist = (props) => {
  const { videos, refreshing, showTitle, userId, jenis_video, style, title } = props;
  const navigation = useNavigation();

  function refreshPage() {
    if (props?.refreshPage === undefined || props?.refreshPage === null) {
      return;
    }
    props?.refreshPage();
  }

  function openVideo(e) {
    let item = checkVideoFileName(e);
    navigation.navigate("VideoPlayerScreen", {
      userId,
      videoId: item?.id ? item?.id : item?.video,
      uri: item?.video ? item?.video : null,
      thumbnail: getTempThumbnail(item),
      title: `${title ? title : ""}${item?.judul ? ` ${item?.judul}` : ""}`,
      width: item?.width ? item?.width : vwmarkdefaultsourcewidth,
      height: item?.height ? item?.height : vwmarkdefaultsourceheight,
      jenis_video,
    });
  }

  function getTempThumbnail(item) {
    if (
      !(
        item?.thumbnail === undefined ||
        item?.thumbnail === null ||
        item?.thumbnail === ""
      )
    ) {
      return item?.thumbnail;
    }
    if (
      !(
        item?.produk === undefined ||
        item?.produk?.thumbnail_url === undefined ||
        item?.produk?.thumbnail_url === null
      )
    ) {
      return item?.produk?.thumbnail_url;
    }
    return require("../../../assets/favicon.png");
  }

  if (refreshing) {
    return null;
  }

  return (
    <View style={[styles.container, style ? style : {width: "100%"}]}>
      <FlashList
        estimatedItemSize={6}
        horizontal={false}
        numColumns={numColumns}
        data={videos}
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
            onPress={() => openVideo(item)}
            style={[
              styles.containerImage,
              {
                flex: 1,
                marginTop: index < numColumns ? staticDimensions.marginHorizontal : 0,
                marginBottom:
                  index >= videos?.length - 1 && jenis_video !== STARTER_KIT_VIDEO_PRODUK_TAG
                    ? height + (3 * staticDimensions.marginHorizontal)
                    : staticDimensions.marginHorizontal,
              },
            ]}
          >
            <Image
                style={[styles.imageList, {
                  width: jenis_video === STARTER_KIT_VIDEO_PRODUK_TAG ? width : width,
                  height: jenis_video === STARTER_KIT_VIDEO_PRODUK_TAG ? height: height, 
                }]}
                source={getTempThumbnail(item)}
                contentFit="cover"
                placeholder={null}
                transition={100}
                cachepolicy="memory-disk"
              />

            {showTitle && item?.judul ? (
              <Text allowFontScaling={false} style={styles.textHeader}>
                {item?.judul}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  containerFlatlist: {
    backgroundColor: "transparent",
  },
  containerImage: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal / 2,
    minHeight: height,
  },
  imageList: {
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  textHeader: {
    width,
    backgroundColor: "transparent",
    fontSize: 12,
    fontFamily: "Poppins-Light",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: staticDimensions.marginHorizontal,
    color: colors.black,
  },
});

export default VideosFlatlist;
