import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import MainHeader from "../main/MainHeader";
import HistoryTabItem from "./HistoryTabItem";
import Checkout from "./Checkout";
import Delivery from "./Delivery";
import {
  checkoutItem,
  deliveryItem,
  checkoutIcon,
  deliveryIcon,
} from "./constants";
import { colors } from "../../styles/base";

export default function History() {
  const [activeTab, setActiveTab] = useState(checkoutItem);

  useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabView}>
        <HistoryTabItem
          activeTab={activeTab}
          name={checkoutItem}
          icon={checkoutIcon}
          onPress={() => setActiveTab(checkoutItem)}
        />

        <HistoryTabItem
          activeTab={activeTab}
          name={deliveryItem}
          icon={deliveryIcon}
          onPress={() => setActiveTab(deliveryItem)}
        />
      </View>
      <View style={styles.container}>
        {activeTab === deliveryItem ? (
          <Delivery />
        ) : (
          <Checkout />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  tabView: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
