import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../styles/base";

const QRScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { text } = props.route.params;
  const navigation = useNavigation();

  if (text === undefined || text === null || text === "") {
    navigation.goBack();
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text
          style={styles.textError}
        >
          {error}
        </Text>
      ) : null}
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          {text}
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.splash_blue}
            style={styles.spinner}
          />
        ) : (
          <View
            style={styles.containerQR}
          >
            {text === null || text === "" ? null : (
              <QRCode
                value={text}
                size={280}
                backgroundColor={colors.white}
                color={colors.black}
                logo={require("../../assets/favicon.png")}
                logoSize={32}
                logoMargin={4}
                onError={(e) => setError(e?.toString())}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/*
        <TouchableOpacity
          onPress={() => fetchQR()}
          style={[
            styles.button,
            {
              backgroundColor:
                loading || elapsed <= 0 ? colors.feed_grey : colors.splash_blue,
            },
          ]}
          disabled={loading || elapsed <= 0}
        >
          <MaterialCommunityIcons name="refresh" size={18} color="white" />
          <Text style={styles.textButton}>Refresh Kode QR</Text>
        </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  containerQR: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 48,
    backgroundColor: colors.white,
  },
  spinner: {
    marginVertical: 20,
    alignSelf: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: 32,
    marginBottom: staticDimensions.pageBottomPadding / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.daclen_orange,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    backgroundColor: "transparent",
    color: colors.daclen_light,
    marginStart: 12,
  },
  text: {
    marginVertical: 32,
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_graydark,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  textError: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.daclen_red,
    textAlign: "center",
  },
});

export default QRScreen;
