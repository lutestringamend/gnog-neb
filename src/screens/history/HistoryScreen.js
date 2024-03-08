import React, { useState } from "react";
import { StyleSheet } from "react-native";

import Checkout from "../../components/history/HistoryList";
import Delivery from "../../components/history/DeliveryList";
import {
  checkoutItem,
  deliveryItem,
} from "../../../components/history/constants";
import { colors } from "../../styles/base";
import CenteredView from "../../components/view/CenteredView";
import TabContainer from "../../components/tabs/TabContainer";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState(checkoutItem);

  return (
    <CenteredView title="Riwayat Transaksi" style={styles.container}>
      <TabContainer
        activeTab={activeTab}
        tabList={[checkoutItem, deliveryItem]}
        onPress={(e) => setActiveTab(e)}
      />
     {activeTab === deliveryItem ? <Delivery /> : <Checkout />}
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_grey_light,
  },
});
