import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, staticDimensions } from "../../styles/base";

const SearchBarAlt = (props) => {
  const { searchText, placeholderText, style, loading, autoFocus, hideSearchClose } = props;
  const ref = useRef();

  useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [ref, autoFocus]);

  function onChangeText(e) {
    if (!(props?.onChangeText === undefined || props?.onChangeText === null)) {
      props?.onChangeText(e);
    }
  }

  return (
    <View
      style={[
        styles.container,
        style ? style : null,
      ]}
    >
      
      <TextInput
        ref={ref}
        style={styles.textInput}
        value={searchText}
        onChangeText={(text) => onChangeText(text)}
        placeholderTextColor={colors.textInputText}
        placeholder={placeholderText ? placeholderText : "Search"}
      />
      
      <View style={styles.containerRight}>
      {loading ? (
        <ActivityIndicator
          size={16}
          color={colors.grey_box}
        />

      ) : searchText === null || searchText === "" || hideSearchClose ? (
        <MaterialCommunityIcons
        name="magnify"
        color={colors.grey_box}
        size={24}
        style={styles.icon}
      />
      ) : (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <MaterialCommunityIcons
            name="close"
            color={colors.grey_box}
            size={16}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
    maxHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey_search,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grey_box,
    paddingStart: staticDimensions.marginHorizontal,
    paddingEnd: 10,
  },
  containerRight: {
    backgroundColor: "transparent",
    width: 24,
    alignItems: "center",
    alignSelf: "center",
  },
  textInput: {
    flex: 1,
    height: "100%",
    alignSelf: "center",
    backgroundColor: "transparent",
    fontFamily: "PlusJakartaSans-Regular",
    textAlignVertical: "center",
    fontSize: 12,
    marginEnd: 10,
    color: colors.textBlack,
  },
  icon: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

export default SearchBarAlt;
