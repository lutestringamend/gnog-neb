import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { Linking } from "react-native";

const ProfileMenuItem = (props) => {
  const { pdfFiles, text, textSecondary, icon, webKey, screen, onItemClick, url } = props;
  const navigation = useNavigation();

  const openScreen = () => {
    if (screen === "PDFViewer") {
      if (webKey !== null && webKey !== undefined) {
        Linking.openURL(webKey);
      }
      return;
    }

    console.log("ProfileMenuItem going to screen " + screen);
    if (screen !== null) {
      navigation.navigate(screen, { webKey, text, url });
    } else {
      console.log('onItemClick')
      onItemClick();
    }
  };

  return (
    <TouchableOpacity
    style={styles.container}
    onPress={() => openScreen()}
  >
    <MaterialCommunityIcons
        name={icon}
        size={30 * dimensions.fullWidthAdjusted / 430}
        color={colors.black}
      />
      <Text allowFontScaling={false} style={styles.text}>{text}</Text>
      {textSecondary && (
        <Text allowFontScaling={false} style={styles.textSecondary}>{textSecondary}</Text>
      )}
      <MaterialCommunityIcons
        name="chevron-right"
        size={25 * dimensions.fullWidthAdjusted / 430}
        color={colors.black}
      />
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60 * dimensions.fullWidthAdjusted / 430,
    borderRadius: 16 * dimensions.fullWidthAdjusted / 430,
    paddingHorizontal: staticDimensions.marginHorizontal,
    backgroundColor: colors.daclen_grey_light,
    alignItems: "center",
    marginBottom: staticDimensions.marginHorizontal / 2,
  },
  text: {
    fontFamily: "Poppins-Medium", 
    fontSize: 14 * dimensions.fullWidthAdjusted / 430,
    color: colors.black,
    flex: 1,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  textSecondary: {
    fontFamily: "Poppins", 
    fontSize: 10 * dimensions.fullWidthAdjusted / 430,
    color: colors.daclen_blue,
    marginEnd: staticDimensions.marginHorizontal,
  },
});

const mapStateToProps = (store) => ({
  pdfFiles: store.homeState.pdfFiles,
});

export default connect(mapStateToProps, null)(ProfileMenuItem);
