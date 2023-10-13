import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions, blurhash } from "../../../styles/base";
import { defaultSelected, filterPhotoProps } from "./WatermarkPhotos";
import PhotoItem from "./PhotoItem";
import { STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE } from "../constants";

const FlyerMengajak = (props) => {
  const {
    photos,
    refreshing,
    showTitle,
    jenis_foto,
    watermarkData,
    sharingAvailability,
    photosMultipleSave,
    userId,
  } = props;
  const navigation = useNavigation();

  const [selected, setSelected] = useState(defaultSelected);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (photosMultipleSave?.success !== success) {
      setSuccess(
        photosMultipleSave?.success ? photosMultipleSave?.success : false
      );
    }
    if (photosMultipleSave?.error !== error) {
      setError(photosMultipleSave?.error ? photosMultipleSave?.error : null);
    }
    if (photosMultipleSave?.success === true && selected?.urls?.length > 0) {
      setSelected({
        ids: {},
        urls: [],
      });
    }
    console.log("redux photosMultipleSave", photosMultipleSave);
  }, [photosMultipleSave]);

  useEffect(() => {
    console.log("FlyerMengajak photos", photos);
  }, [photos]);

  useEffect(() => {
    if (
      (selected?.urls?.length === undefined || selected?.urls?.length < 1) &&
      Object.keys(selected?.ids)?.length > 0
    ) {
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
    if (
      !(
        props?.clearMultipleSave === undefined ||
        props?.clearMultipleSave === null
      )
    ) {
      props?.clearMultipleSave();
    }
    setError(null);
  };

  const startDownload = () => {
    navigation.navigate("MultipleImageSave", {
      photos: selected?.urls,
      sharingAvailability,
      jenis_foto,
      title: `Menyimpan ${STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE}`,
    });
  };

  const deselectItem = (item) => {
    let ids = selected?.ids;
    ids[item?.id] = false;
    let urls = [];
    if (!(selected?.urls?.length === undefined || selected?.urls?.length < 1)) {
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
          !(selected?.urls?.length === undefined || selected?.urls?.length < 1)
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
    openPhoto(item);
  };

  function refreshPage() {
    if (props?.refreshPage === undefined || props?.refreshPage === null) {
      return;
    }
    props?.refreshPage();
  }

  function openPhoto(item) {
    navigation.navigate("ImageViewer", {
      disableWatermark: false,
      title: STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
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
      {photos === null || refreshing ? (
        <View style={styles.containerSpinner}>
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
          />
        </View>
      ) : null}
      {photos === null || refreshing ? null : photos?.length === undefined ||
        photos?.length < 1 ? (
        <Text allowFontScaling={false} style={styles.textUid}>
          Tidak ada Flyer Mengajak tersedia.
        </Text>
      ) : (
        <FlatList
          estimatedItemSize={20}
          horizontal={false}
          numColumns={3}
          data={photos}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => refreshPage()}
            />
          }
          contentContainerStyle={styles.containerFlatlist}
          renderItem={({ item, index }) => (
            <PhotoItem
              selected={selected}
              navigation={navigation}
              item={item}
              index={index}
              style={[styles.containerImage, {
                marginBottom: index >= photos?.length - 1 ? staticDimensions.pageBottomPadding / 2 : 0,
              }]}
              onLongPress={() => onLongPress(item)}
              onPress={() => onPress(item)}
            />
          )}
        />
      )}
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
                  selected?.urls?.length > 1 ? "download-multiple" : "download"
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
  );
};

/*
            <TouchableOpacity
              key={index}
              onLongPress={() => onLongPress(item)}
              onPress={() => onPress(item)}
              style={[
                styles.containerImage,
                {
                  paddingBottom:
                    photos?.length > 3 && index >= Math.floor(photos?.length / 3) * 3
                      ? staticDimensions.pageBottomPadding / 2
                      : 0,
                },
              ]}
            >
              <View style={styles.containerThumbnail}>
                <Image
                  style={styles.imageList}
                  source={item?.thumbnail ? item?.thumbnail : null}
                  contentFit="cover"
                  placeholder={blurhash}
                  transition={0}
                  cachePolicy="memory-disk"
                />
              </View>

              {showTitle && item?.nama ? (
                <Text allowFontScaling={false} style={styles.textHeader}>
                  {item?.nama}
                </Text>
              ) : null}
            </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerSpinner: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerFlatlist: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
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
  containerImage: {
    flex: 1 / 3,
    backgroundColor: "transparent",
    marginHorizontal: 10,
    marginTop: 10,
  },
  containerThumbnail: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_lightgrey,
    backgroundColor: colors.daclen_lightgrey,
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
    aspectRatio: 3 / 4,
    borderRadius: 6,
    backgroundColor: colors.daclen_light,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 6,
    marginBottom: 12,
    marginHorizontal: 10,
    height: 52,
    color: colors.daclen_light,
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

export default FlyerMengajak;
