import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";

import { colors, staticDimensions } from "../../styles/base";
import packageJson from "../../package.json";
import {
  abouttext,
  copyrighttext,
  instagramurl,
  facebookurl,
  twitterurl,
  tiktokurl,
  youtubeurl,
  youtubechannel,
} from "./constants";
import MainHeader from "../main/MainHeader";
import SocialsItem from "./SocialsItem";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_SERVER_URL } from "../asyncstorage/constants";
import { getDeviceInfo } from "../../axios/user";

export const About = (props) => {
  const appVersion = `Versi ${packageJson?.version}`;

  function openYoutube() {
    Linking.openURL("vnd.youtube://channel/" + youtubechannel).catch((e) => {
      console.error(e);
      Linking.openURL(youtubeurl);
    });
  }

  const logoPress = async () => {
    const serverUrl = await getObjectAsync(ASYNC_SERVER_URL);
    console.log("serverUrl", serverUrl, props?.currentUser?.id);
    Linking.openURL(serverUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title="Tentang Daclen" icon="arrow-left" />
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.containerLogo}
          onPress={() => logoPress()}
        >
          <Image
            source={require("../../assets/splashsmall.png")}
            style={styles.logo}
          />
        </TouchableOpacity>

        <Text allowFontScaling={false} style={styles.textCaption}>
          {appVersion}
        </Text>
        <Text allowFontScaling={false} style={styles.textDesc}>
          {abouttext}
        </Text>
        {props?.currentUser?.id === 8054 ? (
          <Text allowFontScaling={false} style={styles.textDesc}>
            {JSON.stringify(getDeviceInfo())}
          </Text>
        ) : null}
        <Text allowFontScaling={false} style={styles.textSocials}>
          Media Sosial
        </Text>
        <View style={styles.containerSocials}>
          <SocialsItem link={instagramurl} icon="ig" />
          <SocialsItem link={facebookurl} icon="fb" />
          <SocialsItem link={twitterurl} icon="twitter" />
          <SocialsItem link={tiktokurl} icon="tiktok" />
          <SocialsItem
            onPress={() => openYoutube()}
            link={null}
            icon="youtube"
          />
        </View>
        <Text allowFontScaling={false} style={styles.textCaption}>
          {copyrighttext}
        </Text>
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
    backgroundColor: "transparent",
    opacity: 0.9,
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
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_light,
    textAlign: "justify",
  },
  textCaption: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_orange,
    alignSelf: "center",
    margin: 6,
  },
  textSocials: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    alignSelf: "center",
    marginVertical: 6,
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(About);
