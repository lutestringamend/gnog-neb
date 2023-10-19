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

import { colors, staticDimensions, blurhash } from "../../../styles/base";
import {
    vwmarkdefaultsourceheight,
    vwmarkdefaultsourcewidth,
  } from "../constants";

const VideosFlatlist = (props) => {
  const { videos, refreshing, showTitle, userId, jenis_video } = props;
  const navigation = useNavigation();

  function refreshPage() {
    if (props?.refreshPage === undefined || props?.refreshPage === null) {
      return;
    }
    props?.refreshPage();
  }

  function getTitle(item) {
    if (
      !(
        item?.produk === undefined ||
        item?.produk?.nama === undefined ||
        item?.produk?.nama === null ||
        item?.produk?.nama === ""
      )
    ) {
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

  function openVideo(item, index) {
    navigation.navigate("VideoPlayerScreen", {
      userId,
      videoId: item?.id ? item?.id : item?.video,
      uri: item?.video ? item?.video : null,
      thumbnail: getTempThumbnail(item),
      title: getTitle(item),
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

  return (
    <View style={styles.containerFlatlist}>
      <FlashList
        estimatedItemSize={6}
        horizontal={false}
        numColumns={3}
        data={videos}
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
                paddingBottom:
                  videos?.length > 3 && index >= Math.floor(videos?.length / 3) * 3
                    ? staticDimensions.pageBottomPadding
                    : 20,
              },
            ]}
          >
            <View style={styles.containerThumbnail}>
              <Image
                style={styles.imageList}
                source={getTempThumbnail(item)}
                contentFit="cover"
                placeholder={blurhash}
                transition={0}
                cachePolicy="memory-disk"
              />
            </View>

            {showTitle ? (
              <Text allowFontScaling={false} style={styles.textHeader}>
                {getTitle(item)}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerFlatlist: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerImage: {
    flex: 1,
    backgroundColor: "transparent",
    marginHorizontal: 10,
  },
  containerThumbnail: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_lightgrey,
    backgroundColor: colors.daclen_lightgrey,
  },
  imageList: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 6,
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
});

export default VideosFlatlist;
