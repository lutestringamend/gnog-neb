import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ToastAndroid,
} from "react-native";
//import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";
import { webreferral } from "../../axios/constants";
import { openWhatsapp } from "../whatsapp/Whatsapp";
import { referralWAtemplate, sharereferral } from "../profile/constants";
import { linkcopied, sharingdialogtitle } from "./constants";

export default function Header(props) {
  const [referral, setReferral] = useState(null);
  const [referralText, setReferralText] = useState(null);

  const { username } = props;
  const navigation = useNavigation();

  useEffect(() => {
    /*const checkSharingAsync = async () => {
      const isAvailable = await Sharing.isAvailableAsync();
      setSharingAvailable(isAvailable);
      console.log({ isAvailable });
    };*/

    if (username === null || username === undefined) {
      setReferral(null);
    } else {
      setReferral(`${webreferral}${username}`);
    }

    /*if (Platform.OS === "web") {
      setSharingAvailable(true);
    } else {
      checkSharingAsync();
    }*/
  }, [username]);

  useEffect(() => {
    if (referral?.length > 34) {
      setReferralText(referral.substring(0, 30) + "...");
    } else {
      setReferralText(referral);
    }
  }, [referral]);

  const shareReferral = async () => {
    if (referral === null) {
      navigation.navigate("Login");
    } else {
      let fullLink=`${referralWAtemplate}https://${referral}`;
      await Clipboard.setStringAsync(fullLink);
      if (Platform.OS === "android") {
        ToastAndroid.show(linkcopied, ToastAndroid.SHORT);
      }
      props?.onMessageChange({
        text: linkcopied,
        isError: false,
      });
      openWhatsapp(null, fullLink);
    }
  };

  /*const openShareDialogAsync = async () => {
    setLoading(true);
    try {
      await Sharing.shareAsync(`https://${referral}`, {
        dialogTitle: sharingdialogtitle,
      })
    } catch (e) {
      console.error(e);
      props?.onMessageChange({
        text: e.message,
        isError: true,
      });
    }
    setLoading(false);
  };*/

  const openLogin = () => {
    if (referral === null) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("Profile", { username });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Image
          source={require("../../assets/splash.png")}
          style={styles.imageLogo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.containerReferral}
        onPress={() => shareReferral()}
      >
        <Text style={styles.textReferral}>
          {referralText ? referralText : sharereferral}
        </Text>
        <MaterialCommunityIcons
            name="share-variant"
            size={12}
            color={colors.daclen_light}
          />
      </TouchableOpacity>

      {Platform.OS === "web" && (
        <TouchableOpacity onPress={() => openLogin()}>
          <MaterialCommunityIcons
            name="account-circle"
            size={16}
            color={colors.daclen_yellow}
            style={styles.iconLogin}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.daclen_black,
  },
  containerReferral: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_blue,
    alignItems: "center",
    marginStart: 14,
    marginEnd: 10,
    marginVertical: 6,
    borderRadius: 5,
  },
  imageLogo: {
    width: 75,
    height: 20,
    marginStart: 14,
    marginVertical: 12,
  },
  textReferral: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    flex: 1,
  },
  iconLogin: {
    marginEnd: 14,
  },
});
