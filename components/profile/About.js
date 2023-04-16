import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
} from "react-native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import packageJson from "../../package.json";
import {
  abouttext,
  copyrighttext,
  instagramurl,
  facebookurl,
  twitterurl,
  tiktokurl,
  youtubeurl,
} from "./constants";
import MainHeader from "../main/MainHeader";
import SocialsItem from "./SocialsItem";

export default function About() {
  const appVersion = `Versi ${packageJson?.version}`;

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title="Tentang Daclen" icon="arrow-left" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.containerLogo}>
          <Image
            source={require("../../assets/splash.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.textCaption}>{appVersion}</Text>
        <Text style={styles.textDesc}>{abouttext}</Text>
        <Text style={styles.textSocials}>Media Sosial</Text>
        <View style={styles.containerSocials}>
          <SocialsItem link={instagramurl} icon="ig" />
          <SocialsItem link={facebookurl} icon="fb" />
          <SocialsItem link={twitterurl} icon="twitter" />
          <SocialsItem link={tiktokurl} icon="tiktok" />
          <SocialsItem link={youtubeurl} icon="youtube" />
        </View>
        <Text style={styles.textCaption}>{copyrighttext}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/*

        */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_black,
  },
  scrollView: {
    flex: 1,
    paddingBottom: staticDimensions.pageBottomPadding,
  },
  containerLogo: {
    padding: 20,
    alignItems: "center",
  },
  containerSocials: {
    backgroundColor: colors.daclen_black,
    flexDirection: "row",
    paddingHorizontal: 32,
    marginVertical: 20,
    alignSelf: "center",
  },
  logo: {
    width: 200,
    height: 50,
    alignSelf: "center",
  },
  textDesc: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingBottom: 20,
    fontSize: 12,
    color: colors.daclen_gray,
    textAlign: "justify",
  },
  textCaption: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_orange,
    alignSelf: "center",
    margin: 6,
  },
  textSocials: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.daclen_light,
    alignSelf: "center",
    marginVertical: 6,
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
});
