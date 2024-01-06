import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Linking,
  Platform,
  ToastAndroid,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import {
  getPenukaranPoinDates,
  getPenukaranPoinIndexProduk,
} from "../../axios/user/points";
import { colors, staticDimensions } from "../../styles/base";
import PointExchangeItem from "./point/PointExchangeItem";

const defaultStatus = {
  disabled: true,
  message: "",
};

const PointWithdrawal = (props) => {
  const { token, currentUser } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeStatus, setExchangeStatus] = useState(defaultStatus);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (token === null) {
      setExchangeStatus(defaultStatus);
      return;
    }
    penukaranPoinCheckAsync();
  }, [token]);

  useEffect(() => {
    if (!exchangeStatus?.disabled) {
      fetchPoinProductsAsync();
    }
  }, [exchangeStatus?.disabled]);

  const fetchPoinProductsAsync = async () => {
    try {
      let result = await getPenukaranPoinIndexProduk(token);
      console.log("getPenukaranPoinIndexProduk", result?.result?.length);
      if (
        !(
          result?.result === undefined ||
          result?.result?.length === undefined ||
          result?.result?.length < 1
        )
      ) {
        setProducts(result?.result);
        if (loading) {
          setLoading(false);
        }
        return;
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
    setProducts([]);
  };

  const penukaranPoinCheckAsync = async () => {
    try {
      let result = await getPenukaranPoinDates();
      let starting = new Date(result?.result?.tanggal_dari);
      let ending = new Date(result?.result?.tanggal_sampai);
      let today = new Date().getTime();

      //console.log(ending.getTime() - today, today - starting.getTime());
      if (today <= ending.getTime() && today >= starting.getTime()) {
        setExchangeStatus({ disabled: false, message: "" });
      } else {
        setExchangeStatus({
          disabled: true,
          message: `Penukaran poin akan berlaku dari tanggal\n${convertDateISOStringtoDisplayDate(
            starting,
            true,
          )} hingga ${convertDateISOStringtoDisplayDate(ending, true)}`,
        });
      }
    } catch (e) {
      console.error(e);
      setError(e.toString());
      setExchangeStatus(defaultStatus);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {exchangeStatus?.message ? (
        <View style={styles.containerInfo}>
          <MaterialCommunityIcons
            name="progress-clock"
            size={18}
            color={colors.daclen_light}
          />
          <Text style={[styles.textInfo, { textAlign: "center" }]}>
            {exchangeStatus?.message}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.containerInfo,
            {
              backgroundColor: colors.daclen_black,
            },
          ]}
        >
          <Text style={[styles.textInfo, { flex: 1, marginStart: 0 }]}>
            {`Total Poin Anda: 0 Poin`}
          </Text>
          <TouchableOpacity
            disabled={exchangeStatus?.disabled}
            style={[
              styles.containerButton,
              {
                backgroundColor: exchangeStatus?.disabled
                  ? colors.daclen_gray
                  : colors.daclen_yellow_new,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="cart"
              size={18}
              color={colors.daclen_black}
            />
            <Text
              style={[
                styles.textInfo,
                {
                  fontFamily: "Poppins",
                  color: colors.daclen_black,
                },
              ]}
            >
              {`Keranjang berisi 0 Poin`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_gray}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : (
        <View style={styles.containerList}>
          <FlashList
            estimatedItemSize={10}
            numColumns={2}
            horizontal={false}
            data={products}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => fetchPoinProductsAsync()}
              />
            }
            renderItem={({ item, index }) => (
              <PointExchangeItem
                index={index}
                {...item}
                onPress={() => console.log(item)}
                disabled={exchangeStatus?.disabled}
              />
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_gray,
  },
  containerButton: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.daclen_yellow_new,
    flexDirection: "row",
    alignItems: "center",
  },
  containerList: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
  textInfo: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    marginStart: 6,
    color: colors.daclen_light,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  points: store.userState.points,
});

/*const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
    },
    dispatch,
  );*/

export default connect(mapStateToProps, null)(PointWithdrawal);
