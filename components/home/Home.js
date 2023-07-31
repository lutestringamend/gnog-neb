import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";

import Header from "../DashboardHeader";
//import Header from "./Header";
import Slider from "./Slider";
import Banner from "./Banner";
import Alert from "./Alert";
import Shop from "./Shop";
import CheckoutBox from "./CheckoutBox";
import { colors } from "../../styles/base";
//import Youtube from "../home/Youtube";

function Home({ goDashboard }) {
  return (
    <View style={styles.container}>
      <Header goDashboard={goDashboard} isHome={true} />
      <ScrollView style={styles.scrollView}>
        <Slider />
        <Banner />
        <Alert />
        <Shop />
      </ScrollView>
      <CheckoutBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
});

export default Home;
