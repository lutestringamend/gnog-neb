import React, { memo} from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
} from "react-native";

import { colors, staticDimensions, dimensions, bottomNav } from "../../styles/base";
import PhotoItem from "./PhotoItem";
import Button from "../Button/Button";

const width = dimensions.fullWidth - (2 * staticDimensions.marginHorizontal);

const StarterKitPhotoSegment = (props) => {
  const { title, photos, index, isLast, navigation, selected, selectMode, unit } =
    props;
  //const [arraySize, setArraySize] = useState(null);
  const { width } = Dimensions.get("window");

  function openSegmentScreen() {
    navigation.navigate("PhotosSegment", {
      ...props,
    });
  }

  function onLongPress(e) {
    if (props?.onLongPress === undefined || props?.onLongPress === null) {
      return;
    }
    props?.onLongPress(e);
  }

  function onPress(e, photoIndex) {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress(e, title, photoIndex);
  }

  if (photos?.length === undefined || photos?.length < 1) {
    return null;
  }

  try {

    return (
      <View
        style={[
          styles.containerScroll,
          {
            marginBottom: isLast ? bottomNav.height + 3 * staticDimensions.marginHorizontal : staticDimensions.marginHorizontal,
          },
        ]}
      >
        

        <View style={styles.containerCarousel}>
          <FlatList
            estimatedItemSize={10}
            horizontal={true}
            data={photos}
            contentContainerStyle={styles.containerFlatlist}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <PhotoItem
                selected={
                  selected.find(({ id }) => item?.id === id) ? true : false
                }
                navigation={navigation}
                item={item}
                index={index}
                selectMode={selectMode}
                onLongPress={() => onLongPress(item)}
                onPress={() => onPress(item, index)}
              />
            )}
          />
        </View>

        <View
          style={styles.containerHorizontal}
        >
          <View style={styles.containerVertical}>
          <Text allowFontScaling={false} style={[styles.textName, {
            fontSize: title?.length > 20 ? 14 * dimensions.fullWidthAdjusted / 430 : 18 * dimensions.fullWidthAdjusted / 430,
          }]}>
            {title}
          </Text>
          <Text allowFontScaling={false} style={styles.textNum}>
            {`${photos?.length} ${unit ? unit : "foto"}`}
          </Text>
          </View>
         <Button
          style={styles.button}
          fontFamily="Poppins-Light"
          fontSize={12 * dimensions.fullWidthAdjusted / 430}
          arrowSize={12 * dimensions.fullWidthAdjusted / 430}
          text="Lebih Banyak"
          withArrow
          rightArrow="chevron-double-right"
          onPress={() => openSegmentScreen()}
         />
        </View>
      </View>
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "transparent",
    marginHorizontal: 10,
    paddingTop: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerScroll: {
    backgroundColor: colors.daclen_grey_container,
    borderRadius: 20 * dimensions.fullWidthAdjusted / 430,
    width,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerHorizontal: {
    maxWidth: dimensions.fullWidth - (4 * staticDimensions.marginHorizontal),
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginTop: 4 * dimensions.fullWidth / 430,
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: 16,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    borderRadius: 6,
    overflow: "hidden",
  },
  containerCarousel: {
    backgroundColor: colors.daclen_grey_light,
    borderRadius: 20 * dimensions.fullWidthAdjusted / 430,
    overflow: "hidden",
    paddingVertical: staticDimensions.marginHorizontal / 2,
    margin: 4 * dimensions.fullWidthAdjusted / 430,
  },
  button: {
    position: "absolute",
    zIndex: 2,
    bottom: 0,
    end: 0,
    height: 30 * dimensions.fullWidthAdjusted / 430,
    borderRadius: 6 * dimensions.fullWidthAdjusted / 430,
    marginTop: staticDimensions.marginHorizontal,
    alignSelf: "flex-end",
  },
  textName: {
    fontFamily: "Poppins",
    fontSize: 18,
    color: colors.black,
  },
  textNum: {
    fontFamily: "Poppins-Light",
    fontSize: 12 * dimensions.fullWidthAdjusted / 430,
    color: colors.black,
  },
  textButton: {
    fontFamily: "Poppins",
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

export default memo(StarterKitPhotoSegment);
