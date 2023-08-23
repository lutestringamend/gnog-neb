import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";
import { sentryLog } from "../../sentry";

const AddressItem = (props) => {
  try {
    const { item, isRealtime, isDefault, addressId, disabled } = props;
    const [isSelected, setSelected] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
      if (isDefault && addressId === "default") {
        setSelected(true);
      } else if (addressId === item?.id) {
        setSelected(true);
      } else {
        setSelected(false);
      }
    }, [addressId]);

    const pickAddress = () => {
      if (props.onPress === undefined || props.onPress === null) {
        return;
      }
      props.onPress(isDefault ? "default" : item?.id);
    };

    return (
      <TouchableOpacity
        style={[styles.container, props?.style ? props?.style : null]}
        onPress={() => pickAddress()}
        disabled={isSelected}
      >
        <View
          style={[
            styles.containerInner,
            {
              borderColor: isDefault
                ? colors.daclen_orange
                : isSelected
                ? colors.daclen_green
                : colors.daclen_gray,
              backgroundColor: isSelected
                ? colors.daclen_offgreen
                : colors.white,
            },
          ]}
        >
          <View style={styles.containerHorizontal}>
            <MaterialCommunityIcons
              name={
                isDefault
                  ? "home-map-marker"
                  : isSelected
                  ? "map-marker-check"
                  : "map-marker"
              }
              size={32}
              color={
                isDefault
                  ? colors.daclen_orange
                  : isSelected
                  ? colors.daclen_green
                  : colors.daclen_gray
              }
            />

            <View style={styles.containerVertical}>
              <View style={styles.containerHorizontalFlat}>
                <Text
                  style={[
                    styles.textName,
                    {
                      flex: 1,
                      color: isDefault
                        ? colors.daclen_orange
                        : isSelected
                        ? colors.daclen_green
                        : colors.daclen_black,
                    },
                  ]}
                >
                  {isDefault
                    ? "Alamat Utama"
                    : item?.nama_lengkap
                    ? item?.nama_lengkap
                    : `${item?.nama_depan} ${item?.nama_belakang}`}
                </Text>
              </View>

              <Text style={[styles.textDesc, { marginTop: 6 }]}>
                {isDefault
                  ? `${item?.alamat}${
                      item?.provinsi?.name ? `, ${item?.provinsi?.name}` : ""
                    }${item?.kota?.name ? `, ${item?.kota?.name}` : ""}${
                      item?.kecamatan?.name ? `, ${item?.kecamatan?.name}` : ""
                    } ${item?.kode_pos}`
                  : `${item?.alamat}, ${item?.kecamatan_name}, ${item?.kota_name}, ${item?.provinsi_name} ${item?.kode_pos}`}
              </Text>

              {isDefault ? (
                <Text
                  style={[styles.textDesc, { marginTop: 6 }]}
                >{`${item?.nama_depan} ${item?.nama_belakang}\n${item?.nomor_telp}`}</Text>
              ) : item?.nomor_telp === undefined ||
                item?.nomor_telp === null ||
                item?.nomor_telp === "" ? null : (
                <Text style={styles.textDesc}>{item?.nomor_telp}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.containerButtons}>
          <TouchableOpacity
            onPress={() => pickAddress()}
            style={[
              styles.containerButton,
              {
                backgroundColor: isSelected
                  ? colors.daclen_green
                  : colors.daclen_blue,
                borderBottomLeftRadius: 6,
              },
            ]}
            disabled={disabled || isSelected}
          >
            <MaterialCommunityIcons
              name={isSelected ? "check-bold" : "cursor-pointer"}
              size={16}
              color={colors.daclen_light}
            />

            <Text style={styles.textButton}>
              {isSelected ? "Terpilih" : "Pilih"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Address", {
                addressData: item,
                isRealtime: false,
                isDefault,
                isNew: false,
              })
            }
            style={[
              styles.containerButton,
              {
                backgroundColor: colors.daclen_indigo,
                borderBottomRightRadius: 6,
              },
            ]}
            disabled={disabled}
          >
            <MaterialCommunityIcons
              name="file-edit"
              size={16}
              color={colors.daclen_light}
            />
            <Text style={styles.textButton}>Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <View>
        <Text>{e.toString()}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    elevation: 4,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    borderBottomStartRadius: 6,
    borderBottomEndRadius: 6,
    backgroundColor: "transparent",
  },
  containerInner: {
    borderWidth: 1,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    borderBottomWidth: 0,
  },
  containerHorizontalFlat: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 20,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  containerVertical: {
    flex: 1,
    backgroundColor: "transparent",
    marginStart: 20,
  },
  containerRealtimeButton: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomStartRadius: 6,
    borderBottomEndRadius: 6,
  },
  containerButtons: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerButton: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textName: {
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "transparent",
    color: colors.daclen_black,
  },
  textDesc: {
    fontSize: 12,
    backgroundColor: "transparent",
    color: colors.daclen_gray,
  },
  textButton: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: colors.daclen_light,
    marginStart: 6,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 6,
  },
});

export default AddressItem;
