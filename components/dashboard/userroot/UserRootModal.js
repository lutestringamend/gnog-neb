import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { blurhash, colors } from "../../../styles/base";
//import { useNavigation } from "@react-navigation/native";
//import { phonenotverified, userverified } from "../constants";
import { convertDateISOStringtoDisplayDate } from "../../../axios/profile";
import { showHPV } from "../../../axios/user";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const modalWidth =
  screenWidth < 320 ? 296 : screenWidth > 424 ? 400 : screenWidth - 24;
const modalHeight = 180;

const UserRootModal = (props) => {
  const { modal, toggleModal, hpvArray, token, isSelf } = props;
  const [hpvData, setHpvData] = useState(null);

  useEffect(() => {
    setHpvData(null);
    checkHPVData();
  }, [modal?.id]);

  useEffect(() => {
    console.log("hpvData", hpvData);
  }, [hpvData]);

  const checkHPVData = () => {
    try {
      if (!(hpvArray?.length === undefined || hpvArray?.length < 1)) {
        for (let h of hpvArray) {
          if (h?.id === modal?.data?.id) {
            setHpvData(h);
            return;
          }
        }
      }
      fetchHPVData();
    } catch (e) {
      console.error(e);
      setHpvData(false);
    }
  };

  const fetchHPVData = async () => {
    if (
      modal?.data === null ||
      modal?.data?.id === undefined ||
      modal?.data?.id === null
    ) {
      return;
    }
    const result = await showHPV(modal?.data?.id, token);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      setHpvData(false);
    } else {
      let newHpvData = result?.result;
      if (isSelf) {
        let modalData = modal?.data;
        newHpvData = { ...newHpvData, ...modalData };
      }
      setHpvData(newHpvData);
      if (!(props?.concatHPVArray === undefined || props?.concatHPVArray === null)) {
        props?.concatHPVArray(modal?.data?.id, newHpvData);
      }
    }
  };

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
                      fontSize: modal?.data?.name?.length > 12 ? 14 : 20,
                    },
                  ]}
                >
                  {modal?.data?.name}
                </Text>
              </View>

              {hpvData === null ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_black}
                  style={styles.spinner}
                />
              ) : hpvData === false ? (
                <Text style={styles.text}>
                  HPV user ini tidak bisa ditampilkan
                </Text>
              ) : (
                <View style={styles.containerVertical}>
                  <Text allowFontScaling={false} style={styles.text}>
                    {`${
                      hpvData?.join_date
                        ? `Join Date: ${convertDateISOStringtoDisplayDate(
                            hpvData?.join_date,
                            true
                          )}\n`
                        : ""
                    }${hpvData?.email ? `Email: ${hpvData?.email}\n` : ""}${
                      hpvData?.nomor_telp ? `WA: ${hpvData?.nomor_telp}` : ""
                    }\nPV: ${
                      hpvData?.pv ? hpvData?.pv.toString() : "0"
                    }  RPV: ${
                      hpvData?.rpv ? hpvData?.rpv.toString() : "0"
                    } HPV: ${hpvData?.hpv ? hpvData?.hpv : "0"}${
                      hpvData?.distributor_count
                        ? `\nJumlah Distributor Aktif:  ${hpvData?.distributor_count}`
                        : ""
                    }${
                      hpvData?.agen_count
                        ? `\nJumlah Agen Aktif:  ${hpvData?.agen_count}`
                        : ""
                    }${
                      hpvData?.reseller_count
                        ? `\nJumlah Reseller Aktif:  ${hpvData?.reseller_count}`
                        : ""
                    }${
                      hpvData?.poin_user_this_month
                        ? `\nPoin Bulan Ini:  ${hpvData?.poin_user_this_month}`
                        : ""
                    }${
                      hpvData?.total_nominal_penjualan
                        ? `\nPenjualan Bulan Ini:  ${hpvData?.total_nominal_penjualan}`
                        : ""
                    }
                `}
                  </Text>
                </View>
              )}
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
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
  },
  containerHeader: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.daclen_black,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopEndRadius: 6,
  },
  containerVertical: {
    backgroundColor: "transparent",
  },
  photo: {
    width: 135,
    height: 180,
    borderTopStartRadius: 6,
    borderBottomStartRadius: 6,
    backgroundColor: colors.daclen_light,
    overflow: "hidden",
  },
  containerInfo: {
    flex: 1,
    height: 180,
    backgroundColor: colors.daclen_light,
    borderTopEndRadius: 8,
    borderBottomEndRadius: 6,
  },
  textHeader: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    width: "100%",
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
  spinner: {
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});

export default UserRootModal;
