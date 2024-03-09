import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { BlurView } from "expo-blur";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../styles/base";
import moment from "moment";
import { sentryLog } from "../../../sentry";
import { addZeroToArray } from "../../../axios";
import { useNavigation } from "@react-navigation/native";
import {
  countdownbottom,
  countdownbottomfrozen,
  countdownbottommessage,
  countdownbottomplural,
  countdownbottomsingular,
  countdowncompletedtitle,
  countdowndays,
  countdownfrozen,
  countdownhours,
  countdownminutes,
  countdownorange,
  countdownred,
  countdownseconds,
  countdowntitle,
} from "../../../src/constants/dashboard";
import { recruitmenttarget } from "../../../axios/constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const modalWidth =
  screenWidth < 320 ? 320 : screenWidth > 400 ? 400 : screenWidth;
const modalHeight = 258;
const digitTextWidth = 32;
const digitTextHeight = 48;
const defaultDigit = ["0", "0", "0", "0", "0", "0", "0", "0"];

const DigitText = ({ number, countdownColor }) => {
  try {
    return (
      <View
        style={[
          styles.containerDigitText,
          { width: digitTextWidth, height: digitTextHeight },
        ]}
      >
        {countdownColor === countdownfrozen ? (
          <ImageBackground
            source={require("../../../assets/frozen_dg.png")}
            style={[
              styles.background,
              {
                width: digitTextWidth,
                height: digitTextHeight,
                borderRadius: 6,
                borderWidth: 0,
                elevation: 6,
                borderColor: colors.timer_frozen_outline,
              },
            ]}
            imageStyle={{ borderRadius: 6, borderWidth: 0 }}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={
              countdownColor === countdownred
                ? [colors.timer_red_dark, colors.timer_red_light]
                : countdownColor === countdownorange
                ? [colors.timer_orange_dark, colors.timer_orange_light]
                : [colors.timer_green_dark, colors.timer_green_light]
            }
            style={[
              styles.background,
              {
                width: digitTextWidth,
                height: digitTextHeight,
                borderRadius: 6,
                borderColor:
                  countdownColor === countdownred
                    ? colors.timer_red_outline
                    : countdownColor === countdownorange
                    ? colors.timer_orange_outline
                    : colors.timer_green_outline,
              },
            ]}
          />
        )}

        <Text
          allowFontScaling={false}
          style={[
            styles.digitText,
            {
              color:
                countdownColor === countdownfrozen
                  ? colors.timer_frozen_digit
                  : colors.daclen_light,
            },
          ]}
        >
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
            backgroundColor:
              countdownColor === countdownred
                ? colors.timer_red_dark
                : countdownColor === countdownorange
                ? colors.timer_orange_dark
                : countdownColor === countdownfrozen
                ? colors.timer_frozen_dark
                : colors.timer_green_dark,
          },
        ]}
      >
        {countdownColor === countdownfrozen ? (
          <ImageBackground
            source={require("../../../assets/frozen_dg.png")}
            style={[
              styles.background,
              {
                width: digitTextWidth,
                height: digitTextHeight,
                borderRadius: 6,
                borderWidth: 0,
                elevation: 6,
                borderColor: colors.timer_frozen_outline,
              },
            ]}
            imageStyle={{ borderRadius: 6, borderWidth: 0 }}
            resizeMode="cover"
          />
        ) : null}
        <Text
          allowFontScaling={false}
          style={[
            styles.digitText,
            {
              color:
                countdownColor === countdownfrozen
                  ? colors.timer_frozen_digit
                  : colors.daclen_light,
            },
          ]}
        >
          {number.toString()}
        </Text>
      </View>
    );
  }
};

const ContainerDigit = ({ digit1, digit2, label, countdownColor }) => {
  return (
    <View style={styles.containerDigitItem}>
      <View style={styles.containerDoubleDigit}>
        <DigitText number={digit1} countdownColor={countdownColor} />
        <DigitText number={digit2} countdownColor={countdownColor} />
      </View>
      <Text
        allowFontScaling={false}
        style={[
          styles.timeLabel,
          {
            color:
              countdownColor === countdownfrozen
                ? colors.timer_frozen_title
                : colors.daclen_light,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const DashboardTimer = (props) => {
  const {
    recruitmentTimer,
    setShowTimerModal,
    join_date,
    regDateInMs,
    target_rekrutmen,
    target_rekrutmen_latest,
    total_rekrutmen,
    countdownColor,
  } = props;
  const [digits, setDigits] = useState(defaultDigit);
  const navigation = useNavigation();

  useEffect(() => {
    if (countdownColor === countdownfrozen) {
      freezeCountdown();
      return;
    }

    let newDigits = getDigits(recruitmentTimer);
    if (newDigits === null) {
      setDigits(defaultDigit);
      setShowTimerModal(false);
    } else {
      setDigits(newDigits);
    }
  }, [recruitmentTimer]);

  /*useEffect(() => {
    console.log("timer target_rekrutmen", target_rekrutmen);
  }, [target_rekrutmen]);*/

  const freezeCountdown = () => {
    if (
      !(
        target_rekrutmen_latest === undefined ||
        target_rekrutmen_latest === null
      )
    ) {
      try {
        let t =
          new Date(target_rekrutmen_latest?.tgl_akhir).getTime() -
          new Date(target_rekrutmen_latest?.tanggal_rekrut).getTime();
        let newDigits = getDigits(t);
        if (newDigits !== null) {
          setDigits(newDigits);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setDigits(defaultDigit);
  };

  const getDigits = (t) => {
    try {
      let days = Math.floor(moment.duration(t).asDays());
      let hours = Math.floor(moment.duration(t).asHours() - days * 24);
      let minutes = Math.floor(
        moment.duration(t).asMinutes() - hours * 60 - days * 60 * 24
      );
      let seconds = Math.floor(
        moment.duration(t).asSeconds() -
          minutes * 60 -
          hours * 60 * 60 -
          days * 60 * 60 * 24
      );
      return addZeroToArray(days)
        .concat(addZeroToArray(hours))
        .concat(addZeroToArray(minutes))
        .concat(addZeroToArray(seconds));
    } catch (e) {
      console.error(e);
      return null;
    }
  };

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
        <BlurView
          intensity={5}
          style={[
            styles.container,
            {
              width: screenWidth,
              height: screenHeight,
              opacity: 0.95,
            },
          ]}
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
            {countdownColor === countdownfrozen ? (
              <ImageBackground
                source={require("../../../assets/frozen_bg.png")}
                style={[
                  styles.background,
                  {
                    width: modalWidth,
                    height: modalHeight,
                    borderRadius: 12,
                    borderColor: colors.timer_frozen_outline,
                  },
                ]}
                imageStyle={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.timer_frozen_outline,
                }}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={
                  countdownColor === countdownred
                    ? [colors.timer_red_light, colors.timer_red_dark]
                    : countdownColor === countdownorange
                    ? [colors.timer_orange_light, colors.timer_orange_dark]
                    : [colors.timer_green_light, colors.timer_green_dark]
                }
                style={[
                  styles.background,
                  {
                    width: modalWidth,
                    height: modalHeight,
                    borderRadius: 12,
                    borderColor:
                      countdownColor === countdownred
                        ? colors.timer_red_outline
                        : countdownColor === countdownorange
                        ? colors.timer_orange_outline
                        : colors.timer_green_outline,
                  },
                ]}
              />
            )}

            <TouchableOpacity
              style={styles.containerModalTitle}
              onPress={() =>
                navigation.navigate("TimerExplanation", {
                  regDateInMs,
                  recruitmentTimer,
                  target_rekrutmen,
                  total_rekrutmen:
                    total_rekrutmen?.childrenSize > total_rekrutmen?.showHPV
                      ? total_rekrutmen?.childrenSize
                      : total_rekrutmen?.showHPV,
                })
              }
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.textHeader,
                  {
                    color:
                      countdownColor === countdownfrozen
                        ? colors.timer_frozen_title
                        : colors.daclen_light,
                  },
                ]}
              >
                {countdownColor === countdownfrozen
                  ? countdowncompletedtitle
                  : countdowntitle}
              </Text>
              <MaterialCommunityIcons
                name="help-circle"
                size={20}
                color={
                  countdownColor === countdownfrozen
                    ? colors.timer_frozen_title
                    : colors.daclen_light
                }
                style={styles.help}
              />
            </TouchableOpacity>

            <View style={styles.containerSubheader}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textSubheader,
                  {
                    color:
                      countdownColor === countdownfrozen
                        ? colors.timer_frozen_title
                        : colors.daclen_light,
                  },
                ]}
              >
                {`Join Date: ${join_date}`}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textSubheader,
                  {
                    color:
                      countdownColor === countdownfrozen
                        ? colors.timer_frozen_title
                        : colors.daclen_light,
                  },
                ]}
              >
                {target_rekrutmen > 0 &&
                countdownColor !== countdownfrozen &&
                total_rekrutmen?.childrenSize < recruitmenttarget
                  ? `${countdownbottom}${target_rekrutmen} ${
                      target_rekrutmen > 1
                        ? countdownbottomplural
                        : countdownbottomsingular
                    }`
                  : `${countdownbottomfrozen}${total_rekrutmen?.childrenSize} ${
                      total_rekrutmen?.childrenSize > 1
                        ? countdownbottomplural
                        : countdownbottomsingular
                    }`}
              </Text>
            </View>

            {digits === defaultDigit && countdownColor !== countdownfrozen ? (
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
                  countdownColor={countdownColor}
                />
                <Text allowFontScaling={false} style={styles.textWall}>
                  :
                </Text>
                <ContainerDigit
                  digit1={digits[2]}
                  digit2={digits[3]}
                  label={countdownhours}
                  countdownColor={countdownColor}
                />
                <Text allowFontScaling={false} style={styles.textWall}>
                  :
                </Text>
                <ContainerDigit
                  digit1={digits[4]}
                  digit2={digits[5]}
                  label={countdownminutes}
                  countdownColor={countdownColor}
                />
                <Text allowFontScaling={false} style={styles.textWall}>
                  :
                </Text>
                <ContainerDigit
                  digit1={digits[6]}
                  digit2={digits[7]}
                  label={countdownseconds}
                  countdownColor={countdownColor}
                />
              </View>
            )}

            <View
              style={[
                styles.containerBottom,
                {
                  start: (modalWidth * 0.15) / 2,
                  end: (modalWidth * 0.15) / 2,
                  bottom: 26,
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.textBottom,
                  {
                    color:
                      countdownColor === countdownred
                        ? colors.timer_red_dark
                        : countdownColor === countdownorange
                        ? colors.timer_orange_dark
                        : countdownColor === countdownfrozen
                        ? colors.timer_frozen_dark
                        : colors.timer_green_dark,
                  },
                ]}
              >
                {countdownbottommessage}
              </Text>
            </View>

            <View
              style={[
                styles.containerOK,
                {
                  start: modalWidth / 2 - 60,
                  borderWidth: countdownColor === countdownfrozen ? 0 : 1,
                  backgroundColor:
                    countdownColor === countdownfrozen
                      ? "transparent"
                      : colors.daclen_light,
                  borderColor:
                    countdownColor === countdownred
                      ? colors.timer_red_dark
                      : countdownColor === countdownorange
                      ? colors.timer_orange_dark
                      : countdownColor === countdownfrozen
                      ? colors.timer_frozen_dark
                      : colors.timer_green_dark,
                },
              ]}
            >
              {countdownColor === countdownfrozen ? (
                <ImageBackground
                  source={require("../../../assets/frozen_btn.png")}
                  style={[
                    styles.background,
                    {
                      width: "100%",
                      height: "100%",
                      borderRadius: 6,
                      borderWidth: 0,
                    },
                  ]}
                  imageStyle={{
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: colors.timer_frozen_outline,
                  }}
                  resizeMode="cover"
                />
              ) : null}
              <Text
                allowFontScaling={false}
                style={[
                  styles.textOK,
                  {
                    color:
                      countdownColor === countdownred
                        ? colors.timer_red_dark
                        : countdownColor === countdownorange
                        ? colors.timer_orange_dark
                        : countdownColor === countdownfrozen
                        ? colors.timer_frozen_ok
                        : colors.timer_green_dark,
                  },
                ]}
              >
                OK
              </Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  } catch (e) {
    console.log("DashboardTimer error", e);
    return null;
  }
};

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
    zIndex: 0,
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
    borderRadius: 12,
    elevation: 6,
  },
  containerModalTitle: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerSubheader: {
    width: modalWidth * 0.85,
    backgroundColor: "transparent",
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 4,
    justifyContent: "space-between",
    alignSelf: "center",
  },
  containerCountdown: {
    backgroundColor: "transparent",
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  containerOK: {
    position: "absolute",
    bottom: -17,
    zIndex: 6,
    elevation: 6,
    backgroundColor: colors.daclen_light,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.timer_green_dark,
    width: 120,
    height: 34,
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
  containerBottom: {
    borderRadius: 8,
    backgroundColor: colors.daclen_light,
    width: modalWidth * 0.85,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    zIndex: 6,
  },
  textSubheader: {
    backgroundColor: "transparent",
    alignSelf: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: colors.daclen_light,
  },
  textBottom: {
    backgroundColor: "transparent",
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
  },
  textHeader: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
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
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    marginTop: 12,
  },
  textOK: {
    backgroundColor: "transparent",
    color: colors.timer_green_dark,
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    zIndex: 6,
  },
  help: {
    marginStart: 10,
  },
});

export default DashboardTimer;
