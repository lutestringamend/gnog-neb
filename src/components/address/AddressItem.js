import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { presentAddress } from "../../utils/address";
import Button from "../Button/Button";

const ratio = dimensions.fullWidthAdjusted / 430;

const AddressItem = (props) => {
  const {
    id,
    isDefault,
    addressId,
    style,
    disabled,
    nama_depan,
    nama_belakang,
  } = props;
  const navigation = useNavigation();

  const editAddress = () => {
    navigation.navigate("Address", {
      addressData: props,
      isRealtime: false,
      isDefault: false,
      isNew: false,
    });
  };

  const pickAddress = () => {
    if (props.onPress === undefined || props.onPress === null) {
      return;
    }
    props.onPress(isDefault ? "default" : id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => pickAddress()}
        style={[
          styles.containerSaldo,
          {
            borderWidth:
              addressId === id ||
              ((addressId === "" || addressId === "default") && isDefault)
                ? 1
                : 0,
          },
          style ? style : null,
        ]}
      >
        <View style={styles.containerHeader}>
          <View style={styles.containerIcon}>
            <MaterialCommunityIcons
              name={
                isDefault
                  ? "home-map-marker"
                  : addressId === id
                    ? "map-marker-check"
                    : "map-marker"
              }
              size={20 * ratio}
              color={colors.daclen_grey_icon}
            />
          </View>

          <View
            style={[
              styles.containerDescVertical,
              {
                flex: 1,
                marginHorizontal: 10 * ratio,
                marginBottom: staticDimensions.marginHorizontal / 2,
              },
            ]}
          >
            <Text allowFontScaling={false} style={styles.textPrice}>
              {`${nama_depan} ${nama_belakang}`}
            </Text>
            <Text allowFontScaling={false} style={styles.textStatus}>
              {presentAddress(props)}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24 * ratio}
            color={colors.black}
          />
        </View>
        <View style={styles.containerDescHorizontal}>
          <Text allowFontScaling={false} style={styles.textType}>
            {isDefault
              ? "Alamat Utama"
              : addressId === id
                ? "Alamat Terpilih"
                : "Alamat"}
          </Text>
          <Button
            text="Detail"
            disabled={disabled}
            style={styles.button}
            fontSize={11 * ratio}
            onPress={() => editAddress()}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.daclen_grey_light,
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    alignSelf: "center",
    marginBottom: 10 * ratio,
  },
  containerSaldo: {
    backgroundColor: colors.white,
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    maxHeight: 200 * ratio,
    borderRadius: 12 * ratio,
    borderColor: colors.daclen_success,
    padding: 10 * ratio,
    elevation: 4,
  },
  containerHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerIcon: {
    backgroundColor: colors.daclen_grey_light,
    width: 40 * ratio,
    height: 40 * ratio,
    borderRadius: 20 * ratio,
    justifyContent: "center",
    alignItems: "center",
  },
  containerDescVertical: {
    backgroundColor: "transparent",
  },
  containerDescHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4 * ratio,
  },
  containerPoints: {
    marginHorizontal: 10,
  },
  icon: {
    alignSelf: "center",
  },
  textPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18 * ratio,
    color: colors.black,
  },
  textStatus: {
    fontFamily: "Poppins",
    fontSize: 11 * ratio,
    marginTop: 4 * ratio,
    color: colors.black,
  },
  textType: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.daclen_grey_placeholder,
  },
  textLight: {
    fontFamily: "Poppins-Light",
    fontSize: 11 * ratio,
    color: colors.daclen_grey_placeholder,
  },
  textBalance: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14 * ratio,
    color: colors.black,
  },
  button: {
    width: 60 * ratio,
    height: 36 * ratio,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

export default AddressItem;
