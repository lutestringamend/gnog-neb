import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = (result) => {
      //console.log("screendimensionschange", result);
      setScreenData(result.screen);
    };

    Dimensions.addEventListener("change", onChange);

    return () => Dimensions.removeEventListener("change", onChange);
  });

  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
  };
};
