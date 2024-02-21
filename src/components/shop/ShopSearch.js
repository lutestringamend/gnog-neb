import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getStorageProductData, updateProductSearchFilter } from "../../axios/product";
import { colors, staticDimensions } from "../../styles/base";


function ShopSearch (props) {
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
        size={25 * height / 60}
      />
      <TextInput
        style={[styles.textInput, { height, fontSize: height / 3 }]}
        value={filter}
        onChangeText={text => setFilter(text)}
        placeholderTextColor={colors.daclen_grey_placeholder}
        placeholder="Cari Produk"
      />
{searchFilter === null || searchFilter === "" ? null : (
        <TouchableOpacity onPress={() => setFilter("")}>
          <MaterialCommunityIcons
            name="close-circle"
            color={colors.daclen_grey_placeholder}
            size={25 * height / 60}
            style={{ marginEnd: 20 }}
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
    backgroundColor: colors.daclen_grey_search_container,
    paddingStart: 20,
    height: 60,
    borderRadius: 40,
    flex: 1,
  },
  textInput: {
    flex: 1,
    alignSelf: "center",
    marginHorizontal: staticDimensions.marginHorizontal,
    fontFamily: "Poppins-Light", 
    height: 60,
    textAlignVertical: "center",
    fontSize: 20,
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
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(ShopSearch);
