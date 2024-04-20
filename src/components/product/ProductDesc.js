import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//import RenderHTML from "react-native-render-html";

import { colors, globalUIRatio, staticDimensions } from "../../styles/base";
import { formatProductDescription } from "../../axios/product";

export default function ProductDesc(props) {
  const deskripsi = props?.deskripsi ? props?.deskripsi : null;
  const [desc, setDesc] = useState(false);
  const [spec, setSpec] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (deskripsi === null || deskripsi === "") {
      setContent([]);
      return;
    }
    setContent(formatProductDescription(deskripsi));
  }, [deskripsi]);


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDesc((desc) => !desc)}>
        <View style={styles.containerHeader}>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.textHeader}>
            Deskripsi
          </Text>
          <MaterialCommunityIcons
              name={desc ? "chevron-up" : "chevron-down"}
              size={24 * globalUIRatio}
              color={colors.daclen_black}
            />
         
        </View>
      </TouchableOpacity>

      {desc && !(content?.length === undefined || content?.length < 1) ? (
        <View style={styles.containerDesc}>
          {content.map((item, index) => (
            <Text
              allowFontScaling={false}
              key={index}
              style={[
                styles.textDesc,
                item?.tag === "strongp" ? styles.textDescStrong : null,
              ]}
            >
              {`${item?.tag === "li" ? "• " : ""}${item?.text}`}
            </Text>
          ))}
        </View>
      ) : null}

      <TouchableOpacity onPress={() => setSpec((spec) => !spec)}>
        <View style={styles.containerHeader}>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.textHeader}>
            Spesifikasi
          </Text>
          <MaterialCommunityIcons
              name={spec ? "chevron-up" : "chevron-down"}
              size={24}
              color={colors.daclen_black}
            />
        </View>
      </TouchableOpacity>

      {spec ? (
        <View style={styles.containerVertical}>
          <View style={styles.containerSpec}>
            <Text allowFontScaling={false} style={styles.textSpec}>
              Dimensi
            </Text>
            <Text allowFontScaling={false} style={styles.textSpec}>
              {props?.dimensi} cm
            </Text>
          </View>

          <View style={styles.containerSpec}>
            <Text allowFontScaling={false} style={styles.textSpec}>
              Berat
            </Text>
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

/*
<RenderHTML
        style={styles.textDesc}
        contentWidth={dimensions.fullWidth}
        source={{ html: content }}
        enableCSSInlineProcessing
      />
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  containerDesc: {
    backgroundColor: "transparent",
    marginBottom: 12,
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
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: staticDimensions.marginHorizontal,
    borderBottomWidth: 1,
    borderColor: colors.daclen_grey_placeholder,
  },
  textHeader: {
    flex: 1,
    fontSize: 18 * globalUIRatio,
    fontFamily: "Poppins-Light",
    color: colors.black,
  },
  textDesc: {
    fontFamily: "Poppins",
    fontSize: 11 * globalUIRatio,
    backgroundColor: "transparent",
    textAlign: "justify",
    lineHeight: 20 * globalUIRatio,
    color: colors.black,
    marginBottom: 10,
  },
  textDescStrong: {
    marginTop: 6,
    fontSize: 13 * globalUIRatio,
    fontFamily: "Poppins-SemiBold",
  },
  textSpec: {
    flex: 1,
    padding: 8,
    fontFamily: "Poppins-Light",
    fontSize: 11 * globalUIRatio,
    color: colors.daclen_black,
  },
  arrow: {
    marginStart: 10,
  },
});
