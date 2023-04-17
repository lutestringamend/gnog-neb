import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { connect } from "react-redux";
//import { bindActionCreators } from "redux";

import BSUserRoot from "../bottomsheets/BSUserRoot";
import UserRootItem, { VerticalLine } from "./UserRootItem";
import { colors, staticDimensions } from "../../styles/base";
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
  const [popupUser, setPopupUser] = useState({name: null});
  const { currentUser, hpv } = props;
  const rbSheet = useRef();

  useEffect(() => {
    if (hpv?.data?.children?.length === undefined || hpv?.data?.children?.length < 1) {
      setNumRoots(0);
      setNumVerified(0);
    } else {
      setNumRoots(hpv?.data?.children?.length);
      for (let i = 0; i < hpv?.children?.length; i++) {
        if (checkVerification(hpv?.children[i])) {
          setNumVerified((n) => n + 1);
        }
      }
    }
  }, [hpv]);

  useEffect(() => {
    if (popupUser?.name !== null) {
      rbSheet.current.open();
    }
  }, [popupUser]);

  function openUserPopup(data) {
    if (popupUser?.name === null || popupUser?.name !== data?.name) {
      setPopupUser(data);
    } else {
      rbSheet.current.open();
    }
  }

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
            onPress={() => openUserPopup(currentUser)}
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
                data={hpv?.data?.children}
                renderItem={({ item, index }) => (
                  <UserRootItem
                    userData={item}
                    onPress={() => openUserPopup(item)}
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
      <RBSheet
        ref={rbSheet}
        openDuration={250}
        height={300}
      >
        <BSUserRoot
          title="Detail User"
          data={popupUser}
          closeThis={() => rbSheet.current.close()}
        />
      </RBSheet>
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
