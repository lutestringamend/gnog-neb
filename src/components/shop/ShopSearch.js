import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getStorageProductData,
  updateProductSearchFilter,
} from "../../axios/product";
import { colors, dimensions, staticDimensions } from "../../styles/base";

const ratio = dimensions.fullWidthAdjusted / 430;

function ShopSearch(props) {
  const { searchFilter, height } = props;
  const [filter, setFilter] = useState(searchFilter ? searchFilter : "");

  useEffect(() => {
    if (filter !== searchFilter) {
      if (filter === "") {
        props.updateProductSearchFilter(null);
      } else {
        props.updateProductSearchFilter(filter);
      }
    }
  }, [filter]);

  return (
    <View style={[styles.container, { height }]}>
      <MaterialCommunityIcons
        name="magnify"
        color={colors.daclen_grey_placeholder}
        size={20 * ratio}
      />
      <TextInput
        style={[styles.textInput, { height }]}
        value={filter}
        onChangeText={(text) => setFilter(text)}
        placeholderTextColor={colors.daclen_grey_placeholder}
        placeholder="Cari Produk"
      />
      {searchFilter === null || searchFilter === "" ? null : (
        <TouchableOpacity onPress={() => setFilter("")}>
          <MaterialCommunityIcons
            name="close-circle"
            color={colors.daclen_grey_placeholder}
            size={20 * ratio}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 15 * ratio,
    height: 50 * ratio,
    borderRadius: 40,
    flex: 1,
  },
  textInput: {
    flex: 1,
    alignSelf: "center",
    marginHorizontal: 15 * ratio,
    fontFamily: "Poppins-Light",
    height: 60,
    textAlignVertical: "center",
    fontSize: 12 * ratio,
    color: colors.black,
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (store) => ({
  products: store.productState.products,
  searchFilter: store.productState.searchFilter,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getStorageProductData,
      updateProductSearchFilter,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(ShopSearch);
