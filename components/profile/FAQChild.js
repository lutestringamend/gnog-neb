import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { colors } from "../../styles/base";
import Separator from "./Separator";

export default function FAQChild(props) {
  const [expand, setExpand] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpand(!expand)}>
        <Text style={styles.textQuestion}>Q: {props?.pertanyaan}</Text>
      </TouchableOpacity>
      {expand && (
        <View style={styles.container}>
          <Text style={styles.textAnswer}>A:</Text>
          <Text style={[styles.textAnswer, { paddingBottom: 20 }]}>
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
    fontWeight: "bold",
    color: colors.daclen_black,
    padding: 20,
  },
  textAnswer: {
    fontSize: 14,
    color: colors.daclen_gray,
    paddingHorizontal: 24,
  },
});
