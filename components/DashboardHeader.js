import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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

  function onLockPress() {
    if (props?.onLockPress === undefined || props?.onLockPress === null) {
      return;
    }
    props.onLockPress();
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            Platform.OS === "web" ? colors.daclen_bg : "transparent",
        },
      ]}
    >
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
      {props?.lockStatus === undefined ? null : (
        <TouchableOpacity
          style={styles.containerUser}
          onPress={() => onLockPress()}
        >
          <MaterialCommunityIcons
            name={props?.lockStatus === "open" ? "lock-open-alert" : "lock"}
            size={24}
            color={
              props?.lockStatus === "open"
                ? colors.daclen_green_light
                : colors.daclen_orange
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
  lock: {
    backgroundColor: "transparent",
    alignSelf: "center",
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
