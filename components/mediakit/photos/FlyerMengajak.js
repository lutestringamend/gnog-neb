import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../../styles/base";
import PhotoItem from "./PhotoItem";
import {
  STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  FLYER_MENGAJAK_PAGINATION_LIMIT,
} from "../constants";

const screenAR = dimensions.fullWidth / dimensions.fullHeight;
const limitAR = 9 / 16;
const numColumns = screenAR >= limitAR ? 4 : 3;
const itemLimit = FLYER_MENGAJAK_PAGINATION_LIMIT * numColumns;
const width = (dimensions.fullWidth - (numColumns + 1) * 20) / numColumns;
const height = (4 * width) / 3;

const FlyerMengajak = (props) => {
  const { photos, refreshing, photosMultipleSave, selectMode, selected } =
    props;
  const navigation = useNavigation();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [paginated, setPaginated] = useState([]);
  const [page, setPage] = useState(null);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    if (photos?.length === undefined || photos?.length < 1) {
      setPaginated([]);
      setMaxPage(0);
    }
    let newMaxPage = Math.ceil(photos?.length / itemLimit) - 1;
    setPage(0);
    setMaxPage(newMaxPage);
    console.log("FlyerMengajak photos", photos, newMaxPage);
  }, [photos]);

  useEffect(() => {
    if (
      photos?.length === undefined ||
      photos?.length < 1 ||
      page === null ||
      page < 0
    ) {
      return;
    }
    let newPaginated = [];
    let maxPhotoIndex =
      (page + 1) * itemLimit < photos?.length
        ? (page + 1) * itemLimit
        : photos?.length - 1;
    for (let i = page * itemLimit; i < maxPhotoIndex; i++) {
      newPaginated.push(photos[i]);
    }
    setPaginated(newPaginated);
  }, [page]);

  useEffect(() => {
    console.log("paginated", paginated);
  }),
    [paginated];

  useEffect(() => {
    if (photosMultipleSave?.success !== success) {
      setSuccess(
        photosMultipleSave?.success ? photosMultipleSave?.success : false,
      );
    }
    if (photosMultipleSave?.error !== error) {
      setError(photosMultipleSave?.error ? photosMultipleSave?.error : null);
    }
    if (photosMultipleSave?.success === true && selected?.urls?.length > 0) {
      setSelected(true, null);
    }
    //console.log("redux photosMultipleSave", photosMultipleSave);
  }, [photosMultipleSave]);

  function setSelected(isAdd, e) {
    if (props?.setSelected === undefined || props?.setSelected === null) {
      return;
    }
    props?.setSelected(isAdd, e);
  }

  const clearError = () => {
    if (
      !(
        props?.clearMultipleSave === undefined ||
        props?.clearMultipleSave === null
      )
    ) {
      props?.clearMultipleSave();
    }
    setError(null);
  };

  const deselectItem = (item) => {
    setSelected(false, item);
  };

  const onLongPress = (item) => {
    try {
      const found = selected.find(({ id }) => id === item?.id);
      if (found === undefined || found === null) {
        setSelected(true, item);
      } else {
        deselectItem(item);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onPress = (item, index) => {
    try {
      if (selectMode) {
        const found = selected.find(({ id }) => id === item?.id);
        if (found === undefined || found === null) {
          setSelected(true, item);
          return;
        } else if (selectMode) {
          deselectItem(item);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    openPhoto(index);
  };

  function refreshPage() {
    if (props?.refreshPage === undefined || props?.refreshPage === null) {
      return;
    }
    props?.refreshPage();
  }

  function openPhoto(index) {
    navigation.navigate("FlyerSliderView", {
      index,
      type: STARTER_KIT_FLYER_MENGAJAK_TAG,
      product: STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
    });
    /*navigation.navigate("ImageViewer", {
      disableWatermark: false,
      title: STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
      jenis_foto,
      id: item?.id,
      uri: item?.foto,
      thumbnail: item?.thumbnail,
      isSquare: false,
      width: item?.width,
      height: item?.height,
      text_align: item?.text_align,
      text_x: item?.text_x,
      text_y: item?.text_y,
      link_x: item?.link_x,
      link_y: item?.link_y,
      font: item?.font,
      fontFamily: "Poppins",
      fontSize: item?.font ? item?.font?.ukuran : 48,
      watermarkData,
      sharingAvailability,
    });*/
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View
          style={[
            styles.containerError,
            {
              backgroundColor: success
                ? colors.daclen_green
                : colors.daclen_danger,
            },
          ]}
        >
          <Text allowFontScaling={false} style={styles.textError}>
            {error}
          </Text>
          <TouchableOpacity onPress={() => clearError()} style={styles.close}>
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={colors.daclen_light}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      {photos === null || refreshing ? (
        <View style={styles.containerSpinner}>
          <ActivityIndicator
            size="large"
            color={colors.daclen_light}
            style={{ alignSelf: "center", marginVertical: 20, zIndex: 1 }}
          />
        </View>
      ) : null}
      {photos === null || refreshing ? null : photos?.length === undefined ||
        photos?.length < 1 ? (
        <Text allowFontScaling={false} style={styles.textUid}>
          Tidak ada Flyer Mengajak tersedia.
        </Text>
      ) : (
        <View style={styles.containerFlatlist}>
          <FlatList
            horizontal={false}
            numColumns={numColumns}
            data={paginated}
            scrollEnabled
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => refreshPage()}
              />
            }
            renderItem={({ item, index }) => (
              <PhotoItem
                selected={
                  selected.find(({ id }) => item?.id === id) ? true : false
                }
                navigation={navigation}
                item={item}
                index={index}
                style={[
                  styles.containerImage,
                  {
                    flex: 1 / numColumns,
                    width,
                    height,
                    marginHorizontal: 10,
                    marginBottom:
                      photos?.length > 3 &&
                      index >= Math.floor(photos?.length / 3) * 3
                        ? staticDimensions.pageBottomPadding
                        : 20,
                  },
                ]}
                imageStyle={styles.photoImage}
                selectMode={selectMode}
                onLongPress={() => onLongPress(item)}
                onPress={() => onPress(item, index)}
              />
            )}
          />
          <View style={styles.containerPagination}>
            <TouchableOpacity
              style={[styles.containerArrow, { opacity: page < 1 ? 0 : 1 }]}
              disabled={page < 1}
              onPress={() => setPage(0)}
            >
              <MaterialCommunityIcons
                name="chevron-double-left"
                size={24}
                color={colors.daclen_light}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.containerArrow, { opacity: page < 1 ? 0 : 1, marginEnd: 6 }]}
              disabled={page < 1}
              onPress={() => setPage((page) => page - 1)}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.daclen_light}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.textPageNumber}>
              {`${page + 1} / ${maxPage + 1}`}
            </Text>
            <TouchableOpacity
              style={[
                styles.containerArrow,
                { opacity: page >= maxPage ? 0 : 1 },
              ]}
              disabled={page >= maxPage}
              onPress={() => setPage((page) => page + 1)}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.daclen_light}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.containerArrow,
                { opacity: page >= maxPage ? 0 : 1 },
              ]}
              disabled={page >= maxPage}
              onPress={() => setPage(maxPage)}
            >
              <MaterialCommunityIcons
                name="chevron-double-right"
                size={24}
                color={colors.daclen_light}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

/*
            <TouchableOpacity
              key={index}
              onLongPress={() => onLongPress(item)}
              onPress={() => onPress(item)}
              style={[
                styles.containerImage,
                {
                  paddingBottom:
                    photos?.length > 3 && index >= Math.floor(photos?.length / 3) * 3
                      ? staticDimensions.pageBottomPadding / 2
                      : 0,
                },
              ]}
            >
              <View style={styles.containerThumbnail}>
                <Image
                  style={styles.imageList}
                  source={item?.thumbnail ? item?.thumbnail : null}
                  contentFit="cover"
                  placeholder={blurhash}
                  transition={0}
                  cachepolicy="memory-disk"
                />
              </View>

              {showTitle && item?.nama ? (
                <Text allowFontScaling={false} style={styles.textHeader}>
                  {item?.nama}
                </Text>
              ) : null}
            </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerSpinner: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerFlatlist: {
    flex: 1,
    backgroundColor: "transparent",
    marginVertical: 20,
    marginHorizontal: 10,
  },
  containerPagination: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  containerArrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: 6,
  },
  containerButton: {
    position: "absolute",
    width: "100%",
    end: 0,
    bottom: 20,
    zIndex: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  containerImage: {
    flex: 1 / numColumns,
    backgroundColor: "transparent",
    marginHorizontal: 10,
  },
  containerThumbnail: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.daclen_lightgrey,
    backgroundColor: colors.daclen_lightgrey,
  },
  containerError: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.daclen_danger,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 4,
  },
  textError: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    marginHorizontal: 10,
    backgroundColor: "transparent",
    textAlign: "center",
    alignSelf: "center",
  },
  textPageNumber: {
    marginHorizontal: 2,
    alignSelf: "center",
    backgroundColor: "transparent",
    color: colors.daclen_light,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  photoImage: {
    width,
    height,
  },
  imageList: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 6,
    backgroundColor: colors.daclen_light,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 6,
    marginBottom: 12,
    marginHorizontal: 10,
    height: 52,
    color: colors.daclen_light,
  },
  textUid: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_light,
    padding: 20,
    textAlign: "center",
    zIndex: 20,
    height: "100%",
    backgroundColor: "transparent",
  },
  close: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

export default FlyerMengajak;
