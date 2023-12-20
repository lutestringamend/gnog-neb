import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
//import { ImageSlider } from "react-native-image-slider-banner";

import { connect } from "react-redux";
import { colors, blurhash } from "../../styles/base";
import { dimensions } from "../../styles/base";
import { sentryLog } from "../../sentry";

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
            <ActivityIndicator size="large" color={colors.daclen_gray} style={styles.spinner} />
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
              horizontal={true}
              data={photos}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.containerItem}
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

/*
{mainPhoto ? (
          
        ) : (
          <ImageSlider
            data={photos}
            autoPlay={true}
            caroselImageContainerStyle={{ aspectRatio }}
            caroselImageStyle={{
              width: "100%",
              height: "100%" / aspectRatio,
              resizeMode: "contain",
            }}
            indicatorContainerStyle={{ bottom: 10 }}
            activeIndicatorStyle={{ backgroundColor: colors.daclen_orange }}
            inActiveIndicatorStyle={{ backgroundColor: colors.daclen_light }}
            timer={3000}
            onClick={(item) => openProduct(item?.id)}
            style={{ margin: 0, padding: 0, width: "100%" }}
          />
        )}
*/

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  containerSlider: {
    backgroundColor: colors.white,
    width: dimensions.fullWidth,
    height: dimensions.fullWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  containerFlatlist: {
    width: "100%",
    paddingVertical: 1,
    borderColor: colors.daclen_gray,
    backgroundColor: colors.daclen_light,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 2,
  },
  containerItem: {
    backgroundColor: colors.white,
    width: 60,
    height: 60,
    borderColor: colors.daclen_lightgrey,
    borderStartWidth: 1,
    borderEndWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  largeImage: {
    backgroundColor: "transparent",
    width: dimensions.fullWidth,
    height: dimensions.fullWidth,
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  image: {
    backgroundColor: "transparent",
  },
  imageList: {
    width: 60,
    height: 60,
    backgroundColor: colors.white,
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  spinner: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

const mapStateToProps = (store) => ({
  productItems: store.productState.productItems,
});

export default connect(mapStateToProps, null)(ProductSlider);
