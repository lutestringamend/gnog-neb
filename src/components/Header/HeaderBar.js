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
            size={20}
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
            size={20}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: dimensions.fullWidth,
    height: 60,
    backgroundColor: colors.daclen_black_old,
    flexDirection: "row",
    alignItems: "center",
    padding: staticDimensions.marginHorizontal,
    
  },
  containerBack: {
    backgroundColor: "transparent",
    marginEnd: 10,
    alignItems: "center",
  },
  containerRightButton: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginStart: 10,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    flex: 1,
  },
  textRightButton: {
    backgroundColor: "transparent",
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  thickBorderBottom: {
    borderColor: colors.daclen_lightgrey,
    borderBottomWidth: 10,
  },
  rightImage: {
    backgroundColor: "transparent",
    width: 12,
    height: 12,
  }
});

export default HeaderBar;
