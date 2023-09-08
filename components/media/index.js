import { Camera, ImageType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Dimensions, Platform } from "react-native";
import { getInfoAsync } from "expo-file-system";

import {
  MEDIA_PROFILE_PICTURE_STATE_CHANGE,
  MEDIA_DOWNLOAD_STATE_CHANGE,
  MEDIA_CLEAR_DATA,
  USER_UPDATE_STATE_CHANGE,
  MEDIA_WATERMARK_LAYOUT_STATE_CHANGE,
  MEDIA_WATERMARK_VIDEOS_STATE_CHANGE,
  MEDIA_WATERMARK_VIDEOS_OVERWRITE,
} from "../../redux/constants";
import {
  bigmediafileerror,
  camerafail,
  CAMERA_COMPRESSION_QUALITY,
  CAMERA_NO_PERMISSION,
  DEFAULT_ANDROID_CAMERA_RATIO,
  FILE_OVERSIZE,
  imagepickerfail,
  IMAGE_PICKER_ERROR,
  IMAGE_PICKER_NO_PERMISSION,
  MAXIMUM_FILE_SIZE_IN_BYTES,
  mediafileunusable,
  PICKER_COMPRESSION_QUALITY,
} from "./constants";
import { sentryLog } from "../../sentry";

export const intiialPermissions = {
  cameraPermission: null,
  storagePermission: null,
};

export const foto = {
  uri: "",
  type: "",
  name: "",
};

export function setSkipWatermarkFFMPEGCommand(
  sourceVideo,
  resultVideo
) {
  return `-y -i ${sourceVideo} ${resultVideo}`;
}

export function setBasicFFMPEGCommand(
  sourceVideo,
  watermarkFile,
  resultVideo,
  filter,
  width,
  height
) {
  // -scale=${width ? width.toString() : "720"}:${height ? height.toString() : "1280"},setsar=1:1   
  //-movflags faststart
  //-movflags use_metadata_tags
  //-map_metadata 0
  //-profile:v baseline -level 4.0 -pix_fmt yuv420p -movflags faststart -map_metadata 0
  //${filter} 
  //-metadata:s:v:0 rotate=90
  //-vcodec libx264 -acodec aac 
  //-vf scale="${width ? width.toString() : "720"}:-1" 
  //-vf 'transpose=1' -metadata:s:v:0 rotate=0 -profile:v baseline -codec copy
  //${width < height ? `-map_metadata 0 -metadata:s:v:0 rotate=90 -vf 'transpose=1'` : ""} 720 1080
  //-vf scale=${width < height ? "720:1080" : "1080:720"}
  //-vtag avc1 
  //-profile:v baseline -level 4.0 -pix_fmt yuv420p -preset ultrafast
  
  return `-y -i ${sourceVideo} -i ${watermarkFile} ${filter} -profile:v baseline -preset ultrafast -level 4.0 -pix_fmt yuv420p ${resultVideo}`;
}

export function setFilterFFMPEG(flag, paddingX, paddingY) {
  let filterComplex = "";
  switch (flag) {
    case "bottom-left":
      filterComplex = `overlay=x=${paddingX}:y=(main_h-overlay_h-${paddingY})`;
      break;
    case "top-left":
      filterComplex = `overlay=x=${paddingX}:y=${paddingY}`;
      break;
    case "top-right":
      filterComplex = `overlay=x=(main_w-overlay_w-${paddingX}):y=${paddingY}`;
      break;
    case "center":
      filterComplex = `overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2`;
      break;
    default:
      filterComplex = `overlay=x=(main_w-overlay_w-${paddingX}):y=(main_h-overlay_h-${paddingY})`;
      break;
  }
  return `-filter_complex "${filterComplex}"`;
}

export function setFFMPEGCommand(
  sourceVideo,
  watermarkFile,
  resultVideo,
  flag,
  paddingX,
  paddingY,
  width,
  height,
) {
  return setBasicFFMPEGCommand(
    sourceVideo,
    watermarkFile,
    resultVideo,
    setFilterFFMPEG(flag, paddingX, paddingY),
    width,
    height,
  );
}

export function clearMediaData() {
  return (dispatch) => {
    console.log("clearMediaData");
    dispatch({ type: MEDIA_CLEAR_DATA });
  };
}

export function overwriteWatermarkVideos(data) {
  return (dispatch) => {
    console.log("overwriteWatermarkVideos", data);
    dispatch({ type: MEDIA_WATERMARK_VIDEOS_OVERWRITE, data });
  };
}

export function updateWatermarkVideo(id, rawUri, uri) {
  return (dispatch) => {
    const data = { id, rawUri, uri };
    console.log("updateWatermarkVideo", data);
    dispatch({
      type: MEDIA_WATERMARK_VIDEOS_STATE_CHANGE,
      data,
      id,
      rawUri,
      uri,
    });
  };
}

export function updateWatermarkLayout(data) {
  return (dispatch) => {
    console.log("updateWatermarkLayout", data);
    dispatch({ type: MEDIA_WATERMARK_LAYOUT_STATE_CHANGE, data });
  };
}

export function setPhotoDownloadState(data) {
  return (dispatch) => {
    console.log("setPhotoDownloadState");
    dispatch({ type: MEDIA_DOWNLOAD_STATE_CHANGE, data });
  };
}

export function setMediaProfilePicture(data, userId) {
  return (dispatch) => {
    console.log("setMediaProfilePicture", userId);
    dispatch({ type: MEDIA_PROFILE_PICTURE_STATE_CHANGE, data });
  };
}

export function setImagePickerPermissionRejected() {
  return (dispatch) => {
    console.log("setImagePickerPermissionRejected");
    dispatch({
      type: USER_UPDATE_STATE_CHANGE,
      data: {
        session: "",
        message: "Anda tidak memberikan izin untuk mengakses penyimpanan",
      },
    });
  };
}

export const takePicture = async (ref) => {
  try {
    let { cameraPermission } = await checkMediaPermissions();
    if (!cameraPermission) {
      return CAMERA_NO_PERMISSION;
    }

    if (ref) {
      const options = {
        quality: CAMERA_COMPRESSION_QUALITY,
        base64: true,
        imageType: ImageType.jpg,
        exif: true,
        skipProcessing: false,
      };
      console.log("takePicture", options);
      const picture = await ref.takePictureAsync(options);
      //console.log(picture);
      return picture?.uri;
    } else {
      console.error("ref error", ref);
    }
  } catch (error) {
    console.error(error);
    sentryLog(error);
  }
  console.log("takePicture returning null");
  return null;
};

export function getFileName(uri) {
  try {
    const uriSplit = uri.split("/");
    return uriSplit[uriSplit.length - 1];
  } catch (e) {
    console.error(e);
    return "video.mp4";
  }
}

export const prepareRatio = async (ref) => {
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;

  let ratios = [];
  let desiredRatio = DEFAULT_ANDROID_CAMERA_RATIO;
  let remainder = 0;
  let errorMessage = "";
  try {
    ratios = await ref.getSupportedRatiosAsync();
    if (
      ratios === undefined ||
      ratios === null ||
      ratios?.length === undefined ||
      ratios?.length < 1
    ) {
      return {
        ratio: desiredRatio,
        imagePadding: remainder,
        errorMessage: "no supported ratios",
      };
    }
    let distances = {};
    let realRatios = {};
    let minDistance = null;
    for (const ratio of ratios) {
      const parts = ratio.split(":");
      const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
      realRatios[ratio] = realRatio;
      const distance = screenRatio - realRatio;
      distances[ratio] = realRatio;
      if (minDistance == null) {
        minDistance = ratio;
      } else {
        if (distance >= 0 && distance < distances[minDistance]) {
          minDistance = ratio;
        }
      }
    }

    desiredRatio = minDistance;
    remainder = Math.floor((height - realRatios[desiredRatio] * width) / 2);
  } catch (error) {
    console.error(error);
    errorMessage = error.message;
    sentryLog(error);
  }

  return { ratios, ratio: desiredRatio, imagePadding: remainder, errorMessage };
};

export function processExpoImagePickerUri(result) {
  let newFoto = foto;
  try {
    newFoto = {
      uri:
        Platform.OS === "ios"
          ? result?.uri.replace("file://", "")
          : result?.uri,
      type: result?.type,
      name: result?.fileName,
    };
  } catch (e) {
    console.log(e);
  }

  return newFoto;
}

export function getMimeType(dataURI) {
  try {
    if (Platform.OS === "web") {
      const splitDataURI = dataURI.split(",");
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
      return mimeString;
    } else {
      const splitDataURI = dataURI.split(".");
      const lastIndex = splitDataURI[splitDataURI.length - 1];
      if (lastIndex.substring(0, 3) === "png") {
        return "image/png";
      } else {
        return "image/jpeg";
      }
    }
  } catch (e) {
    console.log(e);
    return "";
  }
}

export function sendProfilePhotoCameraFail(message) {
  console.log("sendProfilePhotoCameraFail");
  return (dispatch) => {
    dispatch({
      type: USER_UPDATE_STATE_CHANGE,
      data: {
        session: "photoError",
        message: `${camerafail}${message ? message : ""}`,
      },
    });
  };
}

export function sendProfilePhotoImagePickerFail(message) {
  console.log("sendProfilePhotoImagePickerFail");
  return (dispatch) => {
    dispatch({
      type: USER_UPDATE_STATE_CHANGE,
      data: {
        session: "photoError",
        message: `${imagepickerfail}${message ? message : ""}`,
      },
    });
  };
}

export function sendProfilePhotoUnusable(isBigSize) {
  console.log("sendProfilePhotoUnusable", { isBigSize });
  return (dispatch) => {
    dispatch({
      type: USER_UPDATE_STATE_CHANGE,
      data: {
        session: "photoError",
        message: isBigSize ? bigmediafileerror : mediafileunusable,
      },
    });
  };
}

export function getProfilePictureName(userId, mimeType, uri) {
  if (Platform.OS === "web") {
    let extension = mimeType === "image/png" ? "png" : "jpg";
    return `user_${userId.toString()}_photo.${extension}`;
  } else {
    try {
      const splitDataURI = uri.split("/");
      return splitDataURI[splitDataURI.length - 1];
    } catch (e) {
      console.log(e);
      return "";
    }
  }
}

export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

export function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], {
    type: mimeString,
  });
}

export function calculateBase64SizeInBytes(uri) {
  try {
    const byteString = uri.split(",")[1];
    const length = byteString.length;
    let size = Math.ceil(length / 4) * 3;
    let padding = 0;
    if (byteString.substring(length - 3, length - 1) === `==`) {
      padding = 2;
    } else if (byteString.substring(length - 2, length - 1) === `=`) {
      padding = 1;
    }
    console.log({ size, padding });
    size -= padding;
    return size;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const getFileSizeAsync = async (uri) => {
  try {
    let fileInfo = await getInfoAsync(uri);
    return fileInfo?.size;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const pickImage = async () => {
  try {
    let { status } = await checkStoragePermission();
    if (status === "denied") {
      return IMAGE_PICKER_NO_PERMISSION;
    } else if (status === "undetermined") {
      console.log("reattempt requestMediaLibraryPermissionAsync");
      let newRequest = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (newRequest?.status !== "granted") {
        return IMAGE_PICKER_NO_PERMISSION;
      }
    }

    let data = null;
    let result = null;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: PICKER_COMPRESSION_QUALITY,
        allowsMultipleSelection: false,
      });
    } catch (e) {
      console.error(e);
      return IMAGE_PICKER_ERROR;
    }

    if (result === null || result?.cancelled) {
      return null;
    } else if (!result.cancelled) {
      console.log("result", result);
      data = processExpoImagePickerUri(result?.uri ? result : result.assets[0]);
      /*if (Platform.OS === "ios") {
        if (data?.fileSize !== undefined && data?.fileSize !== null) {
          return null;
        } else if (data?.fileSize >= MAXIMUM_FILE_SIZE_IN_BYTES) {
          return FILE_OVERSIZE;
        }
      }*/
      console.log(data);
      return data?.uri;
    } else {
      return IMAGE_PICKER_ERROR;
    }
  } catch (error) {
    console.error(error);
    sentryLog(error);
    return IMAGE_PICKER_ERROR;
  }
};

/*export const checkAndroidStoragePermission = async () => {
  try {
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    return permissions;
  } catch (e) {
    return e.message;
  }

  let result = {
    granted: false,
    uri: null,
    files: null
  }

  if (permissions.granted) {
    const uri = permissions.directoryUri;
    const files = await StorageAccessFramework.readDirectoryAsync(uri);
    result = {
      granted: true,
      uri,
      files
    };
    //alert(`Files inside ${uri}:\n\n${JSON.stringify(files)}`);
  } else {
    result = {
      granted: false,
      permissions
    }
  }

  return result;
};*/

export const checkCameraPermission = async () => {
  const permission = await Camera.getCameraPermissionsAsync();
  console.log("camera permission", permission);
  return {
    status: permission?.status,
    canAskAgain: permission?.canAskAgain,
  };
};

export const checkStoragePermission = async () => {
  const permission = await ImagePicker.getMediaLibraryPermissionsAsync(true);
  console.log("storage permission", permission);
  return {
    status: permission?.status,
    canAskAgain: permission?.canAskAgain,
  };
};

export const checkMediaPermissions = async () => {
  let cameraPermission = null;
  let storagePermission = null;
  const deviceCameraPermission = await checkCameraPermission();
  //console.log(deviceCameraPermission);
  if (
    deviceCameraPermission?.status !== "granted" &&
    deviceCameraPermission?.canAskAgain
  ) {
    console.log("requestCameraPermissionsAsync");
    const { status } = await Camera.requestCameraPermissionsAsync();
    cameraPermission = status === "granted";
  } else {
    cameraPermission = true;
  }

  const deviceStoragePermission = await checkStoragePermission();
  if (
    deviceStoragePermission?.status !== "granted" &&
    deviceStoragePermission.canAskAgain
  ) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    storagePermission = status === "granted";
  } else {
    storagePermission = true;
  }

  return {
    cameraPermission,
    storagePermission,
  };
};
