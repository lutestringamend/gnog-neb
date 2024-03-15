import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { dimensions, staticDimensions } from "../../styles/base";
import WatermarkPhotosSegment from "../../components/starterkit/StarterKitPhotoSegment";
import { sentryLog } from "../../sentry";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import EmptySpinner from "../../components/empty/EmptySpinner";
import AlertBox from "../../components/alert/AlertBox";

const StarterKitFlyerProduk = (props) => {
  const {
    photos,
    photoKeys,
    loading,
    watermarkData,
    sharingAvailability,
    refreshPage,
    photosMultipleSave,
    jenis_foto,
    selectMode,
    selected,
  } = props;
  const navigation = useNavigation();
  try {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

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

    const onPress = (item, title, photoIndex) => {
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
      openPhoto(item, title, photoIndex);
    };

    function openPhoto(item, product, index) {
      navigation.navigate("FlyerSliderScreen", {
        index,
        type: jenis_foto,
        product,
      });
    }

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ minHeight: 4 * dimensions.fullHeight }}>
        <View style={styles.containerMain}>
          {loading || photos === undefined || photos === null ? (
            <EmptySpinner />
          ) : null}

          <View style={styles.containerInside}>
            {loading ||
            photos === undefined ||
            photos === null ? null : photoKeys?.length === undefined ||
              photoKeys?.length < 1 ? (
              <EmptyPlaceholder
                title="Flyer Produk"
                text="Tidak ada Flyer Produk tersedia."
              />
            ) : (
              <View style={styles.containerFlatlist}>
                {photoKeys.map((item, index) => (
                   <WatermarkPhotosSegment
                   index={index}
                   isLast={index === photoKeys?.length - 1}
                   key={item}
                   title={item}
                   jenis_foto={jenis_foto}
                   photos={photos[item]}
                   watermarkData={watermarkData}
                   sharingAvailability={sharingAvailability}
                   navigation={navigation}
                   selected={selected}
                   selectMode={selectMode}
                   onPress={(e, title, photoIndex) =>
                     onPress(e, title, photoIndex)
                   }
                   onLongPress={(e) => onLongPress(e)}
                 />
                ))}
              </View>
            )}
          </View>
        </View>
        <AlertBox
          success={success}
          text={error}
          onClose={() => setError(null)}
        />
      </ScrollView>
    );
  } catch (e) {
    sentryLog(e);
    return (
      <EmptyPlaceholder
        title="Flyer Produk"
        text={`Mohon membuka website Daclen untuk melihat foto Media Kit\n\n${e.toString()}`}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  containerMain: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInside: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    flex: 1,
    height: dimensions.fullHeight * 10,
    paddingTop: staticDimensions.marginHorizontal,
  },
});

export default StarterKitFlyerProduk;
