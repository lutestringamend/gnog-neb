import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../../styles/base";

const OTPInput = ({ code, setCode, maximumLength, setIsPinReady, style }) => {
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
        ]}
        key={index}
      >
        <Text
          style={[
            styles.SplitBoxText,
            isInputBoxFocused && isValueFocused ? { color: colors.daclen_light } : null,
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
    backgroundColor: "transparent",
  },
  SplitOTPBoxesContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
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
    paddingVertical: 20,
    paddingHorizontal: 28,
    minWidth: 50,
    minHeight: 60,
  },
  SplitBoxesFocused: {
    borderColor: colors.daclen_light,
    backgroundColor: colors.daclen_blue,
  },
  SplitBoxText: {
    fontFamily: "Poppins", fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    color: colors.daclen_graydark,
  },
});

export default OTPInput;
