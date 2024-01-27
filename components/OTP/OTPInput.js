import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../../styles/base";

const OTPInput = ({ code, setCode, maximumLength, setIsPinReady, style, boxStyle, fontSize }) => {
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
        <Text allowFontScaling={false}
          style={[
            styles.SplitBoxText,
            isInputBoxFocused && isValueFocused ? { color: colors.daclen_light } : null,
            { fontSize: fontSize ? fontSize : 24 },
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
    borderColor: colors.daclen_gray,
    backgroundColor: colors.daclen_light,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    height: 72,
  },
  SplitBoxesFocused: {
    borderColor: colors.daclen_light,
    backgroundColor: colors.daclen_blue,
  },
  SplitBoxText: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    color: colors.daclen_graydark,
  },
});

export default OTPInput;
