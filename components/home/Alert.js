import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
//import { bindActionCreators } from "redux";
import { colors, dimensions } from "../../styles/base";
import { TouchableOpacity } from "react-native-gesture-handler";

function Alert(props) {
  const [hasCheckout, setHasCheckout] = useState(false);
  const { currentUser, checkouts } = props;
  const navigation = useNavigation();

  /*
  ||
      checkouts?.length === undefined ||
      checkouts?.length < 1
  */

  useEffect(() => {
    if (
      currentUser === null ||
      currentUser?.has_checkout === null ||
      currentUser?.has_checkout === undefined ||
      !currentUser?.has_checkout 
    ) {
      setHasCheckout(false);
    } else {
      setHasCheckout(currentUser?.has_checkout);
    }
  }, [currentUser, checkouts]);

  return (
    <View style={styles.container}>
      {hasCheckout && (
        <TouchableOpacity
          onPress={() => navigation.navigate("HistoryCheckout")}
        >
          <Text allowFontScaling={false} style={styles.textHasCheckout}>
            Anda masih memiliki Checkout yang belum dilunasi. Mohon melunasi
            terlebih dahulu.
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  textHasCheckout: {
    width: "100%",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    backgroundColor: colors.daclen_orange,
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  checkout: store.userState.checkout,
  checkouts: store.historyState.checkouts,
});

export default connect(mapStateToProps, null)(Alert);
