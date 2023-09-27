import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { blurhash, colors } from "../styles/base";
import { capitalizeFirstLetter } from "../axios/cart";

const Header = (props) => {
  const { currentUser } = props;
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
            alignItems: "flex-start",
            zIndex: 0,
            height: 36,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("About")}
          style={styles.containerLogoSmall}
        >
          <Image
            source={require("../assets/splashsmall.png")}
            style={styles.imageLogoSmall}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: 72 }]}>
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
        placeholder={blurhash}
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

      <View style={styles.containerUser}>
        <TouchableOpacity onPress={() => navigation.navigate("About")}>
          <Image
            source={require("../assets/splashsmall.png")}
            style={styles.imageLogo}
            contentFit="contain"
          />
          <Text
            allowFontScaling={false}
            style={[styles.text, { marginTop: 4, alignSelf: "flex-end", textAlign: "right" }]}
          >
            {`id referral anda:\n${currentUser?.name}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    backgroundColor: colors.daclen_black,
    opacity: 0.9,
  },
  containerLogoSmall: {
    marginHorizontal: 12,
    marginVertical: 12,
    flex: 1,
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },
  containerText: {
    backgroundColor: "transparent",
    position: "absolute",
    start: 94,
    top: 20,
    zIndex: 20,
  },
  containerUser: {
    alignItems: "flex-end",
    position: "absolute",
    backgroundColor: "transparent",
    top: 12,
    end: 10,
  },
  imageLogoSmall: {
    width: 75,
    height: 20,
    backgroundColor: "transparent",
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
    start: 12,
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
    textAlignVertical: "center",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Header);
