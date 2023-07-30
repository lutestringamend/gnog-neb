import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  Share,
  ToastAndroid,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../../styles/base";
import {
  personalwebsiteurl,
  personalwebsiteurlshort,
} from "../../../axios/constants";
import { sentryLog } from "../../../sentry";

const DashboardBottom = (props) => {
  const navigation = useNavigation();

  function openQRLink() {}

  function openPersonalWebsite() {
    Linking.openURL(`${personalwebsiteurl}${props?.username}`);
  }

  const shareURL = async () => {
    let fullLink = `${personalwebsiteurl}${props?.username}`;

    if (props?.isSharingAvailable) {
      /*await Sharing.shareAsync(fullLink, {
        dialogTitle: "Link Personal Website",
      });*/
      try {
        const result = await Share.share({
          message: fullLink,
          url: fullLink,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log("share result activityType", result.activityType);
          } else {
            console.log("share result", result);
          }
        } else if (result.action === Share.dismissedAction) {
          copytoClipboard();
        }
      } catch (error) {
        console.error(error);
        sentryLog(error);
        copytoClipboard();
      }
    } else {
      copytoClipboard();
    }
  };

  const copytoClipboard = async () => {
    await Clipboard.setStringAsync(`${personalwebsiteurl}${props?.username}`);
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Link Personal Website tersalin ke Clipboard",
        ToastAndroid.SHORT
      );
    }
    if (!(props?.setMessage === undefined || props?.setMessage === null)) {
      props?.setMessage("Link Personal Website tersalin ke Clipboard", false);
    }
  };

  if (
    props?.username === undefined ||
    props?.username === null ||
    props?.username === ""
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text style={styles.textHeader}>{`PERSONAL\nWEBSITE`}</Text>
        <TouchableOpacity style={styles.button} onPress={() => openQRLink()}>
          <Text style={styles.textButton}>QR Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openPersonalWebsite()}
        >
          <Text style={styles.textButton}>BUKA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.daclen_green_light },
          ]}
          onPress={() => shareURL()}
        >
          <Text style={styles.textButton}>
            {props?.isSharingAvailable ? "BAGIKAN" : "SALIN"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textLink}>
        {`${personalwebsiteurlshort}${props?.username}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 4,
    elevation: 4,
    start: 0,
    bottom: 20,
    end: 20,
    backgroundColor: colors.white,
    borderRadius: 2,
    paddingVertical: 6,
    paddingEnd: 4,
  },
  containerHorizontal: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginHorizontal: 2,
    backgroundColor: colors.daclen_gold_brown,
  },
  textButton: {
    fontSize: 12,
    color: colors.daclen_light,
  },
  textHeader: {
    fontSize: 12,
    color: colors.daclen_graydark,
    marginStart: 20,
    marginEnd: 8,
  },
  textLink: {
    marginTop: 6,
    textAlign: "center",
    backgroundColor: "white",
    fontWeight: "bold",
    fontSize: 12,
    color: colors.daclen_graydark,
  },
});

export default DashboardBottom;
