import { Platform } from "react-native";
import { pdfpagewidth } from "../../src/constants/imageviewer";

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
