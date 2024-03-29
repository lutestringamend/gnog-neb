import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import DashboardHeader from "../DashboardHeader";
//import Slider from "./Slider";
//import Banner from "./Banner";
//import Alert from "./Alert";
import Shop from "./Shop";
//import CheckoutBox from "./CheckoutBox";

//import { colors } from "../../styles/base";
//import Youtube from "../home/Youtube";

function Home(props) {
  const { currentUser, token } = props;
  const navigation = useNavigation();

  function openDashboard() {
    if (props?.goDashboard === undefined || props?.goDashboard === null) {
      return;
    }
    props.goDashboard();
  }

  /*
        <ScrollView style={styles.scrollView}>
                  <Slider />
        <Banner />
              <Alert />

      <CheckoutBox />
      </ScrollView>

  */

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require("../../assets/profilbg.png")}
          style={styles.background}
          resizeMode="cover"
        />
      <DashboardHeader
          onSettingPress={() => navigation.navigate("Profile")}
        />

      <Shop goDashboard={() => openDashboard()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  token: store.userState.token,
});

export default connect(mapStateToProps, null)(Home);
