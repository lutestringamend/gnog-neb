import React, { useEffect, useState, Suspense } from "react";
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  SafeAreaView,
  Linking,
  View,
} from "react-native";
import { connect } from "react-redux";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { shareAsync } from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

import { blurhash, colors } from "../../../styles/base";
import { sentryLog } from "../../../sentry";
import { getObjectAsync } from "../../asyncstorage";
import { ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../../asyncstorage/constants";
import { ErrorView } from "../../webview/WebviewChild";
import { webfotowatermark } from "../../../axios/constants";
import { STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE, STARTER_KIT_FLYER_MENGAJAK_TAG, STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE } from "../constants";

const PhotosSegment = (props) => {
  const { title, photos, sharingAvailability, jenis_foto } = props.route.params;
  const { photosUri, watermarkData, currentUser } = props;
  const userId = currentUser?.id ? currentUser?.id : null;

  const [loading, setLoading] = useState(false);
  const [savedUri, setSavedUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    props.navigation.setOptions({
      title: jenis_foto === STARTER_KIT_FLYER_MENGAJAK_TAG ? STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE : STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE,
      headerShown: true,
    });
    //console.log("PhotosSegment params", props.route.params);
  }, [props.route.params]);

  useEffect(() => {
    checkSavedUri();
  }, [photosUri]);

  function openPhoto(item) {
    navigation.navigate("ImageViewer", {
      disableWatermark: false,
      title: `Foto ${item?.id.toString()}`,
      jenis_foto,
      id: item?.id,
      uri: item?.foto,
      thumbnail: item?.thumbnail,
      isSquare: false,
      width: item?.width,
      height: item?.height,
      text_align: item?.text_align,
      text_x: item?.text_x,
      text_y: item?.text_y,
      link_x: item?.link_x,
      link_y: item?.link_y,
      font: item?.font,
      fontFamily: "Poppins", fontSize: item?.font ? item?.font?.ukuran : 48,
      watermarkData,
      sharingAvailability,
    });
  }

  const checkSavedUri = async () => {
    if (
      photosUri === undefined ||
      photosUri === null ||
      photosUri?.length === undefined ||
      photosUri?.length < 1
    ) {
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
    } else {
      for (let pp of photosUri) {
        if (pp?.title === title && pp?.userId === userId) {
          setSavedUri(pp?.uri);
          return;
        }
      }
    }
    setSavedUri(null);
  };

  const shareFileAsync = async () => {
    if (sharingAvailability) {
      try {
        await shareAsync(savedUri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        });
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (Platform.OS === "android") {
          ToastAndroid.show(e.toString(), ToastAndroid.LONG);
        }
      }
    }
  };

  const openMultipleImageView = () => {
    const params = {
      title,
      photos,
      isSquare: false,
      userId,
      sharingAvailability,
    };
    console.log("MultipleImageView", params);
    setSavedUri(null);
    navigation.navigate("MultipleImageView", params);
  };

  //{savedUri === null || savedUri === "" ?  "" : ""}

  try {
    return (
      <SafeAreaView style={styles.containerFlatlist}>
        <View style={styles.containerHeader}>
          <Text allowFontScaling={false} style={styles.textHeader}>{title}</Text>
          {savedUri === null || savedUri === "" ? null : (
            <TouchableOpacity
              onPress={() => shareFileAsync()}
              style={[styles.button, { backgroundColor: colors.daclen_blue }]}
            >
              <MaterialCommunityIcons
                name="share-all"
                size={16}
                color="white"
              />

              <Text allowFontScaling={false} style={styles.textButton}>Share</Text>
            </TouchableOpacity>
          )}
          {!(
            photos?.length === undefined ||
            photos?.length < 1 ||
            photos?.length > 4 ||
            watermarkData === undefined ||
            watermarkData === null
          ) ? (
            <TouchableOpacity
              onPress={() => openMultipleImageView()}
              style={styles.button}
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
                  name="file-download"
                  size={16}
                  color="white"
                />
              )}

              <Text allowFontScaling={false} style={styles.textButton}>Download PDF</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <Suspense
          fallback={
            <ActivityIndicator
              size="small"
              color={colors.daclen_orange}
              style={styles.spinner}
            />
          }
        >
          <FlashList
            estimatedItemSize={6}
            horizontal={false}
            numColumns={3}
            data={photos}
            renderItem={({ item, index }) => item?.jenis_foto === jenis_foto ? (
              <TouchableHighlight
                key={index}
                onPress={() => openPhoto(item)}
                underlayColor={colors.daclen_orange}
                style={styles.containerImage}
              >
                <Image
                  style={styles.imageList}
                  source={item?.thumbnail ? item?.thumbnail : item?.foto}
                  contentFit="cover"
                  placeholder={blurhash}
                  transition={100}
                />
              </TouchableHighlight>
            ) : null}
          />
        </Suspense>
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView
          error={e.toString()}
          onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
        />
      </SafeAreaView>
    );
  }
};

/*
          
*/

const styles = StyleSheet.create({
  containerFlatlist: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
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
    aspectRatio: 3 / 4,
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
    fontFamily: "Poppins-Bold",
    marginStart: 6,
    color: colors.white,
  },
  textHeader: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_black,
    flex: 1,
  },
  textUid: {
    fontFamily: "Poppins", fontSize: 16,
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  photosUri: store.mediaKitState.photosUri,
  watermarkData: store.mediaKitState.watermarkData,
});

export default connect(mapStateToProps, null)(PhotosSegment);