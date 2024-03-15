import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import PhotoItem from "../../components/starterkit/PhotoItem";
import {
  STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  FLYER_MENGAJAK_PAGINATION_LIMIT,
} from "../../constants/starterkit";
import AlertBox from "../../components/alert/AlertBox";
import EmptySpinner from "../../components/empty/EmptySpinner";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";

const screenAR = dimensions.fullWidth / dimensions.fullHeight;
const limitAR = 9 / 16;
const numColumns = screenAR >= limitAR ? 4 : 3;
const itemLimit = FLYER_MENGAJAK_PAGINATION_LIMIT * numColumns;
const width = (dimensions.fullWidth - (numColumns + 1) * 20) / numColumns;
const height = (180 * width) / 135;

const arrowSize = 24 * dimensions.fullWidth / 430;
const textSize = 12 * dimensions.fullWidth / 430;

const StarterKitFlyerMengajak = (props) => {
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
    console.log("FlyerMengajak photos", photos?.length, newMaxPage);
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
        : photos?.length;
    for (let i = page * itemLimit; i < maxPhotoIndex; i++) {
      newPaginated.push(photos[i]);
    }
    setPaginated(newPaginated);
  }, [page]);

  /*useEffect(() => {
    console.log("paginated", paginated);
  }),
    [paginated];*/

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
    let params = {
      index: page * itemLimit + index,
      type: STARTER_KIT_FLYER_MENGAJAK_TAG,
      product: STARTER_KIT_FLYER_MENGAJAK_CASE_SENSITIVE,
    };
    navigation.navigate("FlyerSliderScreen", params);
    console.log("open FlyerSliderScreen", params);
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
    <ScrollView style={styles.container}>
      {photos === null || refreshing ? (
       <EmptySpinner />
      ) : null}
      {photos === null || refreshing ? null : photos?.length === undefined ||
        photos?.length < 1 ? (
          <EmptyPlaceholder title="Flyer Mengajak" text="Tidak ada Flyer Mengajak tersedia." />
      ) : (
        <FlatList
        horizontal={false}
        numColumns={numColumns}
        data={paginated}
        scrollEnabled
        contentContainerStyle={styles.containerFlatlist}
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
                backgroundColor: "transparent",
                marginBottom: staticDimensions.marginHorizontal,
              },
            ]}
            imageStyle={styles.photoImage}
            selectMode={selectMode}
            onLongPress={() => onLongPress(item)}
            onPress={() => onPress(item, index)}
          />
        )}
      />
      )}
      {photos === null || refreshing ? null : <View style={styles.containerPagination}>
            <TouchableOpacity
              style={[styles.containerArrow, { opacity: page < 1 ? 0 : 1 }]}
              disabled={page < 1}
              onPress={() => setPage(0)}
            >
              <MaterialCommunityIcons
                name="chevron-double-left"
                size={arrowSize}
                color={colors.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.containerArrow, { opacity: page < 1 ? 0 : 1, marginEnd: 6 }]}
              disabled={page < 1}
              onPress={() => setPage((page) => page - 1)}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={arrowSize}
                color={colors.black}
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
                size={arrowSize}
                color={colors.black}
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
                size={arrowSize}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>}
      <AlertBox text={error} success={success} onClose={() => clearError()} />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  containerFlatlist: {
    height: (3 * height) + (4 * staticDimensions.marginHorizontal),
    backgroundColor: "transparent",
    paddingTop: staticDimensions.marginHorizontal,
  },
  containerPagination: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  containerArrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: 6,
  },
  containerImage: {
    flex: 1 / numColumns,
  },
 
  textPageNumber: {
    marginHorizontal: 2,
    alignSelf: "center",
    backgroundColor: "transparent",
    color: colors.black,
    fontSize: textSize,
    fontFamily: "Poppins-Light",
  },
  photoImage: {
   width,
   height,
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
});

export default StarterKitFlyerMengajak;
