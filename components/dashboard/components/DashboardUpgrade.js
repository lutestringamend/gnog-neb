import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import { webdashboard } from "../../../axios/constants";

const DashboardUpgrade = ({ registerSnapToken }) => {
  const navigation = useNavigation();

  function proceedJoin() {
    if (
      registerSnapToken === null ||
      registerSnapToken?.snap_token === undefined
    ) {
      Linking.openURL(webdashboard);
      return;
    }
    let snap_url = `https://app.midtrans.com/snap/v3/redirection/${registerSnapToken?.snap_token}`;
    try {
      const params = {
        snapToken: registerSnapToken?.snap_token,
        snap_url,
        checkoutId: registerSnapToken?.bayar_register_id,
      };
      console.log("open snap", params);
      navigation.navigate("OpenMidtrans", params);
    } catch (e) {
      console.log(e);
      Linking.openURL(snap_url);
    }
  }

  return (
    <View style={styles.containerLogin}>
      <Text style={styles.text}>You have to pay</Text>
      <Text style={styles.textPrice}>Rp 300.000,-</Text>
      <Text style={styles.text}>
        {`Enjoy all the features and perk\nafter you complete the payment.`}
      </Text>
      <Text style={styles.textInner}>
        {`100% guaranteed support and\nupdate for the next 5 years.`}
      </Text>
      <TouchableOpacity
        onPress={() => proceedJoin()}
        style={[
          styles.button,
          {
            backgroundColor:
              registerSnapToken === null
                ? colors.daclen_grey
                : colors.daclen_blue,
          },
        ]}
        disabled={registerSnapToken === null}
      >
        <Text style={styles.textButton}>Bergabung Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    backgroundColor: colors.daclen_gold,
    opacity: 0.95,
    marginHorizontal: 12,
    marginVertical: 20,
    paddingVertical: 24,
    borderRadius: 6,
    elevation: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.daclen_blue,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.daclen_light,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    marginHorizontal: 12,
    color: colors.daclen_light,
    backgroundColor: "transparent",
  },
  textInner: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.daclen_gold_dark,
    marginHorizontal: 12,
    color: colors.daclen_light,
    elevation: 6,
  },
  textPrice: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 40,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 20,
    color: colors.daclen_light,
    backgroundColor: "transparent",
  },
});

export default DashboardUpgrade;
