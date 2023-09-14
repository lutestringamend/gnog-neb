import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
//import CountDown from "react-native-countdown-component";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../styles/base";
import moment from "moment";
import { sentryLog } from "../../../sentry";
import { addZeroToArray } from "../../../axios";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const modalWidth = 320;
const modalHeight = 200;
const digitTextWidth = 26;
const digitTextHeight = 50;
const defaultDigit = ["0", "0", "0", "0", "0", "0", "0", "0"];

const DigitText = ({ number }) => {
  return (
    <View
      style={[
        styles.containerDigitText,
        { width: digitTextWidth, height: digitTextHeight },
      ]}
    >
      <LinearGradient
        colors={[colors.timer_green_dark, colors.timer_green_light]}
        style={[
          styles.background,
          {
            width: digitTextWidth,
            height: digitTextHeight,
            borderRadius: 6,
          },
        ]}
      />
      <Text allowFontScaling={false} style={styles.digitText}>{number.toString()}</Text>
    </View>
  );
};

const ContainerDigit = ({ digit1, digit2, label }) => {
  return (
    <View style={styles.containerDigitItem}>
      <View style={styles.containerDoubleDigit}>
        <DigitText number={digit1} />
        <DigitText number={digit2} />
      </View>
      <Text allowFontScaling={false} style={styles.timeLabel}>{label}</Text>
    </View>
  );
};

const DashboardTimer = (props) => {
  const { recruitmentTimer, setShowTimerModal } = props;
  const [digits, setDigits] = useState(defaultDigit);

  useEffect(() => {
    try {
      let days = Math.floor(moment.duration(recruitmentTimer).asDays());
      let hours = Math.floor(
        moment.duration(recruitmentTimer).asHours() - days * 24
      );
      let minutes = Math.floor(
        moment.duration(recruitmentTimer).asMinutes() -
          hours * 60 -
          days * 60 * 24
      );
      let seconds = Math.floor(
        moment.duration(recruitmentTimer).asSeconds() -
          minutes * 60 -
          hours * 60 * 60 -
          days * 60 * 60 * 24
      );
      setDigits(
        addZeroToArray(days)
          .concat(addZeroToArray(hours))
          .concat(addZeroToArray(minutes))
          .concat(addZeroToArray(seconds))
      );
    } catch (e) {
      console.error(e);
      sentryLog(e);
      setDigits(defaultDigit);
      setShowTimerModal(false);
    }
  }, [recruitmentTimer]);

  useEffect(() => {}, [digits]);

  try {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: screenWidth,
            height: screenHeight,
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
              start: (screenWidth - modalWidth) / 2,
              end: (screenWidth - modalWidth) / 2,
              top: ((screenHeight - modalHeight) / 2) - 40,
              bottom: ((screenHeight - modalHeight) / 2) + 40,
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
                borderRadius: 12,
              },
            ]}
          />
          <Text allowFontScaling={false} style={styles.textHeader}>COUNTDOWN RECRUITMENT</Text>

          {digits === defaultDigit ? (
            <ActivityIndicator
              size="large"
              color={colors.daclen_light}
              style={{ alignSelf: "center", marginVertical: 32 }}
            />
          ) : (
            <View style={[styles.containerCountdown, { width: modalWidth }]}>
              <ContainerDigit
                digit1={digits[0]}
                digit2={digits[1]}
                label="Hari"
              />
              <Text allowFontScaling={false} style={styles.textWall}>:</Text>
              <ContainerDigit
                digit1={digits[2]}
                digit2={digits[3]}
                label="Jam"
              />
              <Text allowFontScaling={false} style={styles.textWall}>:</Text>
              <ContainerDigit
                digit1={digits[4]}
                digit2={digits[5]}
                label="Menit"
              />
              <Text allowFontScaling={false} style={styles.textWall}>:</Text>
              <ContainerDigit
                digit1={digits[6]}
                digit2={digits[7]}
                label="Detik"
              />
            </View>
          )}

          <View style={[styles.containerOK, { start: modalWidth / 2 - 60 }]}>
            <Text allowFontScaling={false} style={styles.textOK}>OK</Text>
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
    opacity: 0.95,
  },
  background: {
    position: "absolute",
    start: 0,
    end: 0,
    top: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.timer_green_outline,
  },
  containerTimer: {
    position: "absolute",
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
    elevation: 6,
  },
  containerCountdown: {
    backgroundColor: "transparent",
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
    alignSelf: "center",
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
  containerDigitItem: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    marginTop: 12,
  },
  containerDigitText: {
    backgroundColor: "transparent",
    borderRadius: 10,
    marginHorizontal: 1,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDoubleDigit: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  textHeader: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.daclen_light,
    textAlign: "center",
    zIndex: 2,
  },
  textWall: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: colors.daclen_light,
    backgroundColor: "transparent",
    marginTop: (digitTextHeight - 12) / 2,
  },
  digitText: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
    backgroundColor: "transparent",
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    zIndex: 4,
  },
  timeLabel: {
    color: colors.daclen_light,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    marginTop: 12,
  },
  textOK: {
    backgroundColor: "transparent",
    color: colors.timer_green_dark,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});

export default DashboardTimer;
