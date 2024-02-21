import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Share,
  Platform,
  ToastAndroid,
} from "react-native";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, dimensions } from "../../styles/base";
import { useNavigation } from "@react-navigation/native";

const screenWidth = dimensions.fullWidthAdjusted;
const screenHeight = dimensions.fullHeight;
const modalWidth =
  screenWidth < 320 ? 296 : screenWidth > 424 ? 400 : screenWidth - 24;
const modalHeight = 540;

const StarterKitModal = (props) => {
  const { modal, toggleModal } = props;
  const navigation = useNavigation();

  function displayError(e) {
    console.error(e);
  }

  function openURL() {
    if (modal?.url === undefined || modal?.url === null) {
      return;
    }
    Linking.openURL(modal?.url);
  }

  const shareURL = async () => {
    if (
      modal?.url === undefined ||
      modal?.url === null ||
      Platform.OS === "web"
    ) {
      return;
    }
    try {
      const result = await Share.share({
        message: modal?.url,
        url: modal?.title,
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
  };

  const copytoClipboard = async () => {
    if (modal?.url === undefined || modal?.url === null) {
      return;
    }
    await Clipboard.setStringAsync(modal?.url);
    if (Platform.OS === "android") {
      ToastAndroid.show("Link tersalin ke Clipboard", ToastAndroid.SHORT);
    }
  };

  try {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            zIndex: 100,
          },
        ]}
        onPress={() => toggleModal()}
      >
        <BlurView
          intensity={10}
          style={[
            styles.container,
            {
              opacity: 0.95,
            },
          ]}
        >
          <View
            style={[
              styles.containerModal,
              {
                width: modalWidth,
                height: modalHeight,
                start: (dimensions.fullWidth - modalWidth) / 2,
                end: (dimensions.fullWidth - modalWidth) / 2,
                top: (screenHeight - modalHeight) / 2,
                bottom: (screenHeight - modalHeight) / 2,
              },
            ]}
          >
            <Text allowFontScaling={false} style={styles.textHeader}>
              {modal?.title ? modal?.title : "DACLEN"}
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.text, { marginBottom: 20 }]}
            >
              {modal?.urlShort ? modal?.urlShort : modal?.url ? modal?.url : ""}
            </Text>

            {modal?.url ? (
              <QRCode
                value={modal?.url}
                size={200}
                backgroundColor={colors.daclen_light}
                color={colors.daclen_black}
                logo={require("../../../assets/favicon.png")}
                logoSize={24}
                logoMargin={4}
                onError={(e) => displayError(e)}
              />
            ) : null}

            {modal?.url ? (
              <View style={styles.containerHorizontal}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openURL()}
                >
                  <MaterialCommunityIcons
                    name="web"
                    size={28}
                    color={colors.daclen_light}
                  />
                  <Text allowFontScaling={false} style={styles.textButton}>
                    BUKA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => shareURL()}
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={28}
                    color={colors.daclen_light}
                  />
                  <Text allowFontScaling={false} style={styles.textButton}>
                    BAGIKAN
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <Text
              allowFontScaling={false}
              style={[styles.text, { marginTop: 20 }]}
            >
              {modal?.desc ? modal?.desc : ""}
            </Text>
            <View style={styles.containerClose}>
              <MaterialCommunityIcons
                name="close"
                size={32}
                color={colors.daclen_gray}
              />
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  } catch (e) {
    console.log("StarterKitModal error", e);
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: screenWidth,
            height: screenHeight,
            zIndex: 100,
            elevation: 4,
          },
        ]}
        onPress={() => toggleModal()}
      >
        <View
          style={[
            styles.containerModal,
            {
              width: modalWidth,
              height: modalHeight,
              start: (screenWidth - modalWidth) / 2,
              end: (screenWidth - modalWidth) / 2,
              top: (screenHeight - modalHeight) / 2 - 40,
              bottom: (screenHeight - modalHeight) / 2 + 40,
            },
          ]}
        >
          <Text allowFontScaling={false} style={styles.textHeader}>
            {modal?.title ? modal?.title : "DACLEN"}
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.text, { marginBottom: 20 }]}
          >
            {modal?.urlShort ? modal?.urlShort : modal?.url ? modal?.url : ""}
          </Text>

          {modal?.url ? (
            <QRCode
              value={modal?.url}
              size={200}
              backgroundColor={colors.daclen_light}
              color={colors.daclen_black}
              logo={require("../../../assets/favicon.png")}
              logoSize={24}
              logoMargin={4}
              onError={(e) => displayError(e)}
            />
          ) : null}

          {modal?.url ? (
            <View style={styles.containerHorizontal}>
              <TouchableOpacity style={styles.button} onPress={() => openURL()}>
                <MaterialCommunityIcons
                  name="web"
                  size={28}
                  color={colors.daclen_light}
                />
                <Text allowFontScaling={false} style={styles.textButton}>
                  BUKA
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => shareURL()}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={28}
                  color={colors.daclen_light}
                />
                <Text allowFontScaling={false} style={styles.textButton}>
                  BAGIKAN
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <Text
            allowFontScaling={false}
            style={[styles.text, { marginTop: 20 }]}
          >
            {modal?.desc ? modal?.desc : ""}
          </Text>
          <View style={styles.containerClose}>
            <MaterialCommunityIcons
              name="close"
              size={32}
              color={colors.daclen_gray}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

/*

*/

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    width: dimensions.fullWidth,
    height: screenHeight,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerClose: {
    position: "absolute",
    top: 12,
    end: 10,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  containerModal: {
    position: "absolute",
    backgroundColor: colors.daclen_light,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    elevation: 8,
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    marginTop: 24,
    backgroundColor: "transparent",
  },
  textHeader: {
    width: modalWidth,
    textAlign: "center",
    textAlignVertical: "center",
    color: colors.daclen_black,
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
  },
  text: {
    textAlign: "center",
    textAlignVertical: "center",
    color: colors.daclen_black,
    fontFamily: "Poppins",
    fontSize: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 48,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 10,
    backgroundColor: colors.daclen_bg,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginStart: 10,
    color: colors.daclen_light,
  },
});

export default StarterKitModal;
