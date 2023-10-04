import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions, blurhash } from "../../../styles/base";
import { STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE } from "../constants";

const FlyerMengajak = (props) => {
  const { photos, refreshing, showTitle, jenis_foto, watermarkData, sharingAvailability, userId } = props;
  const navigation = useNavigation();

  useEffect(() => {
    console.log("FlyerMengajak photos", photos);
  }, [photos]);

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
      {photos === null || refreshing ? (
        <View style={styles.containerSpinner}>
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
          />
        </View>

      ) : null}
      { photos === null || refreshing ? null : photos?.length === undefined || photos?.length < 1 ? (
        <Text allowFontScaling={false} style={styles.textUid}>
          Tidak ada Flyer Mengajak tersedia.
        </Text>
      ) : (
        <FlashList
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
            <TouchableOpacity
              key={index}
              onPress={() => openPhoto(item)}
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
          )}
        />
      )}
    </View>
  );
};

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
  containerImage: {
    flex: 1,
    backgroundColor: "transparent",
    marginHorizontal: 10,
    paddingTop: 10,
  },
  containerThumbnail: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_lightgrey,
    backgroundColor: colors.daclen_lightgrey,
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
});

export default FlyerMengajak;
