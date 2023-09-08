import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import CountDown from "react-native-countdown-component";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../styles/base";
import moment from "moment";

const DashboardTimer = (props) => {
  const { recruitmentTimer } = props;
  const modalWidth = Dimensions.get("window").width * 0.9;

  function toggleModal() {
    if (props?.toggleModal === undefined || props?.toggleModal === null) {
      return;
    }
    props?.toggleModal();
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => toggleModal()}>
      <View style={[styles.containerTimer, { width: modalWidth }]}>
        <LinearGradient
          colors={[colors.timer_green_light, colors.timer_green_dark]}
          style={styles.background}
        />
        <Text style={styles.textHeader}>COUNTDOWN RECRUITMENT</Text>
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
        <View style={[styles.containerOK, { start: modalWidth / 2 - 60 }]}>
          <Text style={styles.textOK}>OK</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
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
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  containerTimer: {
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
    marginHorizontal: 10,
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
