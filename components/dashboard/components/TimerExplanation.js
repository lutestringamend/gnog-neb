import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { colors } from "../../../styles/base";
import { timereplanationtext } from "../constants";
import { convertDateMilisecondstoDisplayDate } from "../../../axios/profile";

const TimerExplanation = (props) => {
  const { regDateInMs, recruitmentTimer, target_rekrutmen } = props.route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.container, {alignItems: "center"}]}>
        <Text style={[styles.textHeader, { marginTop: 24 }]}>
          Deadline Recruitment Seller
        </Text>
        <Text style={[styles.text, { color: colors.daclen_blue }]}>
          {`${convertDateMilisecondstoDisplayDate(regDateInMs)} 23:59:59`}
        </Text>
        <Text style={styles.textHeader}>Recruitment Target</Text>
        <Text style={[styles.text, { color: colors.daclen_orange }]}>
          {target_rekrutmen > 1 ? `${target_rekrutmen} Sellers` : `${target_rekrutmen} Seller`}
        </Text>
        <Image
          source={require("../../../assets/countdown.png")}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.textDesc}>{timereplanationtext}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  image: {
    marginVertical: 20,
    width: 340,
    height: 200,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  textHeader: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    backgroundColor: "transparent",
    textAlign: "center",
    color: colors.daclen_gray,
  },
  text: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    backgroundColor: "transparent",
    textAlign: "center",
    marginVertical: 10,
  },
  textDesc: {
    marginHorizontal: 20,
    paddingBottom: 20,
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_black,
  },
});

export default TimerExplanation;
