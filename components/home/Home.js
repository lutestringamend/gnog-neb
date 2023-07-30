import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, Platform, View } from "react-native";

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
    <View style={styles.container}>
      <Header />
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
    backgroundColor: colors.daclen_light,
  },
});

export default Home;
