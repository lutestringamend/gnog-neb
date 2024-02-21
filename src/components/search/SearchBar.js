import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, staticDimensions } from "../../styles/base";

const SearchBar = (props) => {
  const { searchText, placeholderText, style, height, autoFocus, hideSearchClose } = props;
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
      {searchText === null || searchText === "" || hideSearchClose ? null : (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <MaterialCommunityIcons
            name="close"
            color={colors.textInputText}
            size={12}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey_search,
    height: 44,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grey_box,
    paddingStart: staticDimensions.marginHorizontal,
    paddingEnd: 10,
  },
  textInput: {
    flex: 1,
    height: "100%",
    alignSelf: "center",
    backgroundColor: "transparent",
    marginStart: 8,
    fontFamily: "PlusJakartaSans-Regular",
    textAlignVertical: "center",
    fontSize: 12,
    color: colors.textBlack,
  },
  icon: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

export default SearchBar;
