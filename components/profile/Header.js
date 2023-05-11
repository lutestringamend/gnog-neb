import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, blurhash } from "../../styles/base";
import Separator from "./Separator";
import { useState } from "react";

export default function Header(props) {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (props?.token !== undefined && props?.token !== null) {
      setUsername(props?.username);
    }
    console.log({ token: props?.token, username: props?.username });
  }, [props?.token]);

  const openScreen = () => {
    if (props?.token !== undefined && props?.token !== null) {
      navigation.navigate("EditProfile");
    }
  };

  const openLogin = () => {
    if (props?.token === undefined || props?.token === null) {
      console.log("going login with prev username " + username);
      navigation.navigate("Login", { username });
    }
  };

  return (
    <View>
      {props?.token === undefined || props?.token === null ? (
        <View style={styles.containerLogin}>
          <Text style={[styles.text, { textAlign: "center", width: "100%" }]}>
            Login / Register untuk berbelanja dengan Daclen
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => openLogin()}>
            <Text style={styles.textButton}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => openScreen()}
          style={styles.containerTouchable}
        >
          <View style={styles.container}>
            <View style={styles.containerPhoto}>
              <Image
                style={styles.image}
                source={
                  props?.foto !== ""
                    ? props?.foto
                    : require("../../assets/user.png")
                }
                alt={props.nama_lengkap}
                contentFit="contain"
                placeholder={blurhash}
                transition={0}
              />
            </View>

            <View style={styles.containerVertical}>
              <Text style={styles.textName}>
                {props?.nama_lengkap ? props?.nama_lengkap : props?.username}
              </Text>
              <Text style={styles.text}>{props?.email}</Text>
              <Text style={styles.text}>{props?.nomor_telp}</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={40}
            color={colors.daclen_gray}
            style={styles.arrow}
          />
        </TouchableOpacity>
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
  },
  containerVertical: {
    marginHorizontal: 10,
  },
  containerLogin: {
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
    aspectRatio: 1 / 1,
  },
  textName: {
    width: 240,
    marginHorizontal: 10,
    fontSize: 20,
    color: colors.daclen_black,
    fontWeight: "bold",
    paddingBottom: 6,
  },
  text: {
    width: 240,
    marginHorizontal: 10,
    fontSize: 14,
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
    fontWeight: "bold",
    color: "white",
  },
  arrow: { alignSelf: "center", marginStart: 10, flex: 1 },
});

//<Text style={[styles.text, { width: 200 }]}>{props?.token}</Text>
