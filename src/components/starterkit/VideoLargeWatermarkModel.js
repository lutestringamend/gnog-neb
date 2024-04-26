import React from "react";
import { View, StyleSheet } from "react-native";

import { colors } from "../../styles/base";
import {
  vmwarkdefaultpositionendtovideotruewidthratio,
  vmwarkportraittopenlargementconstant,
  vwmark2templatewidth,
  vwmarkdefaultpositiontoptovideotrueheightratio,
  vwmarkdefaultwmark2tovideotruewidthratio,
  vwmarkdefaultwmarktovideotruewidthratio,
  vwmarkportraitenlargementconstant,
  vwmarktemplatewidth,
  vwmarktextnamecharlimit,
  vwmarkurlborderradius,
  vwmarkurlfontsize,
  vwmarkurlmargintop,
  vwmarkurlpaddinghorizontal,
  vwmarkurlpaddingvertical,
} from "../../constants/starterkit";
import VWatermarkModel2 from "./VWatermarkModel2";

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
    (vwmarkdefaultwmark2tovideotruewidthratio *
      width *
      orientationConstant) /
    vwmark2templatewidth;

  const displayWatermarkPositionStart = Math.ceil(
    width - (ratio * vwmark2templatewidth)
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
      <VWatermarkModel2
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
