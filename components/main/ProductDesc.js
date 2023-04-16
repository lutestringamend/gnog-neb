import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RenderHTML from "react-native-render-html";

import Separator from "../profile/Separator";
import { colors, dimensions } from "../../styles/base";

export default function ProductDesc(props) {
  const [desc, setDesc] = useState(false);
  const [spec, setSpec] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (props?.deskripsi === undefined || props?.deskripsi === null || !desc) {
      setContent("");
    } else {
      setContent(props?.deskripsi);
    }
  }, [desc]);

  return (
    <View style={styles.container}>
      <Separator thickness={2} />
      <TouchableOpacity onPress={() => setDesc(!desc)}>
        <View style={styles.containerHeader}>
          <Text style={styles.textHeader}>Deskripsi</Text>
          {desc ? (
            <MaterialCommunityIcons name="chevron-up" size={24} />
          ) : (
            <MaterialCommunityIcons name="chevron-down" size={24} />
          )}
        </View>
      </TouchableOpacity>

      <RenderHTML
        style={styles.textDesc}
        contentWidth={dimensions.fullWidth}
        source={{ html: content }}
      />

      <Separator thickness={2} />
      <TouchableOpacity onPress={() => setSpec(!spec)}>
        <View style={styles.containerHeader}>
          <Text style={styles.textHeader}>Spesifikasi</Text>
          {spec ? (
            <MaterialCommunityIcons name="chevron-up" size={24} />
          ) : (
            <MaterialCommunityIcons name="chevron-down" size={24} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.containerSpec}>
        <Text style={styles.textSpecHeader}>Dimensi</Text>
        <Text style={styles.textSpec}>{props?.dimensi} cm</Text>
      </View>

      <View style={styles.containerSpec}>
        <Text style={styles.textSpecHeader}>Berat</Text>
        <Text style={styles.textSpec}>
          {(props?.berat / 1000).toFixed(2)} kg
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    paddingBottom: 60,
    backgroundColor: "white",
  },
  containerHeader: {
    flexDirection: "row",
    paddingVertical: 15,
  },
  containerSpec: {
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: 10,
    borderColor: colors.daclen_gray,
    borderWidth: 1,
  },

  textHeader: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.daclen_blue,
  },
  textDesc: {
    fontSize: 14,
    backgroundColor: colors.daclen_light,
    color: colors.daclen_gray,
  },
  textSpecHeader: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_graydark,
  },
  textSpec: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: colors.daclen_black,
  },
  arrow: {
    marginStart: 10,
  },
});
