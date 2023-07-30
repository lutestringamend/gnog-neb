import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/base";

export default function Header(props) {
  //const [referral, setReferral] = useState(null);
  //const [referralText, setReferralText] = useState(null);

  const { username } = props;
  const navigation = useNavigation();
  const openLogin = () => {
    if (username === undefined || username === null) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("Profile", { username });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("About")}
        style={styles.containerLogo}
      >
        <Image
          source={require("../../assets/splashsmall.png")}
          style={styles.imageLogo}
        />
      </TouchableOpacity>

      <Text style={styles.text}>Referral</Text>
      <TouchableOpacity
        onPress={() => openLogin()}
        style={styles.containerUser}
      >
        <Text style={styles.textLogin}>
          {username ? username : "Login/Register"}
        </Text>
        <MaterialCommunityIcons
          name="account-circle"
          size={20}
          color={colors.daclen_yellow}
          style={styles.iconLogin}
        />
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
  containerLogo: {
    marginHorizontal: 14,
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
  iconLogin: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
    marginStart: 4,
  },
  textLogin: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.daclen_yellow,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginEnd: 6,
    color: colors.daclen_lightgrey,
  },
});
