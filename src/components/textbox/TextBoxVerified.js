import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from '../../styles/base';

const TextBoxVerified = ({ isShort }) => {
  return (
    <View style={styles.containerVerified}>
            <MaterialCommunityIcons
              name="check-bold"
              size={12}
              color={colors.daclen_success}
              style={styles.verified}
            />
            {isShort ? null : <Text allowFontScaling={false} style={styles.textVerified}>
              Verified
            </Text>}
            
          </View>
  )
}

const styles = StyleSheet.create({
    containerVerified: {
        alignSelf: "center",
        marginEnd: 10,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: colors.daclen_success_light,
        flexDirection: "row",
        alignItems: "self",
      },
      textVerified: {
        backgroundColor: "transparent",
        alignSelf: "center",
        color: colors.daclen_success,
        fontSize: 12,
        marginStart: 4,
        fontFamily: "Poppins",
      },
      verified: {
        backgroundColor: "transparent",
        alignSelf: "center",
      },
})

export default TextBoxVerified