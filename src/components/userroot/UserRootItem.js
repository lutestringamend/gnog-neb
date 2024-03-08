import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, dimensions } from "../../styles/base";
import { phonenotverified } from "../../../components/dashboard/constants";
import {
  capitalizeFirstLetter,
  checkNumberEmpty,
  formatPrice,
} from "../../../axios/cart";
import { checkVerification } from "../../screens/userroot/UserRootScreen";
import { godlevelusername } from "../../axios/constants";

const ratio = dimensions.fullWidthAdjusted / 430;

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
          ]}
          disabled={userData?.name === godlevelusername}
        >
          <View style={[styles.containerHorizontal, { alignItems: "center" }]}>
            <View style={styles.containerPhoto}>
              {userData?.foto ? (
                <Image
                  source={userData?.foto}
                  style={styles.photo}
                  alt={userData?.name ? userData?.name : ""}
                  contentFit="contain"
                  placeholder={null}
                  transition={100}
                />
              ) : null}
            </View>
            <View style={styles.containerVertical}>
              <Text allowFontScaling={false} style={styles.textHeader}>
                {userData?.name === godlevelusername
                  ? "Daclen"
                  : userData?.name}
              </Text>
              <Text allowFontScaling={false} style={styles.text}>
                {userData?.name === godlevelusername
                  ? "Daclen"
                  : `${isCurrentUser ? "Saya • " : ""}${
                      status
                        ? capitalizeFirstLetter(status)
                        : userData?.status
                          ? capitalizeFirstLetter(userData?.status)
                          : hpvStatus
                            ? capitalizeFirstLetter(hpvStatus)
                            : ""
                    }`}
              </Text>
            </View>
            {userData?.name === godlevelusername ? null : (
              <View style={styles.containerArrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24 * ratio}
                  color={colors.white}
                />
              </View>
            )}
          </View>
          <View style={styles.containerInfo}>
            {userData?.name === godlevelusername ? null : (
              <Text allowFontScaling={false} style={styles.textInfo}>
                <Text
                  allowFontScaling={false}
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {`${checkNumberEmpty(userData?.jumlah_penjualan)} produk`}
                </Text>
                {" terjual senilai "}
                <Text
                  allowFontScaling={false}
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {checkNumberEmpty(userData?.total_penjualan)
                    ? formatPrice(checkNumberEmpty(userData?.total_penjualan))
                    : "Rp 0"}
                </Text>
                {" dan "}
                <Text
                  allowFontScaling={false}
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {`${
                    userData?.target_tercapai
                      ? checkNumberEmpty(userData?.target_tercapai)
                      : checkNumberEmpty(userData?.rekrutmen)
                  } orang`}
                </Text>
                {" direkrut"}
              </Text>
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
    backgroundColor: colors.daclen_grey_container,
    minHeight: 120 * ratio,
    minWidth: 240 * ratio,
    padding: 12 * ratio,
    borderRadius: 12 * ratio,
    overflow: "hidden",
    elevation: 4,
  },
  containerPhoto: {
    width: 40 * ratio,
    height: 40 * ratio,
    borderRadius: 20 * ratio,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: colors.daclen_grey_container_background,
  },
  photo: {
    width: 40 * ratio,
    height: 40 * ratio,
    borderRadius: 20 * ratio,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  containerHorizontal: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  containerVertical: {
    backgroundColor: "transparent",
    marginHorizontal: 12 * ratio,
    flex: 1,
  },
  containerExpand: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  verticalLine: {
    height: "100%",
    width: 4 * ratio,
    alignSelf: "flex-start",
    backgroundColor: colors.daclen_grey_container,
  },
  horizontalLine: {
    width: 24,
    height: 4 * ratio,
    backgroundColor: colors.daclen_grey_container,
  },
  containerFlatlist: {
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    paddingEnd: 60,
  },
  containerArrow: {
    backgroundColor: colors.black,
    width: 30 * ratio,
    height: 30 * ratio,
    borderRadius: 15 * ratio,
    justifyContent: "center",
    alignItems: "center",
  },
  containerInfo: {
    backgroundColor: "transparent",
    marginTop: 12 * ratio,
    maxWidth: 210 * ratio,
    flex: 1,
  },
  textHeader: {
    fontSize: 11 * ratio,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
  text: {
    fontSize: 11 * ratio,
    color: colors.daclen_grey_placeholder,
    fontFamily: "Poppins-Light",
    backgroundColor: "transparent",
  },
  textInfo: {
    fontSize: 12 * ratio,
    color: colors.black,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
  },
});

export default UserRootItem;
