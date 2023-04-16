import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { getOrientationAsync, Orientation } from "expo-screen-orientation";

export const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState({
    ...Dimensions.get("window"),
    isLandscape:
      Dimensions.get("window").width > Dimensions.get("window").height,
  });
  useEffect(() => {
    const checkNewOrientation = async (screenResult) => {
      const result = await getOrientationAsync();
      //console.log("getOrientationAsync", result);
      if (
        result === Orientation.LANDSCAPE_LEFT ||
        result === Orientation.LANDSCAPE_RIGHT
      ) {
        setScreenData({ ...screenResult, isLandscape: true });
      } else if (
        result === Orientation.PORTRAIT_DOWN ||
        result === Orientation.PORTRAIT_UP
      ) {
        setScreenData({ ...screenResult, isLandscape: false });
      }
    };

    const onChange = (result) => {
      console.log("screendimensionschange", result);
      checkNewOrientation(result.window);
    };

    Dimensions.addEventListener("change", onChange);

    return () => Dimensions.removeEventListener("change", onChange);
  });

  return screenData;
};
