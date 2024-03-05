import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, dimensions, staticDimensions } from "../../styles/base";

const ratio = dimensions.fullWidthAdjusted / 430;

const OTPInput = ({
  code,
  setCode,
  maximumLength,
  setIsPinReady,
  style,
  boxStyle,
  fontSize,
}) => {
  const boxArray = new Array(maximumLength).fill(0);
  const inputRef = useRef();

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    setIsPinReady(code.length === maximumLength);
    return () => {
      setIsPinReady(false);
    };
  }, [code]);

  const boxDigit = (_, index) => {
    const emptyInput = "";
    const digit = code[index] || emptyInput;

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

    return (
      <View
        style={[
          styles.SplitBoxes,
          isInputBoxFocused && isValueFocused ? styles.SplitBoxesFocused : null,
          boxStyle ? boxStyle : null,
        ]}
        key={index}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.SplitBoxText,
            isInputBoxFocused && isValueFocused
              ? { color: colors.black }
              : null,
            { fontSize: (fontSize ? fontSize : 20) * ratio },
          ]}
        >
          {digit}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.OTPInputContainer, style ? style : null]}>
      <Pressable style={styles.SplitOTPBoxesContainer} onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </Pressable>
      <TextInput
        style={styles.TextInputHidden}
        inputMode="numeric"
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        ref={inputRef}
        onBlur={handleOnBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  OTPInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  SplitOTPBoxesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  TextInputHidden: {
    position: "absolute",
    opacity: 0,
  },
  SplitBoxes: {
    borderColor: colors.daclen_dark,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 10 * ratio,
    justifyContent: "center",
    alignItems: "center",
    width: 60 * ratio,
    height: 60 * ratio,
    marginHorizontal: staticDimensions.marginHorizontal / 4,
  },
  SplitBoxesFocused: {
    borderColor: colors.daclen_dark,
    backgroundColor: colors.daclen_grey_light,
  },
  SplitBoxText: {
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    color: colors.black,
  },
});

export default OTPInput;
