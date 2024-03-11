import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors, dimensions, staticDimensions } from '../../styles/base'

const ratio = dimensions.fullWidthAdjusted / 430;

const TextBox = (props) => {
    const { text, linkText, style } = props;

    function onPress() {
        if (props?.onPress === undefined || props?.onPress === null) {
          return;
        }
        props?.onPress();
      }

  return (
    <View style={[styles.container, style ? style : null]}>
        {text ? <Text allowFontScaling={false} style={styles.text}>{text}</Text> : null}
        {linkText ? 
        <TouchableOpacity style={styles.containerLink} onPress={() => onPress()}>
            <Text allowFontScaling={false} style={[styles.text, {color: colors.daclen_blue_link}]}>
                {linkText}
            </Text>
        </TouchableOpacity>
        : null}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.daclen_grey_light,
        borderRadius: 16 * ratio,
        paddingVertical: 10,
        paddingHorizontal: staticDimensions.marginHorizontal / 2,
    },
    containerLink: {
        marginTop: 10,
        backgroundColor: "transparent",
    },
    text: {
        color: colors.black,
        fontFamily: "Poppins-Light",
        fontSize: 11,
    }
})

export default TextBox