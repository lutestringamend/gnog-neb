import React from "react";
import { View, StyleSheet, Text, Platform, ToastAndroid } from "react-native";
import { colors, dimensions } from "../../styles/base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableHighlight } from "react-native-gesture-handler";
import { emailnotverified, phonenotverified } from "./constants";

export function VerticalLine({ style }) {
  return <View style={[styles.verticalLine, style]} />;
}

const UserRootItem = ({ userData, isCurrentUser, isLastItem, isVerified }) => {
  
  function onPress() {
    let message = `${userData?.name}`;
    if (userData?.email_verified_at === null) {
      message += `\n${emailnotverified}`;
    }
    if (userData?.nomor_telp_verified_at === null) {
      message += `\n${phonenotverified}`;
    }
    console.log({ id: userData?.id, message });
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  }

  return (
    <View style={styles.container}>
      {isCurrentUser ? null : (
        <VerticalLine style={{ height: isLastItem ? "51%" : "100%" }} />
      )}
      {isCurrentUser ? null : <View style={styles.horizontalLine} />}

      <TouchableHighlight
        onPress={() => onPress()}
        underlayColor={colors.daclen_orange}
        style={[
          styles.containerTouchable,
          {
            marginVertical: isCurrentUser ? 0 : 12,
            borderRadius: isCurrentUser ? 0 : 6,
          },
        ]}
      >
        <View
          style={[
            styles.containerMain,
            {
              borderColor: isVerified
                ? colors.daclen_red
                : colors.daclen_lightgrey,
              borderWidth: isCurrentUser ? 2 : 1,
              borderRadius: isCurrentUser ? 0 : 6,
            },
          ]}
        >
          <View
            style={[
              styles.containerHeader,
              {
                backgroundColor: isVerified
                  ? colors.daclen_red
                  : colors.daclen_lightgrey,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isVerified ? "account-check" : "account-remove"}
              size={14}
              color={isVerified ? colors.daclen_light : colors.daclen_gray}
            />
            <Text
              style={[
                styles.textHeader,
                {
                  color: isVerified ? colors.daclen_light : colors.daclen_gray,
                },
              ]}
            >
              {userData?.name}
            </Text>
          </View>
          <View style={styles.containerValue}>
            <Text
              style={[
                styles.text,
                {
                  color: isVerified ? colors.daclen_black : colors.daclen_gray,
                },
              ]}
            >
              0
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    width: dimensions.fullWidth,
  },
  containerTouchable: {
    flex: 1,
    width: dimensions.fullWidth / 2,
    backgroundColor: "white",
  },
  containerMain: {
    flex: 1,
    width: dimensions.fullWidth / 2,
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
    backgroundColor: colors.daclen_red,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  containerValue: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
  },
  textHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginStart: 6,
    overflow: "hidden",
  },
  text: {
    fontSize: 16,
    backgroundColor: "white",
  },
});

export default UserRootItem;
