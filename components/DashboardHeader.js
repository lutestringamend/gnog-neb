import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { colors } from "../styles/base";

const Header = (props) => {
  const { username, currentUser } = props;
  const navigation = useNavigation();

  function onSettingPress() {
    if (props?.onSettingPress === undefined || props?.onSettingPress === null) {
      navigation.navigate("Profile", { username });
    } else {
      props.onSettingPress();
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("About")}
        style={styles.containerLogo}
      >
        <Image
          source={require("../assets/splashsmall.png")}
          style={styles.imageLogo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSettingPress()}
        style={styles.containerUser}
      >
        {props?.isHome ? (
          !(
            currentUser === null ||
            currentUser?.name === undefined ||
            currentUser?.name === null
          ) ? (
            <Text style={styles.textUsername}>{currentUser?.name}</Text>
          ) : null
        ) : (
          <Text style={styles.textLogin}>
            {props?.settingText ? props?.settingText : "SETTING"}
          </Text>
        )}

        <Image source={require("../assets/gear.png")} style={styles.gear} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  containerLogo: {
    marginHorizontal: 12,
    marginVertical: 12,
    flex: 1,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerUser: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    alignSelf: "center",
    marginEnd: 14,
  },
  imageLogo: {
    width: 75,
    height: 20,
    backgroundColor: "transparent",
  },
  gear: {
    backgroundColor: "transparent",
    alignSelf: "center",
    width: 20,
    height: 20,
  },
  textLogin: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_light,
    marginEnd: 6,
  },
  textUsername: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_light,
    marginEnd: 6,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

/*const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      clearUserData,
      getCurrentUser,
    },
    dispatch
  );*/

export default connect(mapStateToProps, null)(Header);
