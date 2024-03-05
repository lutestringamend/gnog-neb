import React from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { capitalizeFirstLetter } from "../../axios/cart";
import DashboardButton from "./DashboardButton";

const width = dimensions.fullWidthAdjusted;

const DashboardHeader = (props) => {
  const { username, currentUser, profileLock } = props;
  const navigation = useNavigation();

  function onLockPress() {
    if (props?.onLockPress === undefined || props?.onLockPress === null) {
      return;
    }
    props.onLockPress();
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerVertical}>
        {currentUser?.status ? (
          <Text
            allowFontScaling={false}
            style={styles.text}
          >{`${capitalizeFirstLetter(currentUser?.status)} Daclen`}</Text>
        ) : null}

        <Text allowFontScaling={false} style={styles.textName}>
          {username}
        </Text>
      </View>

      <DashboardButton
        style={styles.button}
        onPress={() => navigation.navigate("Notifications")}
        icon="bell"
      />

      {currentUser === undefined ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.name === undefined ||
      currentUser?.isActive === undefined ||
      currentUser?.isActive === null ||
      !currentUser?.isActive ||
      profileLock === undefined ? null : (
        <DashboardButton
          style={styles.button}
          onPress={() => onLockPress()}
          disabled={profileLock}
          icon={profileLock ? "lock" : "lock-open-alert"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: colors.daclen_black,
    paddingTop: (23 * dimensions.fullWidthAdjusted) / 430,
    paddingBottom: (60 * dimensions.fullWidthAdjusted) / 430,
    flexDirection: "row",
    paddingHorizontal: staticDimensions.marginHorizontal,
    marginHorizontal: (dimensions.fullWidth - width) / 2,
  },
  containerVertical: {
    flex: 1,
  },
  button: {
    alignSelf: "center",
    marginStart: staticDimensions.marginHorizontal / 2,
  },
  textName: {
    fontSize: 18,
    color: colors.white,
    fontFamily: "Poppins-Bold",
  },
  text: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: colors.white,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  profileLock: store.userState.profileLock,
});

export default connect(mapStateToProps, null)(DashboardHeader);
