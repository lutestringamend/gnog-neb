import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "../../styles/base";
import {
  vmwarkdefaultpositionendtovideotruewidthratio,
  vwmarkdefaultpositiontoptovideotrueheightratio,
  vwmarkdefaultwmarktovideotruewidthratio,
  vwmarktemplatewidth,
  vwmarktextnamecharlimit,
  vwmarkurlborderradius,
  vwmarkurlfontsize,
  vwmarkurlmargintop,
  vwmarkurlpaddinghorizontal,
  vwmarkurlpaddingvertical,
} from "../mediakit/constants";
import VWatermarkModel from "./VWatermarkModel";
import { personalwebsiteurlshort } from "../../axios/constants";

function VideoLargeWatermarkModel(props) {
  const { watermarkData, style, width, height, videoToScreenRatio } = props;
  const ratio =
    (vwmarkdefaultwmarktovideotruewidthratio * width) / vwmarktemplatewidth;

  const displayWatermarkPositionEnd =
    vmwarkdefaultpositionendtovideotruewidthratio * width;
  const displayWatermarkPositionStart = Math.ceil(
    width - displayWatermarkPositionEnd - (ratio * vwmarktemplatewidth) / 2
  );
  const displayWatermarkPositionTop = Math.ceil(
    vwmarkdefaultpositiontoptovideotrueheightratio * height
  );

  /*useEffect(() => {
    console.log(
      ratio,
      displayWatermarkPositionTop,
      displayWatermarkPositionStart,
      videoToScreenRatio,
      (videoToScreenRatio ? videoToScreenRatio : 1) * vwmarkurlmargintop
    );
  }, []);*/

  if (
    watermarkData === undefined ||
    watermarkData === null ||
    width === undefined ||
    width === null ||
    height === undefined ||
    height === null
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
        },
        style ? style : null,
      ]}
    >
      <VWatermarkModel
        watermarkData={watermarkData}
        ratio={ratio}
        style={[
          styles.containerSmall,
          {
            top: displayWatermarkPositionTop,
            start: displayWatermarkPositionStart,
          },
        ]}
      />
      {watermarkData === undefined ||
      watermarkData === null ||
      watermarkData?.name === undefined ||
      watermarkData?.name === null ||
      watermarkData?.name === "" ||
      watermarkData?.name?.length === undefined ||
      watermarkData?.name?.length < 1 ? null : (
        <View
          style={[
            styles.containerUrl,
            {
              paddingHorizontal:
                (videoToScreenRatio ? videoToScreenRatio : 1) *
                vwmarkurlpaddinghorizontal,
              paddingVertical:
                (videoToScreenRatio ? videoToScreenRatio : 1) *
                vwmarkurlpaddingvertical,
              marginTop:
                (videoToScreenRatio ? videoToScreenRatio : 1) *
                vwmarkurlmargintop,
              borderRadius:
                (videoToScreenRatio ? videoToScreenRatio : 1) *
                vwmarkurlborderradius,
            },
          ]}
        >
          <Text
            style={[
              styles.textUrl,
              {
                fontSize:
                  (videoToScreenRatio ? videoToScreenRatio : 1) *
                  vwmarkurlfontsize,
              },
            ]}
          >
            {`${personalwebsiteurlshort}${
              watermarkData?.name?.length > vwmarktextnamecharlimit
                ? watermarkData?.name.substring(0, vwmarktextnamecharlimit)
                : watermarkData?.name
            }`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerSmall: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 1,
    elevation: 2,
  },
  containerUrl: {
    backgroundColor: colors.daclen_gray,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 4,
  },
  textUrl: {
    backgroundColor: "transparent",
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default VideoLargeWatermarkModel;
