import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";
import Separator from "./Separator";
import { Linking } from "react-native";

const ProfileMenuItem = ({ text, textSecondary, icon, webKey, screen, thickness, onItemClick, url }) => {
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
    <View>
      <TouchableOpacity
        onPress={() => openScreen()}
      >
        <View style={styles.container}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            style={styles.icon}
          />
          <Text allowFontScaling={false} style={styles.text}>{text}</Text>
          {textSecondary && (
            <Text allowFontScaling={false} style={styles.textSecondary}>{textSecondary}</Text>
          )}
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            style={styles.arrow}
          />
        </View>
      </TouchableOpacity>
      <Separator thickness={thickness} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 12,
    alignItems: "center",
  },
  text: {
    fontFamily: "Poppins", fontSize: 14,
    color: colors.daclen_gray,
    flex: 1,
    marginHorizontal: 10,
  },
  textSecondary: {
    fontFamily: "Poppins-SemiBold", fontSize: 10,
    color: colors.daclen_blue,
    paddingHorizontal: 10,
  },
  icon: {
    padding: 2,
    color: colors.daclen_gray,
  },
  arrow: {
    padding: 2,
    color: colors.daclen_gray,
  },
});

export default ProfileMenuItem;
