import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, staticDimensions } from '../../styles/base';

const TextBoxVerified = ({ notVerified, style }) => {
  return (
    <View style={[styles.containerVerified, {backgroundColor: notVerified ? colors.danger_background : colors.green_box_border}, style ? style : null]}>
            <MaterialCommunityIcons
              name={notVerified ? "alert-circle-outline" : "check"}
              size={8}
              color={notVerified ? colors.danger : colors.white}
              style={styles.verified}
            />
            <Text allowFontScaling={false} style={[styles.textVerified, {color: notVerified ? colors.danger : colors.white}]}>
              {notVerified ? "Not Verified" : "Verified"}
            </Text>
          </View>
  )
}

const styles = StyleSheet.create({
    containerVerified: {
        alignSelf: "center",
        marginEnd: staticDimensions.marginHorizontal,
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
      },
      textVerified: {
        backgroundColor: "transparent",
        alignSelf: "center",
        fontSize: staticDimensions?.isSmallScreen ? 10 : 12,
        height: "100%",
        marginStart: 4,
        fontFamily: "PlusJakartaSans-Medium",
      },
      verified: {
        backgroundColor: "transparent",
        alignSelf: "center",
      },
})

export default TextBoxVerified