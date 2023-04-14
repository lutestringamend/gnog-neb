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

import { colors, dimensions } from "../../styles/base";

const WatermarkVideos = ({ videos, watermarkData, userId }) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (videos?.length > 0) {
      console.log({ videos });
    }
  }, [videos]);

  function openVideo(item) {
    navigation.navigate("VideoPlayerScreen", {
      ...item,
      watermarkData,
      userId,
    });
  }

  /*
 width: item?.width,
      height: item?.height,
      text_align: item?.text_align,
      text_x: item?.text_x,
      text_y: item?.text_y,
      font: item?.font,
  */

  return (
    <View style={styles.containerFlatlist}>
      {videos?.length === undefined || videos?.length < 1 ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : (
        <FlatList
          horizontal={false}
          numColumns={3}
          data={videos}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => openVideo(item)}
              underlayColor={colors.daclen_orange}
              style={styles.containerImage}
            >
              <Image style={styles.imageList} source={{ uri: item?.thumbnail }} resizeMode="cover" />
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
    paddingBottom: dimensions.pageBottomPadding,
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

export default WatermarkVideos;
