import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, Platform } from "react-native";

import Header from "./Header";
import Slider from "./Slider";
import Banner from "./Banner";
import Alert from "./Alert";
import Shop from "./Shop";
import CheckoutBox from "./CheckoutBox";
import { colors, dimensions } from "../../styles/base";
//import Youtube from "../home/Youtube";

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <Slider />
        <Banner />
        <Alert />
        <Shop />
      </ScrollView>
      <CheckoutBox />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.fullWidth,
    justifyContent: "space-evenly",
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    width: dimensions.fullWidth,
    backgroundColor: colors.daclen_light,
  },
});

export default Home;
