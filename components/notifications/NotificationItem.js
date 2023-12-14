import React, { useState, useEffect, memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";
import Separator from "../profile/Separator";
import { openScreenFromNotification } from ".";
import { convertDateISOStringtoDisplayDate } from "../../axios/profile";

const NotificationItem = ({ data }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (item !== null || data === undefined || data === null) {
      return;
    }
    let displayName = data?.title;
    let icon = require("../../assets/favicon.png");

    /*if (
      !(
        data?.bookingName === undefined ||
        data?.bookingName === null ||
        data?.bookingName === ""
      )
    ) {
      
    }*/

    setItem({
      displayName,
      icon,
    });
  }, [item]);

  const navigation = useNavigation();
  function onNotifPress() {
    if (
      data === undefined ||
      data === null ||
      data?.on_mobile_open === undefined ||
      data?.on_mobile_open === null ||
      data?.on_mobile_open === ""
    ) {
      return;
    }
    openScreenFromNotification(navigation, data?.on_mobile_open, data?.title);
  }

  if (data === undefined || data === null) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.containerHead}
      onPress={() => onNotifPress()}
    >
      {item === null ? (
        <ActivityIndicator
          color={colors.daclen_gray}
          size="small"
          style={styles.spinner}
        />
      ) : (
        <View style={styles.containerMain}>
          <View style={styles.container}>
            <View style={styles.containerHorizontal}>
              <Image
                source={item?.icon}
                style={styles.logo}
                placeholder={null}
                contentFit="contain"
                transition={0}
              />
              <Text allowFontScaling={false} style={styles.textHeader}>
                {item?.displayName}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.textAlert}>
              {data?.body ? data?.body : data?.alert ? data?.alert : ""}
            </Text>
            {data?.timestamp ? (
              <Text allowFontScaling={false} style={styles.textUid}>
                {convertDateISOStringtoDisplayDate(data?.timestamp, true)}
              </Text>
            ) : null}
          </View>
          {item === null ||
          ((data?.objectId === undefined ||
            data?.objectId === null ||
            data?.objectId === "") &&
            (data?.feedId === undefined ||
              data?.feedId === null ||
              data?.feedId === "")) ? null : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={32}
              color={colors.daclen_gray}
            />
          )}
        </View>
      )}

      <Separator thickness={2} style={{ marginTop: 12 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerHead: {
    backgroundColor: colors.daclen_light,
    width: "100%",
  },
  containerMain: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  containerHorizontal: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
  },
  textUid: {
    fontSize: 10,
    color: colors.daclen_gray,
    marginHorizontal: 12,
    marginTop: 4,
    fontFamily: "Poppins",
  },
  textHeader: {
    fontSize: 12,
    marginHorizontal: 10,
    color: colors.daclen_black,
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
  },
  textAlert: {
    marginTop: 6,
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.daclen_gray,
    backgroundColor: "transparent",
    fontFamily: "Poppins",
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "transparent",
  },
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
  },
});

export default memo(NotificationItem);
