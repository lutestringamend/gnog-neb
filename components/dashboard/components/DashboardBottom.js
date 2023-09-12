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
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import {
  personalwebsiteurl,
  personalwebsiteurlshort,
} from "../../../axios/constants";
import { sentryLog } from "../../../sentry";

const DashboardBottom = (props) => {
  const { token, currentUser } = props;
  const navigation = useNavigation();

  function openQRLink() {
    navigation.navigate("QRScreen", {
      text: `${personalwebsiteurl}${currentUser?.name}`,
    });
  }

  function openPersonalWebsite() {
    Linking.openURL(`${personalwebsiteurl}${currentUser?.name}`);
  }

  const shareURL = async () => {
    let fullLink = `${personalwebsiteurl}${currentUser?.name}`;

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
    await Clipboard.setStringAsync(`${personalwebsiteurl}${currentUser?.name}`);
    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Link Toko Online tersalin ke Clipboard",
        ToastAndroid.SHORT
      );
    }
    if (!(props?.setMessage === undefined || props?.setMessage === null)) {
      props?.setMessage("Link Toko Online tersalin ke Clipboard", false);
    }
  };

  if (
    token === null ||
    currentUser === null ||
    currentUser?.id === undefined ||
    currentUser?.isActive === undefined ||
    currentUser?.isActive === null ||
    !currentUser?.isActive
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
      {currentUser === null ||
      currentUser?.name === undefined ||
      currentUser?.name === null ? null : (
        <Text style={styles.textLink}>
          {`${personalwebsiteurlshort}${currentUser?.name}`}
        </Text>
      )}
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
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_light,
  },
  textHeader: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_graydark,
    marginStart: 20,
    marginEnd: 8,
  },
  textLink: {
    marginTop: 6,
    textAlign: "center",
    backgroundColor: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    color: colors.daclen_graydark,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateToProps, null)(DashboardBottom);
