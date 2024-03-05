import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { ProfileHeaderUserData } from "../../../components/profile/constants";
import { capitalizeFirstLetter } from "../../axios/cart";

const width = dimensions.fullWidthAdjusted;
const photoWidth = 60 * dimensions.fullWidthAdjusted / 430;

export default function StarterKitHeader(props) {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState(ProfileHeaderUserData);
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

  function onPress() {
    if (props?.onPress === undefined || props?.onPress === null) {
      return;
    }
    props?.onPress();
  }
  /*const openLogin = () => {
    if (!login) {
      navigation.navigate("Login");
    }
  };*/

  return (
    <View style={styles.containerTouchable}>
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

            {currentUser?.status ? (
                <Text allowFontScaling={false} style={styles.text}>{`${capitalizeFirstLetter(currentUser?.status)} Daclen`}</Text>
              ) : null}

            <Text allowFontScaling={false} style={styles.textName}>{userData?.displayName}</Text>
              
              
             
            </View>

            <TouchableOpacity style={styles.containerGear} onPress={() => onPress()}>
            <Image
              source={require("../../assets/gear.png")}
              contentFit="contain"
              style={styles.gear}
            />
            </TouchableOpacity>
          
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
    width,
    backgroundColor: colors.daclen_black,
    paddingTop: 23 * dimensions.fullWidthAdjusted / 430,
    paddingBottom: 28 * dimensions.fullWidthAdjusted / 430,
    flexDirection: "row",
    paddingHorizontal: staticDimensions.marginHorizontal,
    marginHorizontal: (dimensions.fullWidth - width) / 2,
  },
  containerVertical: {
    marginStart: staticDimensions.marginHorizontal,
    flex: 1,
  },
  containerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerGear: {
    marginStart: staticDimensions.marginHorizontal,
    backgroundColor: "transparent",
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
    fontSize: 18,
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
  gear: {
    backgroundColor: "transparent",
    width: 25 * dimensions.fullWidthAdjusted / 430,
    height: 25 * dimensions.fullWidthAdjusted / 430,
  }
});

//<Text allowFontScaling={false} style={[styles.text, { width: 200 }]}>{props?.token}</Text>
