import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getBannerTiga } from "../../axios/home";

import { webregister, webshop } from "../../axios/constants";

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
      {banners?.length > 0 && (
        <FlatList
          numColumns={3}
          horizontal={false}
          data={banners}
          renderItem={({ item }) => (
            <View style={styles.containerItem}>
              <TouchableOpacity onPress={() => openItem(item?.link)}>
                <Image
                  style={styles.imageBanner}
                  source={{ uri: item?.foto }}
                  alt={item?.judul}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
