import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableHighlight,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";

const WatermarkPhotos = ({ photos, watermarkData, userId }) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (photos?.length > 0) {
      console.log({ photos });
    }
  }, [photos]);

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
      {photos?.length === undefined || photos?.length < 1 ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : (
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
              <Image style={styles.imageList} source={{ uri: item?.foto }} />
            </TouchableHighlight>
          )}
        />
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
});

export default WatermarkPhotos;
