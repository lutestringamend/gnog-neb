import React, { memo } from "react";
import { StyleSheet, View, Text } from "react-native";

import { colors, staticDimensions, bottomNav, dimensions } from "../../styles/base";
import VideosFlatlist from "./VideosFlatlist";
import { STARTER_KIT_VIDEO_PRODUK_TAG } from "../../axios/constants/starterkit";

const width = dimensions.fullWidth - (2 * staticDimensions.marginHorizontal);

const StarterKitVideoSegment = (props) => {
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
            marginTop: index === 0 ? staticDimensions.marginHorizontal : 0,
            marginBottom: isLast ? bottomNav.height + 3 * staticDimensions.marginHorizontal : staticDimensions.marginHorizontal,
          },
        ]}
      >
        

        <View style={styles.containerCarousel}>
        <VideosFlatlist
          videos={videos}
          refreshing={refreshing}
          refreshPage={() => refreshPage()}
          showTitle={true}
          title={title}
          style={styles.containerFlatlist}
          userId={userId}
          jenis_video={jenis_video}
        />
        </View>

        <View
          style={styles.containerHorizontal}
        >
          <View style={styles.containerVertical}>
          <Text allowFontScaling={false} style={styles.textName}>
            {title}
          </Text>
          <Text allowFontScaling={false} style={styles.textNum}>
            {`${videos?.length} video`}
          </Text>
          </View>
         
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
    paddingTop: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerScroll: {
    backgroundColor: colors.daclen_grey_container,
    borderRadius: 20 * dimensions.fullWidthAdjusted / 430,
    width,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerHorizontal: {
    maxWidth: dimensions.fullWidth - (4 * staticDimensions.marginHorizontal),
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginTop: 4 * dimensions.fullWidth / 430,
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: 16,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    borderRadius: 6,
    overflow: "hidden",
  },
  containerCarousel: {
    backgroundColor: colors.daclen_grey_light,
    borderRadius: 20 * dimensions.fullWidthAdjusted / 430,
    overflow: "hidden",
    paddingVertical: staticDimensions.marginHorizontal / 2,
    margin: 4 * dimensions.fullWidthAdjusted / 430,
  },
  button: {
    height: 30 * dimensions.fullWidthAdjusted / 430,
    borderRadius: 6 * dimensions.fullWidthAdjusted / 430,
    marginTop: staticDimensions.marginHorizontal,
    alignSelf: "flex-end",
  },
  textName: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: colors.black,
  },
  textNum: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: colors.black,
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

export default memo(StarterKitVideoSegment);
