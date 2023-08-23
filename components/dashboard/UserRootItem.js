import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { colors } from "../../styles/base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { emailnotverified, phonenotverified } from "./constants";
import { capitalizeFirstLetter } from "../../axios/cart";

export function VerticalLine({ style }) {
  return <View style={[styles.verticalLine, style]} />;
}

const UserRootItem = ({
  userData,
  isCurrentUser,
  isLastItem,
  isVerified,
  isCurrentVerified,
  status,
  onPress,
}) => {
  function userPress() {
    let message = `${userData?.name}`;
    /*if (userData?.email_verified_at === null) {
      message += `\n${emailnotverified}`;
    }*/
    if (userData?.nomor_telp_verified_at === null) {
      message += `\n${phonenotverified}`;
    }
    console.log({ id: userData?.id, message });
    onPress();
    /*if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }*/
  }

  return (
    <View style={styles.container}>
      {isCurrentUser ? null : (
        <VerticalLine
          style={{
            height: isLastItem ? "51%" : "100%",
            backgroundColor: isCurrentVerified
              ? colors.daclen_green
              : colors.daclen_red,
          }}
        />
      )}
      {isCurrentUser ? null : (
        <View
          style={[
            styles.horizontalLine,
            {
              backgroundColor: isVerified
                ? colors.daclen_green
                : colors.daclen_red,
            },
          ]}
        />
      )}

      <TouchableHighlight
        onPress={() => userPress()}
        underlayColor={colors.daclen_orange}
        style={[
          styles.containerTouchable,
          {
            marginVertical: isCurrentUser ? 0 : 12,
            borderRadius: isCurrentUser ? 0 : 6,
            borderTopStartRadius: 6,
            borderTopEndRadius: 6,
          },
        ]}
      >
        <View
          style={[
            styles.containerMain,
            {
              borderColor: isVerified ? colors.daclen_green : colors.daclen_red,
              borderRadius: 6,
              borderBottomStartRadius: isCurrentUser ? 0 : 6,
              borderWidth: isCurrentUser ? 2 : 1,
              borderTopWidth: 0,
            },
          ]}
        >
          <View
            style={[
              styles.containerHeader,
              {
                backgroundColor: isVerified
                  ? colors.daclen_green
                  : colors.daclen_red,
                borderTopStartRadius: 6,
                borderTopEndRadius: 6,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isVerified ? "account-check" : "account-remove"}
              size={14}
              color={colors.daclen_light}
            />
            <Text style={styles.textHeader}>{userData?.name}</Text>
          </View>
          <View style={styles.containerValue}>
            <Text style={styles.text}>
              {status ? capitalizeFirstLetter(status) : "Reseller"}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
  },
  containerTouchable: {
    backgroundColor: "white",
  },
  containerMain: {
    backgroundColor: "white",
  },
  verticalLine: {
    height: "100%",
    width: 2,
    alignSelf: "flex-start",
    backgroundColor: colors.daclen_red,
  },
  horizontalLine: {
    width: 24,
    height: 2,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
  },
  containerValue: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 8,
  },
  textHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_light,
    marginStart: 6,
    overflow: "hidden",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_black,
    backgroundColor: "transparent",
  },
});

export default UserRootItem;
