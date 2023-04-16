import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

import { connect } from "react-redux";
//import { bindActionCreators } from "redux";

import UserRootItem, { VerticalLine } from "./UserRootItem";
import { colors, dimensions, staticDimensions } from "../../styles/base";
import UserRootHeaderItem from "./UserRootHeaderItem";
import { notverified, userverified } from "./constants";

function checkVerification(userData) {
  if (userData?.email_verified_at !== null) {
    return true;
  } else {
    return false;
  }
}

const UserRoots = (props) => {
  const [numRoots, setNumRoots] = useState(0);
  const [numVerified, setNumVerified] = useState(0);
  const { currentUser, hpv } = props;

  useEffect(() => {
    if (hpv?.length === undefined || hpv?.length < 1) {
      setNumRoots(0);
      setNumVerified(0);
    } else {
      setNumRoots(hpv?.length);
      for (let i = 0; i < hpv?.length; i++) {
        if (checkVerification(hpv[i])) {
          setNumVerified((n) => n + 1);
        }
      }
    }
  }, [hpv]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.containerHorizontal}>
          <UserRootHeaderItem
            title={userverified}
            backgroundColor={colors.daclen_green}
            color={colors.daclen_light}
            icon="account-check"
            content={numVerified}
          />
          <UserRootHeaderItem
            title={notverified}
            backgroundColor={colors.daclen_red}
            color={colors.daclen_light}
            icon="account-remove"
            content={numRoots - numVerified}
          />
        </View>
        <View style={styles.containerMain}>
          <UserRootItem
            userData={currentUser}
            isCurrentUser={true}
            isLastItem={false}
            isVerified={checkVerification(currentUser)}
          />
          <View style={styles.containerFlatlist}>
            {numRoots > 0 ? <VerticalLine style={{ height: 32 }} /> : null}
            {numRoots > 0 && (
              <FlatList
                numColumns={1}
                horizontal={false}
                data={hpv}
                renderItem={({ item, index }) => (
                  <UserRootItem
                    userData={item}
                    isCurrentUser={false}
                    isLastItem={index >= numRoots - 1}
                    isVerified={checkVerification(item)}
                  />
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "stretch",
    paddingHorizontal: staticDimensions.dashboardBoxHorizontalMargin,
    marginVertical: 10,
  },
  containerMain: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
    marginVertical: 10,
    marginHorizontal: 12,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  containerFlatlist: {
    justifyContent: "flex-start",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  hpv: store.userState.hpv,
});

/*const mapDispatchProps = (dispatch) =>
    bindActionCreators(
      {
        clearUserData,
        getCurrentUser,
        getHPV,
      },
      dispatch
    );*/

export default connect(mapStateToProps, null)(UserRoots);
