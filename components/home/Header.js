import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { clearUserData, getCurrentUser } from "../../axios/user";
import { colors } from "../../styles/base";

function Header(props) {
  const [username, setUsername] = useState(null);
  const [displayAddress, setDisplayAddress] = useState(null);
  const { currentUser, token, currentAddress } = props;
  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser === null || token === null) {
      console.log("currentUser is null");
      setUsername(null);
      setDisplayAddress(null);
    } else {
      setUsername(currentUser?.name);
      console.log({
        token,
        currentUser,
      });
    }
  }, [currentUser, token]);

  useEffect(() => {
    if (
      currentAddress === null ||
      currentAddress?.alamat === undefined ||
      currentAddress?.alamat === null
    ) {
      setDisplayAddress(null);
    } else {
      if (currentAddress?.alamat.length > 18) {
        setDisplayAddress(currentAddress?.alamat.substring(0, 15) + "...");
      } else {
        setDisplayAddress(currentAddress?.alamat);
      }
    }
    //console.log(currentAddress);
  }, [currentAddress]);

  const openAddress = () => {
    navigation.navigate("Address");
  };

  const openLogin = () => {
    if (token === null) {
      props.clearUserData();
      navigation.navigate("Login", { username });
    } else {
      navigation.navigate("Profile", { username });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Image
          source={require("../../assets/splashsmall.png")}
          style={styles.imageLogo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.containerAddress}
        onPress={() => openAddress()}
      >
        <Text style={styles.textAddress}>
          {displayAddress ? displayAddress : "Alamat Pengiriman"}
        </Text>
        <MaterialCommunityIcons
          name="map"
          size={14}
          color={colors.daclen_light}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLogin()}>
        <Text style={styles.textLogin}>
          {username ? username : "Login/Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.daclen_black,
  },
  containerAddress: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.daclen_gray,
    alignItems: "center",
    marginStart: 14,
    marginVertical: 6,
    borderRadius: 5,
  },
  imageLogo: {
    width: 75,
    height: 20,
    marginStart: 14,
    marginVertical: 12,
  },
  textAddress: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    flex: 1,
  },
  textLogin: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_yellow,
    marginHorizontal: 14,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  currentAddress: store.userState.currentAddress,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearUserData,
      getCurrentUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Header);
