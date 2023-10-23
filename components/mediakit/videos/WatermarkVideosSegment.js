import React, { memo } from "react";
import { StyleSheet, View, Text } from "react-native";

import { colors, staticDimensions } from "../../../styles/base";
import VideosFlatlist from "./VideosFlatlist";
import { STARTER_KIT_VIDEO_PRODUK_TAG } from "../constants";

const WatermarkVideosSegment = (props) => {
  const { title, videos, index, isLast, refreshing, userId, jenis_video } =
    props;

  function refreshPage() {
    if (props?.refreshPage === undefined || props?.refreshPage === null) {
      return;
    }
    props?.refreshPage();
  }

  return (
    <View
      style={[
        styles.containerScroll,
        {
          paddingTop: index === 0 ? 20 : 10,
          paddingBottom: isLast ? staticDimensions.pageBottomPadding / 2 : 0,
        },
      ]}
    >
      {title && jenis_video === STARTER_KIT_VIDEO_PRODUK_TAG ? (
        <View style={styles.containerScrollHeader}>
          <Text allowFontScaling={false} style={[styles.textName, { flex: 1 }]}>
            {title}
          </Text>
        </View>
      ) : null}

      <View style={styles.containerCarousel}>
        <VideosFlatlist
          videos={videos}
          refreshing={refreshing}
          refreshPage={() => refreshPage()}
          showTitle={true}
          userId={userId}
          jenis_video={jenis_video}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "transparent",
    marginHorizontal: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerScroll: {
    backgroundColor: "transparent",
    marginHorizontal: 10,
  },
  containerScrollHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    paddingEnd: 24,
  },
  containerCarousel: {
    backgroundColor: "transparent",
    marginVertical: 20,
  },
  containerLeft: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
    marginStart: 10,
  },
  containerInfo: {
    flex: 1,
    backgroundColor: "center",
    marginStart: 10,
    alignSelf: "flex-start",
    height: 100,
  },
  containerImage: {
    backgroundColor: "transparent",
    width: 104,
    height: 125,
    alignSelf: "center",
  },
  textName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: colors.daclen_light,
    alignSelf: "flex-start",
  },
  image: {
    width: 94,
    height: 125,
    borderRadius: 6,
    alignSelf: "center",
    backgroundColor: "transparent",
    marginStart: 12,
  },
  textPrice: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_orange,
    marginTop: 6,
  },
  textButton: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: colors.daclen_black,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
  icon: {
    alignSelf: "center",
    marginEnd: 12,
  },
});

export default memo(WatermarkVideosSegment);
