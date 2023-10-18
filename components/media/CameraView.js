import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  ToastAndroid,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  checkCameraPermission,
  takePicture,
  setMediaProfilePicture,
  sendProfilePhotoUnusable,
  sendProfilePhotoCameraFail,
  getFileSizeAsync,
  prepareRatio,
} from ".";
import { colors, dimensions } from "../../styles/base";
import { useNavigation } from "@react-navigation/native";
import {
  camerafail,
  cameranopermissionmessage,
  CAMERA_NO_PERMISSION,
  DEFAULT_ANDROID_CAMERA_RATIO,
  MAXIMUM_FILE_SIZE_IN_BYTES,
} from "./constants";

//const { height, width } = Dimensions.get("window");

function CameraView(props) {
  const [type, setType] = useState(CameraType.back);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [permission, setPermission] = useState(null);
  const [loadingText, setLoadingText] = useState(null);
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState(DEFAULT_ANDROID_CAMERA_RATIO);

  const ref = useRef();
  const navigation = useNavigation();
  const key = props.route.params?.key;

  useEffect(() => {
    const resetCameraPermission = async () => {
      let newPermission = await checkCameraPermission();
      setPermission(newPermission);
    };

    console.log({ permission });
    if (permission === null) {
      resetCameraPermission();
    } else if (permission?.status === "undetermined") {
      startRecheckingPermissions();
    }
  }, [permission]);

  useEffect(() => {
    const getAvailableRatios = async () => {
      try {
        const cameraAnalysis = await prepareRatio(ref.current);
        setRatio(cameraAnalysis?.ratio);
        setImagePadding(cameraAnalysis?.imagePadding);
        if (props.currentUser?.id === 8054) {
          ToastAndroid.show(JSON.stringify(cameraAnalysis), ToastAndroid.LONG);
        }
        setLoadingText(null);
      } catch (e) {
        console.log(e);
        setLoadingText(e?.message);
      }
    };

    if (Platform.OS === "android" && ready) {
      getAvailableRatios();
    } else {
      setLoadingText(null);
    }
  }, [ready, props.currentUser]);

  const startRecheckingPermissions = async () => {
    console.log("startRecheckingPermissions");
    await Camera.requestCameraPermissionsAsync();
    setPermission(null);
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function onCameraReady() {
    setReady(true);
  }

  const snap = async () => {
    setCapturing(true);
    try {
      const rawResult = await takePicture(ref.current);
      const rotate = await manipulateAsync(rawResult?.uri, [
        {
          rotate: rawResult?.exif
            ? rawResult?.exif?.orientation
              ? rawResult?.exif?.orientation
              : 0
            : 0,
        },
      ]);
      const uri = rotate?.uri;
      console.log("CameraView snap", { rawResult, uri, key });

      if (key === "profilePicture") {
        if (uri === null || uri === undefined) {
          props.sendProfilePhotoCameraFail("");
          navigation.goBack();
          return;
        } else if (uri === CAMERA_NO_PERMISSION) {
          props.sendProfilePhotoCameraFail(cameranopermissionmessage);
          navigation.goBack();
          return;
        }

        if (Platform.OS !== "web") {
          let fileInfoSize = await getFileSizeAsync(uri);

          if (Platform.OS === "android" && props.currentUser?.id === 8054) {
            ToastAndroid.show(
              `cameraview uri ${uri}\nsize ${fileInfoSize.toString()}`,
              ToastAndroid.LONG
            );
          }

          if (fileInfoSize === undefined || fileInfoSize === null) {
            props.sendProfilePhotoUnusable(false);
            navigation.goBack();
            return;
          }
          if (fileInfoSize >= MAXIMUM_FILE_SIZE_IN_BYTES) {
            props.sendProfilePhotoUnusable(true);
            navigation.goBack();
            return;
          }
        }
        props.setMediaProfilePicture(uri, props.currentUser?.id);
      }
    } catch (e) {
      console.error(e);
      if (Platform.OS === "android") {
        ToastAndroid.show(`${camerafail}${e?.message}`, ToastAndroid.LONG);
      }
      if (key === "profilePicture") {
        props.sendProfilePhotoCameraFail(e?.message);
      }
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {permission === null ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_gray}
          style={{ alignSelf: "center" }}
        />
      ) : permission?.status !== "granted" ? (
        <View style={styles.containerPermission}>
          <Text allowFontScaling={false} style={styles.text}>
            {permission?.status === "denied"
              ? "Anda telah menolak memberikan izin akses kamera\nMohon buka manajemen aplikasi di pengaturan HP Anda dan berikan izin"
              : "Mohon berikan izin akses kamera"}
          </Text>
          {permission?.status !== "granted" ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => startRecheckingPermissions()}
            >
              <Text allowFontScaling={false} style={styles.textButton}>
                Minta Izin
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : Platform.OS === "android" ? (
        <Camera
          ref={ref}
          type={type}
          style={[
            styles.camera,
            { marginTop: imagePadding, marginBottom: imagePadding },
          ]}
          onCameraReady={onCameraReady}
          ratio={ratio}
        />
      ) : (
        <Camera
          ref={ref}
          type={type}
          style={styles.camera}
          onCameraReady={onCameraReady}
        />
      )}

      {loadingText ? (
        <Text allowFontScaling={false} style={styles.textDebug}>
          {loadingText}
        </Text>
      ) : null}

      {capturing || !ready ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={styles.containerBottomSpinner}
        />
      ) : (
        <TouchableHighlight
          style={styles.containerCapture}
          underlayColor={colors.daclen_orange}
          onPress={() => snap()}
        >
          <MaterialCommunityIcons
            name="camera"
            size={54}
            color={colors.daclen_light}
          />
        </TouchableHighlight>
      )}

      {capturing ? null : (
        <TouchableOpacity
          style={styles.containerBack}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left-bold-circle"
            size={40}
            color={colors.daclen_light}
          />
        </TouchableOpacity>
      )}

      {ready && !capturing && Platform.OS !== "web" && (
        <TouchableOpacity
          style={styles.containerFlip}
          onPress={toggleCameraType}
        >
          <MaterialCommunityIcons
            name="camera-flip"
            size={40}
            color={
              type === CameraType.back
                ? colors.daclen_light
                : colors.daclen_blue
            }
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  containerPermission: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.daclen_black,
    padding: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  containerBack: {
    position: "absolute",
    top: 20,
    start: 20,
    elevation: 2,
  },
  containerFlip: {
    position: "absolute",
    top: 20,
    end: 20,
    elevation: 2,
  },
  containerBottomSpinner: {
    alignSelf: "center",
    elevation: 6,
    position: "absolute",
    bottom: 36,
  },
  containerCapture: {
    width: 90,
    height: 90,
    position: "absolute",
    bottom: 36,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
    borderWidth: 4,
    borderColor: colors.daclen_light,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.white,
  },
  text: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
    textAlign: "center",
    padding: 20,
  },
  textDebug: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: colors.daclen_danger,
    paddingVertical: 10,
    paddingHorizontal: 32,
    color: colors.white,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    elevation: 10,
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

export default connect(mapStateToProps, mapDispatchProps)(CameraView);
