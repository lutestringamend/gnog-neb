import React, { memo } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

import {
  colors,
  staticDimensions,
  dimensions,
  bottomNav,
} from "../../styles/base";
import PhotoItem from "./PhotoItem";
import Button from "../Button/Button";

const ratio = dimensions.fullWidthAdjusted / 430;
const width = dimensions.fullWidth - 2 * staticDimensions.marginHorizontal;
const itemWidth = 160 * ratio;

const StarterKitPhotoSegment = (props) => {
  const {
    title,
    photos,
    index,
    isLast,
    navigation,
    selected,
    selectMode,
    unit,
    numItems,
  } = props;

  function openSegmentScreen() {
    if (
      props?.openSegmentScreen === undefined ||
      props?.openSegmentScreen === null
    ) {
      navigation.navigate("PhotosSegment", {
        ...props,
      });
    } else {
      props?.openSegmentScreen();
    }
  }

  function onLongPress(e) {
    if (props?.onLongPress === undefined || props?.onLongPress === null) {
      if (
        !(
          props?.openSegmentScreen === undefined ||
          props?.openSegmentScreen === null
        )
      ) {
        props.openSegmentScreen();
      }
      return;
    }
    props?.onLongPress(e);
  }

  function onPress(e, photoIndex) {
    if (props?.onPress === undefined || props?.onPress === null) {
      if (
        !(
          props?.openSegmentScreen === undefined ||
          props?.openSegmentScreen === null
        )
      ) {
        props.openSegmentScreen();
      }
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
            marginBottom: isLast
              ? bottomNav.height + 3 * staticDimensions.marginHorizontal
              : staticDimensions.marginHorizontal,
          },
        ]}
      >
        <View style={styles.containerCarousel}>
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
            scrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.containerFlatlist,
              {
                minWidth:
                  staticDimensions.marginHorizontal * 2 +
                  (photos?.length - 1) * itemWidth,
              },
            ]}
          >
            {photos.map((item, index) => (
              <PhotoItem
                selected={
                  selected
                    ? selected.find(({ id }) => item?.id === id)
                      ? true
                      : false
                    : false
                }
                navigation={navigation}
                key={index}
                item={item}
                index={index}
                selectMode={selectMode}
                onLongPress={() => onLongPress(item)}
                onPress={() => onPress(item, index)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.containerHorizontal}>
          <View style={styles.containerVertical}>
            <Text
              allowFontScaling={false}
              style={[
                styles.textName,
                {
                  fontSize:
                    title?.length > 20
                      ? (14 * dimensions.fullWidthAdjusted) / 430
                      : (18 * dimensions.fullWidthAdjusted) / 430,
                },
              ]}
            >
              {title}
            </Text>
            <Text allowFontScaling={false} style={styles.textNum}>
              {`${numItems ? numItems : photos?.length} ${
                unit ? unit : "item"
              }`}
            </Text>
          </View>
          <Button
            style={styles.button}
            fontFamily="Poppins-Light"
            fontSize={(12 * dimensions.fullWidthAdjusted) / 430}
            arrowSize={(12 * dimensions.fullWidthAdjusted) / 430}
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
    borderRadius: 10 * ratio,
    backgroundColor: "transparent",
    paddingTop: 10 * ratio,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerScroll: {
    backgroundColor: colors.daclen_grey_container,
    borderRadius: 20 * ratio,
    width,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerHorizontal: {
    maxWidth: dimensions.fullWidth - 4 * staticDimensions.marginHorizontal,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginTop: 4 * ratio,
    marginHorizontal: staticDimensions.marginHorizontal / 2,
    marginBottom: staticDimensions.marginHorizontal,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    borderRadius: 6,
    flexDirection: "row",
    overflow: "hidden",
  },
  containerCarousel: {
    backgroundColor: colors.daclen_grey_light,
    borderRadius: (20 * dimensions.fullWidthAdjusted) / 430,
    overflow: "hidden",
    paddingVertical: staticDimensions.marginHorizontal / 2,
    margin: (4 * dimensions.fullWidthAdjusted) / 430,
  },
  button: {
    position: "absolute",
    zIndex: 2,
    bottom: -(staticDimensions.marginHorizontal / 2),
    end: -staticDimensions.marginHorizontal,
    height: (30 * dimensions.fullWidthAdjusted) / 430,
    borderRadius: (6 * dimensions.fullWidthAdjusted) / 430,
    alignSelf: "flex-end",
  },
  textName: {
    fontFamily: "Poppins",
    fontSize: 18,
    color: colors.black,
  },
  textNum: {
    fontFamily: "Poppins-Light",
    fontSize: (12 * dimensions.fullWidthAdjusted) / 430,
    color: colors.black,
  },
  icon: {
    alignSelf: "center",
    marginEnd: 12,
  },
});

export default memo(StarterKitPhotoSegment);
