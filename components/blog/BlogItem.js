import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import { colors, dimensions, staticDimensions } from "../../styles/base";


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

  return (
    <View style={styles.container}>
      {props?.id !== null && props?.id !== undefined ? (
        <ScrollView style={styles.containerItem}>
          <TouchableOpacity
            onPress={() => openItem(props?.id)}
            disabled={props?.isi !== undefined && props?.isi !== null}
          >
            <Image
              style={styles.image}
              source={{ uri: props?.foto_url }}
              onClick={() => openItem(props?.id)}
            />

            <View style={styles.containerDescVertical}>
              <View style={styles.containerDescHorizontal}>
                {props?.tag_blog?.length > 0 && (
                  <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={props?.tag_blog}
                    style={styles.containerFlatlist}
                    renderItem={({ item }) => <Text style={styles.textCategory}>{item?.nama}</Text>}
                  />
                )}
                <Text style={styles.textDate}>{props?.created_at}</Text>
              </View>
              <Text style={styles.textTitle}>{props?.judul}</Text>
              <RenderHTML
                style={styles.textDesc}
                contentWidth={dimensions.blogTextWidth}
                source={{ html: content }}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ActivityIndicator
              size="large"
              color={colors.daclen_orange}
              style={{ alignSelf: "center", marginVertical: 20 }}
            />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: dimensions.fullWidth,
  },
  containerDescVertical: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  containerDescHorizontal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4,
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
    fontWeight: "bold",
    fontSize: 20,
    color: colors.daclen_black,
    marginVertical: 6,
  },
  textDate: {
    alignSelf: 'center',
    fontSize: 12,
    color: colors.daclen_gray,
  },
  textDesc: {
    marginVertical: 6,
    fontSize: 14,
    marginHorizontal: 10,
    color: colors.daclen_gray,
  },
  textUid: {
    fontSize: 12,
    marginBottom: 12,
    color: colors.daclen_gray,
    marginHorizontal: 20,
  },
  textCategory: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
    fontWeight: "bold",
    backgroundColor: colors.daclen_green,
    color: colors.daclen_light,
    borderRadius: 2,
    marginVertical: 2,
    marginEnd: 8,
  },
  image: {
    width: dimensions.fullWidth,
    aspectRatio: 2 / 1,
  },
});

export default BlogItem;
