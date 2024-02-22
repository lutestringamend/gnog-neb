import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { colors } from "../../../styles/base";
import Separator from "../Separator";

export default function FAQChild(props) {
  const [expand, setExpand] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpand(!expand)}>
        <Text allowFontScaling={false} style={styles.textQuestion}>Q: {props?.pertanyaan}</Text>
      </TouchableOpacity>
      {expand && (
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.textAnswer}>A:</Text>
          <Text allowFontScaling={false} style={[styles.textAnswer, { paddingBottom: 20 }]}>
            {props?.jawaban}
          </Text>
        </View>
      )}
      <Separator thickness={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textQuestion: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_black,
    padding: 20,
  },
  textAnswer: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_gray,
    paddingHorizontal: 24,
  },
});
