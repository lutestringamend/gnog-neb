import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  RefreshControl,
  FlatList,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";

import { colors } from "../../../styles/base";
import { webfotowatermark } from "../../../axios/constants";
import { ErrorView } from "../../webview/WebviewChild";
import WatermarkPhotosSegment from "./WatermarkPhotosSegment";
import { sentryLog } from "../../../sentry";

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
  try {
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
          />
        ) : null}

        <View style={styles.containerInside}>
          {error ? (
            <ErrorView
              error="Mohon membuka website Daclen untuk melihat Flyer Produk"
              onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
            />
          ) : photos === undefined ||
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
                />
              )}
            />
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

export default WatermarkPhotos;
