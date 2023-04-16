import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { getOrientationAsync, Orientation } from "expo-screen-orientation";

export const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));
  const [isLandscape, setLandscape] = useState(Dimensions.get("window").width > Dimensions.get("window").height);

  useEffect(() => {
    const checkNewOrientation = async (screenResult) => {
      const result = await getOrientationAsync();
      //console.log("getOrientationAsync", result);
      if (
        result === Orientation.LANDSCAPE_LEFT ||
        result === Orientation.LANDSCAPE_RIGHT
      ) {
        setLandscape(true);
      } else if (
        result === Orientation.PORTRAIT_DOWN ||
        result === Orientation.PORTRAIT_UP
      ) {
        setLandscape(false);
      } 
      setScreenData(screenResult);
    };

    const onChange = (result) => {
      console.log("screendimensionschange", result);
      checkNewOrientation(result.window);
    };

    Dimensions.addEventListener("change", onChange);

    return () => Dimensions.removeEventListener("change", onChange);
  });

  return {
    ...screenData,
    isLandscape,
  };
};
