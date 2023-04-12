import React, { useState, useEffect } from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import { ImageSlider } from "react-native-image-slider-banner";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getSliderContent } from "../../axios/home";
import { colors } from "../../styles/base";

function Slider(props) {
  const { sliders } = props;
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;
  const aspectRatio = 1625 / 650;

  useEffect(() => {
    if ((sliders === null || sliders.length < 1) && !loading) {
      props.getSliderContent();
      setLoading(true);
      setPhotos([]);
    } else {
      setLoading(false);
      const data = [
        ...new Set(
          sliders
            .map(({ foto, foto_small, produk_id }) => ({
              img: foto === "" || foto === null ? foto_small : foto,
              id: produk_id,
            }))
            .flat(1)
        ),
      ];
      setPhotos(data);
      //console.log(data);
    }
  }, [sliders]);

  const openProduct = (id) => {
    console.log(id);
    if (id !== null && id !== undefined) {
      navigation.navigate("Product", { id });
    }
  };

  return (
    <View style={{ width: windowWidth }}>
      {loading ? (
        <ActivityIndicator
          size="small"
          style={{ alignSelf: "center", marginVertical: 20 }}
          color={colors.daclen_gray}
        />
      ) : sliders?.length > 0 ? (
        <ImageSlider
          data={photos}
          autoPlay={true}
          preview={false}
          caroselImageContainerStyle={{
            aspectRatio,
            backgroundColor: colors.daclen_light,
          }}
          caroselImageStyle={{
            width: windowWidth,
            height: windowWidth / aspectRatio,
            resizeMode: "contain",
          }}
          indicatorContainerStyle={{ bottom: 10 }}
          activeIndicatorStyle={{ backgroundColor: colors.daclen_orange }}
          inActiveIndicatorStyle={{ backgroundColor: colors.daclen_light }}
          timer={2000}
          onClick={(item) => openProduct(item?.id)}
          style={{ margin: 0, padding: 0, width: "100%" }}
        />
      ) : null}
    </View>
  );
}

const mapStateToProps = (store) => ({
  sliders: store.homeState.sliders,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getSliderContent,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Slider);
