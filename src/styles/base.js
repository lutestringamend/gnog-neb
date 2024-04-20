import { StatusBar, Platform, Dimensions } from "react-native";

export const MAX_SCREEN_WIDTH = 450;

export const dimensions = {
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
  fullWidthAdjusted: Dimensions.get("window").width > MAX_SCREEN_WIDTH ? MAX_SCREEN_WIDTH : Dimensions.get("window").width,
}

export const globalUIRatio = dimensions.fullWidthAdjusted / 430;

export const staticDimensions = {
  statusBarPadding: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  marginHorizontal: 25 * dimensions.fullWidthAdjusted / 430,
  authMarginHorizontal: 25 * dimensions.fullWidthAdjusted / 430,
  smallScreenWidth: 390,
  maxScreenWidth: MAX_SCREEN_WIDTH,
  isSmallScreen: Dimensions.get("window").width < 390,
  dashboardBoxHorizontalMargin: 5,
  pageBottomPadding: 100,
  authBoxTopHeight: 150,
  authBoxWidthMargin: 40,
  authPageRegisterBottomPadding: 300,
  blogTextWidthMargin: 20,
  webviewWidthMargin: 24,
  productPhotoWidthMargin: 12,
  youtubeEmbedAspectRatio: 560 / 340,
  shopMaxWidth: 450,
}



export const colors = {
  daclen_black: "#212529",
  daclen_black_old: "#212529",
  daclen_dark_background: "#333333",
  daclen_button_disabled_grey: "#676C70",
  daclen_grey_placeholder: "#868686",
  daclen_grey_shadow: "#E9E9E9",
  daclen_blue_textinput: "#BBC8F5",
  daclen_blue_light_border: "#DAE0FA",
  daclen_blue_dark: "#2C304B",
  daclen_blue: "#00BFFF",
  daclen_blue_link: "#4169E1",
  daclen_grey_light: "#F1EFEF",
  daclen_grey_container: "#E4E4E2",
  daclen_grey_container_background: "#D9D9D9",
  daclen_grey_search_container: "#E4E4EE",
  daclen_grey_background: "#CCCCCC",
  daclen_grey_icon: "#44494D",
  daclen_success_border: "#85C2A4",
  daclen_success_light: "#CCE9D9",
  daclen_green_background: "#A8D5BF",
  daclen_green: "#198754",
  daclen_danger: "#dc3545",
  daclen_danger_border: "#EE959C",
  daclen_danger_light: "#F9D5D6",
  daclen_danger_background: "#F3B5B9",
  daclen_red_delete: "#E25562",
  daclen_red_light: "#E25562",
  daclen_orange: "#FF6F00",
  daclen_yellow_background: "#FEEEA0",


  daclen_yellow_new: "#f8c133",
  daclen_bg: "#0a0a0a",
  daclen_bg_highlighted: "#434343",
  black: "#000000",
  white: "#FFFFFF",
  daclen_green_button: "#96af9a",
  daclen_green_pale: "#9fa88a",
  daclen_grey_button: "#3d3b3f",
  daclen_lightgrey_button: "#464646",
  daclen_black_header: "#08090b",
  daclen_black_bg: "#1c1c1c",
  daclen_violet: "#131b3f",
  daclen_green_dark: "#0f241f",
  daclen_maroon_dark: "#2d253d",
  daclen_gold: "#e7b40a",
  daclen_gold_light: "#edbb02",
  daclen_gold_dark: "#b8860b",
  daclen_gold_brown: "#5d3d03",
  daclen_green_light: "#009126",
  daclen_yellow: "#ffc107",
  daclen_red: "#dc3545",
  daclen_indigo: "#6610f2",
  daclen_pink: "#d63384",
  daclen_teal: "#20c997",
  daclen_cyan: "#0dcaf0",
  daclen_gray: "#6c757d",
  daclen_graydark: "#343a40",
  daclen_primary: "#0d6efd",
  daclen_secondary: "#6c757d",
  daclen_success: "#198754",
  daclen_info: "#0dcaf0",
  daclen_warning: "#ffc107",
  daclen_light: "#f8f9fa",
  daclen_dark: "#212529",
  daclen_label_grey: "#33373b",
  daclen_box_grey: "#d6dbe1",
  daclen_search_grey: "#353535",
  daclen_lightgrey: "#e8f5e6",
  daclen_offgreen: "#eaffe7",
  daclen_palepink: "#ffdbcb",
  daclen_reddishbrown: "#750f0f",
  timer_green_dark: "#0c4824",
  timer_green_light: "#0c8a38",
  timer_green_outline: "#04a23d",
  timer_orange_dark: "#ff6801",
  timer_orange_light: "#ffad01",
  timer_orange_outline: "#ffb200",
  timer_red_dark: "#730101",
  timer_red_light: "#fe0000",
  timer_red_outline: "#fe0000",
  timer_frozen_dark: "#609bd3",
  timer_frozen_light: "#88c1e7",
  timer_frozen_outline: "#b0d1f1",
  timer_frozen_title: "#eaf2fa",
  timer_frozen_digit: "#f8feff",
  timer_frozen_ok: "#3575ba",
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
  marginHorizontal: 25 * dimensions.fullWidthAdjusted / 430,
  paddingHorizontal: 28 * dimensions.fullWidthAdjusted / 430,
  paddingVertical: 14 * dimensions.fullWidthAdjusted / 430,
  width: 380 * dimensions.fullWidthAdjusted / 430,
  height: 60 * dimensions.fullWidthAdjusted / 430,
  color: colors.daclen_black,
  focusedColor: colors.white,
  activeColor: colors.white,
  inactiveColor: colors.daclen_grey_placeholder,
  barBackground: colors.daclen_black,
  borderRadius: 18 * dimensions.fullWidthAdjusted / 430,
  iconSize: 20 * dimensions.fullWidthAdjusted / 430,
  fontFamily: "Poppins-SemiBold", 
  fontSize: 11 * dimensions.fullWidthAdjusted / 430,
};

export const blurhash = null;
/*
export const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  */



