import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
//import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../styles/base";
import moment from "moment";
import { sentryLog } from "../../../sentry";
import { addZeroToArray } from "../../../axios";
import { useNavigation } from "@react-navigation/native";
import {
  countdownbottom,
  countdowndays,
  countdownhours,
  countdownminutes,
  countdownseconds,
  countdowntitle,
} from "../constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const modalWidth =
  screenWidth < 320 ? 320 : screenWidth > 400 ? 400 : screenWidth;
const modalHeight = 214;
const digitTextWidth = 32;
const digitTextHeight = 48;
const defaultDigit = ["0", "0", "0", "0", "0", "0", "0", "0"];

const DigitText = ({ number }) => {
  try {
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
        <Text allowFontScaling={false} style={styles.digitText}>
          {number.toString()}
        </Text>
      </View>
    );
  } catch (e) {
    console.error(e);
    return (
      <View
        style={[
          styles.containerDigitText,
          {
            width: digitTextWidth,
            height: digitTextHeight,
            backgroundColor: colors.timer_green_dark,
          },
        ]}
      >
        <Text allowFontScaling={false} style={styles.digitText}>
          {number.toString()}
        </Text>
      </View>
    );
  }
};

const ContainerDigit = ({ digit1, digit2, label }) => {
  return (
    <View style={styles.containerDigitItem}>
      <View style={styles.containerDoubleDigit}>
        <DigitText number={digit1} />
        <DigitText number={digit2} />
      </View>
      <Text allowFontScaling={false} style={styles.timeLabel}>
        {label}
      </Text>
    </View>
  );
};

const DashboardTimer = (props) => {
  const { recruitmentTimer, setShowTimerModal, regDateInMs, target_rekrutmen } =
    props;
  const [digits, setDigits] = useState(defaultDigit);
  const navigation = useNavigation();

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
            zIndex: 100,
            elevation: 4,
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
                top: (screenHeight - modalHeight) / 2 - 40,
                bottom: (screenHeight - modalHeight) / 2 + 40,
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
            <TouchableOpacity
              style={styles.containerModalTitle}
              onPress={() =>
                navigation.navigate("TimerExplanation", {
                  regDateInMs,
                  recruitmentTimer,
                  target_rekrutmen,
                })
              }
            >
              <Text allowFontScaling={false} style={styles.textHeader}>
                {countdowntitle}
              </Text>
              <MaterialCommunityIcons
                name="help-circle"
                size={20}
                color={colors.daclen_light}
                style={styles.help}
              />
            </TouchableOpacity>

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
                  label={countdowndays}
                />
                <Text allowFontScaling={false} style={styles.textWall}>
                  :
                </Text>
                <ContainerDigit
                  digit1={digits[2]}
                  digit2={digits[3]}
                  label={countdownhours}
                />
                <Text allowFontScaling={false} style={styles.textWall}>
                  :
                </Text>
                <ContainerDigit
                  digit1={digits[4]}
                  digit2={digits[5]}
                  label={countdownminutes}
                />
                <Text allowFontScaling={false} style={styles.textWall}>
                  :
                </Text>
                <ContainerDigit
                  digit1={digits[6]}
                  digit2={digits[7]}
                  label={countdownseconds}
                />
              </View>
            )}

            <Text
              allowFontScaling={false}
              style={[
                styles.textBottom,
                {
                  start: 0,
                  end: 0,
                  width: modalWidth,
                  bottom: 28,
                },
              ]}
            >
              {`${countdownbottom}${
                target_rekrutmen > 1
                  ? `${target_rekrutmen} Sellers`
                  : `${target_rekrutmen} Seller`
              }`}
            </Text>

            <View style={[styles.containerOK, { start: modalWidth / 2 - 60 }]}>
              <Text allowFontScaling={false} style={styles.textOK}>
                OK
              </Text>
            </View>
          </View>
      </TouchableOpacity>
    );
  } catch (e) {
    console.log("DashboardTimer error", e);
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: screenWidth,
            height: screenHeight,
            zIndex: 100,
            elevation: 4,
            opacity: 0.95,
          },
        ]}
        onPress={() => setShowTimerModal((showTimerModal) => !showTimerModal)}
      >
        <View
          style={[
            styles.containerTimer,
            {
              backgroundColor: colors.timer_green_light,
              width: modalWidth,
              height: modalHeight,
              start: (screenWidth - modalWidth) / 2,
              end: (screenWidth - modalWidth) / 2,
              top: (screenHeight - modalHeight) / 2 - 40,
              bottom: (screenHeight - modalHeight) / 2 + 40,
            },
          ]}
        >
          <View style={styles.containerModalTitle}>
            <Text allowFontScaling={false} style={styles.textHeader}>
              {countdowntitle}
            </Text>
            <MaterialCommunityIcons
              name="help-circle"
              size={20}
              color={colors.daclen_light}
              style={styles.help}
            />
          </View>

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
                label={countdowndays}
              />
              <Text allowFontScaling={false} style={styles.textWall}>
                :
              </Text>
              <ContainerDigit
                digit1={digits[2]}
                digit2={digits[3]}
                label={countdownhours}
              />
              <Text allowFontScaling={false} style={styles.textWall}>
                :
              </Text>
              <ContainerDigit
                digit1={digits[4]}
                digit2={digits[5]}
                label={countdownminutes}
              />
              <Text allowFontScaling={false} style={styles.textWall}>
                :
              </Text>
              <ContainerDigit
                digit1={digits[6]}
                digit2={digits[7]}
                label={countdownseconds}
              />
            </View>
          )}

          <Text
            allowFontScaling={false}
            style={[
              styles.textBottom,
              {
                start: 0,
                end: 0,
                width: modalWidth,
                bottom: 28,
              },
            ]}
          >
            {`${countdownbottom}${
              target_rekrutmen > 1
                ? `${target_rekrutmen} Sellers`
                : `${target_rekrutmen} Seller`
            }`}
          </Text>

          <View style={[styles.containerOK, { start: modalWidth / 2 - 60 }]}>
            <Text allowFontScaling={false} style={styles.textOK}>
              OK
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

/*
        <BlurView
          intensity={10}
          style={[
            styles.container,
            {
              width: screenWidth,
              height: screenHeight,

              opacity: 0.95,
            },
          ]}
        >

        </BlurView>
*/

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    start: 0,
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
  containerModalTitle: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  textBottom: {
    backgroundColor: "transparent",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 12,
    position: "absolute",
    color: colors.daclen_light,
    zIndex: 6,
  },
  textHeader: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: colors.daclen_light,
    textAlign: "center",
    zIndex: 2,
    alignSelf: "center",
  },
  textWall: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: colors.daclen_light,
    backgroundColor: "transparent",
    marginTop: (digitTextHeight - 12) / 2,
  },
  digitText: {
    fontSize: 26,
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
  help: {
    marginStart: 10,
  },
});

export default DashboardTimer;
