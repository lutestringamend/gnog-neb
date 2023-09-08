import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
//import CountDown from "react-native-countdown-component";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../styles/base";
import moment from "moment";

const DashboardTimer = (props) => {
  const { recruitmentTimer, showTimerModal, setShowTimerModal } = props;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const modalWidth = screenWidth * 0.9;
  const modalHeight = 200;

  try {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: screenWidth,
            height: screenHeight,
            opacity: showTimerModal ? 0.95 : 0,
          },
        ]}
        onPress={() => setShowTimerModal((showTimerModal) => !showTimerModal)}
      >
        <View
          style={[
            styles.containerTimer,
            {
              width: modalWidth,
              height: modalHeight,
              start: screenWidth * 0.05,
              end: screenWidth * 0.05,
              top: screenHeight * 0.2,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.timer_green_light, colors.timer_green_dark]}
            style={[
              styles.background,
              {
                width: modalWidth,
                height: modalHeight,
              },
            ]}
          />
          <Text style={styles.textHeader}>COUNTDOWN RECRUITMENT</Text>
 
          <View style={[styles.containerOK, { start: modalWidth / 2 - 60 }]}>
            <Text style={styles.textOK}>OK</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } catch (e) {
    console.log("DashboardTimer error", e);
    return null;
  }
};

/*
         <CountDown
            until={moment.duration(recruitmentTimer).asSeconds()}
            size={32}
            onFinish={() => console.log("Finished")}
            style={styles.containerCountdown}
            digitStyle={{ backgroundColor: "transparent" }}
            digitTxtStyle={styles.digitText}
            timeLabelStyle={styles.timeLabel}
            timeToShow={["D", "H", "M"]}
            timeLabels={{ d: "HARI", h: "JAM", m: "MENIT" }}
          />
*/

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 100,
    elevation: 4,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    start: 0,
    end: 0,
    top: 0,
    borderRadius: 12,
  },
  containerTimer: {
    position: "absolute",
    backgroundColor: "transparent",
    opacity: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.timer_green_outline,
    paddingVertical: 24,
    paddingHorizontal: 12,
    elevation: 6,
  },
  containerCountdown: {
    backgroundColor: "transparent",
    marginVertical: 10,
  },
  containerOK: {
    position: "absolute",
    bottom: -16,
    zIndex: 6,
    elevation: 6,
    backgroundColor: colors.daclen_light,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.timer_green_dark,
    width: 120,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.daclen_light,
    textAlign: "center",
    zIndex: 2,
  },
  digitText: {
    color: colors.daclen_light,
    backgroundColor: colors.timer_green_dark,
    padding: 16,
    borderRadius: 10,
    elevation: 6,
  },
  timeLabel: { color: colors.daclen_light, fontSize: 14 },
  textOK: {
    backgroundColor: "transparent",
    color: colors.timer_green_dark,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default DashboardTimer;
