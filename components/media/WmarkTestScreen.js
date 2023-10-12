import React from 'react'
import { Dimensions, SafeAreaView, View, Platform } from 'react-native'
import VideoLargeWatermarkModel from './VideoLargeWatermarkModel'
import { videoplayerportraitiosheight, videoplayerportraitpanelandroidheight, vwmarkdefaultsourceheight, vwmarkdefaultsourcewidth } from '../mediakit/constants'
import { tokoonlineurlshort } from '../../axios/constants'
import { colors } from '../../styles/base'



const WmarkTestScreen = () => {
  const width = vwmarkdefaultsourcewidth;
  const height = vwmarkdefaultsourceheight;
  const displayWidth = Dimensions.get("window").width;
  const displayHeight = Dimensions.get("window").height;

  const ratio =
    width === null || height === null
      ? vwmarkdefaultsourcewidth / vwmarkdefaultsourceheight
      : width / height;

  const projectedPortraitVideoHeight = Math.round(displayWidth / ratio);
  const readjustedPortraitVideoHeight =
    displayHeight -
    (Platform.OS === "ios"
      ? videoplayerportraitiosheight
      : videoplayerportraitpanelandroidheight);
  const readjustedPortraitVideoWidth = Math.round(
    readjustedPortraitVideoHeight * ratio
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white", width: "100%", justifyContent: "center", alignItems: "center"}}>
      <View style={{backgroundColor: colors.daclen_black, width: readjustedPortraitVideoWidth, height: readjustedPortraitVideoHeight}}>
      <VideoLargeWatermarkModel
          width={readjustedPortraitVideoWidth}
          height={readjustedPortraitVideoHeight}
          videoToScreenRatio={parseFloat(readjustedPortraitVideoWidth / displayWidth)}
          watermarkData={{
            name: "DaclenDaclenDaclen",
            phone: "08123456789123123",
            url: `${tokoonlineurlshort}\jasonlimanjaya`,
          }}
          orientation="portrait"
          username="Jason"
          onLoadEnd={() => console.log("onLoadEnd")}
        />
      </View>
      

    </SafeAreaView>
  )
}

export default WmarkTestScreen
