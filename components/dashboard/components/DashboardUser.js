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
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../../styles/base";
import {
  capitalizeFirstLetter,
  checkNumberEmpty,
  formatPrice,
} from "../../../axios/cart";

export default function DashboardUser(props) {
  const { currentUser, profilePicture, saldoAkumulasi, mockData } = props;
  const navigation = useNavigation();

  function openWithdrawal() {
    navigation.navigate("SaldoReportScreen");
  }

  function refreshSaldo() {
    if (!(props?.refreshSaldo === undefined || props?.refreshSaldo === null)) {
      props?.refreshSaldo();
    }
  }

  if (
    currentUser === undefined ||
    currentUser === null ||
    currentUser?.id === undefined ||
    currentUser?.detail_user === undefined
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.containerPhoto}
      >
        <Image
          key="userImage"
          style={styles.image}
          source={
            profilePicture
              ? profilePicture
              : require("../../../assets/user.png")
          }
          alt={currentUser?.name}
          placeholder={
            Platform.OS === "ios" ? null : require("../../../assets/user.png")
          }
          contentFit={
            Platform.OS === "ios" && profilePicture === null
              ? "contain"
              : "cover"
          }
          transition={0}
        />
        {currentUser?.status.toLowerCase() === "agen" ||
        mockData?.status.toLowerCase() === "agen" ? (
          <View style={styles.containerStar}>
            <Image
              style={styles.star}
              source={require("../../../assets/star_one_agen.png")}
              contentFit="contain"
            />
          </View>
        ) : null}
      </TouchableOpacity>

      <View style={styles.containerHorizontal}>
        <View style={styles.containerVertical}>
          <Text allowFontScaling={false} style={styles.text}>{`${
            mockData?.status
              ? mockData?.status
              : currentUser?.status
              ? capitalizeFirstLetter(currentUser?.status)
              : "Reseller"
          } Daclen`}</Text>
          <View style={styles.containerName}>
            <Text
              allowFontScaling={false}
              style={[
                styles.textName,
                {
                  fontSize: currentUser?.detail_user?.nama_lengkap
                    ? currentUser?.detail_user?.nama_lengkap?.length > 12
                      ? 12
                      : 14
                    : 14,
                },
              ]}
            >
              {currentUser?.detail_user?.nama_lengkap
                ? currentUser?.detail_user?.nama_lengkap
                : currentUser?.name}
            </Text>
            {currentUser?.is_lifetime_sales ||
            checkNumberEmpty(mockData?.reseller) >= 50 ? (
              <View style={styles.containerCrown}>
                <Image
                  style={styles.crown}
                  source={require("../../../assets/lifetime_gold.png")}
                  contentFit="contain"
                />
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => refreshSaldo()}
            style={styles.containerSaldoHorizontal}
          >
            <View style={styles.containerSaldo}>
              <Text allowFontScaling={false} style={styles.text}>
                {saldoAkumulasi ? "Saldo Akumulasi" : "Saldo"}
              </Text>

              <Text
                allowFontScaling={false}
                style={[styles.textName, { color: colors.daclen_yellow }]}
              >
                {mockData?.saldo
                  ? formatPrice(mockData?.saldo)
                  : saldoAkumulasi
                  ? saldoAkumulasi > 0
                    ? formatPrice(saldoAkumulasi)
                    : "Rp 0"
                  : currentUser?.komisi_user
                  ? checkNumberEmpty(currentUser?.komisi_user?.total) > 0
                    ? formatPrice(currentUser?.komisi_user?.total)
                      ? formatPrice(currentUser?.komisi_user?.total)
                      : "Rp 0"
                    : "Rp 0"
                  : "Rp 0"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openWithdrawal()}
        >
          <Text allowFontScaling={false} style={styles.textButton}>
            {`CAIRKAN\nSALDO`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/*
<Text allowFontScaling={false} style={styles.textReferral}>
          {`Referral Id: ${currentUser?.name}`}
        </Text>

        <TouchableOpacity
              style={styles.refresh}
              onPress={() => refreshSaldo()}
            >
              <MaterialCommunityIcons
                name="eye"
                size={16}
                color={colors.daclen_light}
              />
            </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginHorizontal: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  containerPhoto: {
    marginStart: 10,
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "center",
    elevation: 4,
  },
  containerVertical: {
    marginHorizontal: 10,
    backgroundColor: "transparent",
    flex: 1,
  },
  containerHorizontal: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerName: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerSaldo: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  containerSaldoHorizontal: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerStar: {
    width: 28,
    height: 28,
    backgroundColor: "transparent",
    position: "absolute",
    end: 2,
    bottom: 2,
    zIndex: 6,
  },
  containerCrown: {
    width: 18,
    height: 18,
    backgroundColor: "transparent",
    marginStart: 2,
    alignSelf: "center",
    top: -4,
    zIndex: 6,
  },
  button: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.daclen_green_button,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    opacity: 0.95,
    backgroundColor: colors.daclen_grey_button,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  refresh: {
    backgroundColor: "transparent",
    marginStart: 8,
    alignSelf: "center",
  },
  textButton: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_green_button,
    textAlign: "center",
  },
  textName: {
    fontSize: 14,
    color: colors.daclen_light,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_light,
  },
  textReferral: {
    fontFamily: "Poppins",
    fontSize: 10,
    color: colors.daclen_lightgrey,
    marginTop: 6,
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: colors.daclen_light,
    borderRadius: 45,
  },
  star: {
    width: 28,
    height: 28,
    backgroundColor: "transparent",
  },
  crown: {
    width: 18,
    height: 18,
    backgroundColor: "transparent",
  },
});
