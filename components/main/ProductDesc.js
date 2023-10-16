import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RenderHTML from "react-native-render-html";

import Separator from "../profile/Separator";
import { colors, dimensions, staticDimensions } from "../../styles/base";

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
      <TouchableOpacity onPress={() => setDesc((desc) => !desc)}>
        <View style={styles.containerHeader}>
          <Text allowFontScaling={false} style={styles.textHeader}>Deskripsi</Text>
          {desc ? (
            <MaterialCommunityIcons name="chevron-up" size={24} color={colors.daclen_gray} />
          ) : (
            <MaterialCommunityIcons name="chevron-down" size={24} color={colors.daclen_gray} />
          )}
        </View>
      </TouchableOpacity>

      <RenderHTML
        style={styles.textDesc}
        contentWidth={dimensions.fullWidth}
        source={{ html: content }}
        enableCSSInlineProcessing
      />

      <Separator thickness={2} />
      <TouchableOpacity onPress={() => setSpec((spec) => !spec)}>
        <View style={styles.containerHeader}>
          <Text allowFontScaling={false} style={styles.textHeader}>Spesifikasi</Text>
          {spec ? (
            <MaterialCommunityIcons name="chevron-up" size={24} color={colors.daclen_gray} />
          ) : (
            <MaterialCommunityIcons name="chevron-down" size={24} color={colors.daclen_gray} />
          )}
        </View>
      </TouchableOpacity>

      {spec ? (
        <View style={styles.containerVertical}>
          <View style={styles.containerSpec}>
            <Text allowFontScaling={false} style={styles.textSpecHeader}>Dimensi</Text>
            <Text allowFontScaling={false} style={styles.textSpec}>{props?.dimensi} cm</Text>
          </View>

          <View style={styles.containerSpec}>
            <Text allowFontScaling={false} style={styles.textSpecHeader}>Berat</Text>
            <Text allowFontScaling={false} style={styles.textSpec}>
              {(props?.berat / 1000).toFixed(2)} kg
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.containerBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: colors.white,
  },
  containerHeader: {
    flexDirection: "row",
    paddingVertical: 15,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  containerBottom: {
    backgroundColor: "transparent",
    height: staticDimensions.pageBottomPadding / 2,
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
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_gray,
  },
  textDesc: {
    fontFamily: "Poppins", fontSize: 12,
    backgroundColor: "transparent",
    color: colors.daclen_gray,
  },
  textSpecHeader: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_graydark,
  },
  textSpec: {
    flex: 1,
    padding: 8,
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_black,
  },
  arrow: {
    marginStart: 10,
  },
});
