import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions, staticDimensions } from '../../styles/base'
import { Image } from 'expo-image';

const width = 140 * dimensions.fullWidthAdjusted / 430;
const height = 2480 *  width / 9257;

const AuthHeader = (props) => {
  const { hideBack, style } = props;
    const navigation = useNavigation();

    function onBackPress() {
        if (props?.onBackPress === undefined || props?.onBackPress === null) {
          navigation.goBack();
        } else {
            props?.onBackPress();
        }
        
      }
  return (
    <View style={[styles.container, style ? style : null]}>
        <TouchableOpacity disabled={hideBack} onPress={() => onBackPress()}>

        {hideBack ? null :  <MaterialCommunityIcons
          name="arrow-left"
          size={30 * dimensions.fullWidthAdjusted / 430}
          color={colors.black}
        />}
       
        </TouchableOpacity>
        <Image
            source={require("../../assets/logoblack.png")}
            contentFit="contain"
            style={styles.logo}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: dimensions.fullWidthAdjusted,
        backgroundColor: colors.white,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 38 * dimensions.fullWidthAdjusted / 430,
        paddingHorizontal: staticDimensions.authMarginHorizontal,
        marginBottom: staticDimensions.marginHorizontal * 2,
    },
    logo: {
        backgroundColor: "transparent",
        width,
        height,
    }
})

export default AuthHeader