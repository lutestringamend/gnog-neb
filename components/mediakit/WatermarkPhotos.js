import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";

import { colors } from "../../styles/base";
import { webfotowatermark } from "../../axios/constants";
import { ErrorView } from "../webview/WebviewChild";
import WatermarkPhotosSegment from "./WatermarkPhotosSegment";
import { sentryLog } from "../../sentry";
import { FlashList } from "@shopify/flash-list";

const WatermarkPhotos = ({
  photos,
  photoKeys,
  loading,
  error,
  watermarkData,
  sharingAvailability,
  refreshPage
}) => {
  try {

    return (
      <View style={styles.container}>
        {error ? (
          <ErrorView
            error="Mohon membuka website Daclen untuk melihat foto Media Kit"
            onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
          />
        ) : loading || photos === undefined || photos === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : photoKeys?.length === undefined || photoKeys?.length < 1 ? (
          <Text style={styles.textUid}>Tidak ada Foto Promosi tersedia.</Text>
        ) : (
          <FlashList
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
                photos={photos[item]}
                watermarkData={watermarkData}
                sharingAvailability={sharingAvailability}
              />
            )}
          />
        )}
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

/*
          Object.keys(photos)
            .sort()
            .reverse()
            .map((keyName, i) => (
              
            ))
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
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
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
    color: colors.daclen_gray,
    marginHorizontal: 10,
  },
});

export default WatermarkPhotos;
