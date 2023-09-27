import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { blurhash, colors } from "../../../styles/base";
import { useNavigation } from "@react-navigation/native";
import { phonenotverified, userverified } from "../constants";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const modalWidth =
  screenWidth < 320 ? 296 : screenWidth > 424 ? 400 : screenWidth - 24;
const modalHeight = 180;

const UserRootModal = (props) => {
  const { modal, toggleModal } = props;
  const navigation = useNavigation();

  function displayError(e) {
    console.error(e);
  }

  try {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: screenWidth,
            height: screenHeight,
            zIndex: 100,
            elevation: 4,
          },
        ]}
        onPress={() => toggleModal()}
      >
        <BlurView
          intensity={10}
          style={[
            styles.container,
            {
              width: screenWidth,
              height: screenHeight,

              opacity: 0.95,
            },
          ]}
        >
          <View
            style={[
              styles.containerModal,
              {
                width: modalWidth,
                height: modalHeight,
                start: (screenWidth - modalWidth) / 2,
                end: (screenWidth - modalWidth) / 2,
                top: (screenHeight - modalHeight) / 2 - 40,
                bottom: (screenHeight - modalHeight) / 2 + 40,
              },
            ]}
          >
            <View style={styles.containerPhoto}>
              <Image
                source={
                  modal?.data?.foto
                    ? modal?.data?.foto
                    : require("../../../assets/user.png")
                }
                style={styles.photo}
                alt={modal?.data?.title ? modal?.data?.title : ""}
                contentFit="cover"
                placeholder={blurhash}
                transition={0}
              />
            </View>

            <View style={styles.containerInfo}>
              <View style={styles.containerHeader}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textHeader,
                    {
                      fontSize: modal?.data?.name?.length > 16 ? 14 : 24,
                    },
                  ]}
                >
                  {modal?.data?.name}
                </Text>
              </View>

              <Text allowFontScaling={false} style={styles.text}>
                {`Join Date : \nEmail     : \nWA        : \nPV: ${
                  modal?.data?.pv ? modal?.data?.pv : "0"
                }   RPV: ${modal?.data?.rpv ? modal?.data?.rpv : "0"}  HPV: ${
                  modal?.data?.hpv ? modal?.data?.hpv : "0"
                }\nPoin Bulan Ini:  ${
                  modal?.data?.user?.poin_user_this_month
                    ? modal?.data?.user?.poin_user_this_month
                    : "0"
                }\nPenjualan Bulan Ini:
                `}
              </Text>
            </View>

            <View style={styles.containerClose}>
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={colors.daclen_light}
              />
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  } catch (e) {
    console.log("UserRootModal error", e);
    return null;
  }
};

/*
<Text
                allowFontScaling={false}
                style={[
                  styles.textVerification,
                  {
                    backgroundColor: modal?.isVerified
                      ? colors.daclen_green
                      : colors.daclen_red,
                  },
                ]}
              >
                {modal?.isVerified
                  ? modal?.data?.nomor_telp
                    ? modal?.data?.nomor_telp
                    : userverified
                  : phonenotverified}
              </Text>
*/

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerClose: {
    position: "absolute",
    top: 2,
    end: 2,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  containerModal: {
    position: "absolute",
    backgroundColor: colors.daclen_light,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 6,
    elevation: 8,
  },
  containerPhoto: {
    height: 180,
    borderTopStartRadius: 6,
    borderBottomStartRadius: 6,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: colors.daclen_light,
  },
  containerHeader: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.daclen_black,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopEndRadius: 6,
  },
  photo: {
    width: 135,
    height: 180,
    borderTopStartRadius: 6,
    borderBottomStartRadius: 6,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  containerInfo: {
    flex: 1,
    height: 180,
    backgroundColor: "transparent",
    borderTopEndRadius: 6,
    borderBottomEndRadius: 6,
  },
  textHeader: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    width: "100%",
    textAlign: "flex-start",
    textAlignVertical: "center",
    color: colors.daclen_light,
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    color: colors.daclen_black,
  },
});

export default UserRootModal;
