import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { colors, staticDimensions } from "../../../styles/base";
import { timereplanationtext } from "../../../components/dashboard/constants";
import { convertDateMilisecondstoDisplayDate } from "../../../axios/profile";
import { recruitmenttarget } from "../../../axios/constants";
import CenteredView from "../../components/view/CenteredView";

const TimerExplanation = (props) => {
  const { regDateInMs, total_rekrutmen, target_rekrutmen } =
    props.route.params;

  return (
    <CenteredView title="Countdown Rekrutmen" style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={[styles.container, { alignItems: "center" }]}>
          <Text style={[styles.textHeader, { marginTop: 24 }]}>
            Deadline Recruitment Seller
          </Text>
          <Text style={[styles.text, { color: colors.daclen_blue }]}>
            {`${convertDateMilisecondstoDisplayDate(regDateInMs)} 23:59:59`}
          </Text>
          <Text style={styles.textHeader}>Remaining Recruitment Target</Text>
          <Text style={[styles.text, { color: total_rekrutmen >= target_rekrutmen ? colors.daclen_green : colors.daclen_orange }]}>
            {target_rekrutmen > 1
              ? `${target_rekrutmen} Sellers`
              : `${target_rekrutmen} Seller`}
          </Text>
          <Text style={styles.textHeader}>Total Recruitment</Text>
          <Text style={[styles.text, { color: total_rekrutmen >= recruitmenttarget ? colors.daclen_green : colors.daclen_orange }]}>
            {total_rekrutmen > 1
              ? `${total_rekrutmen} Sellers`
              : `${total_rekrutmen} Seller`}
          </Text>
          <Image
            source={require("../../../assets/countdown.png")}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.textDesc}>{timereplanationtext}</Text>
        </View>
        <View style={styles.containerBottom} />
      </ScrollView>
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerBottom: {
    backgroundColor: "transparent",
    height: staticDimensions.pageBottomPadding / 2,
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
    color: colors.daclen_black,
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
    color: colors.daclen_gray,
  },
});

export default TimerExplanation;
