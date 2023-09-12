import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";
import { useNavigation } from "@react-navigation/native";

export default function BSDashboard(props) {
  const navigation = useNavigation();

  function buttonPress() {
    try {
      navigation.navigate(props?.data?.screen);
    } catch (e) {
      console.error(e);
    }
    props?.closeThis();
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text style={styles.textTitle}>{props?.data?.title}</Text>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => props?.closeThis()}
        >
          <MaterialCommunityIcons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {props?.data?.icon === undefined || props?.data?.icon === null ? null : (<MaterialCommunityIcons
            name={props?.data?.icon}
            size={40}
            color={colors.daclen_black}
            style={styles.logo}
          />)}
      
      <Text style={styles.text}>{props?.data?.desc}</Text>
      

      {props?.closeThis === null ? null : (
        <TouchableOpacity
          onPress={() => buttonPress()}
          style={styles.button}
        >
          <Text style={styles.textButton}>{props?.data?.button}</Text>
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
  icon: {
    backgroundColor: colors.daclen_black,
  },
  logo: {
    alignSelf: "center",
    marginTop: 20,
  },
  button: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
    textAlign: "center",
  },
  textTitle: {
    flex: 1,
    fontFamily: "Poppins", fontSize: 16,
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  text: {
    fontFamily: "Poppins", fontSize: 14,
    marginVertical: 20,
    color: colors.daclen_gray,
    width: "80%",
    textAlign: "center",
  },
});
