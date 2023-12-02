import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import { colors, staticDimensions, dimensions } from "../../styles/base";

function BlogItem(props) {
  const [content, setContent] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (props?.isi === undefined || props?.isi === null) {
      setContent(props?.isi_limit);
    } else {
      setContent(props?.isi);
    }
  }, [props?.isi]);

  function openItem(id) {
    console.log("open Blog " + id);
    navigation.navigate("Blog", { id });
  }

  if (props?.id === undefined || props?.id === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerItem}>
        <TouchableOpacity
          onPress={() => openItem(props?.id)}
          disabled={props?.isi !== undefined && props?.isi !== null}
        >
          <View style={styles.containerImage}>
            <ActivityIndicator
              size="small"
              color={colors.daclen_gray}
              style={{ alignSelf: "center", zIndex: 0 }}
            />
            <Image
              style={styles.image}
              source={props?.foto_url}
              onClick={() => openItem(props?.id)}
              contentFit="cover"
              placeholder={null}
              transition={100}
              cachepolicy="memory-disk"
            />
          </View>

          <View style={styles.containerDescVertical}>
            <View style={styles.containerDescHorizontal}>
              {props?.tag_blog?.length > 0
                ? props?.tag_blog.map(({ nama }) => (
                    <Text
                      allowFontScaling={false}
                      key={nama}
                      style={styles.textCategory}
                    >
                      {nama}
                    </Text>
                  ))
                : null}
            </View>
            <Text allowFontScaling={false} style={styles.textDate}>
              {props?.created_at}
            </Text>
            <Text allowFontScaling={false} style={styles.textTitle}>
              {props?.judul}
            </Text>
            {content ? (
              <RenderHTML
                style={styles.textDesc}
                contentWidth={
                  dimensions.fullWidth - staticDimensions.blogTextWidthMargin
                }
                source={{ html: content }}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  containerImage: {
    width: dimensions.fullWidth,
    height: dimensions.fullWidth / 2,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerDescVertical: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  containerDescHorizontal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  containerFlatlist: {
    flex: 1,
  },
  containerItem: {
    paddingBottom: staticDimensions.pageBottomPadding / 2,
  },
  icon: {
    margin: 5,
    alignSelf: "center",
  },
  textTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: colors.daclen_black,
    marginVertical: 2,
  },
  textDate: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_gray,
    marginVertical: 6,
  },
  textDesc: {
    marginVertical: 6,
    fontFamily: "Poppins",
    fontSize: 12,
    marginHorizontal: 10,
    color: colors.daclen_gray,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginBottom: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
  },
  textCategory: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    backgroundColor: colors.daclen_green,
    color: colors.daclen_light,
    borderRadius: 2,
    marginVertical: 2,
    marginEnd: 2,
  },
  image: {
    width: dimensions.fullWidth,
    height: dimensions.fullWidth / 2,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
  },
});

export default BlogItem;
