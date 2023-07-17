import React, { Suspense } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
} from "react-native";

import { colors, staticDimensions } from "../../styles/base";
import { webfotowatermark } from "../../axios/constants";
import { ErrorView } from "../webview/WebviewChild";
import WatermarkPhotosSegment from "./WatermarkPhotosSegment";
import { sentryLog } from "../../sentry";

const WatermarkPhotos = ({ photos, watermarkData, userId, loading, error, sharingAvailability }) => {
  try {
    return (
      <View style={styles.container}>
        {error ? (
          <ErrorView
            error="Mohon membuka website Daclen untuk melihat foto Media Kit"
            onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
          />
        ) : loading || sharingAvailability === undefined || sharingAvailability === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_orange}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
        ) : photos === undefined || photos === null ? (
          <Text style={styles.textUid}>Tidak ada foto Media Kit tersedia</Text>
        ) : (
          Object.keys(photos)
            .sort()
            .reverse()
            .map((keyName, i) => (
              <WatermarkPhotosSegment
                isExpanded={i === 0 ? true : false}
                key={keyName}
                title={keyName}
                photos={photos[keyName]}
                watermarkData={watermarkData}
                userId={userId}
                sharingAvailability={sharingAvailability}
              />
            ))
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

const styles = StyleSheet.create({
  containerFlatlist: {
    flex: 1,
    width: "100%",
    paddingBottom: staticDimensions.pageBottomPadding,
    backgroundColor: "white",
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
