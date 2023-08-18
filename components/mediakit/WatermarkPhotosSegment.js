import React, { memo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, blurhash } from "../../styles/base";

const WatermarkPhotosSegment = (props) => {
  const {
    title,
    photos,
    isLast,
  } = props;
  const navigation = useNavigation();

  function openSegmentScreen() {
    navigation.navigate("PhotosSegment", {
      ...props
    });
  }

  return (
    <TouchableOpacity
      style={[styles.containerItem, {marginBottom: isLast ? 32 : 0}]}
      key={title}
      onPress={() => openSegmentScreen()}
    >
      {photos === null || photos?.length === undefined ? (
        <ActivityIndicator
          size="small"
          color={colors.daclen_gray}
          style={{ flex: 2, alignSelf: "center" }}
        />
      ) : (
        <View style={styles.containerLeft}>
          {photos === undefined ||
          photos === null ||
          photos?.length === undefined ||
          photos?.length < 1 ||
          photos[0] === undefined ||
          photos[0] === null ||
          ((photos[0]?.thumbnail === undefined ||
          photos[0]?.thumbnail === null ||
          photos[0]?.thumbnail === "") &&
          photos[0]?.foto === undefined ||
          photos[0]?.foto === null ||
          photos[0]?.foto === "") ? null : (
            <Image
              key={title}
              style={styles.image}
              source={photos[0]?.thumbnail ? photos[0]?.thumbnail : photos[0]?.foto}
              onClick={() => openSegmentScreen()}
              contentFit="cover"
              placeholder={blurhash}
              transition={100}
            />
          )}

          <View style={styles.containerInfo}>
            <Text style={styles.textName}>{title}</Text>
            <Text
              style={styles.textPrice}
            >{`${photos?.length} foto tersedia`}</Text>
          </View>
        </View>
      )}
      <MaterialCommunityIcons
        name="arrow-right-drop-circle"
        size={24}
        color={colors.daclen_black}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerLeft: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 10,
    marginStart: 10,
  },
  containerInfo: {
    flex: 1,
    backgroundColor: "center",
    marginStart: 10,
    alignSelf: "flex-start",
    height: 100,
  },
  textName: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_black,
    alignSelf: "flex-start",
  },
  image: {
    width: 94,
    height: 125,
    borderRadius: 6,
    alignSelf: "center",
    backgroundColor: "transparent",
    marginStart: 12,
  },
  textPrice: {
    fontSize: 12,
    color: colors.daclen_orange,
    marginTop: 6,
  },
  textButton: {
    fontSize: 14,
    color: colors.daclen_black,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
  icon: {
    alignSelf: "center",
    marginEnd: 12,
  },
});

export default memo(WatermarkPhotosSegment);
