import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../styles/base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { phonenotverified } from "./constants";
import { capitalizeFirstLetter } from "../../axios/cart";
import { checkVerification } from "./UserRoots";

export function VerticalLine({ style }) {
  return <View style={[styles.verticalLine, style]} />;
}

const UserRootItem = ({
  userData,
  isCurrentUser,
  isFirstItem,
  isLastItem,
  isNextBranch,
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
    console.log(userData?.id, message, userData?.children);
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
                  ? colors.daclen_green
                  : colors.daclen_red,
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
      {isCurrentUser ? null : (
        <VerticalLine
          style={{
            height: isLastItem || (isFirstItem && isNextBranch) ? "51%" : "100%",
            backgroundColor: isCurrentVerified
              ? colors.daclen_green
              : colors.daclen_red,
            alignSelf: isFirstItem && isNextBranch ? "flex-end" : isLastItem ? "flex-start" : "auto",
          }}
        />
      )}
      {isCurrentUser ? null : (
        <View
          style={[
            styles.horizontalLine,
            {
              backgroundColor: isVerified
                ? colors.daclen_green
                : colors.daclen_red,
            },
          ]}
        />
      )}


      <TouchableHighlight
          onPress={() => userPress()}
          underlayColor={colors.daclen_orange}
          style={[
            styles.containerTouchable,
            {
              marginVertical: isCurrentUser ? 0 : 12,
            },
          ]}
        >
          <View
            style={[
              styles.containerMain,
              {
                borderColor: isVerified
                  ? colors.daclen_green
                  : colors.daclen_red,
                borderWidth: isCurrentUser ? 2 : 1,
                borderTopWidth: 0,
              },
            ]}
          >
            <View
              style={[
                styles.containerHeader,
                {
                  backgroundColor: isVerified
                    ? colors.daclen_green
                    : colors.daclen_red,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={isVerified ? "account-check" : "account-remove"}
                size={14}
                color={colors.daclen_light}
              />
              <Text style={styles.textHeader}>{userData?.name}</Text>
            </View>
            <View style={styles.containerValue}>
              <Text style={styles.text}>
                {`${isCurrentUser ? "Saya - " : ""}${
                  status ? capitalizeFirstLetter(status) : "Reseller"
                }${
                  isCurrentUser ||
                  userData?.children === undefined ||
                  userData?.children === null ||
                  userData?.children?.length === undefined ||
                  userData?.children?.length < 1
                    ? ""
                    : `\n${userData?.children?.length} anggota`
                }`}
              </Text>
            </View>
          </View>
        </TouchableHighlight>

      {isCurrentUser ||
      userData?.children === undefined ||
      userData?.children === null ||
      userData?.children?.length === undefined ||
      userData?.children?.length < 1 ||
      !expand ? null : (
        <View
          style={[
            styles.horizontalLine,
            {
              backgroundColor: isVerified
                ? colors.daclen_green
                : colors.daclen_red,
              alignSelf: "center",
            },
          ]}
        />
      )}

      {isCurrentUser ||
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
              isFirstItem={index === 0}
              isLastItem={index >= userData?.children?.length - 1}
              isNextBranch={true}
              isCurrentVerified={isVerified}
              isVerified={checkVerification(item)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

/*
           <VerticalLine
              style={{
                height: "100%",
                backgroundColor: isVerified
                  ? colors.daclen_green
                  : colors.daclen_red,
              }}
            />
*/

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  containerTouchable: {
    backgroundColor: "transparent",
  },
  containerMain: {
    backgroundColor: "transparent",
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
    backgroundColor: colors.daclen_green,
  },
  horizontalLine: {
    width: 24,
    height: 2,
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  containerFlatlist: {
    justifyContent: "flex-start",
  },
  containerValue: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 8,
  },
  textHeader: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.daclen_light,
    marginStart: 6,
    overflow: "hidden",
  },
  text: {
    fontSize: 12,
    color: colors.daclen_black,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    backgroundColor: "transparent",
  },
});

export default UserRootItem;
