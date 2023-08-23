import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";
import { phonenotverified } from "../dashboard/constants";
import { userverified } from "../dashboard/constants";

export default function BSUserRoot(props) {
  const { data } = props;
  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text style={styles.textTitle}>{props?.title}</Text>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => props?.closeThis()}
        >
          <MaterialCommunityIcons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.containerContent}>
        <View style={styles.containerLogo}>
          <Image
            source={require("../../assets/user.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.containerInfo}>
          <Text style={styles.textName}>{data?.name}</Text>
          <Text
            style={[
              styles.textVerification,
              {
                backgroundColor: data?.nomor_telp_verified_at
                  ? colors.daclen_green
                  : colors.daclen_red,
              },
            ]}
          >
            {data?.nomor_telp_verified_at ? data?.nomor_telp ? data?.nomor_telp : userverified : phonenotverified}
          </Text>
          <Text style={styles.text}>
            PV: {data?.pv ? data?.pv : "0"}
          </Text>
          <Text style={styles.text}>
            RPV: {data?.rpv ? data?.rpv : "0"}
          </Text>
          <Text style={styles.text}>
            HPV: {data?.hpv ? data?.hpv : "0"}
          </Text>
          <Text style={styles.text}>
            Poin Bulan Ini:{" "}
            {data?.user?.poin_user_this_month
              ? data?.user?.poin_user_this_month
              : "0"}
          </Text>
        </View>
      </View>

      {props?.closeThis === null ? null : (
        <TouchableOpacity
          onPress={() => props?.closeThis()}
          style={styles.button}
        >
          <Text style={styles.textButton}>OK</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: colors.daclen_light,
    borderTopWidth: 2,
    borderTopColor: colors.daclen_gray,
    elevation: 10,
    alignItems: "center",
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.daclen_black,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  containerFlatlist: {
    backgroundColor: colors.daclen_light,
    paddingBottom: 60,
  },
  containerLogo: {
    backgroundColor: colors.daclen_light,
  },
  containerContent: {
    width: "80%",
    marginVertical: 20,
    flexDirection: "row",
    backgroundColor: colors.daclen_light,
  },
  containerInfo: {
    flex: 1,
    backgroundColor: colors.daclen_light,
    marginStart: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  icon: {
    backgroundColor: colors.daclen_black,
  },
  button: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  textTitle: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: colors.daclen_gray,
  },
  textVerification: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.daclen_light,
    backgroundColor: colors.daclen_lightgrey,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  textName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.daclen_black,
  },
});
