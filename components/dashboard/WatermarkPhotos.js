import React, { Suspense } from "react";
import {
  View,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash, staticDimensions } from "../../styles/base";
import { webfotowatermark } from "../../axios/constants";
import { ErrorView } from "../webview/WebviewChild";

const WatermarkPhotos = ({ photos, watermarkData, userId, loading, error }) => {
  const navigation = useNavigation();

  function openPhoto(item) {
    navigation.navigate("ImageViewer", {
      title: `Foto ${item?.id.toString()}`,
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
    });
  }

  return (
    <View style={styles.containerFlatlist}>
      {error ? (
        <ErrorView
          error="Mohon membuka website Daclen untuk melihat foto Media Kit"
          onOpenExternalLink={() => Linking.openURL(webfotowatermark)}
        />
      ) : loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : photos?.length === undefined || photos?.length < 1 ? (
        <Text style={styles.textUid}>Tidak ada foto Media Kit tersedia</Text>
      ) : (
        <Suspense
          fallback={
            <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={{ alignSelf: "center", marginVertical: 20 }}
            />
          }
        >
          <FlatList
            horizontal={false}
            numColumns={3}
            data={photos}
            renderItem={({ item }) => (
              <TouchableHighlight
                onPress={() => openPhoto(item)}
                underlayColor={colors.daclen_orange}
                style={styles.containerImage}
              >
                <Image
                  style={styles.imageList}
                  source={item?.foto}
                  contentFit="cover"
                  placeholder={blurhash}
                  transition={0}
                />
              </TouchableHighlight>
            )}
          />
        </Suspense>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerFlatlist: {
    width: "100%",
    paddingBottom: staticDimensions.pageBottomPadding,
    backgroundColor: "white",
  },
  containerImage: {
    flex: 1 / 3,
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
