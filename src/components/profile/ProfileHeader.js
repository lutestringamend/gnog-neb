import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash, dimensions } from "../../styles/base";
import { ProfileHeaderUserData } from "../../../components/profile/constants";
import { staticDimensions } from "../../styles/base";

const height = 145 * dimensions.fullWidthAdjusted / 430;
const photoWidth = 100 * dimensions.fullWidthAdjusted / 430;

export default function ProfileHeader(props) {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState(ProfileHeaderUserData);
  const navigation = useNavigation();
  const { token, currentUser, profilePicture } = props;

  useEffect(() => {
    if (
      token === null ||
      currentUser === null ||
      currentUser?.id === undefined
    ) {
      if (login) {
        setUserData(ProfileHeaderUserData);
        setLogin(false);
      }
    } else {
      if (!login) {
        let username = currentUser?.username;
        let displayName =
          currentUser?.detail_user === undefined ||
          currentUser?.detail_user === null ||
          currentUser?.detail_user?.nama_lengkap === undefined
            ? username
            : currentUser?.detail_user?.nama_lengkap;
        setUserData({
          username,
          displayName,
        });
        setLogin(true);
      }
    }
  }, [token, currentUser]);

  const openScreen = () => {
    if (login) {
      navigation.navigate("EditProfile");
    }
  };

  const openLogin = () => {
    if (!login) {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={{ backgroundColor: colors.white, height }}>
      {login ? (
        <TouchableOpacity
          onPress={() => openScreen()}
          style={styles.containerTouchable}
        >
          <View style={styles.containerPhoto}>
              <Image
                key="userImage"
                style={styles.image}
                source={
                  profilePicture
                    ? profilePicture
                    : require("../../assets/user.png")
                }
                alt={userData?.username}
                contentFit={Platform.OS === "ios" && profilePicture === null ? "contain" : "cover"}
                placeholder={Platform.OS === "ios" ? null : require("../../assets/user.png")}
                transition={0}
              />
            </View>

            <View style={styles.containerVertical}>
              <View style={styles.containerHorizontal}>
              <Text allowFontScaling={false} style={styles.textName}>{userData?.displayName}</Text>
              <MaterialCommunityIcons
            name="pencil"
            size={32}
            color={colors.white}
            style={{ marginStart: staticDimensions.marginHorizontal }}
          />
              </View>
              
              {currentUser?.email ? (
                <Text allowFontScaling={false} style={[styles.text, { marginTop: 4 }]}>{currentUser?.email}</Text>
              ) : null}
              {currentUser?.nomor_telp ? (
                <Text allowFontScaling={false} style={styles.text}>{currentUser?.nomor_telp}</Text>
              ) : null}
            </View>
          
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/*
(
        <View style={styles.containerLogin}>
          <Text allowFontScaling={false} style={[styles.text, { textAlign: "center", width: "100%" }]}>
            Login / Register untuk berbelanja dengan Daclen
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => openLogin()}>
            <Text allowFontScaling={false} style={styles.textButton}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      )
*/

const styles = StyleSheet.create({
  containerTouchable: {
    width: "100%",
    height,
    backgroundColor: colors.daclen_black,
    borderBottomStartRadius: 62 * dimensions.fullWidthAdjusted / 430,
    paddingTop: 27 * dimensions.fullWidthAdjusted / 430,
    flexDirection: "row",
    paddingHorizontal: staticDimensions.marginHorizontal,
  },
  containerVertical: {
    marginStart: staticDimensions.marginHorizontal,
    flex: 1,
  },
  containerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerLogin: {
    backgroundColor: "transparent",
    marginHorizontal: 10,
    marginVertical: 20,
  },
  containerPhoto: {
    height: photoWidth,
    width: photoWidth,
    borderRadius: photoWidth / 2,
    overflow: "hidden",
    borderColor: colors.white,
    borderWidth: 1,
  },
  image: {
    width: photoWidth,
    height: photoWidth,
    backgroundColor: colors.white,
  },
  textName: {
    fontSize: 20,
    color: colors.white,
    fontFamily: "Poppins-Bold",
  },
  text: {
    fontFamily: "Poppins-Light", 
    fontSize: 12,
    color: colors.white,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
  },
});

//<Text allowFontScaling={false} style={[styles.text, { width: 200 }]}>{props?.token}</Text>
