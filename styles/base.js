import { StatusBar, Platform } from "react-native";
import { useScreenDimensions } from "../hooks/useScreenDimensions";

export const staticDimensions = {
  statusBarPadding: Platform.OS === "android" ? StatusBar.currentHeight : 0,
}

export const dimensions = () => {
  let screenData = useScreenDimensions();

  return {
    fullHeight: screenData.height,
    fullWidth: screenData.width,
    isLandscape: screenData?.isLandscape,
    pageBottomPadding: 100,
    authBoxWidth: screenData.width - 40,
    authBoxTopHeight: 150,
    authPageRegisterBottomPadding: 300,
    productPhotoWidth: screenData.width - 10,
    blogTextWidth: screenData.width - 20,
    webviewWidth: screenData.width - 24,
    youtubeEmbedAspectRatio: 560 / 340,
    dashboardBoxHorizontalMargin: 5,
  };
};

export const colors = {
  daclen_black: "#212529",
  daclen_orange: "#fd7e14",
  daclen_yellow: "#ffc107",
  daclen_red: "#dc3545",
  daclen_blue: "#0d6efd",
  daclen_indigo: "#6610f2",
  daclen_pink: "#d63384",
  daclen_green: "#198754",
  daclen_teal: "#20c997",
  daclen_cyan: "#0dcaf0",
  daclen_gray: "#6c757d",
  daclen_graydark: "#343a40",
  daclen_primary: "#0d6efd",
  daclen_secondary: "#6c757d",
  daclen_success: "#198754",
  daclen_info: "#0dcaf0",
  daclen_warning: "#ffc107",
  daclen_danger: "#dc3545",
  daclen_light: "#f8f9fa",
  daclen_dark: "#212529",
  daclen_lightgrey: "#e8f5e6",
  daclen_offgreen: "#eaffe7",
  daclen_palepink: "#ffdbcb",
  daclen_reddishbrown: "#750f0f",
};

export const padding = {
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
};

export const fonts = {
  sm: 12,
  md: 18,
  lg: 28,
  primary: "Cochin",
};

export const bottomNav = {
  color: colors.daclen_graydark,
  focusedColor: colors.daclen_orange,
  activeColor: colors.daclen_lightgrey,
  inactiveColor: colors.daclen_light,
  barBackground: "white",
  iconSize: 24,
  fontSize: 7,
};
