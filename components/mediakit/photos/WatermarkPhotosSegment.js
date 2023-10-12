import React, { memo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, blurhash, staticDimensions } from "../../../styles/base";
import PhotoItem from "./PhotoItem";

const WatermarkPhotosSegment = (props) => {
  const { title, photos, index, isLast, navigation, selected } = props;
  //const [arraySize, setArraySize] = useState(null);

  const { width } = Dimensions.get("window");

  /*useEffect(() => {
    if (photos?.length === undefined || photos?.length < 1) {
      setArraySize(null);
      return;
    }
    let newSize = 0;
    for (let p of photos) {
      if (p?.jenis_foto === jenis_foto) {
        newSize++;
      }
    }
    setArraySize(newSize);
  }, [photos]);*/

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

  function onPress(e) {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress(e, title);
  }

  if (photos?.length === undefined || photos?.length < 1) {
    return null;
  }

  try {
    let scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, width);

    return (
      <View
        style={[
          styles.containerScroll,
          {
            paddingTop: index === 0 ? 20 : 10,
            paddingBottom: isLast ? staticDimensions.pageBottomPadding / 2 : 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => openSegmentScreen()}
          style={styles.containerScrollHeader}
        >
          <Text allowFontScaling={false} style={[styles.textName, { flex: 1 }]}>
            {title}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.daclen_light}
            style={styles.icon}
          />
        </TouchableOpacity>

        <View style={styles.containerCarousel}>
          <FlatList
            estimatedItemSize={10}
            horizontal={true}
            data={photos}
            contentContainerStyle={styles.containerFlatlist}
            renderItem={({ item, i }) => (
              <PhotoItem
                selected={selected}
                navigation={navigation}
                item={item}
                index={i}
                onLongPress={() => onLongPress(item)}
                onPress={() => onPress(item)}
              />
            )}
          />
        </View>
      </View>
    );
  } catch (e) {
    console.error(e);
    return (
      <TouchableOpacity
        style={[styles.containerItem, { paddingBottom: isLast ? 32 : 0 }]}
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
              photos[0]?.foto === undefined) ||
            photos[0]?.foto === null ||
            photos[0]?.foto === "" ? null : (
              <Image
                key={title}
                style={styles.image}
                source={
                  photos[0]?.thumbnail ? photos[0]?.thumbnail : photos[0]?.foto
                }
                onClick={() => openSegmentScreen()}
                contentFit="cover"
                placeholder={blurhash}
                transition={100}
              />
            )}

            <View style={styles.containerInfo}>
              <Text allowFontScaling={false} style={styles.textName}>
                {title}
              </Text>
              <Text
                allowFontScaling={false}
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
  }
};

/*

          <ScrollView
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event(
              // Animated.event returns a function that takes an array where the first element...
              [{ nativeEvent: { contentOffset: { x: scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
          >
            {photos.map((item, i) => {
              return (
                
              );
            })}
          </ScrollView>

<View
          style={{ flexDirection: "row" }} // this will layout our dots horizontally (row) instead of vertically (column)
        >
          {photos.map((_, i) => {
            // the _ just means we won't use that parameter
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
              outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
              // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
              // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
              extrapolate: "clamp", // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
            });
            return (
              <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                style={{
                  opacity,
                  height: 10,
                  width: 10,
                  backgroundColor: "#595959",
                  margin: 8,
                  borderRadius: 5,
                }}
              />
            );
          })}
        </View>
*/

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
    backgroundColor: "transparent",
    marginHorizontal: 10,
    paddingTop: 10,
  },
  containerScrollHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    paddingEnd: 24,
  },
  containerCarousel: {
    backgroundColor: "transparent",
    marginVertical: 20,
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
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: colors.daclen_light,
    alignSelf: "flex-start",
  },
  textPrice: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_orange,
    marginTop: 6,
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

export default memo(WatermarkPhotosSegment);
