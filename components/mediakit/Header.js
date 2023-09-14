import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { colors } from "../../styles/base";

const Header = (props) => {
  const navigation = useNavigation();

  function onSettingPress() {
    if (props?.onSettingPress === undefined || props?.onSettingPress === null) {
      return;
    } else {
      props.onSettingPress();
    }
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
          source={require("../../assets/splashsmall.png")}
          style={styles.imageLogo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSettingPress()}
        style={styles.containerUser}
      >
        <Text allowFontScaling={false} style={styles.textLogin}>SETTING WATERMARK</Text>
        <Image source={require("../../assets/gear.png")} style={styles.gear} />
      </TouchableOpacity>
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
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    color: colors.daclen_light,
    marginEnd: 6,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  profileLock: store.userState.profileLock,
});

export default connect(mapStateToProps, null)(Header);
