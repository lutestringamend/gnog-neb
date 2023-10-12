import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import { FlashList } from "@shopify/flash-list";

import { colors } from "../../../styles/base";
import { webfotowatermark } from "../../../axios/constants";
import { ErrorView } from "../../webview/WebviewChild";
import WatermarkPhotosSegment from "./WatermarkPhotosSegment";
import { sentryLog } from "../../../sentry";
import { STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE, STARTER_KIT_FLYER_MENGAJAK_TAG, STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE } from "../constants";

const defaultSelected = {
  ids: {},
  urls: [],
};

const WatermarkPhotos = (props) => {
  const {
    photos,
    photoKeys,
    loading,
    error,
    watermarkData,
    sharingAvailability,
    refreshPage,
    photosMultipleSave,
    jenis_foto,
  } = props;
  const navigation = useNavigation();
  try {
    const [selected, setSelected] = useState(defaultSelected);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
      if (photosMultipleSave?.success !== success) {
        setSuccess(photosMultipleSave?.success ? photosMultipleSave?.success : false);
      }
      if (photosMultipleSave?.error !== error) {
        setError(photosMultipleSave?.error ? photosMultipleSave?.error : null);
      }
      console.log("redux photosMultipleSave", photosMultipleSave);
    }, [photosMultipleSave]);

    useEffect(() => {
      if ((selected?.urls?.length === undefined || selected?.urls?.length < 1) && Object.keys(selected?.ids)?.length > 0) {
        clearSelection();
      }
      console.log("selected", selected);
    }, [selected]);

    const clearSelection = () => {
      clearError();
      setSelected({
        ids: {},
        urls: [],
      });
    };

    const clearError = () => {
      if (!(props?.clearMultipleSave === undefined || props?.clearMultipleSave === null)) {
        props?.clearMultipleSave();
      }
      setError(null);
    }

    const startDownload = () => {
      navigation.navigate("MultipleImageSave", {
        photos: selected?.urls,
        sharingAvailability,
        jenis_foto,
        title: `Menyimpan ${jenis_foto === STARTER_KIT_FLYER_MENGAJAK_TAG ? STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE : STARTER_KIT_FLYER_PRODUK_CASE_SENSITIVE}`,
      });
    };

    const filterPhotoProps = (item) => {
      return {
        id: item?.id,
        foto: item?.foto,
        width: item?.width,
        height: item?.height,
        text_y: item?.text_y,
        link_y: item?.link_y,
      }
    }

    const deselectItem = (item) => {
      let ids = selected?.ids;
      ids[item?.id] = false;
      let urls = [];
      if (
        !(selected?.urls?.length === undefined || selected?.urls?.length < 1)
      ) {
        for (let i = 0; i < selected?.urls?.length; i++) {
          if (selected?.urls[i]?.id === item?.id) {
            urls.push(selected?.urls[i]);
          }
        }
      }
      setSelected({
        ids,
        urls,
      });
    };

    const onLongPress = (item) => {
      try {
        if (
          selected.ids[item?.id] === undefined ||
          selected.ids[item?.id] === null ||
          !selected.ids[item?.id]
        ) {
          let ids = selected?.ids;
          ids[item?.id] = true;
          let urls = [];
          let isFound = false;
          if (
            !(
              selected?.urls?.length === undefined || selected?.urls?.length < 1
            )
          ) {
            for (let i = 0; i < selected?.urls?.length; i++) {
              if (selected?.urls[i]?.id === item?.id) {
                isFound = true;
              }
              urls.push(selected?.urls[i]);
            }
          }
          if (!isFound) {
            urls.push(filterPhotoProps(item));
          }
          setSelected({
            ids,
            urls,
          });
        } else {
          deselectItem(item);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const onPress = (item, title) => {
      try {
        if (
          !(
            selected.ids[item?.id] === undefined ||
            selected.ids[item?.id] === null ||
            !selected.ids[item?.id]
          )
        ) {
          deselectItem(item);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      openPhoto(item, title);
    };

    function openPhoto(item, title) {
      try {
        navigation.navigate("ImageViewer", {
          disableWatermark: false,
          title,
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
          fontFamily: "Poppins",
          fontSize: item?.font ? item?.font?.ukuran : 48,
          watermarkData,
          sharingAvailability,
        });
      } catch (e) {
        console.error(e);
      }
    }

    return (
      <View style={styles.container}>
        {error ? (
          <View
            style={[
              styles.containerError,
              {
                backgroundColor: success
                  ? colors.daclen_green
                  : colors.daclen_danger,
              },
            ]}
          >
            <Text allowFontScaling={false} style={styles.textError}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => clearError()}
              style={styles.close}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.daclen_light}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.containerMain}>
          {loading || photos === undefined || photos === null ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_light}
              style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
            />
          ) : null}

          <View style={styles.containerInside}>
            {loading ||
            photos === undefined ||
            photos === null ? null : photoKeys?.length === undefined ||
              photoKeys?.length < 1 ? (
              <Text allowFontScaling={false} style={styles.textUid}>
                Tidak ada Flyer Produk tersedia.
              </Text>
            ) : (
              <FlatList
                estimatedItemSize={10}
                horizontal={false}
                numColumns={1}
                data={photoKeys}
                style={styles.containerFlatlist}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={() => refreshPage()}
                  />
                }
                renderItem={({ item, index }) => (
                  <WatermarkPhotosSegment
                    index={index}
                    isLast={index === photoKeys?.length - 1}
                    key={item}
                    title={item}
                    jenis_foto={jenis_foto}
                    photos={photos[item]}
                    watermarkData={watermarkData}
                    sharingAvailability={sharingAvailability}
                    selected={selected}
                    onPress={(e, title) => onPress(e, title)}
                    onLongPress={(e) => onLongPress(e)}
                  />
                )}
              />
            )}
          </View>
          {selected?.urls?.length === undefined ||
          selected?.urls?.length < 1 ? null : (
            <View style={styles.containerButton}>
              <TouchableOpacity
                onPress={() => startDownload()}
                style={[
                  styles.button,
                  {
                    backgroundColor: downloading
                      ? colors.daclen_lightgrey_button
                      : colors.daclen_light,
                    width: 200,
                  },
                ]}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.daclen_black}
                    style={{ alignSelf: "center" }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={
                      selected?.urls?.length > 1
                        ? "download-multiple"
                        : "download"
                    }
                    size={18}
                    color={colors.daclen_black}
                  />
                )}

                <Text allowFontScaling={false} style={styles.textButton}>
                  {selected?.urls?.length > 1
                    ? `Simpan ${selected?.urls?.length} Flyer`
                    : `Simpan Flyer`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => clearSelection()}
                style={[
                  styles.button,
                  {
                    backgroundColor: downloading
                      ? colors.daclen_lightgrey_button
                      : colors.daclen_light,
                  },
                ]}
                disabled={downloading}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={colors.daclen_black}
                />

                <Text allowFontScaling={false} style={styles.textButton}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  } catch (e) {
    sentryLog(e);
    return (
      <ErrorView
        error={`Mohon membuka website Daclen untuk melihat foto Media Kit\n\n${e.toString()}`}
        onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerMain: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInside: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  containerFlatlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerError: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.daclen_danger,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 4,
  },
  containerImage: {
    flex: 1,
    backgroundColor: colors.daclen_light,
    borderWidth: 0.5,
    borderColor: colors.daclen_lightgrey,
  },
  containerButton: {
    position: "absolute",
    width: "100%",
    end: 0,
    bottom: 20,
    zIndex: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginEnd: 12,
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    backgroundColor: colors.daclen_light,
    alignSelf: "center",
    elevation: 4,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginStart: 6,
    alignSelf: "center",
    textAlignVertical: "center",
    color: colors.daclen_black,
  },
  imageList: {
    flex: 1,
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
  },
  textError: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    marginHorizontal: 10,
    backgroundColor: "transparent",
    textAlign: "center",
    alignSelf: "center",
  },
  textUid: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_light,
    padding: 20,
    textAlign: "center",
    zIndex: 20,
    height: "100%",
    backgroundColor: "transparent",
  },
  close: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

export default WatermarkPhotos;
