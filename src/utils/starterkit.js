import { Platform } from "react-native";
import { pdfpagewidth } from "../constants/imageviewer";
import { MEDIA_KIT_HOME_STATE_CHANGE } from "../redux/constants";
import { checkNumberEmpty } from "../axios/cart";
import { mainhttp } from "../axios/constants";

export function updateReduxMediaKitHome(data) {
  return (dispatch) => {
    console.log("updateReduxMediaKitHome", data);
    dispatch({ type: MEDIA_KIT_HOME_STATE_CHANGE, data });
  };
}

export const processThumbnailUrl = (url) => {
  try {
    if (!url.includes(mainhttp)) {
      return `${mainhttp}${url}`;
    }
  } catch (e) {
    console.error(e);
  }
  return url;
}

export const processStarterKitHome = (name, list) => {
  let numItems = 0;
  let photos = [];
  try {
    for (let i = 0; i < list?.length; i++) {
      if (photos?.length < 8 && list[i]?.thumbnails?.length > 0) {
        if (list?.length > 1) {
          photos.push({
            index: photos?.length,
            thumbnail: processThumbnailUrl(list[i]?.thumbnails[0]?.thumbnail),
          });
        } else {
          for (let t of list[i]?.thumbnails) {
            if (photos?.length < 8) {
              photos.push({
                index: photos?.length,
                thumbnail: processThumbnailUrl(t?.thumbnail),
              })
            }
          }
        }
      }
      numItems += checkNumberEmpty(list[i]?.jumlah_item);
    }
  } catch (e) {
    console.error(e);
  }
  return {
    title: name,
    numItems,
    photos,
    selected: null,
  };
}

export const calculateResizedImageDimensions = (width, height) => {
    if (Platform.OS !== "ios") {
        try {
            let resizedWidth = pdfpagewidth - 20;
            let resizedHeight = Math.ceil((height * resizedWidth) / width);
            return {
                width: resizedWidth,
                height: resizedHeight,
            }
        } catch (e) {
            console.error(e);
        }
    }
    return {
        width,
        height
    };
}

export const calculateFlyerDisplayWidth = (
  width,
  height,
  photoWidth,
  photoHeight,
) => {
  try {
    return calculateFlyerDisplayDimensions(
      width,
      height,
      photoWidth,
      photoHeight,
    ).displayWidth;
  } catch (e) {
    console.error(e);
    return photoWidth;
  }
};

export const calculateFlyerDisplayHeight = (
  width,
  height,
  photoWidth,
  photoHeight,
) => {
  try {
    return calculateFlyerDisplayDimensions(
      width,
      height,
      photoWidth,
      photoHeight,
    ).displayHeight;
  } catch (e) {
    console.error(e);
    return photoHeight;
  }
};

export const calculateFlyerDisplayDimensions = (
  width,
  height,
  photoWidth,
  photoHeight,
) => {
  let displayWidth = photoWidth;
  let displayHeight = photoHeight;
  try {
    const projectedImageWidth = Math.round((width * photoHeight) / height);
    const portraitImageWidth =
      projectedImageWidth >= photoWidth ? photoWidth : projectedImageWidth;
    const portraitImageHeight =
      projectedImageWidth >= photoWidth
        ? Math.round((height * portraitImageWidth) / width)
        : photoHeight;
    displayWidth =
      width > height || width === height ? photoWidth : portraitImageWidth;
    const ratio = width / displayWidth;
    displayHeight =
      width === height
        ? displayWidth
        : width > height
          ? height / ratio
          : portraitImageHeight;
  } catch (e) {
    console.error(e);
  }
  return {
    displayWidth,
    displayHeight,
  };
};
