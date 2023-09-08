import { StatusBar, Platform, Dimensions } from "react-native";

export const staticDimensions = {
  statusBarPadding: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  dashboardBoxHorizontalMargin: 5,
  pageBottomPadding: 100,
  authBoxTopHeight: 150,
  authBoxWidthMargin: 40,
  authPageRegisterBottomPadding: 300,
  blogTextWidthMargin: 20,
  webviewWidthMargin: 24,
  productPhotoWidthMargin: 10,
  youtubeEmbedAspectRatio: 560 / 340,
}

export const dimensions = {
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
}

export const colors = {
  daclen_black: "#001731",
  daclen_black_old: "#212529",
  daclen_bg: "#001731",
  daclen_bg_highlighted: "#303c54",
  black: "#000000",
  white: "#FFFFFF",
  daclen_green_button: "#96af9a",
  daclen_green_pale: "#9fa88a",
  daclen_grey_button: "#3d3b3f",
  daclen_lightgrey_button: "#373d49",
  daclen_black_header: "#08090b",
  daclen_black_bg: "#091221",
  daclen_violet: "#131b3f",
  daclen_green_dark: "#0f241f",
  daclen_maroon_dark: "#2d253d",
  daclen_gold: "#e7b40a",
  daclen_gold_light: "#edbb02",
  daclen_gold_dark: "#b8860b",
  daclen_gold_brown: "#5d3d03",
  daclen_green_light: "#009126",
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
  timer_green_dark: "#0c4824",
  timer_green_light: "#0c8a38",
  timer_green_outline: "#04a23d",
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
  fontSize: 16,
};

export const blurhash = null;
/*
export const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  */



