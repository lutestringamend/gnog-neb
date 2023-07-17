import React, { Suspense, memo, useEffect, useState } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { shareAsync } from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash } from "../../styles/base";
import { sentryLog } from "../../sentry";
import { getObjectAsync, setObjectAsync } from "../asyncstorage";
import { ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../asyncstorage/constants";

const WatermarkPhotosSegment = ({
  title,
  photos,
  watermarkData,
  userId,
  isExpanded,
  sharingAvailability,
}) => {
  const [expanded, setExpanded] = useState(isExpanded ? isExpanded : false);
  const [loading, setLoading] = useState(false);
  const [savedUri, setSavedUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    checkSavedUri();
  }, []);

  function openPhoto(item) {
    navigation.navigate("ImageViewer", {
      title: `Foto ${item?.id.toString()}`,
      id: item?.id,
      uri: item?.foto,
      isSquare: false,
      width: item?.width,
      height: item?.height,
      text_align: item?.text_align,
      text_x: item?.text_x,
      text_y: item?.text_y,
      font: item?.font,
      watermarkData,
      userId,
      sharingAvailability,
    });
  }

  const checkSavedUri = async () => {
    const storagePdfPhotos = await getObjectAsync(
      ASYNC_WATERMARK_PHOTOS_PDF_KEY
    );
    console.log("storagePdfPhotos", storagePdfPhotos);
    if (
      !(
        storagePdfPhotos === undefined ||
        storagePdfPhotos === null ||
        storagePdfPhotos?.length === undefined ||
        storagePdfPhotos?.length < 1
      )
    ) {
      for (let pp of storagePdfPhotos) {
        if (pp?.title === title && pp?.userId === userId) {
          setSavedUri(pp?.uri);
          return;
        }
      }
    }
  };

  const shareFileAsync = async () => {
    if (sharingAvailability) {
      setLoading(true);
      try {
        await shareAsync(savedUri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        });
        return;
      } catch (e) {
        console.error(e);
        if (Platform.OS === "android") {
          ToastAndroid.show(e.toString(), ToastAndroid.LONG);
        }
      }
      setLoading(false);
    }
  };

  const openMultipleImageView = () => {
    const params = {
      title,
      photos,
      isSquare: false,
      watermarkData,
      userId,
      sharingAvailability,
    };
    console.log("MultipleImageView", params);
    navigation.navigate("MultipleImageView", params);
  };

  try {
    return (
      <View style={styles.containerFlatlist}>
        <TouchableOpacity
          style={styles.containerHeader}
          onPress={() => setExpanded((expanded) => !expanded)}
        >
          <Text style={styles.textHeader}>{title}</Text>
          {savedUri === null ? null : (
            <TouchableOpacity
              onPress={() => shareFileAsync()}
              style={[styles.button, { backgroundColor: colors.daclen_blue }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={styles.spinner}
                />
              ) : (
                <MaterialCommunityIcons
                  name="share-all"
                  size={16}
                  color="white"
                />
              )}

              <Text style={styles.textButton}>Share</Text>
            </TouchableOpacity>
          )}
          {expanded &&
          !(
            photos?.length === undefined ||
            photos?.length < 1 ||
            watermarkData === undefined ||
            watermarkData === null
          ) ? (
            <TouchableOpacity
              onPress={() => openMultipleImageView()}
              style={styles.button}
            >
              <MaterialCommunityIcons
                name="file-download"
                size={16}
                color="white"
              />

              <Text style={styles.textButton}>Download</Text>
            </TouchableOpacity>
          ) : null}
          <MaterialCommunityIcons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.daclen_black}
            style={styles.icon}
          />
        </TouchableOpacity>
        {expanded ? (
          <Suspense
            fallback={
              <ActivityIndicator
                size="large"
                color={colors.daclen_orange}
                style={{ alignSelf: "center", marginVertical: 20 }}
              />
            }
          >
            <FlashList
              estimatedItemSize={10}
              horizontal={false}
              numColumns={3}
              data={photos}
              renderItem={({ item, index }) => (
                <TouchableHighlight
                  key={index}
                  onPress={() => openPhoto(item)}
                  underlayColor={colors.daclen_orange}
                  style={styles.containerImage}
                >
                  <Image
                    style={styles.imageList}
                    source={item?.foto}
                    contentFit="cover"
                    placeholder={blurhash}
                    transition={100}
                  />
                </TouchableHighlight>
              )}
            />
          </Suspense>
        ) : null}
      </View>
    );
  } catch (e) {
    sentryLog(e);
    return null;
  }
};

const styles = StyleSheet.create({
  containerFlatlist: {
    width: "100%",
    backgroundColor: "transparent",
  },
  containerHeader: {
    flexDirection: "row",
    backgroundColor: colors.daclen_light,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: colors.daclen_lightgrey,
    borderBottomColor: colors.daclen_lightgrey,
  },
  containerImage: {
    flex: 1,
    backgroundColor: colors.daclen_light,
    borderWidth: 0.5,
    borderColor: colors.daclen_lightgrey,
  },
  imageList: {
    flex: 1,
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginStart: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "center",
    backgroundColor: colors.daclen_red,
  },
  textButton: {
    fontSize: 12,
    fontWeight: "bold",
    marginStart: 6,
    color: "white",
  },
  textHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_black,
    flex: 1,
  },
  textUid: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
    color: colors.daclen_gray,
    marginHorizontal: 10,
  },
  icon: {
    alignSelf: "center",
    marginStart: 12,
    backgroundColor: "transparent",
  },
  spinner: {
    alignSelf: "center",
    width: 16,
    height: 16,
  },
});

export default memo(WatermarkPhotosSegment);
