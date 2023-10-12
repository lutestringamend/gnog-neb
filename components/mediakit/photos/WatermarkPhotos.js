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
import * as MediaLibrary from "expo-media-library";
//import { FlashList } from "@shopify/flash-list";

import { colors } from "../../../styles/base";
import { webfotowatermark } from "../../../axios/constants";
import { ErrorView } from "../../webview/WebviewChild";
import WatermarkPhotosSegment from "./WatermarkPhotosSegment";
import { sentryLog } from "../../../sentry";

const defaultSelected = {
  ids: {},
  urls: [],
};

const WatermarkPhotos = ({
  photos,
  photoKeys,
  loading,
  error,
  watermarkData,
  sharingAvailability,
  refreshPage,
  jenis_foto,
}) => {
  const navigation = useNavigation();
  try {
    const [selected, setSelected] = useState(defaultSelected);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    useEffect(() => {
      console.log("MediaLibrary permissionResponse", permissionResponse);
    }, [permissionResponse]);

    useEffect(() => {
      console.log("selected", selected);
    }, [selected]);

    const startDownload = async () => {
      setDownloading(true);
      try {
        if (!(permissionResponse?.status === "granted" && permissionResponse?.granted)) {
          const request = await requestPermission();
          console.log("requestPermission", request);
        }
        
        for (let i = 0; i < selected?.urls?.length; i++) {
          const result = await MediaLibrary.saveToLibraryAsync(selected?.urls[i]);
          console.log(`savetoLibraryAsync ${selected?.urls[i]}`, result);
        }

        setSuccess(true);
        setError(`${selected?.urls?.length} Flyer tersimpan di ${Platform.OS === "ios" ? "Camera Roll" : " Galeri"}`);
        setSelected({
          ids: {},
          urls: [],
        });
      } catch (e) {
        console.error(e);
        setSuccess(false);
        setError(`Gagal menyimpan Flyer\n${e.toString()}`);
      }
      setDownloading(false);
    };

    const deselectItem = (item) => {
      let ids = selected?.ids;
      ids[item?.id] = false;
      let urls = [];
      if (
        !(selected?.urls?.length === undefined || selected?.urls?.length < 1)
      ) {
        for (let i = 0; i < selected?.urls?.length; i++) {
          if (selected?.urls[i] !== item?.foto) {
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
              if (selected?.urls[i] === item?.foto) {
                isFound = true;
              }
              urls.push(selected?.urls[i]);
            }
          }
          if (!isFound) {
            urls.push(item?.foto);
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
              onPress={() => setError(null)}
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
            <TouchableOpacity
              onPress={() => startDownload()}
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
                  ? "Simpan Semua"
                  : "Simpan ke Galeri"}
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 200,
    height: 40,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.daclen_light,
    position: "absolute",
    end: 20,
    bottom: 20,
    zIndex: 10,
    elevation: 4,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginStart: 10,
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
    marginStart: 10,
  },
});

export default WatermarkPhotos;
