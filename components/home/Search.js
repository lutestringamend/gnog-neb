import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getStorageProductData, updateProductSearchFilter } from "../../axios/product";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../asyncstorage/constants";

import { colors } from "../../styles/base";


function Search(props) {
  const { searchFilter } = props;
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
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        color={colors.daclen_gray}
        size={20}
      />
      <TextInput
        style={styles.textInput}
        value={filter}
        onChangeText={text => setFilter(text)}
        placeholderTextColor={colors.daclen_gray}
        placeholder="Cari Produk"
      />
      {searchFilter === null || searchFilter === "" ? null : (
        <TouchableOpacity onPress={() => setFilter("")}>
          <MaterialCommunityIcons
            name="close"
            color={colors.daclen_gray}
            size={20}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 6,
    borderColor: colors.daclen_gray,
    borderWidth: 1,
    elevation: 4,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: "100%",
    marginStart: 10,
    fontSize: 12,
    color: colors.daclen_graydark,
    backgroundColor: "white",
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

export default connect(mapStateToProps, mapDispatchProps)(Search);
