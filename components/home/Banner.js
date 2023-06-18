import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";

import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getBannerTiga } from "../../axios/home";

import { webregister, webshop } from "../../axios/constants";
import { colors, blurhash } from "../../styles/base";

function Banner(props) {
  const { banners } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if ((banners === null || banners.length < 1) && !loading) {
      props.getBannerTiga();
      setLoading(true);
    } else {
      setLoading(false);
    }
    //console.log(banners);
  }, [banners]);

  function openItem(link) {
    if (!loading) {
      /*setLoading(true);
      props.getCheckoutItem(id);*/
      switch (link) {
        case webregister:
          navigation.navigate("Login");
          break;
        case webshop:
          //navigation.navigate("Main");
          break;
        default:
          console.log(link);
          break;
      }
    }
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={{ alignSelf: "center", marginVertical: 29 }}
          color={colors.daclen_gray}
        />
      ) : banners?.length > 0 ? (
        <FlatList
          numColumns={3}
          horizontal={false}
          data={banners}
          renderItem={({ item, index }) => (
            <View style={styles.containerItem} key={index}>
              <TouchableOpacity onPress={() => openItem(item?.link)}>
                <Image
                  key={index}
                  style={styles.imageBanner}
                  source={item?.foto}
                  alt={item?.judul}
                  contentFit="contain"
                  placeholder={blurhash}
                  transition={0}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerItem: {
    flex: 1 / 3,
    paddingHorizontal: 2,
    backgroundColor: colors.daclen_light,
  },
  imageBanner: {
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  banners: store.homeState.banners,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getBannerTiga,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Banner);
