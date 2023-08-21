import React from 'react'
import { Dimensions, SafeAreaView } from 'react-native'
import VideoLargeWatermarkModel from './VideoLargeWatermarkModel'
import { vwmarkdefaultsourceheight, vwmarkdefaultsourcewidth } from '../mediakit/constants'
import ImageLargeWatermarkModel from './ImageLargeWatermarkModel'

const WmarkTestScreen = () => {
  const width = 1500;
  const height = 2000;
  const displayWidth = Dimensions.get("window").width;
  const displayHeight = height * displayWidth / width;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white", width: "100%"}}>
        <ImageLargeWatermarkModel 
        width={width}
        height={height}
        displayWidth={displayWidth}
        displayHeight={displayHeight}
        uri="https://daclen.com/img/foto-watermark/1692392910TARA LAPTOP BACKPACK 1 WM.jpg"
        link_x={570}
        link_y={1801}
        text_x={398}
        text_y={1914}
        fontSize={48}
        watermarkData={
          {
            name: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            phone: "123456789123456789",
            url: "daclen.com/web/ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          }
        }
        />

    </SafeAreaView>
  )
}

export default WmarkTestScreen
