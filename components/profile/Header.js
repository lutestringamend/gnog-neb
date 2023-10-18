import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash } from "../../styles/base";
import Separator from "./Separator";
import { ProfileHeaderUserData } from "./constants";

export default function Header(props) {
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
    <View style={{ backgroundColor: "transparent" }}>
      {login ? (
        <TouchableOpacity
          onPress={() => openScreen()}
          style={styles.containerTouchable}
        >
          <View style={styles.container}>
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
              <Text allowFontScaling={false} style={styles.textName}>{userData?.displayName}</Text>
              {currentUser?.email ? (
                <Text allowFontScaling={false} style={styles.text}>{currentUser?.email}</Text>
              ) : null}
              {currentUser?.nomor_telp ? (
                <Text allowFontScaling={false} style={styles.text}>{currentUser?.nomor_telp}</Text>
              ) : null}
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={40}
            color={colors.daclen_gray}
            style={styles.arrow}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.containerLogin}>
          <Text allowFontScaling={false} style={[styles.text, { textAlign: "center", width: "100%" }]}>
            Login / Register untuk berbelanja dengan Daclen
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => openLogin()}>
            <Text allowFontScaling={false} style={styles.textButton}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      )}

      <Separator thickness={props?.thickness} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerTouchable: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 6,
    flexDirection: "row",
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: "center",
  },
  containerVertical: {
    marginHorizontal: 10,
    alignItems: "flex-start",
  },
  containerLogin: {
    backgroundColor: "transparent",
    marginHorizontal: 10,
    marginVertical: 20,
  },
  containerPhoto: {
    marginStart: 10,
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderColor: colors.daclen_lightgrey,
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: colors.daclen_light,
  },
  textName: {
    width: 240,
    marginEnd: 10,
    fontSize: 16,
    color: colors.daclen_black,
    fontFamily: "Poppins-SemiBold",
    paddingBottom: 6,
  },
  text: {
    fontFamily: "Poppins", 
    fontSize: 10,
    color: colors.daclen_gray,
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
  arrow: { alignSelf: "center", marginStart: 10, flex: 1 },
});

//<Text allowFontScaling={false} style={[styles.text, { width: 200 }]}>{props?.token}</Text>
