import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getStorageProductData } from "../../axios/product";
import { colors } from "../../styles/base";
import { getObjectAsync } from "../asyncstorage";
import { ASYNC_PRODUCTS_ARRAY_KEY } from "../asyncstorage/constants";

function ShopPages(props) {
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [props.products]);

  const nextPage = async () => {
    if (currentIndex < props.maxIndex) {
      setLoading(true);
      const storageProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
      props.getStorageProductData(storageProducts, currentIndex + 1);
      setCurrentIndex((currentIndex) => currentIndex + 1);
    }
  };

  const previousPage = async () => {
    if (currentIndex > 0) {
      setLoading(true);
      const storageProducts = await getObjectAsync(ASYNC_PRODUCTS_ARRAY_KEY);
      props.getStorageProductData(storageProducts, currentIndex - 1);
      setCurrentIndex((currentIndex) => currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => previousPage()}
        disabled={loading || props?.disabled}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={16}
          style={styles.cartIcon}
          color={colors.daclen_gray}
        />
      </TouchableOpacity>

      <View style={styles.containerNumber}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.daclen_gray}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <Text style={styles.textCart}>
            {`${currentIndex + 1} / ${props.maxIndex + 1}`}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => nextPage()}
        disabled={loading || props?.disabled}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={16}
          style={styles.cartIcon}
          color={colors.daclen_gray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
  },
  cartIcon: {
    borderWidth: 0.5,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    alignSelf: "center",
    padding: 6,
  },
  containerNumber: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: colors.daclen_gray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  textCart: {
    color: colors.daclen_graydark,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
});

const mapStateToProps = (store) => ({
  products: store.productState.products,
  maxIndex: store.productState.maxIndex,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getStorageProductData,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(ShopPages);
