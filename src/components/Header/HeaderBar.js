import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import SearchBar from "../search/SearchBar";

const HeaderBar = (props) => {
  const {
    title,
    hideBack,
    thickSeparator,
    rightButton,
    rightButtonColor,
    rightButtonDisabled,
    rightButtonLoading,
    showIcons,
    showNotification,
    hideSecondaryIcon,
    isOrder,
    showSearchBar,
    searchText,
    searchFocus,
    hideSearchClose,
    placeholderText,
    rightImage,
    rightIcon,
    style,
    textStyle,
    color,
  } = props;
  const navigation = useNavigation();

  function onBackPress() {
    if (props?.onBackPress === undefined || props?.onBackPress === null) {
      navigation.goBack();
    } else {
      props?.onBackPress();
    }
  }

  function onChangeText(e) {
    if (!(props?.onChangeText === undefined || props?.onChangeText === null)) {
      props?.onChangeText(e);
    }
  }

  function onRightButtonPress() {
    if (
      !(
        props?.onRightButtonPress === undefined ||
        props?.onRightButtonPress === null
      )
    ) {
      props?.onRightButtonPress();
    }
  }

  function onRightIconPress() {
    if (
      !(
        props?.onRightIconPress === undefined ||
        props?.onRightIconPress === null
      )
    ) {
      props?.onRightIconPress();
    }
  }

  return (
    <View
      style={[
        styles.container,
        style ? style : null,
        thickSeparator ? styles.thickBorderBottom : null,
      ]}
    >
      {hideBack ? null : (
        <TouchableOpacity
          style={styles.containerBack}
          onPress={() => onBackPress()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            color={color ? color : colors.white}
            size={35 * dimensions.fullWidthAdjusted / 430}
          />
        </TouchableOpacity>
      )}

      {showSearchBar === true ? (
        <SearchBar
          placeholderText={placeholderText}
          searchText={searchText}
          onChangeText={(e) => onChangeText(e)}
          autoFocus={searchFocus}
          hideSearchClose={hideSearchClose}
        />
      ) : (
        <Text
          allowFontScaling={false}
          style={[
            styles.textHeader,
            { color: color ? color : colors.white },
            textStyle ? textStyle : null,
          ]}
        >
          {title ? title : ""}
        </Text>
      )}

      {rightButton ? rightButtonLoading ? (
        <ActivityIndicator
          size={24}
          color={colors.white}
          style={{ alignSelf: "center" }}
        />
      ) : (
        <TouchableOpacity
          disabled={rightButtonDisabled}
          style={styles.containerRightButton}
          onPress={() => onRightButtonPress()}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.textRightButton,
              {
                color: rightButtonDisabled
                  ? colors.daclen_button_disabled_grey
                  : rightButtonColor ? rightButtonColor : colors.white,
                opacity: rightButtonDisabled ? 0.12 : 1,
              },
            ]}
          >
            {rightButton}
          </Text>
        </TouchableOpacity>
      ) : rightImage ? (
        <TouchableOpacity
          style={styles.containerRightButton}
          onPress={() => onRightIconPress()}
        >
          <Image
            source={rightImage}
            contentFit="contain"
            style={styles.rightImage}
          />
        </TouchableOpacity>
      ) : rightIcon ? (
        <TouchableOpacity
          style={styles.containerRightButton}
          onPress={() => onRightIconPress()}
        >
          <MaterialCommunityIcons
            name={rightIcon}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: dimensions.fullWidth,
    height: 95 * dimensions.fullWidthAdjusted / 430,
    backgroundColor: colors.daclen_black_old,
    flexDirection: "row",
    alignItems: "center",
    padding: staticDimensions.marginHorizontal,
  },
  containerBack: {
    backgroundColor: "transparent",
    alignItems: "center",
    position: "absolute",
    zIndex: 2,
    top: 30 * dimensions.fullWidthAdjusted / 430,
    bottom: 30 * dimensions.fullWidthAdjusted / 430,
    start: 25 * dimensions.fullWidthAdjusted / 430,
  },
  containerRightButton: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: 10,
  },
  textHeader: {
    zIndex: 0,
    backgroundColor: "transparent",
    fontFamily: "Poppins-Bold",
    fontSize: 18 * dimensions.fullWidthAdjusted / 430,
    textAlign: "center",
    flex: 1,
  },
  textRightButton: {
    backgroundColor: "transparent",
    color: colors.white,
    fontFamily: "Poppins",
    fontSize: 12,
  },
  thickBorderBottom: {
    borderColor: colors.daclen_grey_light,
    borderBottomWidth: 10,
  },
  rightImage: {
    backgroundColor: "transparent",
    width: 25,
    height: 25,
  }
});

export default HeaderBar;
