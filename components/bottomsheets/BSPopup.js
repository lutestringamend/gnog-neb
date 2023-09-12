import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";

export default function BSPopup(props) {
  const [loading, setLoading] = useState(false);

  function proceedAction() {
    if (!loading) {
      setLoading(true);
      props?.onPress();
    }
  }

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
      {props?.icon === undefined && props?.logo === undefined ? null : (
        <View style={styles.containerLogo}>
          {props?.icon !== undefined ? (
            <MaterialCommunityIcons
              name={props?.icon}
              size={100}
              color={colors.daclen_black}
            />
          ) : (
            <Image
              source={require("../../assets/verified.png")}
              style={styles.logo}
            />
          )}
        </View>
      )}

      {props?.content !== undefined ? (
        props?.content
      ) : (
        <Text style={styles.text}>{props?.text}</Text>
      )}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : props?.onPress === null && props?.buttonNegative === null ? null : (
        <View style={styles.containerButtons}>
          {props?.onPress === null ? null : (
            <TouchableOpacity
              onPress={() => proceedAction()}
              style={[
                styles.button,
                loading || props?.buttonDisabled
                  ? { backgroundColor: colors.daclen_gray }
                  : { backgroundColor: props?.buttonPositiveColor },
              ]}
              disabled={loading || props?.buttonDisabled}
            >
              <Text style={styles.textButton}>{props?.buttonPositive}</Text>
            </TouchableOpacity>
          )}

          {props?.closeThis === null ? null : (
            <TouchableOpacity
              onPress={() => props?.closeThis()}
              style={[
                styles.button,
                { backgroundColor: props?.buttonNegativeColor },
              ]}
            >
              <Text style={styles.textButton}>{props?.buttonNegative}</Text>
            </TouchableOpacity>
          )}
        </View>
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
  },
  containerHorizontal: {
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
    marginVertical: 20,
    backgroundColor: colors.daclen_light,
    alignSelf: "center",
    alignItems: "center",
  },
  containerButtons: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.daclen_light,
    alignSelf: "center",
    marginVertical: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  icon: {
    backgroundColor: colors.daclen_black,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: colors.daclen_black,
  },
  textButton: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
  },
  textTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    fontFamily: "Poppins-SemiBold",
  },
  text: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_gray,
    textAlign: "center",
    marginHorizontal: 10,
  },
});
