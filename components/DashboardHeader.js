import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { colors } from "../styles/base";
import { capitalizeFirstLetter } from "../axios/cart";

const Header = (props) => {
  const { username, currentUser, profileLock } = props;
  const navigation = useNavigation();

  if (
    currentUser === null ||
    currentUser?.name === undefined ||
    currentUser?.name === null
  ) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              Platform.OS === "web" ? colors.daclen_bg : "transparent",
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("About")}
          style={[styles.containerLogo, {marginVertical: 12}]}
        >
          <Image
            source={require("../assets/splashsmall.png")}
            style={styles.imageLogo}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, {height: 72}]} >
      <View style={styles.containerLogo}>
        <Image
          key="userImage"
          style={styles.image}
          source={
            currentUser?.detail_user?.foto
              ? currentUser?.detail_user?.foto
              : require("../assets/user.png")
          }
          alt={currentUser?.name}
          contentFit="cover"
          placeholder={require("../assets/user.png")}
          transition={100}
        />
        <View style={styles.containerText}>
          <Text allowFontScaling={false} style={styles.text}>
            Welcome!
          </Text>
          <Text allowFontScaling={false} style={styles.textName}>
            {currentUser?.detail_user?.nama_lengkap
              ? currentUser?.detail_user?.nama_lengkap
              : currentUser?.name}
          </Text>
          <Text allowFontScaling={false} style={styles.text}>{`${
            currentUser?.status
              ? capitalizeFirstLetter(currentUser?.status)
              : "Reseller"
          } Daclen`}</Text>
        </View>
      </View>

      <View style={styles.containerUser}>
        <TouchableOpacity onPress={() => navigation.navigate("About")}>
          <Image
            source={require("../assets/splashsmall.png")}
            style={styles.imageLogo}
            contentFit="contain"
          />
          <Text allowFontScaling={false} style={[styles.text, {marginTop: 4, alignSelf: "flex-end"}]}>
            {`id referral anda:\n${currentUser?.name}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    zIndex: 10,
    backgroundColor: colors.daclen_black,
  },
  containerLogo: {
    flex: 1,
    backgroundColor: "transparent",
    marginHorizontal: 14,
    alignSelf: "flex-start",
  },
  containerText: {
    backgroundColor: "transparent",
    position: "absolute",
    start: 82,
    top: 24,
    zIndex: 20,
  },
  containerUser: {
    alignItems: "flex-end",
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    marginTop: 12,
    marginEnd: 10,
  },
  imageLogo: {
    width: 80,
    height: 24,
    backgroundColor: "transparent",
  },
  image: {
    width: 76,
    height: 76,
    elevation: 4,
    backgroundColor: colors.daclen_light,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: colors.daclen_light,
    position: "absolute",
    start: 0,
    bottom: -12,
    zIndex: 20,
  },
  textName: {
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.daclen_light,
    fontFamily: "Poppins-SemiBold",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 8,
    color: colors.daclen_light,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  profileLock: store.userState.profileLock,
});

export default connect(mapStateToProps, null)(Header);
