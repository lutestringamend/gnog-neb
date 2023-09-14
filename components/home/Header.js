import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { colors } from "../../styles/base";
import { capitalizeFirstLetter } from "../../axios/cart";

const Header = (props) => {
  const { currentUser, navigation } = props;

  function goDashboard() {
    if (props?.goDashboard === undefined || props?.goDashboard === null) {
      return;
    }
    props?.goDashboard();
  }

  function goCheckout() {
    if (navigation === undefined || navigation === null) {
      return;
    }
    navigation.navigate("History");
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
        onPress={() => goDashboard()}
        style={styles.containerPhoto}
      >
        <Image
          key="userImage"
          style={styles.image}
          source={
            currentUser?.detail_user?.foto
              ? currentUser?.detail_user?.foto
              : require("../../assets/user.png")
          }
          alt={currentUser?.name}
          contentFit="cover"
          placeholder={require("../../assets/user.png")}
          transition={100}
        />
      </TouchableOpacity>

      <View style={styles.containerVertical}>
        <Text allowFontScaling={false} style={styles.textName}>
          {currentUser?.detail_user?.nama_lengkap
            ? currentUser?.detail_user?.nama_lengkap
            : currentUser?.name}
        </Text>
        <Text allowFontScaling={false} style={styles.text}>{`${currentUser?.status ? capitalizeFirstLetter(currentUser?.status) : "Reseller"} Daclen`}</Text>
        <Text allowFontScaling={false} style={styles.textReferral}>
          {`Referral Id: ${currentUser?.name}`}
        </Text>
      </View>

      <View style={styles.containerRight}>
        <TouchableOpacity
          onPress={() => goDashboard()}
          style={styles.containerUser}
        >
          <Image
            source={require("../../assets/gear.png")}
            style={styles.gear}
          />
        </TouchableOpacity>
        {currentUser === null ||
        currentUser?.has_checkout === undefined ||
        currentUser?.has_checkout === null ||
        !currentUser?.has_checkout ? null : (
          <TouchableOpacity
            onPress={() => goCheckout()}
            style={[styles.containerUser, { marginTop: 10 }]}
          >
            <Text allowFontScaling={false} style={[styles.textAlert, { color: colors.daclen_orange }]}>
              RIWAYAT
            </Text>
            <MaterialCommunityIcons
              name="history"
              size={24}
              color={colors.daclen_orange}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerPhoto: {
    marginStart: 10,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "center",
    elevation: 4,
  },
  containerVertical: {
    marginHorizontal: 12,
    backgroundColor: "transparent",
    flex: 1,
    alignSelf: "center",
  },
  containerRight: {
    marginVertical: 16,
    marginEnd: 14,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  containerUser: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    alignSelf: "flex-end",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.daclen_light,
  },
  gear: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    width: 20,
    height: 20,
  },
  lock: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  textName: {
    fontSize: 12,
    color: colors.daclen_light,
    fontFamily: "Poppins-Bold",
  },
  text: {
    fontFamily: "Poppins", fontSize: 10,
    color: colors.daclen_light,
  },
  textReferral: {
    fontFamily: "Poppins", fontSize: 10,
    color: colors.daclen_lightgrey,
    marginTop: 4,
  },
  textAlert: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    color: colors.daclen_yellow,
    marginEnd: 6,
  },
  textUsername: {
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
