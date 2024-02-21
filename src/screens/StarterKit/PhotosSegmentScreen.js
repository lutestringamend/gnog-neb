import React, { useEffect, useState, Suspense } from "react";
import {
  StyleSheet,
  Text,
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

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { sentryLog } from "../../../sentry";
import { getObjectAsync } from "../../../components/asyncstorage";
import { ASYNC_WATERMARK_PHOTOS_PDF_KEY } from "../../../components/asyncstorage/constants";
import { webfotowatermark } from "../../../axios/constants";
import {
  STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE,
  FLYER_MENGAJAK_PAGINATION_LIMIT,
} from "../../constants/starterkit";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import EmptySpinner from "../../components/empty/EmptySpinner";
import HeaderBar from "../../components/Header/HeaderBar";

const screenAR = dimensions.fullWidth / dimensions.fullHeight;
const limitAR = 9 / 16;
const numColumns = screenAR >= limitAR ? 4 : 3;
const itemLimit = FLYER_MENGAJAK_PAGINATION_LIMIT * numColumns;
const width = (dimensions.fullWidth - (numColumns + 1) * 20) / numColumns;
const height = (180 * width) / 135;

const PhotosSegmentScreen = (props) => {
  const { title, photos, sharingAvailability, jenis_foto } = props.route.params;
  const { photosUri, watermarkData, currentUser } = props;
  const userId = currentUser?.id ? currentUser?.id : null;

  const [loading, setLoading] = useState(false);
  const [savedUri, setSavedUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("photos", photos);
  }, [photos]);

  useEffect(() => {
    checkSavedUri();
  }, [photosUri]);

  function openPhoto(index) {
    navigation.navigate("FlyerSliderView", {
      index,
      type: jenis_foto,
      product: title,
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
        ASYNC_WATERMARK_PHOTOS_PDF_KEY,
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

  /*
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
  */

  try {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderBar
          title={
            jenis_foto === STARTER_KIT_FLYER_MENGAJAK_TAG
              ? STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE
              : `Flyer ${title}`
          }
        />
        <Suspense fallback={<EmptySpinner />}>
          <FlashList
            estimatedItemSize={20}
            horizontal={false}
            numColumns={numColumns}
            data={photos}
            contentContainerStyle={styles.containerFlatlist}
            renderItem={({ item, index }) =>
              item ? (
                item?.jenis_foto ? (
                  item?.jenis_foto?.toLowerCase() ===
                  jenis_foto.toLowerCase() ? (
                    <TouchableOpacity
                      key={index}
                      onPress={() => openPhoto(index)}
                      style={[
                        styles.containerImage,
                        {
                          marginBottom:
                            index >= photos?.length - 1
                              ? height + 2 * staticDimensions.marginHorizontal
                              : staticDimensions.marginHorizontal,
                        },
                      ]}
                    >
                      <Image
                        style={styles.imageList}
                        source={item?.thumbnail ? item?.thumbnail : item?.foto}
                        contentFit="cover"
                        placeholder={null}
                        transition={100}
                      />
                    </TouchableOpacity>
                  ) : null
                ) : null
              ) : null
            }
          />
        </Suspense>
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <SafeAreaView style={styles.container}>
        <EmptyPlaceholder title="Flyer Produk" text={e.toString()} />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerFlatlist: {
    width: dimensions.fullWidth,
    backgroundColor: "transparent",
    paddingTop: staticDimensions.marginHorizontal,
    paddingHorizontal: staticDimensions.marginHorizontal / 2,
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
    backgroundColor: "transparent",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: staticDimensions.marginHorizontal / 2,
  },
  imageList: {
    width,
    height,
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
  icon: {
    alignSelf: "center",
    marginStart: 12,
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  photosUri: store.mediaKitState.photosUri,
  watermarkData: store.mediaKitState.watermarkData,
});

export default connect(mapStateToProps, null)(PhotosSegmentScreen);
