import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions } from "../../../styles/base";
import { mainhttp } from "../../../axios/constants";

const width = (dimensions.fullWidth - 36) / 2;
const photoHeight = (width * 537) / 403;

const PointExchangeItem = (props) => {
  const { nama, foto, harga_poin, index, disabled } = props;

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: disabled ? colors.daclen_light : colors.white,
          marginStart: index % 2 === 0 ? 0 : 6,
          marginEnd: index % 2 === 0 ? 6 : 0,
          marginTop: index < 2 ? 24 : 0,
        },
      ]}
    >
      <ImageBackground
        source={
          foto
            ? { uri: `${mainhttp}${foto}` }
            : require("../../../assets/logoblack.png")
        }
        resizeMode="cover"
        style={styles.photo}
      />
      <Text allowFontScaling={false} style={styles.textHeader}>
        {nama}
      </Text>
      <Text allowFontScaling={false} style={styles.textPoint}>
        {`${harga_poin} Poin`}
      </Text>
      <TouchableOpacity
        onPress={() => onPress()}
        disabled={disabled}
        style={[
          styles.containerButton,
          {
            backgroundColor: disabled
              ? colors.daclen_gray
              : colors.daclen_yellow,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="cart"
          size={12}
          color={colors.daclen_black}
        />
        <Text allowFontScaling={false} style={styles.textButton}>
          Keranjang
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: colors.daclen_box_grey,
    width,
    marginBottom: 24,
    paddingBottom: 12,
    elevation: 2,
  },
  photo: {
    backgroundColor: colors.daclen_light,
    width: width,
    height: photoHeight,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    overflow: "hidden",
  },
  containerButton: {
    marginHorizontal: 8,
    marginTop: 20,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.daclen_yellow_new,
  },
  textHeader: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_black,
    marginTop: 12,
    textAlignVertical: "center",
    marginHorizontal: 8,
  },
  textPoint: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_gray,
    marginTop: 4,
    marginHorizontal: 8,
  },
  textButton: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_black,
    marginStart: 8,
  },
});

export default PointExchangeItem;
