import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  pickImage,
  setMediaProfilePicture,
  setImagePickerPermissionRejected,
  sendProfilePhotoUnusable,
  sendProfilePhotoImagePickerFail,
  getFileSizeAsync,
} from "../media";

import { colors, dimensions } from "../../styles/base";
import { useNavigation } from "@react-navigation/native";
import {
  FILE_OVERSIZE,
  imagepickernocameralrollmessage,
  imagepickernopermissionmessage,
  IMAGE_PICKER_ERROR,
  IMAGE_PICKER_NO_PERMISSION,
  MAXIMUM_FILE_SIZE_IN_BYTES,
} from "../media/constants";

function BSMedia(props) {
  const navigation = useNavigation();

  function openCamera() {
    props?.closeThis();
    navigation.navigate("CameraView", { key: props?.mediaKey });
  }

  const openImagePicker = async () => {
    props?.closeThis();
    const uri = await pickImage();
    if (props?.mediaKey === "profilePicture") {
      if (uri === undefined || uri === null) {
        return;
      } else if (uri === IMAGE_PICKER_NO_PERMISSION) {
        props.sendProfilePhotoImagePickerFail(
          Platform.OS === "ios"
            ? imagepickernocameralrollmessage
            : Platform.OS === "android"
            ? imagepickernopermissionmessage
            : ""
        );
        return;
      } else if (uri === IMAGE_PICKER_ERROR) {
        props.sendProfilePhotoImagePickerFail("");
        return;
      } else if (uri === FILE_OVERSIZE) {
        props.sendProfilePhotoUnusable(true);
      } else {
        if (Platform.OS !== "web") {
          let fileInfoSize = await getFileSizeAsync(uri);
          if (fileInfoSize === undefined || fileInfoSize === null) {
            props.sendProfilePhotoUnusable(false);
            return;
          }
          if (fileInfoSize >= MAXIMUM_FILE_SIZE_IN_BYTES) {
            props.sendProfilePhotoUnusable(true);
            return;
          }
        }
        props.setMediaProfilePicture(uri, props.currentUser?.id);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text style={styles.textTitle}>{props?.title}</Text>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => props?.closeThis()}
        >
          <MaterialCommunityIcons name="chevron-down" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerVertical}>
        <TouchableOpacity
          onPress={() => openCamera()}
          style={[
            styles.button,
            {
              backgroundColor: props?.disabled
                ? colors.daclen_gray
                : colors.daclen_blue,
            },
          ]}
          disabled={props?.disabled}
        >
          <MaterialCommunityIcons name="camera" size={18} color="white" />
          <Text style={styles.textButton}>Ambil dari Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openImagePicker()}
          style={[
            styles.button,
            {
              backgroundColor: props?.disabled
                ? colors.daclen_gray
                : colors.daclen_green,
            },
          ]}
          disabled={props?.disabled}
        >
          <MaterialCommunityIcons name="camera-burst" size={18} color="white" />
          <Text style={styles.textButton}>Unggah dari Galeri</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props?.closeThis()}
          style={styles.button}
        >
          <Text style={[styles.textButton, { marginStart: 0 }]}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: dimensions.fullWidth,
    flex: 1,
    backgroundColor: colors.daclen_light,
    borderTopWidth: 2,
    borderTopColor: colors.daclen_gray,
    elevation: 10,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.daclen_black,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  containerVertical: {
    flex: 1,
    backgroundColor: colors.daclen_light,
    padding: 12,
  },
  icon: {
    backgroundColor: colors.daclen_black,
  },
  textTitle: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
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
    backgroundColor: colors.daclen_red,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginStart: 16,
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
      setImagePickerPermissionRejected,
      sendProfilePhotoUnusable,
      sendProfilePhotoImagePickerFail,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(BSMedia);
