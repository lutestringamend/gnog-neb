import React from 'react'
import { Dimensions, SafeAreaView } from 'react-native'
import VideoLargeWatermarkModel from './VideoLargeWatermarkModel'
import { vwmarkdefaultsourceheight, vwmarkdefaultsourcewidth } from '../mediakit/constants'

const WmarkTestScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white", width: "100%"}}>
        <VideoLargeWatermarkModel 
        width={Dimensions.get("window").width}
        height={vwmarkdefaultsourceheight * Dimensions.get("window").width / vwmarkdefaultsourcewidth}
        videotoScreenRatio={1}
        watermarkData={
          {
            name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            phone: "123456789123456789",
            url: "",
          }
        }
        />

    </SafeAreaView>
  )
}

export default WmarkTestScreen
