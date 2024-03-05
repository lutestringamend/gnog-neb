import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, staticDimensions } from "../../styles/base";
import { shortenNotifDesc } from "../../utils";

const AlertBox = (props) => {
  const { text, style, textStyle, closeText, isInfo, success, icon } = props;

  function onClose() {
    if (!(props?.onClose === undefined || props?.onClose === null)) {
      props?.onClose();
    }
  }

  if (text === undefined || text === null || text == "") {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isInfo
            ? colors.daclen_black
            : success
              ? colors.daclen_success_light
              : colors.daclen_danger_light,
          borderColor: isInfo
            ? colors.daclen_black
            : success
              ? colors.daclen_success_border
              : colors.daclen_danger_border,
        },
        style ? style : null,
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          color={isInfo ? colors.white : colors.black}
          size={16}
          style={styles.icon}
        />
      ) : null}
      <Text
        allowFontScaling={false}
        style={[
          styles.text,
          { color: isInfo ? colors.white : colors.black },
          textStyle ? textStyle : null,
        ]}
      >
        {shortenNotifDesc(text, 90)}
      </Text>
      {props?.onClose === undefined || props?.onClose === null ? null : (
        <TouchableOpacity
          style={styles.containerClose}
          onPress={() => onClose()}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.textClose,
              { color: isInfo ? colors.white : colors.black },
              textStyle ? textStyle : null,
            ]}
          >
            {closeText ? closeText : "Tutup"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/*
<TouchableOpacity style={styles.close} onPress={() => onClose()}>
        <MaterialCommunityIcons
            name="close"
            color={colors.white}
            size={16}
        />
    </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    start: staticDimensions.marginHorizontal,
    end: staticDimensions.marginHorizontal,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: staticDimensions.marginHorizontal,
    flexDirection: "row",
    alignItems: "center",
  },
  containerClose: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: staticDimensions.marginHorizontal / 2,
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.black,
    flex: 1,
  },
  textClose: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.black,
    flex: 1,
  },
  icon: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 12,
  },
  close: {
    backgroundColor: "transparent",
    width: 16,
    height: 16,
  },
});

export default AlertBox;
