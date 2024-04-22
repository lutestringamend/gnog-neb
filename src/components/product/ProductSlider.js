import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
//import { ImageSlider } from "react-native-image-slider-banner";
import { connect } from "react-redux";

import { colors, dimensions, globalUIRatio } from "../../styles/base";
import { sentryLog } from "../../../sentry";

const width = dimensions.fullWidthAdjusted;

function ProductSlider(props) {
  try {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [mainPhoto, setMainPhoto] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
      setMainPhoto(null);
      if ((props.id === null || props.id === undefined) && !loading) {
        setPhotos([]);
        console.log("sliders are empty");
      } else {
        setLoading(false);
        //console.log("product id is " + props.id);
        const check = props.productItems.find(({ id }) => id === props.id);
        if (check !== undefined) {
          setMainPhoto(
            check?.thumbnail_url ? check?.thumbnail_url : check?.foto_url,
          );
          const data = [
            {
              img: check?.foto_url,
              thumbnail: check?.thumbnail_url
                ? check?.thumbnail_url
                : check?.foto_url,
              id: 0,
            },
            ...new Set(
              check?.foto_produk
                .map(({ foto_url, thumbnail_url, id }) => ({
                  img: foto_url,
                  thumbnail: thumbnail_url ? thumbnail_url : foto_url,
                  id,
                }))
                .flat(1),
            ),
          ];
          setPhotos(data);
          //console.log("productSlider data", data);
        } else {
          console.log("check is " + check);
          setPhotos([]);
        }
      }
    }, [props?.id, props.productItems]);

    const openPhoto = (foto_url) => {
      //console.log(foto_url);
      if (foto_url !== null && foto_url !== undefined) {
        setMainPhoto(foto_url);
      }
    };

    function openImageViewer() {
      if (mainPhoto !== null && mainPhoto !== undefined) {
        navigation.navigate("ImageViewer", {
          disableWatermark: true,
          title: props?.title,
          uri: mainPhoto,
          isSquare: true,
          watermarkData: null,
        });
      }
    }

    return (
      <View style={styles.container}>
        {mainPhoto === null ? null : (
          <TouchableOpacity
            style={styles.containerSlider}
            onPress={() => openImageViewer()}
          >
            <ActivityIndicator size={20 * globalUIRatio} color={colors.daclen_gray} style={styles.spinner} />
            <Image
              style={styles.largeImage}
              source={mainPhoto}
              contentFit="contain"
              placeholder={null}
              transition={100}
            />
          </TouchableOpacity>
        )}

        {photos?.length > 1 ? (
          <View style={styles.containerFlatlist}>
            <FlashList
              estimatedItemSize={10}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={photos}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.containerItem, {
                    marginEnd: index >= photos?.length - 1 ? 0 : 8 * globalUIRatio,
                  }]}
                  onPress={() => openPhoto(item?.img)}
                >
                  <ActivityIndicator size="small" color={colors.daclen_gray} style={styles.spinner} />
                  <Image
                    style={styles.imageList}
                    source={item?.thumbnail}
                    contentFit="contain"
                    placeholder={null}
                    transition={100}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}
      </View>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return null;
  }
}


const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: "transparent",
  },
  containerSlider: {
    backgroundColor: colors.daclen_grey_light,
    width,
    height: width,
    justifyContent: "center",
    alignItems: "center",
  },
  containerFlatlist: {
    width: dimensions.fullWidthAdjusted,
    backgroundColor: colors.white,
    marginVertical: 8 * globalUIRatio,
  },
  containerItem: {
    backgroundColor: colors.daclen_grey_light,
    width: 80 * globalUIRatio,
    height: 80 * globalUIRatio,
    borderRadius: 10 * globalUIRatio,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  largeImage: {
    backgroundColor: "transparent",
    width,
    height: width,
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  image: {
    backgroundColor: "transparent",
  },
  imageList: {
    backgroundColor: colors.daclen_grey_light,
    width: 80 * globalUIRatio,
    height: 80 * globalUIRatio,
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  spinner: {
    backgroundColor: "transparent",
    alignSelf: "center",
    position: "absolute",
    top: (width - 20) / 2,
    bottom: (width - 20) / 2,
    start: (width - 20) / 2,
    height: (width - 20) / 2,
  },
});

const mapStateToProps = (store) => ({
  productItems: store.productState.productItems,
});

export default connect(mapStateToProps, null)(ProductSlider);
