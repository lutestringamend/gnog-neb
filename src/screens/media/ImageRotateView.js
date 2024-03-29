import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
//import { Asset } from "expo-asset";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions } from "../../../styles/base";
import { sentryLog } from "../../../sentry";
import {
  setMediaProfilePicture,
  sendProfilePhotoUnusable,
  sendProfilePhotoCameraFail,
  getFileSizeAsync,
  prepareRatio,
} from "../../../components/media";
import { MAXIMUM_FILE_SIZE_IN_BYTES } from "../../../components/media/constants";
import CenteredView from "../../components/view/CenteredView";
import AlertBox from "../../components/alert/AlertBox";

const maxWidth = dimensions.fullWidth - 24;

const ImageRotateView = (props) => {
  const { currentUser, profilePicture } = props;
  const { key } = props.route.params;
  const navigation = useNavigation();

  const [data, setData] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      props.route.params?.data === undefined ||
      props.route.params?.data === null ||
      props.route.params?.data?.uri === undefined ||
      props.route.params?.data?.uri === null
    ) {
      return;
    }
    rotateImage(props.route.params?.data, 360);

    /*if (Platform.OS === "web") {
      let report = {
        ...props.route.params?.data,
        uri: "",
        base64: "",
      };
      setError(JSON.stringify(report));
    }*/
  }, [props.route.params]);

  useEffect(() => {
    if (processing) {
      /*if (Platform.OS === "web") {
        let report = {
          ...data,
          uri: "",
          base64: "",
        };
        setError(JSON.stringify(report));
      }*/
      setProcessing(false);
    }
    if (flipping) {
      setFlipping(false);
    }
    console.log("data", data);
  }, [data]);

  const onImageError = (e) => {
    console.error(e);
    sentryLog(e);
    setError(e?.toString());
  };

  const rotateImage = async (data, rotate) => {
    setProcessing(true);
    try {
      const manipResult = await manipulateAsync(data?.uri, [{ rotate }], {
        compress: 1,
        format: SaveFormat.JPEG,
      });
      let exif = manipResult?.exif
        ? manipResult?.exif
        : data?.exif
        ? data?.exif
        : null;
      setData({
        ...manipResult,
        exif: {
          ...exif,
          orientation: 0,
          width: manipResult?.width,
          height: manipResult?.height,
        },
      });
    } catch (e) {
      onImageError(e);
      setProcessing(false);
    }
  };

  const flipImage = async (data) => {
    setFlipping(true);
    try {
      const manipResult = await manipulateAsync(
        data?.uri,
        [{ flip: FlipType.Horizontal }],
        {
          compress: 1,
          format: SaveFormat.JPEG,
        }
      );
      let exif = manipResult?.exif
        ? manipResult?.exif
        : data?.exif
        ? data?.exif
        : null;
      setData({
        ...manipResult,
        exif: {
          ...exif,
          orientation: 0,
          width: manipResult?.width,
          height: manipResult?.height,
        },
      });
    } catch (e) {
      onImageError(e);
      setFlipping(false);
    }
  };

  const saveImage = async () => {
    if (key === "profilePicture") {
      if (data === null || data?.uri === undefined || data?.uri === null) {
        props.sendProfilePhotoCameraFail("");
      } else {
        let fileInfoSize =
          Platform.OS === "web" ? null : await getFileSizeAsync(data?.uri);
        if (
          Platform.OS !== "web" &&
          (fileInfoSize === undefined || fileInfoSize === null)
        ) {
          props.sendProfilePhotoUnusable(false);
        } else if (
          Platform.OS !== "web" &&
          fileInfoSize >= MAXIMUM_FILE_SIZE_IN_BYTES
        ) {
          props.sendProfilePhotoUnusable(true);
        } else {
          props.setMediaProfilePicture(data?.uri, currentUser?.id);
        }
      }
    }
    navigation.pop(2);
  };

  return (
    <CenteredView style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.daclen_light}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.textHeader}>
          Edit Foto
        </Text>
        {data === null ||
        data?.uri === undefined ||
        data?.uri === null ||
        disabled ? null : (
          <View style={styles.containerHorizontal}>
            <TouchableOpacity
              style={styles.containerIcon}
              onPress={() => rotateImage(data, -90)}
            >
              {processing ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_light}
                  style={styles.icon}
                />
              ) : (
                <MaterialCommunityIcons
                  name="rotate-left"
                  size={24}
                  color={colors.daclen_light}
                  style={styles.icon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.containerIcon}
              onPress={() => flipImage(data)}
            >
              {flipping ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_light}
                  style={styles.icon}
                />
              ) : (
                <MaterialCommunityIcons
                  name="flip-horizontal"
                  size={24}
                  color={colors.daclen_light}
                  style={styles.icon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => saveImage()}
              disabled={processing || flipping}
              style={styles.containerSave}
            >
              <Text style={styles.textSave}>SIMPAN</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
      >
        {data === null || data?.uri === undefined || data?.uri === null ? (
          <ActivityIndicator
            size="large"
            color={colors.daclen_gray}
            style={styles.icon}
          />
        ) : (
          <Image
            source={data?.uri}
            style={[
              styles.image,
              {
                width: data?.width > maxWidth ? maxWidth : data?.width,
                height:
                  data?.width > maxWidth
                    ? (data?.height * maxWidth) / data?.width
                    : data?.height,
              },
            ]}
            contentFit="cover"
            placeholder={null}
            transition={0}
            onLoadEnd={() => setDisabled(false)}
            onError={(e) => onImageError(e)}
          />
        )}
      </ScrollView>
      <AlertBox error={error} onClose={() => setError(null)} />
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.black,
  },
  containerScroll: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_black,
    elevation: 4,
    borderBottomWidth: 1,
    borderColor: colors.daclen_light,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerSave: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerIcon: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 20,
  },
  image: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  icon: {
    backgroundColor: "transparent",
    alignSelf: "center",
    width: 24,
    height: 24,
  },
  arrow: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginHorizontal: 20,
    color: colors.daclen_light,
    alignSelf: "center",
    flex: 1,
  },
  textSave: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.daclen_light,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_danger,
    textAlign: "center",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  profilePicture: store.mediaState.profilePicture,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      setMediaProfilePicture,
      sendProfilePhotoUnusable,
      sendProfilePhotoCameraFail,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(ImageRotateView);
