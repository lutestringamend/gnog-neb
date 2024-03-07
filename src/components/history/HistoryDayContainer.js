import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { dimensions, colors, staticDimensions } from "../../styles/base";
import HistoryHiddenView from "./HistoryHiddenView";
import CheckoutCard from "./CheckoutCard";

const ratio = dimensions.fullWidthAdjusted / 430;

const HistoryDayContainer = (props) => {
  const { header, list, isLast } = props;

  function onLeftPress(e) {
    if (props?.onLeftPress === undefined || props?.onLeftPress === null) {
      return;
    }
    props?.onLeftPress(e);
  }

  function onRightPress(e) {
    if (props?.onRightPress === undefined || props?.onRightPress === null) {
      return;
    }
    props?.onRightPress(e);
  }

  return (
    <View
      style={[styles.container, { paddingBottom: isLast ? 120 * ratio : 0 }]}
    >
      {header ? (
        <Text allowFontScaling={false} style={styles.textHeader}>
          {header}
        </Text>
      ) : null}
      {list === undefined ||
      list?.length === undefined ||
      list?.length < 1 ? null : (
        <SwipeListView
          numColumns={1}
          horizontal={false}
          data={list}
          nestedScrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderHiddenItem={(data, rowMap) => (
            <HistoryHiddenView
              status={data?.item?.status}
              onLeftPress={() => onLeftPress(data?.item)}
              rightText={
                data?.item?.status === null
                  ? "Batalkan"
                  : data?.item?.status === "diverifikasi"
                    ? `Konfirmasi\nDiterima`
                    : "Hapus"
              }
              rightDisabled={
                !(
                  data?.item?.status === null ||
                  data?.item?.status === "ditolak" ||
                  data?.item?.status === "diverifikasi"
                )
              }
              leftTextColor={colors.daclen_blue_link}
              rightTextColor={
                data?.item?.status === null
                  ? colors.daclen_red_delete
                  : data?.item?.status === "diverifikasi"
                    ? colors.daclen_blue_link
                    : data?.item?.status === "ditolak"
                      ? colors.daclen_red_delete
                      : colors.black
              }
              onRightPress={() => onRightPress(data?.item)}
            />
          )}
          leftOpenValue={80 * ratio}
          rightOpenValue={-80 * ratio}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          renderItem={(data, rowMap) => (
            <CheckoutCard
              {...data?.item}
              onPress={() => onLeftPress(data?.item)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    width: dimensions.fullWidthAdjusted,
  },
  textHeader: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.black,
    marginVertical: 16 * ratio,
  },
});

export default HistoryDayContainer;
