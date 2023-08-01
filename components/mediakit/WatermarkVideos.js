import React, { useEffect } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash, staticDimensions } from "../../styles/base";

const WatermarkVideos = ({ videos, userId }) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (videos?.length > 0) {
      console.log({ videos });
    }
  }, [videos]);

  function openVideo(item) {
    navigation.navigate("VideoPlayerScreen", {
      ...item,
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
        <FlashList
          estimatedItemSize={12}
          horizontal={false}
          numColumns={3}
          data={videos}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => openVideo(item)}
              underlayColor={colors.daclen_orange}
              style={styles.containerImage}
            >
              <Image
                style={styles.imageList}
                source={item?.thumbnail}
                contentFit="cover"
                placeholder={blurhash}
                transition={0}
              />
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
});

export default WatermarkVideos;
