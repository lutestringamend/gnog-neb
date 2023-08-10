import React from 'react'
import { SafeAreaView } from 'react-native'
import VWatermarkModel from './VWatermarkModel'

const WmarkTestScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white", width: "100%"}}>
        <VWatermarkModel 
        ratio={0.1}
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
