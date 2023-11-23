import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewShot from "react-native-view-shot";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";

import { colors, staticDimensions } from "../../styles/base";
import { sentryLog } from "../../sentry";
import { sharingOptionsJPEG, sharingOptionsPDF } from "../media/constants";
import {
  multiplephotoshtml,
  multiplephotosimgtagcustomwidthheight,
  pdfpageheight,
  pdfpagewidth,
} from "./constants";
import ImageLargeWatermarkModel from "../media/ImageLargeWatermarkModel";
import {
  STARTER_KIT_FLYER_MENGAJAK,
  STARTER_KIT_FLYER_MENGAJAK_TAG,
  STARTER_KIT_FLYER_PRODUK,
  STARTER_KIT_FLYER_PRODUK_TAG,
  videoplayerportraitiosheight,
  videoplayerportraitpanelandroidheight,
} from "../mediakit/constants";
import {
  calculateFlyerDisplayHeight,
  calculateFlyerDisplayWidth,
  calculateResizedImageDimensions,
} from "../mediakit";

const defaultFlyers = [null, null, null];
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const paddingTop = 32;

const previewHeight = screenHeight * 0.8;
const photoWidth = screenWidth - 20;
const photoHeight = previewHeight - paddingTop - 20;
const panelHeight = screenHeight - previewHeight;

const marginTop = 48;
/*const panelHeight =
  Platform.OS === "ios"
    ? videoplayerportraitiosheight
    : videoplayerportraitpanelandroidheight;*/

const FlyerSliderView = (props) => {
  const { currentUser, watermarkData, mediaKitPhotos, flyerMengajak } = props;
  const navigation = useNavigation();
  const refScroll = useRef();
  const imageRef = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState({
    index: 0,
    type: null,
    product: null,
  });
  const [limit, setLimit] = useState(2);
  const [scrollPosition, setScrollPosition] = useState({
    x: screenWidth,
    y: 0,
  });
  const [flyers, setFlyers] = useState(defaultFlyers);

  useEffect(() => {
    if (
      props.route.params?.index === undefined ||
      props.route.params?.index === null ||
      props.route.params?.type === undefined ||
      props.route.params?.type === null
    ) {
      navigation.goBack();
      return;
    }
    setData({
      index: props.route.params?.index ? props.route.params?.index : 0,
      type: props.route.params?.type
        ? props.route.params?.type
        : STARTER_KIT_FLYER_PRODUK_TAG,
      product: props.route.params?.product
        ? props.route.params?.product
        : "Audra",
    });
    console.log("route params", props.route.params);
  }, [props.route.params]);

  useEffect(() => {
    if (data?.type === null) {
      return;
    }
    try {
      if (data?.type === STARTER_KIT_FLYER_PRODUK_TAG) {
        //console.log("mediakitPhotos", mediaKitPhotos);
        props.navigation.setOptions({
          title: data?.product ? data?.product : STARTER_KIT_FLYER_PRODUK,
        });
        let array = mediaKitPhotos[data?.product];
        let limit = array?.length - 1;
        if (data?.index < 1) {
          setFlyers([null, array[0], array[1]]);
        } else if (data?.index >= limit) {
          setFlyers([array[data?.index - 1], array[data?.index], null]);
        } else {
          setFlyers([
            array[data?.index - 1],
            array[data?.index],
            array[data?.index + 1],
          ]);
        }
        setLimit(limit);
      } else if (data?.type === STARTER_KIT_FLYER_MENGAJAK_TAG) {
        props.navigation.setOptions({ title: STARTER_KIT_FLYER_MENGAJAK });
        let limit = flyerMengajak?.length - 1;
        if (data?.index < 1) {
          setFlyers(["", flyerMengajak[0], flyerMengajak[1]]);
        } else if (data?.index >= limit) {
          setFlyers([
            flyerMengajak[data?.index - 1],
            flyerMengajak[data?.index],
            "",
          ]);
        } else {
          setFlyers([
            flyerMengajak[data?.index - 1],
            flyerMengajak[data?.index],
            flyerMengajak[data?.index + 1],
          ]);
        }
        setLimit(limit);
      }
      refScroll.current.scrollTo({ animated: false, x: screenWidth, y: 0 });
    } catch (e) {
      console.error(e);
      setFlyers(defaultFlyers);
    }
  }, [data]);

  useEffect(() => {
    console.log("flyers", flyers);
  }, [flyers]);

  const handleScroll = (event) => {
    let x = event.nativeEvent.contentOffset.x;
    if (
      (data?.index < 1 && x < screenWidth) ||
      (data?.index >= limit && x > screenWidth)
    ) {
      refScroll.current.scrollTo({ animated: true, x: screenWidth, y: 0 });
      return;
    }
    if (x < 1) {
      setData((data) => ({ ...data, index: data?.index - 1 }));
      return;
    }
    if (x >= screenWidth * 2) {
      setData((data) => ({ ...data, index: data?.index + 1 }));
      return;
    }
    setScrollPosition({
      x,
      y: event.nativeEvent.contentOffset.y,
    });
  };

  const goPrev = async () => {
    try {
      refScroll.current.scrollTo({ animated: true, x: 0, y: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const goNext = () => {
    try {
      refScroll.current.scrollTo({ animated: true, x: screenWidth * 2, y: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const transformImage = () => {
    console.log("transformImage");
  };

  const onError = (e) => {
    console.log("Image onError", e);
    setError(
      `Foto tidak bisa diunduh, cek koneksi Internet${
        currentUser?.id === 8054 && Platform.OS !== "web" ? `\n${e?.error}` : ""
      }`,
    );
  };

  /*
<ImageBackground
        source={require("../../assets/profilbg.png")}
        style={styles.background}
        resizeMode="cover"
      />
  */

  return (
    <SafeAreaView style={styles.container}>
      {flyers[1] === null ||
      flyers[1]?.foto === undefined ||
      flyers[1]?.foto === null ||
      watermarkData === undefined ||
      watermarkData === null ? null : (
        <ViewShot
          ref={imageRef}
          options={{
            fileName: `daclenw_${
              flyers[1]?.id ? flyers[1]?.id.toString() : ""
            }`,
            format: "jpg",
            quality: 1,
            result: "tmpfile",
            useRenderInContext: Platform.OS === "ios",
          }}
          style={[
            styles.containerLargeImage,
            {
              width: calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).width,
              height: calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).height,
            },
          ]}
          captureMode=""
        >
          <Image
            source={flyers[1]?.foto}
            style={[
              styles.image,
              {
                width: calculateResizedImageDimensions(
                  flyers[1]?.width,
                  flyers[1]?.height,
                ).width,
                height: calculateResizedImageDimensions(
                  flyers[1]?.width,
                  flyers[1]?.height,
                ).height,
                zIndex: 2,
              },
            ]}
            contentFit="contain"
            placeholder={null}
            transition={0}
            onLoadEnd={() => transformImage()}
            onError={(e) => onError(e)}
          />
          <ImageLargeWatermarkModel
            style={styles.image}
            width={flyers[1]?.width}
            height={flyers[1]?.height}
            displayWidth={
              calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).width
            }
            displayHeight={
              calculateResizedImageDimensions(
                flyers[1]?.width,
                flyers[1]?.height,
              ).height
            }
            uri={null}
            link_x={flyers[1]?.link_x}
            link_y={flyers[1]?.link_y}
            text_x={flyers[1]?.text_x}
            text_y={flyers[1]?.text_y}
            fontSize={
              flyers[1]?.font?.size?.ukuran ? flyers[1]?.font?.size?.ukuran : 48
            }
            watermarkData={watermarkData}
            jenis_foto={data?.type}
            username={currentUser?.name}
          />
        </ViewShot>
      )}

      {error ? (
        <Text
          allowFontScaling={false}
          style={[
            styles.textError,
            success && { backgroundColor: colors.daclen_green },
          ]}
        >
          {error}
        </Text>
      ) : null}

      <ScrollView
        ref={refScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.containerScroll}
        contentContainerStyle={styles.containerInside}
      >
        <View style={styles.containerPhoto}>
          {flyers[0] ? (
            <ImageLargeWatermarkModel
              width={flyers[0]?.width}
              height={flyers[0]?.height}
              displayWidth={calculateFlyerDisplayWidth(
                flyers[0]?.width,
                flyers[0]?.height,
                photoWidth,
                photoHeight,
              )}
              displayHeight={calculateFlyerDisplayHeight(
                flyers[0]?.width,
                flyers[0]?.height,
                photoWidth,
                photoHeight,
              )}
              uri={flyers[0]?.foto}
              link_x={flyers[0]?.link_x}
              link_y={flyers[0]?.link_y}
              text_x={flyers[0]?.text_x}
              text_y={flyers[0]?.text_y}
              fontSize={
                flyers[0]?.font?.size?.ukuran
                  ? flyers[0]?.font?.size?.ukuran
                  : 48
              }
              watermarkData={watermarkData}
              jenis_foto={data?.type}
              username={currentUser?.name}
            />
          ) : null}
        </View>
        <View style={styles.containerPhoto}>
          {flyers[1] ? (
            <ImageLargeWatermarkModel
              width={flyers[1]?.width}
              height={flyers[1]?.height}
              displayWidth={calculateFlyerDisplayWidth(
                flyers[1]?.width,
                flyers[1]?.height,
                photoWidth,
                photoHeight,
              )}
              displayHeight={calculateFlyerDisplayHeight(
                flyers[1]?.width,
                flyers[1]?.height,
                photoWidth,
                photoHeight,
              )}
              uri={flyers[1]?.foto}
              link_x={flyers[1]?.link_x}
              link_y={flyers[1]?.link_y}
              text_x={flyers[1]?.text_x}
              text_y={flyers[1]?.text_y}
              fontSize={
                flyers[1]?.font?.size?.ukuran
                  ? flyers[1]?.font?.size?.ukuran
                  : 48
              }
              watermarkData={watermarkData}
              jenis_foto={data?.type}
              username={currentUser?.name}
            />
          ) : null}
        </View>
        <View style={styles.containerPhoto}>
          {flyers[2] ? (
            <ImageLargeWatermarkModel
              width={flyers[2]?.width}
              height={flyers[2]?.height}
              displayWidth={calculateFlyerDisplayWidth(
                flyers[2]?.width,
                flyers[2]?.height,
                photoWidth,
                photoHeight,
              )}
              displayHeight={calculateFlyerDisplayHeight(
                flyers[2]?.width,
                flyers[2]?.height,
                photoWidth,
                photoHeight,
              )}
              uri={flyers[2]?.foto}
              link_x={flyers[2]?.link_x}
              link_y={flyers[2]?.link_y}
              text_x={flyers[2]?.text_x}
              text_y={flyers[2]?.text_y}
              fontSize={
                flyers[2]?.font?.size?.ukuran
                  ? flyers[2]?.font?.size?.ukuran
                  : 48
              }
              watermarkData={watermarkData}
              jenis_foto={data?.type}
              username={currentUser?.name}
            />
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.containerPanel}></View>
      {data?.index < 1 ? null : (
        <TouchableOpacity style={styles.containerPrev} onPress={() => goPrev()}>
          <MaterialCommunityIcons
            name="arrow-left-drop-circle"
            size={32}
            color={colors.daclen_gray}
            style={styles.arrow}
          />
        </TouchableOpacity>
      )}

      {data?.index >= limit ? null : (
        <TouchableOpacity style={styles.containerNext} onPress={() => goNext()}>
          <MaterialCommunityIcons
            name="arrow-right-drop-circle"
            size={32}
            color={colors.daclen_gray}
            style={styles.arrow}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerLargeImage: {
    flex: 1,
    backgroundColor: colors.white,
    overflow: "visible",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: -1,
    opacity: 100,
  },
  containerPrev: {
    position: "absolute",
    zIndex: 99,
    opacity: 0.5,
    width: 32,
    height: 32,
    start: 12,
    top: (previewHeight - 32) / 2,
    backgroundColor: "transparent",
  },
  containerNext: {
    position: "absolute",
    zIndex: 99,
    opacity: 0.5,
    width: 32,
    height: 32,
    start: screenWidth - 44,
    top: (previewHeight - 32) / 2,
    backgroundColor: "transparent",
  },
  containerScroll: {
    zIndex: 3,
    width: screenWidth,
    flex: previewHeight,
    backgroundColor: "transparent",
  },
  containerInside: {
    paddingTop,
    width: screenWidth * 3,
    height: previewHeight,
    backgroundColor: "transparent",
  },
  containerPhoto: {
    backgroundColor: "transparent",
    width: screenWidth,
    height: previewHeight - paddingTop,
    justifyContent: "center",
    alignItems: "center",
  },
  containerPanel: {
    zIndex: 3,
    width: screenWidth,
    height: panelHeight,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: screenWidth,
    height: screenHeight,
  },
  image: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    zIndex: 4,
    overflow: "visible",
  },
  textError: {
    width: "100%",
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 4,
  },
  arrow: {
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  watermarkData: store.mediaKitState.watermarkData,
  mediaKitPhotos: store.mediaKitState.photos,
  flyerMengajak: store.mediaKitState.flyerMengajak,
});

export default connect(mapStateToProps, null)(FlyerSliderView);
