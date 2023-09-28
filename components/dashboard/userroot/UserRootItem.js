import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { blurhash, colors } from "../../../styles/base";
import { phonenotverified } from "../constants";
import { capitalizeFirstLetter } from "../../../axios/cart";
import { checkVerification } from "../UserRoots";

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
  isCurrentVerified,
  status,
  onPress,
  openUserPopup,
}) => {
  const [expand, setExpand] = useState(true);

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
              contentFit="cover"
              placeholder={blurhash}
              transition={0}
            />
          </View>

          <View style={styles.containerMain}>
            <View style={styles.containerHeader}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textHeader,
                  {
                    fontSize: userData?.name?.length > 16 ? 10 : 12,
                  },
                ]}
              >
                {userData?.name}
              </Text>
            </View>
            <View style={styles.containerValue}>
              <Text allowFontScaling={false} style={styles.text}>
                {`${isCurrentUser ? "Saya - " : ""}${
                  status ? capitalizeFirstLetter(status) : "Reseller"
                }`}
              </Text>
            </View>
            <View style={styles.containerInfo}>
              <Text style={styles.textInfo}>Info</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={12}
                color={colors.daclen_gray}
              />
            </View>
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
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    alignItems: "center",
    height: 80,
  },
  containerPhoto: {
    height: 80,
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
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    height: 56,
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
    fontSize: 10,
    color: colors.daclen_black,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
  },
  textInfo: {
    fontSize: 10,
    color: colors.daclen_gray,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    marginEnd: 1,
  },
  photo: {
    width: 60,
    height: 80,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
});

export default UserRootItem;
