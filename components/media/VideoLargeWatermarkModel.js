import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "../../styles/base";
import {
  vmwarkdefaultpositionendtovideotruewidthratio,
  vmwarkportraittopenlargementconstant,
  vwmarkdefaultpositiontoptovideotrueheightratio,
  vwmarkdefaultwmarktovideotruewidthratio,
  vwmarkportraitenlargementconstant,
  vwmarktemplatewidth,
  vwmarktextnamecharlimit,
  vwmarkurlborderradius,
  vwmarkurlfontsize,
  vwmarkurlmargintop,
  vwmarkurlpaddinghorizontal,
  vwmarkurlpaddingvertical,
} from "../mediakit/constants";
import VWatermarkModel from "./VWatermarkModel";
import { tokoonlineurlshort } from "../../axios/constants";

function VideoLargeWatermarkModel(props) {
  const {
    watermarkData,
    style,
    width,
    height,
    videoToScreenRatio,
    orientation,
    username,
  } = props;

  const orientationConstant = orientation === "portrait" ? vwmarkportraitenlargementconstant : 1;
  const topOrientationConstant = orientation === "portrait" ? vmwarkportraittopenlargementconstant : 1;
  const ratio =
    (vwmarkdefaultwmarktovideotruewidthratio *
      width *
      orientationConstant) /
    vwmarktemplatewidth;

  const displayWatermarkPositionEnd =
    vmwarkdefaultpositionendtovideotruewidthratio * width * orientationConstant;
  const displayWatermarkPositionStart = Math.ceil(
    width - displayWatermarkPositionEnd - (ratio * vwmarktemplatewidth) / 2
  );
  const displayWatermarkPositionTop = Math.ceil(
    vwmarkdefaultpositiontoptovideotrueheightratio * height * orientationConstant
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

  function onLoadEnd() {
    if (props?.onLoadEnd === undefined || props?.onLoadEnd === null) {
      return;
    }
    props?.onLoadEnd();
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
        onLoadEnd={() => onLoadEnd()}
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
                (videoToScreenRatio ? videoToScreenRatio : 1) * topOrientationConstant *
                vwmarkurlpaddinghorizontal,
              paddingVertical:
                (videoToScreenRatio ? videoToScreenRatio : 1) * topOrientationConstant *
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
          <Text allowFontScaling={false}
            style={[
              styles.textUrl,
              {
                fontSize:
                  (videoToScreenRatio ? videoToScreenRatio : 1) * topOrientationConstant *
                  vwmarkurlfontsize,
              },
            ]}
          >
             {`${watermarkData?.url ? watermarkData?.url : username ? `${tokoonlineurlshort}${
            username
          }` : ""}`}
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
    opacity: 0.9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 4,
  },
  textUrl: {
    backgroundColor: "transparent",
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default VideoLargeWatermarkModel;
