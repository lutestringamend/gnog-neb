import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import HistoryTabItem from "../../../components/history/HistoryTabItem";
import Checkout from "../../components/history/Checkout";
import Delivery from "../../components/history/Delivery";
import {
  checkoutItem,
  deliveryItem,
  checkoutIcon,
  deliveryIcon,
} from "../../../components/history/constants";
import { colors } from "../../../styles/base";
import CenteredView from "../../components/view/CenteredView";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState(checkoutItem);

  /*useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);*/

  return (
    <CenteredView title="Riwayat Transaksi" style={styles.container}>
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
    </CenteredView>
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
