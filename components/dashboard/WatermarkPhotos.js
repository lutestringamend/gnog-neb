import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableHighlight,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions } from "../../styles/base";
import { defaultmediakitphotoheight, defaultmediakitphotowidth, tempmediakitphotos } from "./constants";

const WatermarkPhotos = ({ watermarkData, userId }) => {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (photos?.length === undefined || photos?.length < 1) {
      setPhotos(tempmediakitphotos);
    } 
  }, [photos]);

  function openPhoto(uri) {
    navigation.navigate("ImageViewer", {
      title: "Foto Promosi",
      uri,
      isSquare: false,
      width: defaultmediakitphotowidth,
      height: defaultmediakitphotoheight,
      watermarkData,
      userId,
    });
  }

  return (
    <View style={styles.containerFlatlist}>
      {photos?.length === undefined || photos?.length < 1 ? null : (
        <FlatList
          horizontal={false}
          numColumns={3}
          data={photos}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <TouchableHighlight
                onPress={() => openPhoto(item)}
                underlayColor={colors.daclen_orange}
              >
                <Image style={styles.imageList} source={{ uri: item }} />
              </TouchableHighlight>
            </View>
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
  },    
  imageList: {
    flex: 1,
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
    borderColor: colors.daclen_light,
    borderWidth: 1,
  },
});

export default WatermarkPhotos;
