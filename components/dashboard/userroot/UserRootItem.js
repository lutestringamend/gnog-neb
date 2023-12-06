import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../../styles/base";
import { phonenotverified } from "../constants";
import {
  capitalizeFirstLetter,
  checkNumberEmpty,
  formatPrice,
} from "../../../axios/cart";
import { checkVerification } from "../UserRoots";
import { godlevelusername } from "../../../axios/constants";

export function VerticalLine({ style }) {
  return <View style={[styles.verticalLine, style]} />;
}

const UserRootItem = ({
  userData,
  isCurrentUser,
  isParent,
  isFirstItem,
  isLastItem,
  isNextBranch,
  isSingleChild,
  isVerified,
  hpvArray,
  status,
  onPress,
  openUserPopup,
}) => {
  const [expand, setExpand] = useState(true);
  const [hpvStatus, setHpvStatus] = useState(null);

  useEffect(() => {
    if (hpvArray?.length === undefined || hpvArray?.length < 1) {
      setHpvStatus(null);
      return;
    }
    for (let h of hpvArray) {
      if (
        h?.id === userData?.id &&
        !(h?.status === undefined || h?.status === null || h?.status === "")
      ) {
        setHpvStatus(h?.status);
      }
    }
  }, [hpvArray]);

  function userPress() {
    let message = `${userData?.name}`;
    /*if (userData?.email_verified_at === null) {
      message += `\n${emailnotverified}`;
    }*/
    if (userData?.nomor_telp_verified_at === null) {
      message += `\n${phonenotverified}`;
    }
    console.log("userRootItem", userData);
    onPress();
    /*if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }*/
  }

  /*
          {isCurrentUser ||
        userData?.children === undefined ||
        userData?.children === null ||
        userData?.children?.length === undefined ||
        userData?.children?.length < 1 ? null : (
          <TouchableOpacity
            style={[
              styles.containerExpand,
              {
                backgroundColor: isVerified
                  ? colors.daclen_light
                  : colors.daclen_light,
              },
            ]}
            onPress={() => setExpand((expand) => !expand)}
          >
            <MaterialCommunityIcons
              name={expand ? "arrow-collapse" : "arrow-expand"}
              size={16}
              color={colors.daclen_light}
            />
          </TouchableOpacity>
        )}
  (

        ) : 
  */

  return (
    <View style={styles.container}>
      {isCurrentUser || isParent || (isNextBranch && isSingleChild) ? null : (
        <VerticalLine
          style={{
            height:
              isLastItem || (isFirstItem && isNextBranch) ? "51%" : "100%",
            alignSelf:
              isFirstItem && isNextBranch
                ? "flex-end"
                : isLastItem
                  ? "flex-start"
                  : "auto",
          }}
        />
      )}
      <ScrollView
        style={styles.containerScroll}
        contentContainerStyle={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={
          !(
            isCurrentUser ||
            isParent ||
            userData?.children === undefined ||
            userData?.children === null ||
            userData?.children?.length === undefined ||
            userData?.children?.length < 1 ||
            !expand
          )
        }
      >
        {isCurrentUser || isParent ? null : (
          <View style={styles.horizontalLine} />
        )}
        <TouchableOpacity
          onPress={() => userPress()}
          style={[
            styles.containerTouchable,
            {
              marginVertical: isCurrentUser || isParent ? 0 : 12,
            },
            isCurrentUser
              ? { borderTopEndRadius: 6, borderBottomEndRadius: 6 }
              : {
                  borderRadius: 6,
                  overflow: "hidden",
                },
          ]}
          disabled={userData?.name === godlevelusername}
        >
          <View
            style={[
              styles.containerPhoto,
              isCurrentUser
                ? null
                : {
                    borderTopStartRadius: 6,
                    borderBottomStartRadius: 6,
                    overflow: "hidden",
                  },
            ]}
          >
            <Image
              source={
                userData?.foto
                  ? userData?.foto
                  : require("../../../assets/user.png")
              }
              style={[
                styles.photo,
                isCurrentUser
                  ? null
                  : {
                      borderTopStartRadius: 6,
                      borderBottomStartRadius: 6,
                      overflow: "hidden",
                    },
              ]}
              alt={userData?.name ? userData?.name : ""}
              contentFit="contain"
              placeholder={null}
              transition={100}
            />
            {userData?.name === godlevelusername ? null : (
              <Text allowFontScaling={false} style={styles.textStatus}>
                {status
                  ? capitalizeFirstLetter(status)
                  : userData?.status
                    ? capitalizeFirstLetter(userData?.status)
                    : hpvStatus
                      ? capitalizeFirstLetter(hpvStatus)
                      : ""}
              </Text>
            )}
          </View>

          <View style={styles.containerMain}>
            <View style={styles.containerHeader}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textHeader,
                  {
                    fontSize: userData?.name?.length > 12 ? 10 : 12,
                  },
                ]}
              >
                {userData?.name}
              </Text>
            </View>
            <View style={styles.containerValue}>
              <Text allowFontScaling={false} style={styles.text}>
                {`${isCurrentUser ? "Saya\n" : ""}${
                  isCurrentUser || isParent
                    ? ""
                    : `Penjualan: ${checkNumberEmpty(
                        userData?.jumlah_penjualan,
                      )} produk\n${
                        checkNumberEmpty(userData?.total_penjualan) > 0
                          ? formatPrice(
                              checkNumberEmpty(userData?.total_penjualan),
                            )
                          : "Rp 0"
                      }\nRekrutmen: ${userData?.target_tercapai ? checkNumberEmpty(userData?.target_tercapai) : checkNumberEmpty(userData?.rekrutmen)} orang`
                }`}
              </Text>
            </View>
            {userData?.name === godlevelusername ? null : (
              <View style={styles.containerInfo}>
                <Text style={styles.textInfo}>Info</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={12}
                  color={colors.daclen_gray}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {isCurrentUser ||
        isParent ||
        userData?.children === undefined ||
        userData?.children === null ||
        userData?.children?.length === undefined ||
        userData?.children?.length < 1 ||
        !expand ? null : (
          <View
            style={[
              styles.horizontalLine,
              {
                width: 20,
                alignSelf: "center",
              },
            ]}
          />
        )}

        {isCurrentUser ||
        isParent ||
        userData?.children === undefined ||
        userData?.children === null ||
        userData?.children?.length === undefined ||
        userData?.children?.length < 1 ||
        !expand ? null : (
          <View style={styles.containerFlatlist}>
            {userData?.children.map((item, index) => (
              <UserRootItem
                key={index}
                userData={item}
                onPress={() => openUserPopup(item, checkVerification(item))}
                isCurrentUser={false}
                isParent={false}
                isFirstItem={index === 0}
                isLastItem={index >= userData?.children?.length - 1}
                isNextBranch={true}
                isSingleChild={userData?.children?.length < 2}
                isCurrentVerified={isVerified}
                isVerified={checkVerification(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/*
           <VerticalLine
              style={{
                height: "100%",
                backgroundColor: isVerified
                  ? colors.daclen_light
                  : colors.daclen_light,
              }}
            />
*/

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerScroll: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  containerTouchable: {
    backgroundColor: "transaprent",
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    elevation: 4,
  },
  containerPhoto: {
    height: 120,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerMain: {
    backgroundColor: "transparent",
    height: 80,
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerExpand: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  verticalLine: {
    height: "100%",
    width: 2,
    alignSelf: "flex-start",
    backgroundColor: colors.daclen_light,
  },
  horizontalLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.daclen_light,
  },
  containerHeader: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.daclen_black,
    borderTopEndRadius: 6,
    paddingStart: 6,
    paddingEnd: 48,
    height: 24,
  },
  containerInfo: {
    position: "absolute",
    bottom: 2,
    end: 2,
    backgroundColor: "transparent",
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  containerFlatlist: {
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    paddingEnd: 60,
  },
  containerValue: {
    backgroundColor: colors.daclen_light,
    paddingHorizontal: 6,
    borderBottomEndRadius: 6,
    height: 96,
    overflow: "hidden",
  },
  textHeader: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    width: "100%",
    textAlignVertical: "center",
    marginVertical: 4,
    color: colors.daclen_light,
  },
  text: {
    fontSize: 9,
    color: colors.daclen_black,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    marginEnd: 20,
  },
  textInfo: {
    fontSize: 10,
    color: colors.daclen_gray,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    marginEnd: 1,
  },
  textStatus: {
    position: "absolute",
    zIndex: 6,
    end: 0,
    top: 80,
    height: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.daclen_blue,
    color: colors.daclen_light,
    borderTopStartRadius: 4,
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
  },
  photo: {
    width: 80,
    height: 120,
    backgroundColor: colors.daclen_light,
    overflow: "hidden",
  },
});

export default UserRootItem;
